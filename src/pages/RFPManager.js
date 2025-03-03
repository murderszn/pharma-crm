import React, { useState } from 'react';
import { toast } from '../components/Toast';
import { rfpApi } from '../services/rfpApi';
import { QuickStart } from '../components/QuickStart';

export function RFPManager() {
  const [rfpContent, setRfpContent] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSections, setSelectedSections] = useState(new Set());

  const rfpSections = [
    { 
      id: 'executive-summary',
      name: 'Executive Summary',
      prompt: 'Create an executive summary highlighting key solutions and benefits'
    },
    { 
      id: 'company-overview',
      name: 'Company Overview',
      prompt: 'Present company background, expertise, and relevant experience'
    },
    { 
      id: 'technical-approach',
      name: 'Technical Approach',
      prompt: 'Detail the technical solution, methodology, and implementation approach'
    },
    { 
      id: 'past-performance',
      name: 'Past Performance',
      prompt: 'Showcase relevant past projects and success stories'
    },
    { 
      id: 'management-approach',
      name: 'Management Approach',
      prompt: 'Outline project management methodology and team structure'
    },
    { 
      id: 'pricing',
      name: 'Pricing and Cost',
      prompt: 'Provide detailed cost breakdown and pricing strategy'
    },
    { 
      id: 'implementation',
      name: 'Implementation Plan',
      prompt: 'Detail the implementation timeline and deployment strategy'
    },
    { 
      id: 'quality-assurance',
      name: 'Quality Assurance',
      prompt: 'Describe quality control measures and testing procedures'
    },
    { 
      id: 'risk-management',
      name: 'Risk Management',
      prompt: 'Identify potential risks and mitigation strategies'
    },
    { 
      id: 'compliance',
      name: 'Compliance and Security',
      prompt: 'Address regulatory compliance and security measures'
    }
  ];

  const handleSectionClick = (section) => {
    const updatedSections = new Set(selectedSections);
    if (updatedSections.has(section.id)) {
      updatedSections.delete(section.id);
    } else {
      updatedSections.add(section.id);
    }
    setSelectedSections(updatedSections);
  };

  const generateSectionContent = async (section) => {
    if (!rfpContent.trim()) {
      toast.error('Please paste the RFP requirements first');
      return;
    }

    if (!companyInfo.trim()) {
      toast.error('Please provide company information for better context');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await rfpApi.generateSection(section, rfpContent, companyInfo);
      setGeneratedResponse(prev => ({
        ...prev,
        [section.id]: content
      }));
      
      toast.success(`Generated content for ${section.name}`);
    } catch (error) {
      console.error('Error generating section content:', error);
      toast.error(`Failed to generate content for ${section.name}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFullResponse = async () => {
    if (!rfpContent.trim()) {
      toast.error('Please paste the RFP requirements first');
      return;
    }

    if (!companyInfo.trim()) {
      toast.error('Please provide company information for better context');
      return;
    }

    if (selectedSections.size === 0) {
      toast.error('Please select at least one section');
      return;
    }

    setIsGenerating(true);
    try {
      for (const sectionId of selectedSections) {
        const section = rfpSections.find(s => s.id === sectionId);
        await generateSectionContent(section);
      }
      
      toast.success('Full RFP response generated successfully!');
    } catch (error) {
      console.error('Error generating full response:', error);
      toast.error('Failed to generate complete response');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportDocument = (format) => {
    toast.info(`Exporting as ${format}... (Feature coming soon)`);
  };

  const quickStartGuides = [
    {
      title: "Input Your RFP Details",
      description: "Start by providing your RFP requirements and company information. This helps our AI understand your needs and generate tailored responses.",
      keywords: ["Requirements", "Company Info", "Context"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "Generate & Customize",
      description: "Select the sections you need, generate content, and refine it to match your organization's voice and specific requirements.",
      keywords: ["AI Generation", "Section Selection", "Customization"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: "Review & Export",
      description: "Review your generated content, make final adjustments, and export your complete RFP response in your preferred format.",
      keywords: ["Review", "Export", "Final Polish"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                RFP Manager
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Create winning RFP responses with AI-assisted writing and smart content generation
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
                    <div className="text-2xl font-bold text-white">10</div>
                    <div className="text-xs text-primary-300">Sections</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">2x</div>
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
            {/* Left Column - Input */}
            <div className="space-y-6">
              {/* Company Information Section */}
              <div className="bg-white rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Information
                  <span className="text-gray-500 ml-1 text-xs">
                    (This context will be used to personalize the RFP response)
                  </span>
                </label>
                <textarea
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="Describe your company's background, expertise, core services, notable achievements, and any unique value propositions..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* RFP Requirements Section */}
              <div className="bg-white rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFP Requirements
                </label>
                <textarea
                  value={rfpContent}
                  onChange={(e) => setRfpContent(e.target.value)}
                  placeholder="Paste the RFP requirements here..."
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFP Sections
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {rfpSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedSections.has(section.id)
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateFullResponse}
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
                  'Generate Full Response'
                )}
              </button>
            </div>

            {/* Right Column - Output */}
            <div>
              {Object.entries(generatedResponse).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(generatedResponse).map(([sectionId, content]) => (
                    <div key={sectionId} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {rfpSections.find(s => s.id === sectionId)?.name}
                      </h3>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">{content}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportDocument('docx')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Export as Word
                    </button>
                    <button
                      onClick={() => exportDocument('pdf')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-gray-200">
                  Select sections and generate content to see the response here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default RFPManager;