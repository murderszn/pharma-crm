import React, { useState } from 'react';
import { geminiApi } from '../services/geminiApi';
import { toast } from '../components/Toast';
import { QuickStart } from '../components/QuickStart';

export function GrantWriter() {
  const [grantType, setGrantType] = useState('research');
  const [organizationInfo, setOrganizationInfo] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [generatedSections, setGeneratedSections] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);

  const grantTypes = {
    research: 'Research Grant',
    nonprofit: 'Nonprofit Grant',
    education: 'Educational Grant',
    arts: 'Arts & Culture Grant',
    community: 'Community Development Grant',
    technology: 'Technology Innovation Grant'
  };

  const sections = {
    overview: 'Project Overview',
    objectives: 'Goals & Objectives',
    methodology: 'Methodology',
    budget: 'Budget Breakdown',
    impact: 'Impact & Outcomes',
    sustainability: 'Sustainability Plan'
  };

  const handleSectionToggle = (sectionKey) => {
    setSelectedSections(prev => {
      if (prev.includes(sectionKey)) {
        return prev.filter(key => key !== sectionKey);
      } else {
        return [...prev, sectionKey];
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!organizationInfo || !projectDescription || !budget) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (selectedSections.length === 0) {
      toast.warning('Please select at least one section to generate');
      return;
    }

    setIsGenerating(true);
    try {
      const newSections = { ...generatedSections };
      
      for (const sectionKey of selectedSections) {
        const prompt = `As an expert grant writer, help me create a professional ${grantTypes[grantType]} proposal section for ${sections[sectionKey]}.
      
Organization Information:
${organizationInfo}

Project Description:
${projectDescription}

Budget Overview:
${budget}

Please generate a detailed and compelling ${sections[sectionKey]} section for this grant proposal. 
Use professional grant writing best practices and focus on clarity, impact, and persuasiveness.`;

        const response = await geminiApi.generateText(prompt);
        newSections[sectionKey] = response.message;
      }
      
      setGeneratedSections(newSections);
      toast.success('Grant sections generated successfully');
    } catch (error) {
      console.error('Error generating grant content:', error);
      toast.error('Failed to generate grant content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearSection = (sectionKey) => {
    setGeneratedSections(prev => {
      const newSections = { ...prev };
      delete newSections[sectionKey];
      return newSections;
    });
  };

  const quickStartGuides = [
    {
      title: "Project Setup",
      description: "Choose your grant type and provide essential details about your organization and project to help our AI understand your needs.",
      keywords: ["Grant Type", "Organization Info", "Project Goals"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: "Content Generation",
      description: "Select sections to generate and let our AI create compelling content tailored to your grant application needs.",
      keywords: ["AI Writing", "Section Selection", "Smart Templates"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      title: "Finalize & Submit",
      description: "Review and refine the generated content, ensuring all requirements are met and your proposal tells a compelling story.",
      keywords: ["Review", "Customize", "Submit"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                <span className="text-sm text-primary-100">AI-Powered Writing</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Grant Writer
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Create compelling grant proposals with AI-assisted writing and intelligent content generation
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Powered by Google Gemini</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Templates</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-xs text-primary-300">Sections</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">3x</div>
                    <div className="text-xs text-primary-300">Faster</div>
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant Type
                </label>
                <select
                  value={grantType}
                  onChange={(e) => setGrantType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(grantTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Information
                </label>
                <textarea
                  value={organizationInfo}
                  onChange={(e) => setOrganizationInfo(e.target.value)}
                  rows="4"
                  placeholder="Describe your organization, mission, and track record..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows="4"
                  placeholder="Describe your project, its goals, and expected outcomes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Overview
                </label>
                <textarea
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  rows="4"
                  placeholder="Provide a high-level budget breakdown..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Section Selection and Output */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sections to Generate
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(sections).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleSectionToggle(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedSections.includes(key)
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Generate Selected Sections'
                )}
              </button>

              {/* Generated Sections */}
              {Object.entries(generatedSections).map(([key, content]) => (
                <div key={key} className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {sections[key]}
                    </h3>
                    <button
                      onClick={() => handleClearSection(key)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear Section
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default GrantWriter; 