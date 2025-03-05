import React, { useState, useRef } from 'react';
import { aiApi } from '../services/api';
import { geminiService } from '../services/geminiService';
import { FEATURES } from '../utils/env';
import { toast } from '../components/Toast';
import { QuickStart } from '../components/QuickStart';
import { BetaBadge, BetaMessage } from '../components/BetaDisclaimer';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

// Tab icons
const TabIcons = {
  chatbot: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  'document-rag': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  ),
  'image-generation': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'document-analysis': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'voice-recognition': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  'magic-spreadsheet': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
};

export function AIToybox() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant powered by Google Gemini. How can I help you today?' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [documentSummary, setDocumentSummary] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResponse, setRagResponse] = useState('');
  const [isProcessingRag, setIsProcessingRag] = useState(false);
  const [documentPool, setDocumentPool] = useState([]);
  
  // New state for social media post generator
  const [socialMediaInput, setSocialMediaInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [generatedPost, setGeneratedPost] = useState('');

  // Platform options for the dropdown
  const platformOptions = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'X (Twitter)' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'blog', label: 'Blog Post' }
  ];

  // References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Add new state for magic spreadsheet
  const [spreadsheetData, setSpreadsheetData] = useState([
    ['Name', 'Age', 'Occupation', 'Salary'],
    ['John Doe', 30, 'Engineer', 85000],
    ['Jane Smith', 28, 'Designer', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState('');
  const hotTableComponent = useRef(null);

  // Get the appropriate API service based on feature flags
  const getApiService = () => {
    return FEATURES.useGeminiAPI ? geminiService : aiApi;
  };

  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isProcessing) return;

    // Add user message
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsProcessing(true);

    try {
      if (FEATURES.enableAIChat) {
        // Get chat history in the format expected by the API
        const history = chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Get the appropriate API service
        const api = getApiService();
        
        // Call the API
        let response;
        if (FEATURES.useGeminiAPI) {
          response = await api.generateText(chatInput, history);
        } else {
          response = await api.chat(chatInput, history);
        }
        
        // Add AI response to chat
        setChatMessages([...newMessages, { 
          role: 'assistant', 
          content: response.message || "I'm sorry, I couldn't process that request."
        }]);
      } else {
        // Fallback to simulated response if API is disabled
        simulateChatResponse(chatInput, newMessages);
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message to chat
      setChatMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error processing your request. Please try again later."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate AI chat response (fallback when API is disabled)
  const simulateChatResponse = (input, messages) => {
    setTimeout(() => {
      // Generate a response based on the input
      let response;
      const lowercaseInput = input.toLowerCase();
      
      if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        response = "Hello there! How can I assist you today?";
      } else if (lowercaseInput.includes('help')) {
        response = "I can help with various tasks. You can ask me questions, request information, or just chat!";
      } else if (lowercaseInput.includes('weather')) {
        response = "I don't have real-time weather data, but I can tell you it's a perfect day to explore our Enterprise Hub features!";
      } else if (lowercaseInput.includes('name')) {
        response = "I'm the Enterprise Hub AI Assistant, designed to make your workflow smoother.";
      } else if (lowercaseInput.includes('thank')) {
        response = "You're welcome! Is there anything else I can help you with?";
      } else {
        const responses = [
          "That's an interesting point. Would you like to know more about our Enterprise Hub features?",
          "I understand. How can I assist you further with your workflow needs?",
          "Thanks for sharing. Our AI capabilities are designed to enhance your productivity.",
          "I'm processing that information. Is there a specific aspect of our platform you'd like to explore?",
          "Great question! The Enterprise Hub integrates various tools to streamline your work processes."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      setChatMessages([...messages, { role: 'assistant', content: response }]);
      setIsProcessing(false);
    }, 1000);
  };

  // Handle image generation
  const handleImageGenerate = async (e) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setGeneratedImage(''); // Clear previous image
    setImageDescription(''); // Clear previous description
    
    try {
      if (FEATURES.enableImageGeneration) {
        // Get the appropriate API service
        const api = getApiService();
        
        // Call the API
        let response;
        if (FEATURES.useGeminiAPI) {
          // Gemini doesn't generate images directly, but can generate descriptions
          response = await api.generateText(imagePrompt, {
            detailed: true
          });
          
          // Set the generated image URL and description
          if (response) {
            setImageDescription(response);
            simulateImageGeneration(); // Since Gemini can't generate images directly
          }
        } else {
          // Use the original API for image generation
          response = await api.generateImage(imagePrompt, {
            size: '512x512',
            style: 'natural'
          });
          
          // Set the generated image URL
          if (response && response.imageUrl) {
            setGeneratedImage(response.imageUrl);
          } else {
            simulateImageGeneration();
            toast.warning('Using placeholder image as API did not return a valid image.');
          }
        }
      } else {
        // Fallback to simulated response if API is disabled
        simulateImageGeneration();
      }
    } catch (error) {
      console.error('Image generation error:', error);
      // Fallback to placeholder on error
      simulateImageGeneration();
      toast.error('Error generating image. Using placeholder instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate image generation (fallback when API is disabled)
  const simulateImageGeneration = () => {
    setTimeout(() => {
      // Use a placeholder image
      const placeholderImages = [
        'https://images.unsplash.com/photo-1677442135136-760c813a743d?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1675426513302-77891ab32bac?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1686920740206-c917f2e7b443?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=500&auto=format&fit=crop'
      ];
      
      setGeneratedImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
      setImageDescription("This is a placeholder image. Gemini API doesn't directly generate images, but it can create detailed descriptions of what an image might look like based on your prompt.");
    }, 2000);
  };

  // Handle document analysis
  const handleDocumentAnalyze = async (e) => {
    e.preventDefault();
    if ((!documentText.trim() && !selectedFile && !useFileUpload) || isProcessing) return;
    
    setIsProcessing(true);
    setDocumentSummary('');
    
    try {
      const input = useFileUpload ? selectedFile : documentText;
      const result = await geminiService.generateText(input);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        setDocumentSummary(result);
      }
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error('Failed to analyze document. Please try again.');
    } finally {
      setIsProcessing(false);
      // Clear file selection after processing
      if (useFileUpload) {
        setSelectedFile(null);
      }
    }
  };

  // Handle voice recording
  const handleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      setIsRecording(true);
      setVoiceText('');
      audioChunksRef.current = [];
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          // Combine audio chunks into a single blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          try {
            if (FEATURES.enableVoiceRecognition) {
              // Get the appropriate API service
              const api = getApiService();
              
              // Call the API
              let response;
              if (FEATURES.useGeminiAPI) {
                response = await geminiService.generateText(audioBlob);
              } else {
                response = await api.speechToText(audioBlob);
              }
              
              // Set the transcription result
              if (response && response.text) {
                setVoiceText(response.text);
              } else {
                // Fallback to simulated transcription if API doesn't return valid text
                simulateVoiceTranscription();
                toast.warning('Using simulated transcription as API did not return valid results.');
              }
            } else {
              // Fallback to simulated response if API is disabled
              simulateVoiceTranscription();
            }
          } catch (error) {
            console.error('Voice transcription error:', error);
            // Fallback to simulated transcription on error
            simulateVoiceTranscription();
            toast.error('Error transcribing audio. Using simulated transcription instead.');
          }
          
          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      } catch (error) {
        console.error('Media recording error:', error);
        setIsRecording(false);
        toast.error('Could not access microphone. Please check your browser permissions.');
      }
    }
  };

  // Simulate voice transcription (fallback when API is disabled)
  const simulateVoiceTranscription = () => {
    setTimeout(() => {
      setVoiceText("This is a simulated voice transcription. In a real implementation, this would contain the text converted from your speech using a speech-to-text API.");
    }, 1000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB');
      setSelectedFile(null);
    } else {
      setFileError('');
      setSelectedFile(file);
    }
  };

  // Handle document pool upload
  const handleDocumentPoolUpload = async (files) => {
    try {
      const newDocuments = [];
      
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 10MB limit`);
          continue;
        }
        
        const text = await geminiService.generateText(file);
        newDocuments.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: text,
          type: file.type
        });
      }
      
      setDocumentPool([...documentPool, ...newDocuments]);
      toast.success(`Added ${newDocuments.length} documents to the pool`);
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to process documents');
    }
  };

  // Handle RAG query
  const handleRagQuery = async (e) => {
    e.preventDefault();
    if (!ragQuery.trim() || isProcessingRag || documentPool.length === 0) return;
    
    setIsProcessingRag(true);
    setRagResponse('');
    
    try {
      const result = await geminiService.generateText(ragQuery, documentPool);
      
      if (result.error) {
        switch (result.error) {
          case 'QUOTA_EXCEEDED':
            toast.error('API quota exceeded. Please try again in a few minutes.');
            break;
          case 'EMPTY_DOCUMENT_POOL':
            toast.warning('Please upload some documents before asking questions.');
            break;
          case 'INVALID_REQUEST':
            toast.warning('Please try rephrasing your question.');
            break;
          default:
            toast.error('An error occurred while processing your query.');
        }
      }
      
      setRagResponse(result.answer);
    } catch (error) {
      console.error('Error processing RAG query:', error);
      toast.error('Failed to process query. Please try again later.');
      setRagResponse('');
    } finally {
      setIsProcessingRag(false);
    }
  };

  // Handle document removal from pool
  const handleRemoveDocument = (documentId) => {
    setDocumentPool(documentPool.filter(doc => doc.id !== documentId));
    toast.success('Document removed from pool');
  };

  // Handle social media post generation
  const handleSocialMediaGenerate = async (e) => {
    e.preventDefault();
    if (!socialMediaInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setGeneratedPost('');
    
    try {
      if (FEATURES.enableAIChat) {
        // Get the appropriate API service
        const api = getApiService();
        
        // Prepare the prompt for the social media post
        const prompt = `Generate a professional ${selectedPlatform} post about: ${socialMediaInput}
        
        Consider the following platform-specific guidelines:
        - LinkedIn: Professional tone, industry insights, thought leadership
        - Facebook: Conversational, engaging, community-focused
        - Instagram: Visual focus, emotive, hashtag-friendly
        - Twitter: Concise, trending topics, hashtags
        - Reddit: Community-focused, discussion-oriented
        - Blog: Detailed, informative, SEO-friendly
        
        Include appropriate hashtags and calls to action for the selected platform.`;

        // Call the Gemini API
        const response = await api.generateText(prompt);
        
        if (response.error) {
          toast.error(response.error);
        } else {
          setGeneratedPost(response.message || response);
        }
      } else {
        // Fallback to simulation if API is disabled
        simulateSocialPostGeneration();
      }
    } catch (error) {
      console.error('Error generating social media post:', error);
      toast.error('Failed to generate post. Please try again.');
      // Fallback to simulation on error
      simulateSocialPostGeneration();
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate social media post generation (fallback)
  const simulateSocialPostGeneration = () => {
    setTimeout(() => {
      const platformSpecificContent = {
        linkedin: `🌟 Professional Insight: ${socialMediaInput}\n\nAs industry leaders, we must consider how this impacts our strategic objectives and future growth. What are your thoughts on this development?\n\n#ProfessionalDevelopment #Innovation #Leadership`,
        facebook: `Hey friends! 👋\nI've been thinking about ${socialMediaInput}. It's amazing how this affects our daily lives. What's your experience with this?\n\nLet's start a conversation! 💭`,
        instagram: `✨ ${socialMediaInput} ✨\n\nDouble tap if you relate! 👆\n.\n.\n.\n#Trending #Innovation #Lifestyle #Growth #Community`,
        twitter: `Thoughts on ${socialMediaInput}? 🤔\n\nLet's discuss! #Trending #Innovation`,
        reddit: `Discussion: ${socialMediaInput}\n\nI've been researching this topic and would love to hear the community's perspective. What has been your experience?`,
        blog: `The Complete Guide to ${socialMediaInput}\n\nIn this comprehensive guide, we'll explore the key aspects and implications of this important topic. Let's dive in!`
      };
      
      setGeneratedPost(platformSpecificContent[selectedPlatform] || platformSpecificContent.linkedin);
    }, 2000);
  };

  // Add new handlers for magic spreadsheet
  const handleSpreadsheetChange = (changes) => {
    if (changes) {
      const newData = [...spreadsheetData];
      changes.forEach(([row, col, oldValue, newValue]) => {
        newData[row][col] = newValue;
      });
      setSpreadsheetData(newData);
    }
  };

  // Update the analyzeSpreadsheet function
  const analyzeSpreadsheet = async () => {
    setIsAnalyzing(true);
    try {
      const nonEmptyRows = spreadsheetData.filter(row => row.some(cell => cell !== ''));
      const prompt = `Analyze this spreadsheet data and provide a comprehensive analysis. 
      Headers: ${nonEmptyRows[0].join(', ')}
      Data: ${JSON.stringify(nonEmptyRows.slice(1))}
      
      Please provide a thorough analysis including:

      1. Data Overview:
         - Total number of records
         - Completeness of data (any missing values?)
         - Data range for each column
         - Basic statistics (min, max, average where applicable)

      2. Patterns and Distributions:
         - Distribution analysis for numerical columns
         - Frequency analysis for categorical columns
         - Any notable clusters or groupings
         - Outliers or unusual data points

      3. Relationships and Correlations:
         - Relationships between different columns
         - Any strong correlations or dependencies
         - Cause-effect patterns if apparent

      4. Trends and Insights:
         - Key trends in the data
         - Notable patterns or cycles
         - Significant findings or anomalies
         - Business-relevant insights

      5. Recommendations:
         - Suggested actions based on the analysis
         - Areas that need attention or improvement
         - Potential opportunities identified
         - Data quality improvements if needed

      Please format the analysis in a clear, structured way with sections and bullet points where appropriate.
      Focus on insights that would be most valuable for business decision-making.`;

      const result = await geminiService.generateText(prompt);
      setAnalysisResults(result);
    } catch (error) {
      console.error('Spreadsheet analysis error:', error);
      toast.error('Error analyzing spreadsheet data');
      simulateSpreadsheetAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update the fillEmptyRows function
  const fillEmptyRows = async () => {
    setIsAnalyzing(true);
    try {
      const nonEmptyRows = spreadsheetData.filter(row => row.some(cell => cell !== ''));
      const headers = spreadsheetData[0];
      const prompt = `Based on this spreadsheet data:
      Headers: ${headers.join(', ')}
      Existing Data: ${JSON.stringify(nonEmptyRows.slice(1))}
      
      Generate 3 new rows that follow similar patterns. Return the response in this exact format:
      [
        ["Name", Age, "Occupation", Salary],
        ["Name", Age, "Occupation", Salary],
        ["Name", Age, "Occupation", Salary]
      ]
      
      Make sure the data is realistic and follows the patterns in the existing data.`;

      const response = await geminiService.generateText(prompt);
      
      try {
        const newRows = JSON.parse(response);
        if (Array.isArray(newRows) && newRows.length > 0) {
          const newData = [...nonEmptyRows];
          newRows.forEach(row => {
            newData.push(row);
          });
          setSpreadsheetData(newData);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error('Error parsing generated rows:', parseError);
        simulateRowFilling();
      }
    } catch (error) {
      console.error('Row filling error:', error);
      toast.error('Error filling empty rows');
      simulateRowFilling();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateSpreadsheetAnalysis = () => {
    const analysis = `Analysis Results:
1. Salary Range: The data shows a salary range between $75,000 and $85,000
2. Age Distribution: The average age is 29 years
3. Occupation Mix: Diverse roles including Engineering and Design
4. Potential Insights: 
   - Engineering roles command higher salaries
   - The team appears to be relatively young
   - There's a good mix of technical and creative roles`;
    
    setAnalysisResults(analysis);
  };

  const simulateRowFilling = () => {
    const newData = [...spreadsheetData];
    const sampleData = [
      ['Michael Brown', 32, 'Product Manager', 95000],
      ['Sarah Wilson', 27, 'Developer', 78000],
      ['James Lee', 31, 'UX Researcher', 82000],
    ];
    
    let emptyRowIndex = newData.findIndex(row => row.every(cell => cell === ''));
    sampleData.forEach(row => {
      if (emptyRowIndex !== -1) {
        newData[emptyRowIndex] = row;
        emptyRowIndex = newData.findIndex(row => row.every(cell => cell === ''));
      }
    });
    
    setSpreadsheetData(newData);
  };

  const tabs = [
    {
      id: 'chat',
      name: 'Chat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      )
    },
    {
      id: 'image',
      name: 'Image',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      )
    },
    {
      id: 'document',
      name: 'Document',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    {
      id: 'voice',
      name: 'Voice',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      id: 'rag',
      name: 'RAG',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      )
    },
    {
      id: 'social-media-post',
      name: 'Social Media',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
      )
    },
    {
      id: 'magic-spreadsheet',
      name: 'Magic Spreadsheet',
      icon: TabIcons['magic-spreadsheet']
    }
  ];

  const quickStartGuides = [
    {
      title: "AI Chat & Analysis",
      description: "Engage in natural conversations with AI and get intelligent responses to your queries. Perfect for brainstorming and problem-solving.",
      keywords: ["Chat", "Q&A", "Analysis"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      title: "Creative Generation",
      description: "Generate unique images and creative content using AI. Describe what you want, and watch as AI brings your ideas to life.",
      keywords: ["Images", "Art", "Creation"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Document & Voice",
      description: "Process documents and voice inputs with AI. Convert speech to text and analyze documents for deeper insights.",
      keywords: ["Voice", "Documents", "Transcription"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern SaaS Header */}
        <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-2xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            {/* Modern grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Top and bottom subtle lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"></div>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"></div>
            
            {/* Glowing orbs */}
            <div className="absolute -left-48 -top-48 h-96 w-96">
              <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-500/40 via-primary-300/10 to-primary-400/40 blur-xl opacity-30"></div>
            </div>
            <div className="absolute -right-48 -bottom-48 h-96 w-96">
              <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-400/40 via-primary-300/10 to-primary-500/40 blur-xl opacity-30"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-800/50 border border-primary-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
                  <span className="text-sm text-primary-100">AI Tools Ready</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center">
                  AI Toybox
                  <BetaBadge className="ml-3" />
                </h1>
                <p className="text-lg text-primary-200 max-w-xl">
                  Harness the power of AI with our comprehensive suite of enterprise-grade tools and solutions
                </p>
                <BetaMessage className="mt-2" />
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-primary-200">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Powered by Google Gemini</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-primary-200">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Enterprise Ready</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">5</div>
                      <div className="text-xs text-primary-300">AI Tools</div>
                    </div>
                    <div className="w-px h-12 bg-primary-700/50"></div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-primary-400">99.9%</div>
                      <div className="text-xs text-primary-300">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .bg-gradient-conic {
            background-image: conic-gradient(var(--tw-gradient-stops));
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Selection Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'}`}>
                    {tab.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{tab.name}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Chat Interface */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[600px]">
                  {/* Chat History */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-primary-100 text-primary-800'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <form onSubmit={handleChatSubmit} className="flex space-x-4">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`px-6 py-2 rounded-lg font-medium text-white ${
                          isProcessing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700'
                        }`}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Image Generation */}
              {activeTab === 'image' && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Description
                    </label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      rows="3"
                      placeholder="Describe the image you want to generate..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <button
                    onClick={handleImageGenerate}
                    disabled={isProcessing}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </div>
                    ) : (
                      'Generate Description & Image'
                    )}
                  </button>

                  {generatedImage && !isProcessing && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Result</h3>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-1/2">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={generatedImage} 
                                alt="AI Generated" 
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="md:w-1/2">
                            <h4 className="text-md font-medium text-gray-800 mb-2">AI-Generated Description:</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line">
                                {imageDescription || "No description available."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Document Analysis */}
              {activeTab === 'document' && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Text
                    </label>
                    <textarea
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                      rows="6"
                      placeholder="Paste your document text here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <button
                    onClick={handleDocumentAnalyze}
                    disabled={isProcessing || (useFileUpload && !selectedFile) || (!useFileUpload && !documentText.trim())}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </div>
                    ) : (
                      'Analyze Document'
                    )}
                  </button>

                  {documentSummary && !isProcessing && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap">{documentSummary}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Voice Recognition */}
              {activeTab === 'voice' && (
                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <button 
                      onClick={handleVoiceRecording}
                      className={`
                        rounded-full p-8 text-white shadow-lg transition-all duration-300 transform hover:scale-105
                        ${isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-primary-500 hover:bg-primary-600'}
                      `}
                    >
                      {isRecording ? (
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                      ) : (
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </button>
                    
                    <p className="mt-4 text-gray-700 font-medium">
                      {isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording'}
                    </p>
                    
                    {isRecording && (
                      <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-1">
                          {[...Array(9)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-primary-500 rounded-full animate-pulse"
                              style={{
                                height: `${Math.sin((i + 1) * 0.7) * 20 + 24}px`,
                                animationDelay: `${i * 100}ms`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {voiceText && !isRecording && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Transcription Result</h3>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap">{voiceText}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Document RAG */}
              {activeTab === 'rag' && (
                <div className="p-6 space-y-6">
                  {/* Document Pool Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Document Pool</h3>
                      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Documents
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".txt,.doc,.docx,.pdf"
                          onChange={(e) => handleDocumentPoolUpload(Array.from(e.target.files))}
                        />
                      </label>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      {documentPool.length === 0 ? (
                        <div className="text-center py-6">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                          <p className="mt-1 text-sm text-gray-500">Add documents to start asking questions about their content.</p>
                          <div className="mt-6">
                            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Upload Documents
                              <input
                                type="file"
                                className="hidden"
                                multiple
                                accept=".txt,.doc,.docx,.pdf"
                                onChange={(e) => handleDocumentPoolUpload(Array.from(e.target.files))}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {documentPool.map((doc) => (
                            <li key={doc.id} className="py-3 flex items-center justify-between">
                              <div className="flex items-center min-w-0">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                  <p className="text-sm text-gray-500">{Math.round(doc.content.length / 1000)}K characters</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="ml-4 flex-shrink-0 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <span className="sr-only">Remove document</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Query Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ask a Question
                    </label>
                    <textarea
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      rows="3"
                      placeholder={documentPool.length === 0 
                        ? "Please add documents before asking questions..." 
                        : "Ask a question about the uploaded documents..."}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled={documentPool.length === 0}
                    />
                  </div>

                  <button
                    onClick={handleRagQuery}
                    disabled={isProcessingRag || documentPool.length === 0}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                      isProcessingRag || documentPool.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {isProcessingRag ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </div>
                    ) : documentPool.length === 0 ? (
                      'Add documents to ask questions'
                    ) : (
                      'Ask Question'
                    )}
                  </button>

                  {ragResponse && !isProcessingRag && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Answer</h3>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap">{ragResponse}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social Media Post Generator */}
              {activeTab === 'social-media-post' && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic or Content
                    </label>
                    <textarea
                      value={socialMediaInput}
                      onChange={(e) => setSocialMediaInput(e.target.value)}
                      rows="3"
                      placeholder="Enter your topic or content..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      {platformOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSocialMediaGenerate}
                    disabled={isProcessing || !socialMediaInput.trim()}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isProcessing || !socialMediaInput.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      'Generate Post'
                    )}
                  </button>
                  
                  {generatedPost && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Generated Post
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                        {generatedPost}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPost);
                          toast.success('Post copied to clipboard!');
                        }}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy to Clipboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Magic Spreadsheet */}
              {activeTab === 'magic-spreadsheet' && (
                <div className="p-6 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Magic Spreadsheet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Enter your data and let AI analyze patterns or fill in missing information.
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4" style={{ height: '300px' }}>
                        <HotTable
                          ref={hotTableComponent}
                          data={spreadsheetData}
                          colHeaders={true}
                          rowHeaders={true}
                          height="100%"
                          licenseKey="non-commercial-and-evaluation"
                          afterChange={handleSpreadsheetChange}
                          settings={{
                            stretchH: 'all',
                            width: '100%',
                            autoWrapRow: true,
                            autoWrapCol: true,
                          }}
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          onClick={analyzeSpreadsheet}
                          disabled={isAnalyzing}
                          className={`px-4 py-2 rounded-lg font-medium text-white ${
                            isAnalyzing
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700'
                          }`}
                        >
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
                        </button>
                        
                        <button
                          onClick={fillEmptyRows}
                          disabled={isAnalyzing}
                          className={`px-4 py-2 rounded-lg font-medium text-white ${
                            isAnalyzing
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700'
                          }`}
                        >
                          {isAnalyzing ? 'Processing...' : 'Fill Empty Rows'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {analysisResults && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Analysis Results</h4>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {analysisResults}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <QuickStart guides={quickStartGuides} />
    </div>
  );
} 