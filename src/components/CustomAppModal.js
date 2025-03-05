import React, { useState, useEffect } from 'react';
import { toast } from './Toast';

const CATEGORY_OPTIONS = [
  { id: 'collaboration', name: 'Collaboration Tools' },
  { id: 'crm', name: 'CRM & Sales' },
  { id: 'data', name: 'Data & Analytics' },
  { id: 'project', name: 'Project Management' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'design', name: 'Design & Creative' },
  { id: 'development', name: 'Development' },
  { id: 'finance', name: 'Finance & Accounting' },
  { id: 'hr', name: 'HR & Recruiting' }
];

const ICON_OPTIONS = [
  '📱', '🔗', '🌐', '⚙️', '📊', '📝', '📈', '🛠️', '💼', '🔍', 
  '📁', '🎯', '💡', '📚', '🎨', '📧', '🔔', '💬', '📅', '🔐'
];

export function CustomAppModal({ isOpen, onClose, onAddCustomApp }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📱');
  const [isVisible, setIsVisible] = useState(false);
  const [urlValid, setUrlValid] = useState(true);
  const [formTouched, setFormTouched] = useState(false);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  // Validate URL as user types
  useEffect(() => {
    if (url && formTouched) {
      try {
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        new URL(formattedUrl);
        setUrlValid(true);
      } catch (error) {
        setUrlValid(false);
      }
    }
  }, [url, formTouched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormTouched(true);
    
    if (!name || !url || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate URL format
    try {
      // Add https:// if not present
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(formattedUrl);
      
      const newApp = {
        id: `custom-${Date.now()}`,
        name,
        url: formattedUrl,
        description: description || `Custom app: ${name}`,
        icon,
        isCustom: true,
        category
      };
      
      onAddCustomApp(newApp);
      toast.success(`Added ${name} to your dashboard`);
      resetForm();
      handleClose();
    } catch (error) {
      toast.error('Please enter a valid URL');
      setUrlValid(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setUrl('');
    setCategory('');
    setDescription('');
    setIcon('📱');
    setFormTouched(false);
    setUrlValid(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        {/* Modal positioning */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal content */}
        <div 
          className={`inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
            isVisible ? 'sm:translate-y-0 translate-y-0 opacity-100' : 'sm:translate-y-4 translate-y-8 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl leading-6 font-bold text-white" id="modal-title">
                  Add Custom Application
                </h3>
                <p className="mt-1 text-sm text-primary-100">
                  Add your own application to the dashboard
                </p>
              </div>
              <button
                type="button"
                className="bg-primary-500 rounded-full p-1 text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
            <div className="space-y-6">
              {/* App Name */}
              <div>
                <label htmlFor="app-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="app-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFormTouched(true);
                  }}
                  className="block w-full h-12 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder="My Custom App"
                  required
                />
              </div>
              
              {/* URL */}
              <div>
                <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="app-url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setFormTouched(true);
                    }}
                    className={`block w-full h-12 px-4 py-3 border ${
                      urlValid ? 'border-gray-300' : 'border-red-500'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200`}
                    placeholder="example.com or https://example.com"
                    required
                  />
                  {!urlValid && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="app-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category<span className="text-red-500">*</span>
                </label>
                <select
                  id="app-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setFormTouched(true);
                  }}
                  className="block w-full h-12 pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg transition-colors duration-200"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="app-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="app-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder="Brief description of the application"
                />
              </div>
              
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {ICON_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`h-12 w-12 flex items-center justify-center text-xl rounded-lg transition-all duration-200 ${
                          icon === emoji 
                            ? 'bg-primary-100 border-2 border-primary-500 shadow-md transform scale-110' 
                            : 'bg-white border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="h-12 px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-12 px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Add Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 