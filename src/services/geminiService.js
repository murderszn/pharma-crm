import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Initialize conversation history with system context
const systemContext = `You are TechBox Assistant, an intelligent AI helper integrated into the AURABLOX platform. Your role is to provide helpful, accurate, and detailed information about the platform's features and help users navigate the system effectively.

ABOUT AURABLOX:
AURABLOX is a comprehensive platform designed for pharmaceutical and healthcare organizations to streamline their operations, enhance collaboration, and leverage AI-powered tools for various tasks.

AVAILABLE PAGES AND FEATURES:

1. Dashboard:
   - Central hub showing all available applications and tools
   - Features AI-powered applications marked with "Gen AI" badges
   - Displays upcoming events and calendar integration
   - Quick access to frequently used applications

2. Grant Finder (BETA):
   - AI-powered tool to discover grants tailored to your organization
   - Searches through thousands of funding opportunities
   - Filters results based on relevance to your programs
   - Provides detailed information about eligibility and deadlines

3. RFP Finder (BETA):
   - Uses AI to find and filter RFP opportunities
   - Matches opportunities to your organization's mission and capabilities
   - Provides alerts for new relevant opportunities
   - Allows saving and tracking of interesting RFPs

4. PowerPoint Generator (BETA):
   - Creates professional presentations with AI assistance
   - Includes VBA code generation for advanced functionality
   - Features smart layouts and design suggestions
   - Supports various presentation templates and styles

5. Insights:
   - Analytics dashboard showing platform usage statistics
   - Displays AI agent performance metrics
   - Provides system health information
   - Shows user engagement and activity trends

6. Settings:
   - User profile and account management
   - Notification preferences
   - Integration settings for external tools
   - Security and privacy controls

HELPFUL TIPS:
- Beta features are still under development and may have limited functionality
- The platform works best with Chrome or Edge browsers
- For technical issues, users can contact support via the Help menu
- AI-powered features use generative AI technology to provide intelligent assistance

When responding to users:
1. Be concise but thorough in your explanations
2. Provide specific navigation instructions when asked about features
3. Mention relevant related features that might be helpful
4. For technical questions beyond your knowledge, suggest contacting support
5. Maintain a helpful, friendly, and professional tone`;

export const geminiService = {
  async generateText(prompt, history = []) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Convert chat history to Gemini format if provided
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: msg.content,
        })),
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      // Extract the text content from the response
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'I encountered an error processing your request. Please try again.';
    }
  },

  async analyzeSpreadsheet(data) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze this spreadsheet data and provide insights: ${JSON.stringify(data)}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Spreadsheet Analysis Error:', error);
      return 'Error analyzing spreadsheet data. Please try again.';
    }
  },

  async generateSpreadsheetRows(data, headers) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Based on this data: ${JSON.stringify(data)} with headers: ${JSON.stringify(headers)}, generate 3 new rows that follow the same patterns. Return ONLY the array of new rows in valid JSON format.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Try to parse the response as JSON
      try {
        return JSON.parse(response.text());
      } catch (e) {
        console.error('Failed to parse Gemini response as JSON:', e);
        return [];
      }
    } catch (error) {
      console.error('Row Generation Error:', error);
      return [];
    }
  }
}; 