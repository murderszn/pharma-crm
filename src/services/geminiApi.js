import { GEMINI_API_KEY, GEMINI_ENDPOINTS } from '../utils/env';
import { toast } from '../components/Toast';

/**
 * Gemini API Service
 * Provides methods to interact with Google's Gemini API
 */
class GeminiApiService {
  constructor(apiKey = GEMINI_API_KEY) {
    this.apiKey = apiKey;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.retryDelay = 1000; // Base delay for retries in ms
    this.maxRetries = 3; // Maximum number of retry attempts
  }

  /**
   * Make a request to the Gemini API with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(endpoint, data, retryCount = 0) {
    const url = `${endpoint}?key=${this.apiKey}`;
    
    try {
      console.log('Making Gemini API request to:', endpoint);
      
      const response = await Promise.race([
        fetch(url, {
          method: 'POST',
          headers: this.defaultHeaders,
          body: JSON.stringify(data),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error?.message || `Request failed with status ${response.status}`;
        
        // Handle rate limiting and quota errors
        if (response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate')) {
          if (retryCount < this.maxRetries) {
            const delay = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff
            console.log(`Rate limited, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.makeRequest(endpoint, data, retryCount + 1);
          }
        }
        
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      if (error.message === 'Request timeout' && retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.log(`Request timed out, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, data, retryCount + 1);
      }
      
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  /**
   * Generate text content using Gemini Pro
   * @param {string} prompt - User prompt
   * @param {Array} history - Chat history
   * @returns {Promise<Object>} Generated content
   */
  async generateText(prompt, history = []) {
    try {
      // Format history for Gemini API
      // Only include a limited history to avoid token limits
      const recentHistory = history.slice(-5); // Only use the last 5 messages
      
      const formattedHistory = recentHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add current prompt
      const data = {
        contents: [
          ...formattedHistory,
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          stopSequences: []
        }
      };

      const response = await this.makeRequest(GEMINI_ENDPOINTS.generateContent, data);
      
      // Extract the generated text from the response
      const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        message: generatedText,
        raw: response
      };
    } catch (error) {
      console.error('Error in generateText:', error);
      // Return a fallback message
      return {
        message: "I'm having trouble connecting to my AI services. Let me try a simpler response: How can I help you today?",
        error: error.message
      };
    }
  }

  /**
   * Generate an image description using Gemini Pro Vision
   * @param {string} prompt - Image description prompt
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated content
   */
  async generateImageDescription(prompt, options = {}) {
    try {
      const data = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Create a detailed description of an image based on this prompt: "${prompt}". 
                      The description should be vivid and detailed, focusing on visual elements.` }
            ]
          }
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          stopSequences: []
        }
      };

      const response = await this.makeRequest(GEMINI_ENDPOINTS.generateContent, data);
      
      // Extract the generated description
      const description = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Return a placeholder image URL along with the description
      const placeholderImages = [
        'https://images.unsplash.com/photo-1677442135136-760c813a743d?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1675426513302-77891ab32bac?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1686920740206-c917f2e7b443?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=500&auto=format&fit=crop'
      ];
      
      return {
        imageUrl: placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
        description: description,
        raw: response
      };
    } catch (error) {
      console.error('Error in generateImageDescription:', error);
      // Return a fallback description
      return {
        imageUrl: 'https://images.unsplash.com/photo-1677442135136-760c813a743d?q=80&w=500&auto=format&fit=crop',
        description: "I couldn't generate a description using the AI service, but here's a placeholder image that might be relevant to your request.",
        error: error.message
      };
    }
  }

  /**
   * Analyze document text using Gemini Pro
   * @param {string|File} input - Document text or File object
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeDocument(input, options = {}) {
    try {
      let text;
      
      // Handle File input
      if (input instanceof File) {
        text = await this.extractTextFromFile(input);
      } else {
        text = input;
      }
      
      // Limit text length to avoid token limits
      const maxLength = 10000;
      const truncatedText = text.length > maxLength 
        ? text.substring(0, maxLength) + "... (text truncated due to length)"
        : text;
      
      let prompt;
      switch (options.type || 'summary') {
        case 'summary':
          prompt = `Summarize the following document in a concise way, highlighting the key points:\n\n${truncatedText}`;
          break;
        case 'entities':
          prompt = `Extract the key entities (people, organizations, locations) from the following document:\n\n${truncatedText}`;
          break;
        case 'sentiment':
          prompt = `Analyze the sentiment of the following document. Is it positive, negative, or neutral? Explain why:\n\n${truncatedText}`;
          break;
        default:
          prompt = `Summarize the following document:\n\n${truncatedText}`;
      }

      const data = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          stopSequences: []
        }
      };

      const response = await this.makeRequest(GEMINI_ENDPOINTS.generateContent, data);
      
      // Extract the analysis result
      const analysis = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        summary: analysis,
        raw: response
      };
    } catch (error) {
      console.error('Error in analyzeDocument:', error);
      // Return a fallback summary
      return {
        summary: "I couldn't analyze this document using the AI service. Please try with a shorter document or try again later.",
        error: error.message
      };
    }
  }

  /**
   * Extract text content from a file
   * @param {File} file - The file to extract text from
   * @returns {Promise<string>} Extracted text content
   */
  async extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          let text = '';
          
          if (file.type === 'text/plain') {
            // Handle .txt files
            text = event.target.result;
          } else if (file.type === 'application/pdf') {
            // For PDF files, we'd typically use a PDF.js or similar library
            // For now, we'll just read the raw text
            text = event.target.result;
          } else if (file.type.includes('document')) {
            // For Word documents, we'd typically use a library like mammoth.js
            // For now, we'll just read the raw text
            text = event.target.result;
          }
          
          resolve(text);
        } catch (error) {
          reject(new Error(`Failed to extract text from file: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other file types, read as binary string
        reader.readAsBinaryString(file);
      }
    });
  }

  /**
   * Simulate speech-to-text conversion
   * Note: Gemini doesn't have a direct speech-to-text API, so this is a placeholder
   * @param {Blob} audioBlob - Audio recording
   * @returns {Promise<Object>} Transcription result
   */
  async speechToText(audioBlob) {
    // This is a placeholder since Gemini doesn't have a speech-to-text API
    // In a real implementation, you would use a different service like Google Speech-to-Text
    
    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      text: "This is a simulated transcription. Gemini API doesn't directly support speech-to-text. In a production environment, you would integrate with a dedicated speech recognition service.",
      confidence: 0.95
    };
  }

  /**
   * Split text into chunks of roughly equal size
   * @param {string} text - Text to split
   * @param {number} maxChunkSize - Maximum size of each chunk
   * @returns {Array<string>} Array of text chunks
   */
  splitIntoChunks(text, maxChunkSize = 2000) {
    const chunks = [];
    const sentences = text.split(/[.!?]+\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Process a RAG query against a set of documents
   * @param {string} query - User query
   * @param {Array<Object>} documents - Array of document objects
   * @returns {Promise<Object>} Query response
   */
  async processRagQuery(query, documents) {
    try {
      if (!documents || documents.length === 0) {
        return {
          answer: "No documents available in the knowledge base. Please upload some documents first.",
          error: "EMPTY_DOCUMENT_POOL"
        };
      }

      // Split documents into smaller chunks and process them in batches
      const chunks = [];
      for (const doc of documents) {
        const docChunks = this.splitIntoChunks(doc.content, 1000); // Smaller chunks
        chunks.push(...docChunks.map(chunk => ({
          content: chunk,
          source: doc.name
        })));
      }
      
      // Process chunks in smaller batches to avoid token limits
      const batchSize = 3;
      const batches = [];
      for (let i = 0; i < chunks.length; i += batchSize) {
        batches.push(chunks.slice(i, i + batchSize));
      }

      let relevantContent = [];
      
      // First pass: Find relevant chunks
      for (const batch of batches) {
        const batchContent = batch.map(c => c.content).join('\n\n');
        const relevancePrompt = `Given the following text sections, determine if they are relevant to answering this question: "${query}"
        Only respond with "RELEVANT" or "NOT RELEVANT" for each section.
        
        ${batch.map((c, i) => `Section ${i + 1}:\n${c.content}`).join('\n\n')}`;

        try {
          const response = await this.makeRequest(GEMINI_ENDPOINTS.generateContent, {
            contents: [{ role: 'user', parts: [{ text: relevancePrompt }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 256,
            }
          });

          const relevanceResult = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const relevantIndexes = relevanceResult.split('\n')
            .map((line, i) => line.includes('RELEVANT') ? i : -1)
            .filter(i => i !== -1);

          relevantContent.push(...relevantIndexes.map(i => batch[i]));
        } catch (error) {
          console.error('Error in relevance check:', error);
          // Continue with other batches if one fails
          continue;
        }

        // Add delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // If no relevant content found, use a sample of original chunks
      if (relevantContent.length === 0) {
        relevantContent = chunks.slice(0, 3);
      }

      // Second pass: Generate answer from relevant chunks
      const answerPrompt = `You are a knowledgeable assistant that helps users understand their documents. 
Answer the following question based on these relevant document sections. If the answer cannot be found in the sections, 
clearly state that. Always cite the source documents when possible.

Relevant Sections:
${relevantContent.map((chunk, i) => `[${chunk.source}]\n${chunk.content}`).join('\n\n')}

Question: ${query}

Please provide a detailed answer based on the relevant sections above. Include specific references to the source documents.
If the answer is not found in the provided sections, clearly state this.`;

      const response = await this.makeRequest(GEMINI_ENDPOINTS.generateContent, {
        contents: [{ role: 'user', parts: [{ text: answerPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        }
      });

      return {
        answer: response.candidates?.[0]?.content?.parts?.[0]?.text || '',
        sourcesUsed: [...new Set(relevantContent.map(c => c.source))]
      };

    } catch (error) {
      console.error('Error in processRagQuery:', error);
      
      if (error.message.includes('quota')) {
        return {
          answer: "I apologize, but we've reached our API quota limit. Please try again in a few minutes.",
          error: "QUOTA_EXCEEDED"
        };
      } else if (error.message.includes('timeout')) {
        return {
          answer: "The request timed out. Please try with a shorter question or fewer documents.",
          error: "TIMEOUT"
        };
      } else if (error.message.includes('rate')) {
        return {
          answer: "We're being rate limited. Please wait a moment and try again.",
          error: "RATE_LIMITED"
        };
      }
      
      return {
        answer: "I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        error: error.message
      };
    }
  }
}

// Create and export the Gemini API service instance
export const geminiApi = new GeminiApiService();

export default geminiApi; 