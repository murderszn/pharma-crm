import React from 'react';
import GrantFinder from '../components/GrantFinder';
import { QuickStart } from '../components/QuickStart';

export function GrantFinderPage() {
  const quickStartGuides = [
    {
      title: "Search Setup",
      description: "Define your organization's focus areas and preferences to help our AI find the most relevant grant opportunities.",
      keywords: ["Focus Areas", "Preferences", "Criteria"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "AI Matching",
      description: "Our AI analyzes thousands of grants to find opportunities that match your organization's profile and goals.",
      keywords: ["Smart Match", "Analysis", "Opportunities"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: "Track & Apply",
      description: "Save promising opportunities, set reminders for deadlines, and track your application progress all in one place.",
      keywords: ["Save", "Track", "Deadlines"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  return (
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
                <span className="text-sm text-primary-100">AI-Powered Search</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Grant Finder
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Discover and track grant opportunities across major funding organizations and foundations
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Matching</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">1000+</div>
                    <div className="text-xs text-primary-300">Active Grants</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">24/7</div>
                    <div className="text-xs text-primary-300">Updates</div>
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
      
      <GrantFinder />
      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default GrantFinderPage; 