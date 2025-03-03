import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TAVILY_API_KEY = process.env.REACT_APP_TAVILY_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const grantWebsites = {
    // Government Grants
    "Grants.gov": "https://www.grants.gov/",
    "NIH Grants": "https://grants.nih.gov/",
    "NSF Grants": "https://www.nsf.gov/funding/",
    "Department of Education": "https://www2.ed.gov/fund/grants-apply.html",
    "USDA Rural Development": "https://www.rd.usda.gov/programs-services/all-programs",
    "EPA Grants": "https://www.epa.gov/grants",
    "NEA Grants": "https://www.arts.gov/grants",
    "NEH Grants": "https://www.neh.gov/grants",
    "DOE Grants": "https://www.energy.gov/eere/funding-opportunities",
    "HHS Grants": "https://www.hhs.gov/grants/index.html",
    
    // Major Foundation Grants
    "Gates Foundation": "https://www.gatesfoundation.org/",
    "Ford Foundation": "https://www.fordfoundation.org/",
    "MacArthur Foundation": "https://www.macfound.org/",
    "Robert Wood Johnson Foundation": "https://www.rwjf.org/",
    "Mellon Foundation": "https://mellon.org/",
    "Rockefeller Foundation": "https://www.rockefellerfoundation.org/",
    "Kellogg Foundation": "https://www.wkkf.org/",
    "Open Society Foundations": "https://www.opensocietyfoundations.org/",
    
    // Grant Databases & Directories
    "GrantWatch": "https://www.grantwatch.com/",
    "Foundation Directory Online": "https://fconline.foundationcenter.org/",
    "Candid": "https://candid.org/",
    "Instrumentl": "https://www.instrumentl.com/",
    "Pivot": "https://pivot.proquest.com/",
    "Grant Forward": "https://www.grantforward.com/",
    
    // Research & Academic Grants
    "Research.gov": "https://www.research.gov/",
    "SPIN": "https://spin.infoedglobal.com/",
    "Academic Research Funding Strategies": "https://academicresearchgrants.com/",
    "Research Professional": "https://www.researchprofessional.com/",
    
    // State-Level Grants
    "California Grants Portal": "https://www.grants.ca.gov/",
    "New York State Grants": "https://grantsmanagement.ny.gov/",
    "Texas eGrants": "https://txapps.texas.gov/tolapp/egrants/",
    "Illinois GATA": "https://www2.illinois.gov/sites/GATA/",
    
    // International Grants
    "European Commission Funding": "https://ec.europa.eu/info/funding-tenders_en",
    "Global Innovation Fund": "https://www.globalinnovation.fund/",
    "International Grants": "https://www.international.gc.ca/world-monde/funding-financement/",
    
    // Specialized Grants
    "Terra Viva Grants": "https://terravivagrants.org/",
    "Environmental Grants": "https://www.environmentalgrants.com/",
    "Tech Impact Fund": "https://techimpactfund.org/",
    "Social Justice Fund": "https://socialjusticefund.org/",
    "Arts & Culture Grants": "https://www.artgrants.org/",
    
    // Corporate Grants
    "Google Impact Grants": "https://www.google.org/giving/",
    "Microsoft Grants": "https://www.microsoft.com/en-us/corporate-responsibility/philanthropies",
    "Walmart Foundation": "https://walmart.org/",
    "Amazon Smile": "https://smile.amazon.com/",
    "Cisco Foundation": "https://www.cisco.com/c/en/us/about/csr/community/nonprofits.html"
};

const grantWebsitesList = Object.values(grantWebsites);

// Enhanced grant analysis function
const analyzeGrantOpportunity = async (grantContent) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const analysisPrompt = `Analyze this grant opportunity and provide a structured assessment with the following information:
    1. Time Relevance: Is this grant currently active? What are the key dates?
    2. Grant Amount: What is the confirmed funding amount or range?
    3. Validity Score (0-100): Based on the source credibility and completeness of information
    4. Requirements Analysis: Key eligibility criteria and requirements
    5. Application Complexity (Low/Medium/High): Based on requirements and process
    6. Success Probability (Low/Medium/High): Based on competition level and requirements match

    Grant Content:
    ${grantContent}

    Provide the analysis in JSON format with these exact keys:
    {
      "timeRelevance": { "isActive": boolean, "deadline": string, "startDate": string },
      "grantAmount": { "min": number, "max": number, "isConfirmed": boolean },
      "validityScore": number,
      "requirements": string[],
      "applicationComplexity": string,
      "successProbability": string,
      "reasoning": string
    }`;

    const result = await model.generateContent(analysisPrompt);
    const analysisText = result.response.text();
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(analysisText.substring(
        analysisText.indexOf('{'),
        analysisText.lastIndexOf('}') + 1
      ));
      return analysis;
    } catch (parseError) {
      console.error('Error parsing grant analysis:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing grant:', error);
    return null;
  }
};

export const searchGrants = async (searchTerm) => {
    try {
        if (!TAVILY_API_KEY) {
            throw new Error('Tavily API key is not configured');
        }

        const response = await axios.post('https://api.tavily.com/search', {
            query: `grant funding opportunities for ${searchTerm}`,
            include_domains: grantWebsitesList,
            api_key: TAVILY_API_KEY,
            search_depth: "advanced"
        });

        if (!response.data || !response.data.results || response.data.results.length === 0) {
            return [];
        }

        const results = await Promise.all(response.data.results.map(async result => {
            try {
                // Analyze each grant opportunity
                const analysis = await analyzeGrantOpportunity(result.content).catch(() => null);
                
                return {
                    title: result.title,
                    url: result.url,
                    description: result.content,
                    source: result.url,
                    estimatedAmount: extractGrantAmount(result.content),
                    analysis: analysis,
                    // Calculate relevance score based on analysis
                    relevanceScore: analysis ? calculateRelevanceScore(analysis) : 0
                };
            } catch (analysisError) {
                console.error('Error analyzing grant:', analysisError);
                // Return basic result without analysis if analysis fails
                return {
                    title: result.title,
                    url: result.url,
                    description: result.content,
                    source: result.url,
                    estimatedAmount: extractGrantAmount(result.content),
                    analysis: null,
                    relevanceScore: 0
                };
            }
        }));

        // Filter and sort results, but don't require analysis to be present
        return results
            .filter(result => result && result.title && result.url)
            .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    } catch (error) {
        console.error('Error searching grants:', error);
        
        // Provide specific error messages based on the error type
        if (error.response?.status === 429 || error.message.includes('quota')) {
            throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        } else if (error.message.includes('API key')) {
            throw new Error('Grant search is temporarily unavailable. Please check back later.');
        } else if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        } else {
            throw new Error('Unable to search for grants at this time. Please try again later.');
        }
    }
};

// Helper function to calculate overall relevance score
const calculateRelevanceScore = (analysis) => {
    const weights = {
        validityScore: 0.4,
        timeRelevance: 0.3,
        successProbability: 0.3
    };

    let score = analysis.validityScore * weights.validityScore;

    // Add time relevance score
    if (analysis.timeRelevance.isActive) {
        score += 100 * weights.timeRelevance;
    }

    // Add success probability score
    const probabilityScores = {
        'High': 100,
        'Medium': 60,
        'Low': 30
    };
    score += (probabilityScores[analysis.successProbability] || 0) * weights.successProbability;

    return Math.round(score);
};

// Helper function to extract potential grant amounts from content
const extractGrantAmount = (content) => {
    const amountRegex = /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:million|thousand|billion))?|\d{1,3}(?:,\d{3})*\s*(?:million|thousand|billion)\s*dollars/gi;
    const matches = content.match(amountRegex);
    return matches ? matches[0] : null;
};

export const defaultGrantCategories = [
    "education",
    "healthcare",
    "scientific research",
    "environmental conservation",
    "arts and culture",
    "community development",
    "social justice",
    "technology innovation",
    "public health",
    "renewable energy",
    "youth programs",
    "humanitarian aid",
    "agricultural development",
    "mental health",
    "disability services"
]; 