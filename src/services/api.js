import { API_URL, API_KEY, AI_ENDPOINTS } from '../utils/env';
import { toast } from '../components/Toast';

/**
 * Base API service for making HTTP requests
 */
class ApiService {
  constructor(baseUrl = API_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
    };
  }

  /**
   * Make a fetch request with error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async fetchWithErrorHandling(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      toast.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  get(endpoint, options = {}) {
    return this.fetchWithErrorHandling(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  post(endpoint, data, options = {}) {
    return this.fetchWithErrorHandling(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  put(endpoint, data, options = {}) {
    return this.fetchWithErrorHandling(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  delete(endpoint, options = {}) {
    return this.fetchWithErrorHandling(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Create main API service instance
export const api = new ApiService();

/**
 * AI API service for AI-related endpoints
 */
class AiApiService extends ApiService {
  /**
   * Send a chat message to the AI
   * @param {string} message - User message
   * @param {Array} history - Chat history
   * @returns {Promise<Object>} AI response
   */
  async chat(message, history = []) {
    return this.post(AI_ENDPOINTS.chat, {
      message,
      history,
    });
  }

  /**
   * Generate an image from a prompt
   * @param {string} prompt - Image description
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated image data
   */
  async generateImage(prompt, options = {}) {
    return this.post(AI_ENDPOINTS.image, {
      prompt,
      ...options,
    });
  }

  /**
   * Analyze a document
   * @param {string} text - Document text
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeDocument(text, options = {}) {
    return this.post(AI_ENDPOINTS.document, {
      text,
      ...options,
    });
  }

  /**
   * Convert speech to text
   * @param {Blob} audioBlob - Audio recording
   * @returns {Promise<Object>} Transcription result
   */
  async speechToText(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    return this.fetchWithErrorHandling(AI_ENDPOINTS.voice, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let the browser set it with the boundary
        'Content-Type': undefined,
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
      },
    });
  }
}

// Create AI API service instance
export const aiApi = new AiApiService();

export default api; 