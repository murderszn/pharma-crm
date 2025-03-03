import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Initialize conversation history with system context
const systemContext = `You are TechBox Assistant, an intelligent AI helper integrated into the Aurablox platform. Your role is to provide helpful, accurate, and detailed information about the platform's features and help users navigate the system effectively.

ABOUT AURABLOX:
Aurablox is a comprehensive platform designed for pharmaceutical and healthcare organizations to streamline their operations, enhance collaboration, and leverage AI-powered tools for various tasks.

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

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.chat = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemContext }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand my role as the TechBox Assistant for the Aurablox platform. I will provide helpful, accurate, and detailed information about the platform\'s features and help users navigate effectively. I\'m ready to assist with questions about the Dashboard, Grant Finder, RFP Finder, PowerPoint Generator, Insights, Settings, or any other aspect of the platform.' }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
  }

  async generateResponse(userInput, currentPath) {
    try {
      // Add current page context to the user's question
      const contextualizedInput = `[Current page: ${currentPath}] User question: ${userInput}
      
Based on the current page and the user's question, provide a helpful response that directly addresses their query. If their question relates to features or functionality available on the current page, provide specific information about those elements.`;
      
      const result = await this.chat.sendMessage([{ text: contextualizedInput }]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      if (error.message.includes('API key')) {
        return 'There seems to be an issue with the API configuration. Please contact support.';
      }
      return 'I apologize, but I encountered an error. Please try asking your question again.';
    }
  }

  // Reset chat when closing the assistant
  async resetChat() {
    try {
      this.chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemContext }]
          },
          {
            role: 'model',
            parts: [{ text: 'I understand my role as the TechBox Assistant for the Aurablox platform. I will provide helpful, accurate, and detailed information about the platform\'s features and help users navigate effectively. I\'m ready to assist with questions about the Dashboard, Grant Finder, RFP Finder, PowerPoint Generator, Insights, Settings, or any other aspect of the platform.' }]
        }
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });
    } catch (error) {
      console.error('Error resetting chat:', error);
    }
  }
}

export const geminiService = new GeminiService(); 