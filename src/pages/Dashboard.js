import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { BetaBadge } from '../components/BetaDisclaimer';
import { AppSelector } from '../components/AppSelector';
import { CustomAppModal } from '../components/CustomAppModal';

// Define brandColors object with enhanced enterprise gradients
const brandColors = {
  'salesforce': {
    from: '#00A1E0',
    via: '#1798C1',
    to: '#0D9DDB',
    shadow: 'rgba(0, 161, 224, 0.15)'
  },
  'hubspot': {
    from: '#FF7A59',
    via: '#FF8F73',
    to: '#FF6544',
    shadow: 'rgba(255, 122, 89, 0.15)'
  },
  'zendesk': {
    from: '#03363D',
    via: '#065E6C',
    to: '#03363D',
    shadow: 'rgba(3, 54, 61, 0.15)'
  },
  'microsoft-365': {
    from: '#D83B01',
    via: '#EA4300',
    to: '#D83B01',
    shadow: 'rgba(216, 59, 1, 0.15)'
  },
  'google-workspace': {
    from: '#4285F4',
    via: '#34A853',
    to: '#FBBC05',
    shadow: 'rgba(66, 133, 244, 0.15)'
  },
  'zoom': {
    from: '#2D8CFF',
    via: '#4A9FFF',
    to: '#2D8CFF',
    shadow: 'rgba(45, 140, 255, 0.15)'
  },
  'dropbox': {
    from: '#0061FF',
    via: '#0062FF',
    to: '#0061FF',
    shadow: 'rgba(0, 97, 255, 0.15)'
  },
  'wordpress': {
    from: '#21759B',
    via: '#21759B',
    to: '#464646',
    shadow: 'rgba(33, 117, 155, 0.15)'
  },
  'teams': {
    from: '#6264A7',
    via: '#7B83EB',
    to: '#6264A7',
    shadow: 'rgba(98, 100, 167, 0.15)'
  },
  'slack': {
    from: '#4A154B',
    via: '#611F69',
    to: '#4A154B',
    shadow: 'rgba(74, 21, 75, 0.15)'
  }
};

// Company brand colors with enhanced glow effect
const COMPANY_BLUE = {
  from: '#2563EB',
  via: '#3B82F6',
  to: '#1D4ED8',
  shadow: 'rgba(37, 99, 235, 0.2)'
};

// Default glow for apps without specific brand colors
const DEFAULT_GLOW = {
  from: '#6366F1',
  via: '#8B5CF6',
  to: '#6366F1',
  shadow: 'rgba(99, 102, 241, 0.15)'
};

const AppCard = ({ app, onClick, showTooltip, hideTooltip, isFeatured, isCustom, onRemove }) => {
  const auraColors = isFeatured ? COMPANY_BLUE : (brandColors[app.id] || DEFAULT_GLOW);
  
  // Add a remove button for custom apps
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => showTooltip(app.id)}
      onMouseLeave={hideTooltip}
    >
      {/* Enhanced aura effect */}
      <div
        className={`absolute -inset-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-xl blur-md transition-all duration-500 group-hover:duration-200 ${
          isFeatured ? 'group-hover:opacity-90' : 'group-hover:opacity-75'
        }`}
        style={{
          background: `linear-gradient(135deg, ${auraColors.from}, ${auraColors.via || auraColors.from}, ${auraColors.to})`
        }}
      />
      
      <div
        onClick={() => onClick(app)}
        className={`
          relative flex flex-col p-6 bg-white rounded-xl cursor-pointer
          h-full min-h-[260px] transition-all duration-300 transform
          hover:scale-[1.02] hover:-translate-y-1
          border border-gray-100/50
          hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          backdrop-blur-sm backdrop-saturate-200
        `}
        style={{
          boxShadow: `0 4px 20px ${auraColors.shadow}`
        }}
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50/80">
            {app.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center gap-2">
              {app.name}
              {app.isNew && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  New
                </span>
              )}
              {app.isBeta && <BetaBadge />}
              {isCustom && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Custom</span>}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {app.description}
            </p>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            {app.features && app.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {app.isAI && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Powered
              </span>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick Access
            </div>
          </div>
        </div>

        {/* Remove button for custom apps */}
        {isCustom && onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white bg-opacity-80 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors duration-200"
            title="Remove custom app"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

  // Group applications by category
  const categories = {
    collaboration: {
      title: "Collaboration & Communication",
      description: "Tools for team collaboration and communication",
      apps: ['microsoft-365', 'google-workspace', 'zoom', 'slack', 'notion', 'dropbox'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    crm: {
      title: "CRM & Sales",
      description: "Customer relationship management tools",
      apps: ['salesforce', 'hubspot', 'zendesk'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    data: {
      title: "Data & Analytics",
      description: "Tools for data analysis and visualization",
      apps: ['tableau', 'power-bi', 'looker'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    project: {
      title: "Project Management",
      description: "Tools for managing projects and tasks",
      apps: ['asana', 'monday', 'jira', 'trello'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    marketing: {
      title: "Marketing",
      description: "Digital marketing and campaign tools",
      apps: ['mailchimp', 'marketo', 'hootsuite'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    hr: {
      title: "Human Resources",
      description: "Manage employee records, recruitment, and HR processes",
      apps: ['workday', 'bamboohr'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    cloud: {
      title: "Cloud & Infrastructure",
      description: "Cloud computing, storage, and infrastructure services",
      apps: ['aws', 'azure', 'gcp', 'dropbox'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    web: {
      title: "Web & Content",
      description: "Web presence and content management tools",
      apps: ['wordpress'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

// Featured AI apps
  const featuredAiApps = [
    {
      id: 'ai-toybox',
      name: 'AI Toybox',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      description: 'Explore our suite of AI tools for content and analysis',
      isAI: true
    },
    {
      id: 'social-media-manager',
      name: 'Social Media Manager',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      ),
    description: 'Create and manage social media content with AI assistance',
      isAI: true
    },
    {
      id: 'grant-finder',
      name: 'Grant Finder',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    description: 'Discover grants tailored to your organization using AI matching',
      isAI: true,
      isBeta: true
    },
    {
      id: 'grant-writer',
      name: 'Grant Writer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      description: 'Get AI help writing compelling grant proposals',
      isAI: true
    },
    {
      id: 'powerpoint-generator',
      name: 'Slide Generator',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
    description: 'Generate professional presentations with AI assistance',
      isAI: true,
      isBeta: true
    }
  ];

// User Gen Blox - Customizable AI Personas
const userGenBlox = [
  {
    id: 'creative-writer',
    name: 'Story Weaver',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    description: 'Create custom storytelling AI with unique writing styles and genres',
    isAI: true,
    features: [
      'Character Development',
      'Plot Generation',
      'World Building',
      'Genre Adaptation'
    ]
  },
  {
    id: 'persona-coach',
    name: 'Life Coach AI',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    description: 'Design personalized coaching AI with specific expertise and methodologies',
    isAI: true,
    features: [
      'Goal Setting',
      'Progress Tracking',
      'Personalized Advice',
      'Habit Formation'
    ]
  },
  {
    id: 'expert-advisor',
    name: 'Domain Expert',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    description: 'Create specialized AI experts in any field or domain',
    isAI: true,
    features: [
      'Knowledge Base Creation',
      'Expert Consultation',
      'Field-Specific Insights',
      'Research Assistant'
    ]
  },
  {
    id: 'task-master',
    name: 'Task Assistant',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15" />
        </svg>
      ),
    description: 'Build task-specific AI assistants for any workflow or process',
    isAI: true,
    isNew: true,
    features: [
      'Workflow Automation',
      'Process Optimization',
      'Task Management',
      'Custom Instructions'
    ]
  }
];

// Define all applications
const applications = [
  // Microsoft 365
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
      ),
    description: 'Complete suite for productivity and collaboration'
    },
  // Google Workspace
    {
    id: 'google-workspace',
    name: 'Google Workspace',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15" />
        </svg>
      ),
    description: 'Cloud-based productivity and collaboration tools'
    },
  // Zoom
    {
    id: 'zoom',
    name: 'Zoom',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    description: 'Video conferencing and virtual meeting platform'
    },
  // Teams
    {
    id: 'teams',
    name: 'Microsoft Teams',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    description: 'Team collaboration and communication platform'
    },
  // Slack
    {
    id: 'slack',
    name: 'Slack',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
    description: 'Business communication and collaboration platform'
    },
  // Salesforce
    {
    id: 'salesforce',
    name: 'Salesforce',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    description: 'Leading CRM platform for customer relationship management'
    },
  // HubSpot
    {
    id: 'hubspot',
    name: 'HubSpot',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    description: 'All-in-one inbound marketing, sales, and service platform'
    },
  // Zendesk
    {
    id: 'zendesk',
    name: 'Zendesk',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
    description: 'Customer service software and support ticket system'
    },
  // Dropbox
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
    description: 'File hosting service for file storage and sharing'
    },
  // WordPress
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    description: 'Content management system for websites and blogs'
  },
  // Databricks
    {
      id: 'databricks',
      name: 'Databricks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    description: 'Unified analytics platform for big data and machine learning'
    },
  // Snowflake
    {
      id: 'snowflake',
      name: 'Snowflake',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    description: 'Cloud-based data warehousing platform'
    },
  // Tableau
    {
      id: 'tableau',
      name: 'Tableau',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    description: 'Data visualization and business intelligence platform'
    },
  // Sigma
    {
      id: 'sigma',
      name: 'Sigma Computing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
    description: 'Cloud-native analytics and business intelligence'
  },
  // Asana
  {
    id: 'asana',
    name: 'Asana',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593-3.068a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 013.296-1.043 3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    description: 'Work management platform for teams'
    },
  // Jira
    {
    id: 'jira',
    name: 'Jira',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
    description: 'Issue and project tracking for software teams'
  },
  // Monday
  {
    id: 'monday',
    name: 'Monday.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
    ),
    description: 'Work OS for managing teams and projects'
  },
  // Workday
  {
    id: 'workday',
    name: 'Workday',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    description: 'Enterprise cloud applications for finance and HR'
    },
  // BambooHR
    {
    id: 'bamboohr',
    name: 'BambooHR',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    description: 'HR software for small and medium businesses'
    },
  // AWS
    {
    id: 'aws',
    name: 'AWS',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    description: 'Cloud computing services and APIs'
    },
  // Azure
    {
    id: 'azure',
    name: 'Microsoft Azure',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      ),
    description: 'Cloud computing service for building and managing applications'
    },
  // GCP
    {
    id: 'gcp',
    name: 'Google Cloud',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    description: 'Suite of cloud computing services by Google'
  }
];

export default function Dashboard() {
  const { user, userPreferences, updateSelectedApps } = useAuth();
  const navigate = useNavigate();
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [showCustomAppModal, setShowCustomAppModal] = useState(false);
  const [customApps, setCustomApps] = useState([]);
  const [tooltipApp, setTooltipApp] = useState(null);

  // Load custom apps from localStorage on component mount
  useEffect(() => {
    const savedCustomApps = localStorage.getItem('customApps');
    if (savedCustomApps) {
      try {
        setCustomApps(JSON.parse(savedCustomApps));
      } catch (error) {
        console.error('Error loading custom apps:', error);
      }
    }
  }, []);

  // Save custom apps to localStorage whenever they change
  useEffect(() => {
    if (customApps.length > 0) {
      localStorage.setItem('customApps', JSON.stringify(customApps));
    }
  }, [customApps]);

  const handleAddCustomApp = (newApp) => {
    setCustomApps(prevApps => {
      const updatedApps = [...prevApps, newApp];
      return updatedApps;
    });
  };

  const handleRemoveCustomApp = (appId) => {
    setCustomApps(prevApps => prevApps.filter(app => app.id !== appId));
    
    // Also remove from selected apps if it was selected
    if (userPreferences?.selectedApps?.includes(appId)) {
      const updatedSelectedApps = userPreferences.selectedApps.filter(id => id !== appId);
      updateSelectedApps(updatedSelectedApps);
    }
  };

  // Application launch URLs
  const appUrls = {
    // Internal routes
      'ai-toybox': '/ai-toybox',
      'grant-writer': '/grant-writer',
      'grant-finder': '/grant-finder',
      'social-media-manager': '/social-media-manager',
    'powerpoint-generator': '/powerpoint-generator',
    'rfp-finder': '/rfp-finder',
    'rfp-manager': '/rfp-manager',

    // User Gen Blox
    'creative-writer': '/user-gen-blox/creative-writer',
    'persona-coach': '/user-gen-blox/persona-coach',
    // Enterprise apps
      'salesforce': 'https://login.salesforce.com',
    'hubspot': 'https://app.hubspot.com/login',
      'zendesk': 'https://www.zendesk.com/login',
    'microsoft-365': 'https://www.office.com',
    'google-workspace': 'https://workspace.google.com',
    'zoom': 'https://zoom.us/signin',
    'dropbox': 'https://www.dropbox.com/login',
    'wordpress': 'https://wordpress.com/log-in',
    'teams': 'https://teams.microsoft.com',
    'slack': 'https://slack.com/signin',
      'asana': 'https://app.asana.com',
      'jira': 'https://id.atlassian.com',
    'monday': 'https://auth.monday.com',
    'workday': 'https://www.myworkday.com/signin',
      'bamboohr': 'https://www.bamboohr.com/login',
      'aws': 'https://aws.amazon.com/console',
      'azure': 'https://portal.azure.com',
      'gcp': 'https://console.cloud.google.com',
    'databricks': 'https://accounts.cloud.databricks.com',
      'snowflake': 'https://app.snowflake.com',
      'tableau': 'https://online.tableau.com',
    'sigma': 'https://app.sigmacomputing.com/login',
    
    // Featured AI apps reference sites
    'ai-assistant': 'https://www.anthropic.com/claude',
    'copilot': 'https://copilot.microsoft.com',
    'gemini': 'https://gemini.google.com',
    'chatgpt': 'https://chat.openai.com'
  };

  const handleAppClick = (app) => {
    const url = appUrls[app.id];
    
    if (!url) {
      toast.error(`Launch URL not configured for ${app.name}`);
      return;
    }
    
    // Show launch animation
    toast.info(`Launching ${app.name}...`);

    // Handle custom apps with direct URLs
    if (app.isCustom && app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Internal route
    if (url.startsWith('/')) {
      navigate(url);
      return;
    }

    // External URL - open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getFilteredApps = (categoryApps) => {
    // If no preferences or all apps selected, return all apps for this category
    if (!userPreferences?.selectedApps || userPreferences.selectedApps.length === 0) {
      // Include custom apps that match the category
      const categoryCustomApps = customApps.filter(app => app.category === categoryApps[0]?.category);
      return [...categoryApps, ...categoryCustomApps];
    }
    
    // Filter apps based on user preferences
    const filteredApps = categoryApps.filter(app => 
      userPreferences.selectedApps.includes(app.id)
    );
    
    // Add custom apps that match the category and are in selected apps
    const filteredCustomApps = customApps.filter(app => 
      app.category === categoryApps[0]?.category && 
      userPreferences.selectedApps.includes(app.id)
    );
    
    return [...filteredApps, ...filteredCustomApps];
  };

    return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your personalized dashboard with all your tools in one place
            </p>
              </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button
              type="button"
              onClick={() => setShowCustomAppModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              Add Custom App
              </button>
              <button
              onClick={() => setShowAppSelector(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              Customize
              </button>
            </div>
            </div>
          </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured AI Apps section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
            </div>
        <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured AI Apps</h2>
              <p className="text-sm text-gray-500 mt-1">Powerful AI tools to enhance your productivity</p>
        </div>
      </div>

          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAiApps.map(app => (
                <AppCard
            key={app.id}
                  app={app}
                  onClick={handleAppClick}
                  showTooltip={() => setTooltipApp(app)}
                  hideTooltip={() => setTooltipApp(null)}
                  isFeatured={true}
                  isCustom={false}
                />
          ))}
        </div>
      </div>
        </section>

        {/* User Gen Blox section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5" />
              </svg>
          </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Gen Blox</h2>
              <p className="text-sm text-gray-500 mt-1">Create and customize AI assistants for specific tasks</p>
                  </div>
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Beta
                    </span>
                    </div>
          
          <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 rounded-2xl p-6 border border-primary-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {userGenBlox.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={handleAppClick}
                  showTooltip={() => setTooltipApp(app)}
                  hideTooltip={() => setTooltipApp(null)}
                  isFeatured={false}
                  isCustom={false}
                />
              ))}
          </div>
            
            <div className="mt-6 flex justify-center">
          <button
                onClick={() => navigate('/user-gen-blox/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
                Create Custom AI Assistant
            </button>
        </div>
                    </div>
        </section>

        {/* Regular app categories */}
        {Object.entries(categories).map(([key, category]) => {
          const filteredApps = getFilteredApps(applications.filter(app => category.apps.includes(app.id)));
          
          if (filteredApps.length === 0) return null;

          return (
            <section key={key} className="mb-16">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 mr-3">
                  {category.icon || (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                  )}
                  </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  )}
                </div>
          </div>
              
              <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApps.map(app => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onClick={() => handleAppClick(app)}
                      showTooltip={() => setTooltipApp(app)}
                      hideTooltip={() => setTooltipApp(null)}
                      isFeatured={false}
                      isCustom={app.isCustom}
                      onRemove={app.isCustom ? () => handleRemoveCustomApp(app.id) : undefined}
                    />
        ))}
          </div>
        </div>
            </section>
          );
        })}
      </div>

      {/* App Selector Modal */}
      {showAppSelector && (
        <AppSelector
          onClose={() => setShowAppSelector(false)}
          applications={[...applications, ...customApps]}
          selectedApps={userPreferences?.selectedApps || []}
          onSave={updateSelectedApps}
          categories={categories}
        />
      )}

      {/* Custom App Modal */}
      <CustomAppModal
        isOpen={showCustomAppModal}
        onClose={() => setShowCustomAppModal(false)}
        onAddCustomApp={handleAddCustomApp}
      />
    </div>
  );
} 