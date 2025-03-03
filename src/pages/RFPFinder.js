import React from 'react';
import RFPFinder from '../components/RFPFinder';
import { QuickStart } from '../components/QuickStart';

export function RFPFinderPage() {
  const quickStartGuides = [
    {
      title: "Finding Relevant RFPs",
      steps: [
        "Enter your organization's key focus areas and expertise in the search criteria",
        "Set filters for budget range, deadline, and geographic location",
        "Review the AI-matched RFP opportunities in your results",
        "Save interesting opportunities to your dashboard for later review"
      ],
      tips: [
        "Use industry-specific keywords to improve match accuracy",
        "Set up email alerts for new matching RFPs",
        "Check the 'Similar RFPs' section for additional opportunities"
      ]
    },
    {
      title: "Evaluating Opportunities",
      steps: [
        "Review the full RFP requirements and scope",
        "Check the compatibility score provided by AI",
        "Assess the competition level and success probability",
        "Calculate the potential ROI based on effort required"
      ],
      tips: [
        "Focus on RFPs with high compatibility scores",
        "Consider your current workload and capacity",
        "Look for opportunities that align with your strategic goals"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modern SaaS Header */}
      <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/10 to-transparent"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200/10 to-transparent"></div>
          <div className="absolute -left-48 -top-48 h-96 w-96">
            <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-cyan-500/70 via-blue-500/25 to-purple-500/70 blur-xl opacity-30"></div>
          </div>
          <div className="absolute -right-48 -bottom-48 h-96 w-96">
            <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-indigo-500/70 via-purple-500/25 to-pink-500/70 blur-xl opacity-30"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm text-slate-200">AI-Powered Search</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200/90 via-slate-100 to-slate-200/90">
                RFP Finder
              </h1>
              <p className="text-lg text-slate-400 max-w-xl">
                Search and discover relevant RFPs across multiple platforms with intelligent matching
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multi-Platform Search</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Filtering</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-slate-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-slate-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-slate-200">500+</div>
                    <div className="text-xs text-slate-400">Active RFPs</div>
                  </div>
                  <div className="w-px h-12 bg-slate-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-slate-200">95%</div>
                    <div className="text-xs text-slate-400">Match Rate</div>
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
      
      <RFPFinder />
      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default RFPFinderPage; 