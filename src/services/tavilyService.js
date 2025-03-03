import axios from 'axios';

const TAVILY_API_KEY = process.env.REACT_APP_TAVILY_API_KEY;

const websites = {
    // Government RFP Portals
    "SAM.gov": "https://sam.gov/",
    "USASpending.gov": "https://www.usaspending.gov/",
    "Grants.gov RFPs": "https://www.grants.gov/web/grants/search-grants.html",
    "FedBizOpps Archive": "https://www.fbo.gov/",
    "State Procurement": "https://www.naspo.org/",
    
    // Commercial RFP Platforms
    "FindRFP": "https://www.findrfp.com/",
    "BidPrime": "https://www.bidprime.com/",
    "DemandStar": "https://www.demandstar.com/",
    "BidSync": "https://www.bidsync.com/",
    "BidNet Direct": "https://www.bidnet.com/",
    "The RFP Database": "https://www.therfpdatabase.com/",
    "RFP360": "https://rfp360.com/",
    "Bonfire": "https://gobonfire.com/",
    "Merx": "https://www.merx.com/",
    
    // Industry-Specific RFPs
    "GovTribe": "https://govtribe.com/",
    "IT-Win": "https://www.it-win.com/",
    "ConstructConnect": "https://www.constructconnect.com/",
    "Healthcare Source": "https://www.healthcaresource.com/",
    "Ed Tech RFPs": "https://edtechrfp.com/",
    
    // State & Local Government
    "NYCComptroller": "https://www.comptroller.nyc.gov/",
    "California eProcure": "https://caleprocure.ca.gov/",
    "Texas SmartBuy": "https://comptroller.texas.gov/purchasing/",
    "Florida Vendor Bid System": "https://www.myflorida.com/apps/vbs/",
    
    // International RFPs
    "UN Development Business": "https://devbusiness.un.org/",
    "World Bank Procurement": "https://www.worldbank.org/en/projects-operations/products-and-services/procurement",
    "EU Tenders": "https://ted.europa.eu/",
    "Canadian Buyandsell": "https://buyandsell.gc.ca/",
    
    // Professional Networks
    "LinkedIn": "https://www.linkedin.com/",
    "GovWin IQ": "https://iq.govwin.com/",
    "Onvia DemandStar": "https://www.demandstar.com/",
    
    // Specialized Marketplaces
    "ThomasNet": "https://www.thomasnet.com/",
    "RFP DB": "https://www.rfpdb.com/",
    "Government Bids": "https://www.governmentbids.com/",
    "Periscope S2G": "https://www.periscopeholdings.com/s2g",
    
    // Technology RFPs
    "TechTarget": "https://www.techtarget.com/",
    "GovTech": "https://www.govtech.com/bids-rfps",
    "IT Bid": "https://www.itbid.org/",
    
    // Nonprofit & Education
    "NGO Source": "https://www.ngosource.org/",
    "Education Market RFPs": "https://www.educationmarketrfp.com/",
    "NonProfit RFPs": "https://nonprofitrfps.org/"
};

const websiteUrlsList = Object.values(websites);

export const searchRFPs = async (searchTerm) => {
    try {
        const response = await axios.post('https://api.tavily.com/search', {
            query: `RFP opportunities for ${searchTerm}`,
            include_domains: websiteUrlsList,
            api_key: TAVILY_API_KEY
        });

        return response.data.results.map(result => ({
            title: result.title,
            url: result.url,
            description: result.content,
            source: result.url
        }));
    } catch (error) {
        console.error('Error searching RFPs:', error);
        throw error;
    }
};

export const defaultSearchTerms = [
    "web design",
    "website development",
    "analytics",
    "data analysis",
    "artificial intelligence",
    "AI agent",
    "machine learning",
    "intelligent agents",
    "UX design",
    "UI design",
    "digital marketing analytics",
    "business intelligence"
]; 