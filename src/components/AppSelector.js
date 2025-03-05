import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function AppSelector({ applications, categories, selectedApps = [], onSave, onClose }) {
  const { userPreferences } = useAuth();
  const [selected, setSelected] = useState(selectedApps);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAppToggle = (appId) => {
    setSelected(prev => {
      const isSelected = prev.includes(appId);
      return isSelected ? prev.filter(id => id !== appId) : [...prev, appId];
    });
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Customize Dashboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-gray-600">Select the applications you want to see on your dashboard.</p>
          
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {Object.entries(categories || {}).map(([key, category]) => {
            const categoryApps = filteredApps.filter(app => 
              category.apps.includes(app.id)
            );

            if (categoryApps.length === 0) return null;

            return (
              <div key={key} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryApps.map(app => (
                    <div
                      key={app.id}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selected.includes(app.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => handleAppToggle(app.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {app.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{app.name}</p>
                          <p className="text-xs text-gray-500 truncate">{app.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 