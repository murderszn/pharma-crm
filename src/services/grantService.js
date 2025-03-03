import axios from 'axios';

const TAVILY_API_KEY = process.env.REACT_APP_TAVILY_API_KEY;

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

export const searchGrants = async (searchTerm) => {
    try {
        const response = await axios.post('https://api.tavily.com/search', {
            query: `grant funding opportunities for ${searchTerm}`,
            include_domains: grantWebsitesList,
            api_key: TAVILY_API_KEY,
            search_depth: "advanced"
        });

        return response.data.results.map(result => ({
            title: result.title,
            url: result.url,
            description: result.content,
            source: result.url,
            // Add estimated grant amount if found in the content
            estimatedAmount: extractGrantAmount(result.content)
        }));
    } catch (error) {
        console.error('Error searching grants:', error);
        throw error;
    }
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