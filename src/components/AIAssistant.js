import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'assistant', 
      content: 'Hi! I\'m your TechBox Assistant. How can I help you today?',
      suggestions: [
        'What can I do on this page?',
        'Tell me about beta features',
        'How do I use the Grant Finder?',
        'What AI tools are available?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const location = useLocation();

  // Function to format message content with markdown-like syntax
  const formatMessage = (content) => {
    // Bold text between ** markers
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br> tags
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    // Convert bullet points
    formattedContent = formattedContent.replace(/- (.*?)(?=\n|$)/g, '• $1');
    
    return formattedContent;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get current page name from path
      const pageName = location.pathname.split('/').pop() || 'dashboard';
      
      // Get AI response
      const response = await geminiService.generateResponse(inputValue, location.pathname);
      
      // Generate contextual suggestions based on the conversation
      const suggestions = generateSuggestions(pageName, inputValue);
      
      const aiResponse = { 
        type: 'assistant', 
        content: response,
        suggestions: suggestions
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorResponse = {
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        suggestions: [
          'Try a different question',
          'What features are available?',
          'How do I navigate the dashboard?'
        ]
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate contextual suggestions based on the current page and user input
  const generateSuggestions = (pageName, userInput) => {
    const input = userInput.toLowerCase();
    
    // Default suggestions
    const defaultSuggestions = [
      'What can I do on this page?',
      'Tell me about beta features',
      'How do I use the AI tools?'
    ];
    
    // Page-specific suggestions
    const pageSuggestions = {
      'dashboard': [
        'How do I access the Grant Finder?',
        'What do the Gen AI badges mean?',
        'How do I view my calendar?'
      ],
      'grant-finder': [
        'How do I search for grants?',
        'Can I save grant opportunities?',
        'What makes this a beta feature?'
      ],
      'rfp-finder': [
        'How do I filter RFP results?',
        'Can I get alerts for new RFPs?',
        'How does the AI matching work?'
      ],
      'powerpoint-generator': [
        'How do I create a presentation?',
        'What is VBA code generation?',
        'Can I customize the templates?'
      ],
      'insights': [
        'What metrics are available?',
        'How do I interpret the charts?',
        'Can I export analytics data?'
      ]
    };
    
    // If we have suggestions for this page, use them, otherwise use defaults
    const baseOptions = pageSuggestions[pageName] || defaultSuggestions;
    
    // If the user asked about a specific feature, add relevant follow-up questions
    if (input.includes('grant') || input.includes('funding')) {
      return [
        'How do I apply for a grant?',
        'What grant categories are available?',
        'How does the grant matching work?',
        'Show me the Grant Finder page'
      ];
    } else if (input.includes('rfp') || input.includes('proposal')) {
      return [
        'How do I respond to an RFP?',
        'Can I collaborate on RFP responses?',
        'How does the RFP Finder work?',
        'Take me to the RFP Finder'
      ];
    } else if (input.includes('presentation') || input.includes('powerpoint') || input.includes('slide')) {
      return [
        'What slide templates are available?',
        'How does the AI generate content?',
        'Can I include charts in my slides?',
        'Open the PowerPoint Generator'
      ];
    }
    
    // Return a mix of page-specific and general suggestions
    return baseOptions;
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // If the suggestion is a navigation command, handle it
    if (suggestion.toLowerCase().includes('show me') || 
        suggestion.toLowerCase().includes('take me to') || 
        suggestion.toLowerCase().includes('open the')) {
      // Extract the page name
      let pageName = '';
      if (suggestion.toLowerCase().includes('grant finder')) {
        pageName = 'grant-finder';
      } else if (suggestion.toLowerCase().includes('rfp finder')) {
        pageName = 'rfp-finder';
      } else if (suggestion.toLowerCase().includes('powerpoint')) {
        pageName = 'powerpoint-generator';
      } else if (suggestion.toLowerCase().includes('dashboard')) {
        pageName = 'dashboard';
      } else if (suggestion.toLowerCase().includes('insights')) {
        pageName = 'insights';
      }
      
      if (pageName) {
        // Add a message indicating navigation
        const userMessage = { type: 'user', content: suggestion };
        const assistantMessage = { 
          type: 'assistant', 
          content: `I'll help you navigate to the ${pageName.replace('-', ' ')} page. One moment please...`,
          isNavigation: true,
          targetPage: pageName
        };
        
        setMessages(prev => [...prev, userMessage, assistantMessage]);
        
        // Simulate navigation after a short delay
        setTimeout(() => {
          window.location.href = `/${pageName}`;
        }, 1000);
        return;
      }
    }
    
    // Otherwise, submit the form with the suggestion
    document.getElementById('assistant-form').dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };

  // Reset chat when closing the assistant
  const handleClose = () => {
    setIsOpen(false);
    geminiService.resetChat();
    setMessages([
      { 
        type: 'assistant', 
        content: 'Hi! I\'m your TechBox Assistant. How can I help you today?',
        suggestions: [
          'What can I do on this page?',
          'Tell me about beta features',
          'How do I use the Grant Finder?',
          'What AI tools are available?'
        ]
      }
    ]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-t-xl">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="font-medium">TechBox Assistant</span>
                <div className="text-xs text-primary-100 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Online
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] ${message.type === 'user' ? '' : 'flex flex-col'}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: message.type === 'assistant' 
                          ? formatMessage(message.content) 
                          : message.content 
                      }}
                    />
                  </div>
                  
                  {/* Suggestions */}
                  {message.type === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white text-primary-700 border border-primary-200 rounded-full px-3 py-1 hover:bg-primary-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center ml-2 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg p-3 rounded-tl-none shadow-sm border border-gray-200 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <form id="assistant-form" onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Aurablox..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'
                } text-white rounded-lg px-4 py-2 transition-colors`}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating Button */}
      <button
        onClick={() => !isOpen ? setIsOpen(true) : handleClose()}
        className={`bg-primary-500 text-white rounded-full p-3 shadow-lg hover:bg-primary-600 transition-all transform hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen 
              ? "M6 18L18 6M6 6l12 12" 
              : "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          />
        </svg>
      </button>
    </div>
  );
} 