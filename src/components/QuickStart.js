import React, { useState } from 'react';

export function QuickStart({ guides }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Quick Start Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg shadow-lg border border-primary-100 hover:bg-primary-50 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Quick Start</span>
      </button>

      {/* Quick Start Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4" id="modal-title">
                      Getting Started
                    </h3>
                    <div className="mt-4 space-y-6">
                      {guides.map((guide, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium mr-3">
                              {index + 1}
                            </span>
                            {guide.title}
                          </h4>
                          <div className="flex items-start space-x-4">
                            <div className="flex-grow">
                              <p className="text-gray-600 mb-2">{guide.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {guide.keywords.map((keyword, kIndex) => (
                                  <span 
                                    key={kIndex}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {guide.icon && (
                              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                {guide.icon}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 