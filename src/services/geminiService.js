import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Initialize conversation history with system context
const systemContext = `You are TechBox Assistant, an AI helper integrated into the TechBox platform. Your role is to help users navigate and use the platform effectively.

Available tools and pages:
- Dashboard: Overview of all tools and recent activities
- Insights: Analytics about tool usage and team collaboration
- AI Toybox: AI-powered tools for various tasks
- RFP Manager: Tool for managing and generating RFP content
- Settings: User and account settings

Keep responses concise, friendly, and focused on helping users navigate and use TechBox features.`;

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
          parts: [{ text: 'Understood. I will help users navigate and use the TechBox platform effectively.' }]
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
      const contextualizedInput = `[Current page: ${currentPath}] ${userInput}`;
      
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
            parts: [{ text: 'Understood. I will help users navigate and use the TechBox platform effectively.' }]
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