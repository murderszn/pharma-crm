# Enterprise Insights & Workflow Hub

A modern React application that provides a centralized hub for enterprise applications, analytics, and AI-powered tools.

## Features

- **User Authentication**: Secure login system with user session management
- **Application Dashboard**: Central launchpad for all enterprise applications
- **Analytics & Insights**: Data visualization and business intelligence
- **Settings Management**: User preferences and account settings
- **AI Toybox**: Integrated AI capabilities powered by Google Gemini API
  - Conversational AI chatbot
  - Image description generation
  - Document analysis and summarization
  - Voice recognition (simulated)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pharma-crm
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the API keys and endpoints as needed

4. Start the development server
```bash
npm start
# or
yarn start
```

## Google Gemini API Integration

This application uses Google's Gemini API for AI capabilities. To use these features:

1. Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add your API key to the `.env` file:
```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

### Gemini API Features

- **Text Generation**: The chatbot uses Gemini Pro to generate conversational responses
- **Image Descriptions**: While Gemini can't directly generate images, it creates detailed descriptions that are paired with placeholder images
- **Document Analysis**: Gemini analyzes and summarizes document text
- **Voice Recognition**: Currently simulated as Gemini doesn't have direct speech-to-text capabilities

## Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers for state management
- `/src/pages`: Main application pages
- `/src/services`: API service integrations
- `/src/utils`: Utility functions and helpers

## Environment Variables

| Variable | Description |
|----------|-------------|
| REACT_APP_API_URL | Base URL for backend API |
| REACT_APP_API_KEY | API key for backend services |
| REACT_APP_ENV | Environment (development, production, test) |
| REACT_APP_VERSION | Application version |
| REACT_APP_GEMINI_API_KEY | Google Gemini API key |
| REACT_APP_GEMINI_API_URL | Base URL for Gemini API |

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- React and associated libraries for the frontend framework 