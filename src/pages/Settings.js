import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { settingsService } from '../services/settingsService';

export function Settings() {
  const { user } = useAuth();
  
  // Form state
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Load settings on component mount
    const userSettings = settingsService.getSettings();
    setSettings(userSettings);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = {
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    };
    setSettings(newSettings);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const success = settingsService.saveSettings(settings);
      if (success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Manage your account preferences and settings.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Information</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="input-field"
                        value={user?.name}
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="input-field"
                        placeholder="john.doe@example.com"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Appearance</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                      Theme
                    </label>
                    <div className="mt-1">
                      <select
                        id="theme"
                        name="theme"
                        className="input-field"
                        value={settings.theme}
                        onChange={handleChange}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
                      Font Size
                    </label>
                    <div className="mt-1">
                      <select
                        id="fontSize"
                        name="fontSize"
                        className="input-field"
                        value={settings.fontSize}
                        onChange={handleChange}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="compactView"
                        name="compactView"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={settings.compactView}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="compactView" className="font-medium text-gray-700">
                        Compact View
                      </label>
                      <p className="text-gray-500">Use a more compact layout throughout the application.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Preferences</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <div className="mt-1">
                      <select
                        id="language"
                        name="language"
                        className="input-field"
                        value={settings.language}
                        onChange={handleChange}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <div className="mt-1">
                      <select
                        id="timezone"
                        name="timezone"
                        className="input-field"
                        value={settings.timezone}
                        onChange={handleChange}
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                        Email notifications
                      </label>
                      <p className="text-gray-500">Receive email notifications for important updates.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="desktopNotifications"
                        name="desktopNotifications"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={settings.desktopNotifications}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="desktopNotifications" className="font-medium text-gray-700">
                        Desktop notifications
                      </label>
                      <p className="text-gray-500">Receive desktop notifications for important updates.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="weeklyDigest"
                        name="weeklyDigest"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={settings.weeklyDigest}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="weeklyDigest" className="font-medium text-gray-700">
                        Weekly digest
                      </label>
                      <p className="text-gray-500">Receive a weekly summary of your activity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSettings(settingsService.getSettings())}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 