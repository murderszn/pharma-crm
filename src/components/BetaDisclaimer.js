import React from 'react';

/**
 * BetaBadge component
 * Displays just the BETA badge to be used inline with titles
 * 
 * @returns {JSX.Element}
 */
export function BetaBadge() {
  return (
    <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-yellow-500 text-yellow-900 rounded-full">
      BETA
    </span>
  );
}

/**
 * BetaMessage component
 * Displays the beta disclaimer message in a styled container
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display (optional)
 * @returns {JSX.Element}
 */
export function BetaMessage({ message = "This feature is in beta. Some functionality may be limited or under development." }) {
  return (
    <div className="mt-2 text-sm text-yellow-300 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

/**
 * BetaDisclaimer component
 * Combines both the badge and message in a horizontal layout for the header
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display (optional)
 * @returns {JSX.Element}
 */
export function BetaDisclaimer({ message = "This feature is in beta. Some functionality may be limited or under development." }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-yellow-300">{message}</span>
      </div>
    </div>
  );
} 