/**
 * Settings Service
 * Handles user settings persistence using localStorage
 */

const SETTINGS_KEY = 'user_settings';

class SettingsService {
  constructor() {
    this.defaultSettings = {
      emailNotifications: true,
      desktopNotifications: true,
      weeklyDigest: false,
      darkMode: false,
      language: 'english',
      timezone: 'UTC-5',
      theme: 'light',
      fontSize: 'medium',
      compactView: false
    };
  }

  /**
   * Get user settings
   * @returns {Object} User settings
   */
  getSettings() {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      return savedSettings ? { ...this.defaultSettings, ...JSON.parse(savedSettings) } : this.defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.defaultSettings;
    }
  }

  /**
   * Save user settings
   * @param {Object} settings - Settings to save
   * @returns {boolean} Success status
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      this.applySettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  /**
   * Apply settings to the application
   * @param {Object} settings - Settings to apply
   */
  applySettings(settings) {
    const root = document.documentElement;
    const body = document.body;

    // Apply theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size
    root.style.fontSize = this.getFontSize(settings.fontSize);

    // Apply compact view
    if (settings.compactView) {
      body.classList.add('compact-view');
    } else {
      body.classList.remove('compact-view');
    }

    // Apply theme colors
    this.applyThemeColors(settings.theme);

    // Apply any additional classes based on settings
    this.applyUtilityClasses(settings);
  }

  /**
   * Get font size in pixels
   * @param {string} size - Font size name
   * @returns {string} Font size in pixels
   */
  getFontSize(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    return sizes[size] || sizes.medium;
  }

  /**
   * Apply theme colors
   * @param {string} theme - Theme name
   */
  applyThemeColors(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--primary-50', '#1a1a1a');
      root.style.setProperty('--primary-100', '#2d2d2d');
      root.style.setProperty('--primary-200', '#404040');
      root.style.setProperty('--primary-300', '#595959');
      root.style.setProperty('--primary-400', '#737373');
      root.style.setProperty('--primary-500', '#8c8c8c');
      root.style.setProperty('--primary-600', '#a6a6a6');
      root.style.setProperty('--primary-700', '#bfbfbf');
      root.style.setProperty('--primary-800', '#d9d9d9');
      root.style.setProperty('--primary-900', '#f2f2f2');
    } else {
      root.style.setProperty('--primary-50', '#f0f9ff');
      root.style.setProperty('--primary-100', '#e0f2fe');
      root.style.setProperty('--primary-200', '#bae6fd');
      root.style.setProperty('--primary-300', '#7dd3fc');
      root.style.setProperty('--primary-400', '#38bdf8');
      root.style.setProperty('--primary-500', '#0ea5e9');
      root.style.setProperty('--primary-600', '#0284c7');
      root.style.setProperty('--primary-700', '#0369a1');
      root.style.setProperty('--primary-800', '#075985');
      root.style.setProperty('--primary-900', '#0c4a6e');
    }
  }

  /**
   * Apply utility classes based on settings
   * @param {Object} settings - Settings object
   */
  applyUtilityClasses(settings) {
    const body = document.body;

    // Apply text size utility classes
    body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    body.classList.add(`text-size-${settings.fontSize}`);

    // Apply any other utility classes based on settings
    // Add more as needed
  }
}

export const settingsService = new SettingsService(); 