/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const API_KEY = process.env.REACT_APP_API_KEY || '';
export const ENV = process.env.REACT_APP_ENV || 'development';
export const VERSION = process.env.REACT_APP_VERSION || '1.0.0';

// AI Services Configuration
export const AI_ENDPOINTS = {
  chat: process.env.REACT_APP_AI_CHAT_ENDPOINT || `${API_URL}/ai/chat`,
  image: process.env.REACT_APP_AI_IMAGE_ENDPOINT || `${API_URL}/ai/image`,
  document: process.env.REACT_APP_AI_DOCUMENT_ENDPOINT || `${API_URL}/ai/document`,
  voice: process.env.REACT_APP_AI_VOICE_ENDPOINT || `${API_URL}/ai/voice`,
};

// Gemini API Configuration
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
export const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL || 'https://generativelanguage.googleapis.com';
export const GEMINI_ENDPOINTS = {
  generateContent: `${GEMINI_API_URL}/v1beta/models/gemini-1.5-pro:generateContent`,
  generateImage: `${GEMINI_API_URL}/v1beta/models/gemini-1.5-pro:generateContent`,
};

// Environment helpers
export const isDevelopment = ENV === 'development';
export const isProduction = ENV === 'production';
export const isTest = ENV === 'test';

// Feature flags
export const FEATURES = {
  enableAIChat: true,
  enableImageGeneration: true,
  enableDocumentAnalysis: true,
  enableVoiceRecognition: true,
  useGeminiAPI: true, // Flag to use Gemini API instead of default API
};

/**
 * Get environment variable with fallback
 * @param {string} name - Environment variable name
 * @param {string} fallback - Fallback value if environment variable is not set
 * @returns {string} Environment variable value or fallback
 */
export function getEnv(name, fallback = '') {
  return process.env[`REACT_APP_${name}`] || fallback;
}

export default {
  API_URL,
  API_KEY,
  ENV,
  VERSION,
  AI_ENDPOINTS,
  GEMINI_API_KEY,
  GEMINI_API_URL,
  GEMINI_ENDPOINTS,
  isDevelopment,
  isProduction,
  isTest,
  FEATURES,
  getEnv,
}; 