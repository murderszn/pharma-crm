import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { AppSelector } from '../components/AppSelector';
import styled from 'styled-components';

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
  },
  'aws': {
    from: '#FF9900',
    via: '#FFA723',
    to: '#FF9900',
    shadow: 'rgba(255, 153, 0, 0.15)'
  },
  'azure': {
    from: '#0078D4',
    via: '#0089FF',
    to: '#0078D4',
    shadow: 'rgba(0, 120, 212, 0.15)'
  },
  'gcp': {
    from: '#4285F4',
    via: '#34A853',
    to: '#FBBC05',
    shadow: 'rgba(66, 133, 244, 0.15)'
  },
  'jira': {
    from: '#0052CC',
    via: '#0065FF',
    to: '#0052CC',
    shadow: 'rgba(0, 82, 204, 0.15)'
  },
  'trello': {
    from: '#0079BF',
    via: '#00A3FF',
    to: '#0079BF',
    shadow: 'rgba(0, 121, 191, 0.15)'
  },
  'asana': {
    from: '#F06A6A',
    via: '#FF8080',
    to: '#F06A6A',
    shadow: 'rgba(240, 106, 106, 0.15)'
  },
  'monday': {
    from: '#FF3D57',
    via: '#FF666F',
    to: '#FF3D57',
    shadow: 'rgba(255, 61, 87, 0.15)'
  },
  'workday': {
    from: '#0875E1',
    via: '#2B8DF5',
    to: '#0875E1',
    shadow: 'rgba(8, 117, 225, 0.15)'
  },
  'bamboohr': {
    from: '#7BC053',
    via: '#8FD066',
    to: '#7BC053',
    shadow: 'rgba(123, 192, 83, 0.15)'
  },
  'databricks': {
    from: '#FF3621',
    via: '#FF4B38',
    to: '#FF3621',
    shadow: 'rgba(255, 54, 33, 0.15)'
  },
  'snowflake': {
    from: '#29B5E8',
    via: '#40C4F4',
    to: '#29B5E8',
    shadow: 'rgba(41, 181, 232, 0.15)'
  },
  'tableau': {
    from: '#E97627',
    via: '#FF8A3D',
    to: '#E97627',
    shadow: 'rgba(233, 118, 39, 0.15)'
  },
  'sigma': {
    from: '#00A4EF',
    via: '#00B8FF',
    to: '#00A4EF',
    shadow: 'rgba(0, 164, 239, 0.15)'
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

const AppCard = ({ app, onClick, showTooltip, hideTooltip, isFeatured }) => {
  const getAuraColors = () => {
    if (app.brand === 'company') {
      return COMPANY_BLUE;
    }
    return brandColors[app.brand] || DEFAULT_GLOW;
  };

  const auraColors = getAuraColors();

  // Modern monochrome icon mapping
  const getIcon = () => {
    switch (app.id) {
      case 'ai-toybox':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'social-media-manager':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'grant-finder':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        );
      case 'grant-writer':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'powerpoint-generator':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'creative-writer':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'persona-coach':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'salesforce':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'hubspot':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'microsoft-365':
      case 'teams':
      case 'azure':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'google-workspace':
      case 'gcp':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case 'slack':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        );
      case 'aws':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'jira':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case 'trello':
      case 'monday':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'asana':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'workday':
      case 'bamboohr':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'databricks':
      case 'snowflake':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      case 'tableau':
      case 'sigma':
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => showTooltip(app)}
      onMouseLeave={hideTooltip}
    >
      <div
        className={`absolute -inset-[3px] bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition-all duration-500 group-hover:duration-200 ${
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
          h-full transition-all duration-300 transform
          hover:scale-[1.02] hover:-translate-y-1
          border border-gray-100
          hover:shadow-lg
          backdrop-blur-sm backdrop-saturate-200
          min-h-[200px]
        `}
        style={{
          boxShadow: `0 4px 20px ${auraColors.shadow}`
        }}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3.5 rounded-xl bg-gradient-to-br ${
            app.brand === 'company' ? 'from-blue-50 via-blue-100 to-blue-50' : 'from-gray-50 via-gray-100 to-gray-50'
          }`}>
            <div className={`${
              app.brand === 'company' ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {getIcon()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
              {app.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
              {app.isNew && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              )}
                {app.isBeta && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Beta
                  </span>
                )}
                {app.isAI && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    AI
                  </span>
                )}
          </div>
        </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{app.description}</p>
              </div>
          </div>
          
        <div className="mt-auto pt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            Launch App
            </div>
          {app.brand === 'company' && (
            <div className="flex items-center text-xs font-medium text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
              Enterprise Ready
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

// Define categories
const categories = [
  { id: 'featured', name: 'Featured AI Apps' },
  { id: 'user-gen', name: 'User Gen Blox' },
  { id: 'productivity', name: 'Productivity & Collaboration' },
  { id: 'crm', name: 'CRM & Sales' },
  { id: 'project-management', name: 'Project Management' },
  { id: 'hr', name: 'HR & Team Management' },
  { id: 'data-analytics', name: 'Data & Analytics' },
  { id: 'cloud', name: 'Cloud & Infrastructure' },
  { id: 'development', name: 'Development' },
  { id: 'custom', name: 'Custom Apps' }
];

// Featured AI apps
const featuredApps = [
    {
      id: 'ai-toybox',
      name: 'AI Toybox',
    icon: '🎮',
      description: 'Explore our suite of AI tools for content and analysis',
    category: 'featured',
    isAI: true,
    brand: 'company'
    },
    {
      id: 'social-media-manager',
      name: 'Social Media Manager',
    icon: '🔄',
    description: 'Create and manage social media content with AI assistance',
    category: 'featured',
    isAI: true,
    brand: 'company'
    },
    {
      id: 'grant-finder',
      name: 'Grant Finder',
    icon: '🔍',
    description: 'Discover grants tailored to your organization using AI matching',
    category: 'featured',
      isAI: true,
    isBeta: true,
    brand: 'company'
    },
    {
      id: 'grant-writer',
      name: 'Grant Writer',
    icon: '📝',
      description: 'Get AI help writing compelling grant proposals',
    category: 'featured',
    isAI: true,
    brand: 'company'
    },
    {
      id: 'powerpoint-generator',
      name: 'Slide Generator',
    icon: '📊',
    description: 'Generate professional presentations with AI assistance',
    category: 'featured',
      isAI: true,
    isBeta: true,
    brand: 'company'
    }
  ];

// User Gen Blox apps
const userGenApps = [
  {
    id: 'creative-writer',
    name: 'Story Weaver',
    description: 'Create custom storytelling AI with unique writing styles',
    category: 'user-gen',
    isAI: true,
    brand: 'company'
  },
  {
    id: 'persona-coach',
    name: 'Life Coach AI',
    description: 'Design personalized coaching AI with specific expertise',
    category: 'user-gen',
    isAI: true,
    brand: 'company'
  }
];

// Enterprise apps
const enterpriseApps = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '💼',
    description: 'CRM and sales management platform',
    category: 'crm',
    brand: 'salesforce'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '📊',
    description: 'Marketing and CRM platform',
    category: 'crm',
    brand: 'hubspot'
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    icon: '🎯',
    description: 'Customer service and engagement platform',
    category: 'crm',
    brand: 'zendesk'
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    icon: '📝',
    description: 'Productivity and collaboration suite',
    category: 'productivity',
    brand: 'microsoft-365'
  },
    {
    id: 'google-workspace',
    name: 'Google Workspace',
    icon: '📧',
    description: 'Business productivity and collaboration tools',
    category: 'productivity',
    brand: 'google-workspace'
  },
    {
    id: 'zoom',
    name: 'Zoom',
    icon: '🎥',
    description: 'Video conferencing platform',
    category: 'productivity',
    brand: 'zoom'
  },
    {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Team communication platform',
    category: 'productivity',
    brand: 'slack'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: '👥',
    description: 'Team collaboration platform',
    category: 'productivity',
    brand: 'teams'
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: '☁️',
    description: 'Cloud computing services',
    category: 'cloud',
    brand: 'aws'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: '⚡',
    description: 'Cloud platform and services',
    category: 'cloud',
    brand: 'microsoft-365'
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    icon: '🌩️',
    description: 'Cloud computing platform',
    category: 'cloud',
    brand: 'google-workspace'
  }
];

// Project Management apps
const projectManagementApps = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Agile project management and issue tracking',
    category: 'project-management',
    brand: 'jira'
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Visual project management and collaboration',
    category: 'project-management',
    brand: 'trello'
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Work management platform for teams',
    category: 'project-management',
    brand: 'asana'
  }
];

// HR apps
const hrApps = [
  {
    id: 'monday',
    name: 'Monday.com',
    description: 'Team management and collaboration platform',
    category: 'hr',
    brand: 'monday'
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Enterprise HR and finance management',
    category: 'hr',
    brand: 'workday'
  },
    {
    id: 'bamboohr',
    name: 'BambooHR',
    description: 'HR software for growing companies',
    category: 'hr',
    brand: 'bamboohr'
  }
];

// Data & Analytics apps
const dataApps = [
  {
    id: 'databricks',
    name: 'Databricks',
    description: 'Unified analytics platform for big data and ML',
    category: 'data-analytics',
    brand: 'databricks'
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Cloud data platform and warehouse',
    category: 'data-analytics',
    brand: 'snowflake'
  },
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Business intelligence and analytics platform',
    category: 'data-analytics',
    brand: 'tableau'
  },
  {
    id: 'sigma',
    name: 'Sigma Computing',
    description: 'Cloud-native analytics and business intelligence',
    category: 'data-analytics',
    brand: 'sigma'
  }
];

// Combine all apps
const applications = [
  ...featuredApps,
  ...userGenApps,
  ...enterpriseApps,
  ...projectManagementApps,
  ...hrApps,
  ...dataApps
];

export default function Dashboard() {
  const { user, userPreferences, updateSelectedApps } = useAuth();
  const navigate = useNavigate();
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [tooltipApp, setTooltipApp] = useState(null);
  const [taskSummary, setTaskSummary] = useState({
    emails: 0,
    messages: 0,
    todos: 0,
    jiraIssues: 0,
    meetings: 0,
    deadlines: 0,
    approvals: 0,
    mentions: 0
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user's name with fallback
  const getUserName = () => {
    const firstName = user?.displayName?.split(' ')[0] || user?.firstName || user?.email?.split('@')[0];
    if (!firstName) {
      return (
        <div className="inline-flex items-center">
          <span className="text-gray-600">friend</span>
          <button
            onClick={() => navigate('/profile')}
            className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Set your name
          </button>
        </div>
      );
    }
    return <span className="capitalize">{firstName}</span>;
  };

  // Fetch task summary (mock data for now)
  useEffect(() => {
    // This would typically be an API call to fetch real data
    setTaskSummary({
      emails: 12,
      messages: 5,
      todos: 8,
      jiraIssues: 3,
      meetings: 4,
      deadlines: 2,
      approvals: 3,
      mentions: 7
    });
  }, []);

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
    
    if (url.startsWith('/')) {
      navigate(url);
    } else {
    window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getFilteredApps = (categoryId) => {
    if (!userPreferences?.selectedApps || userPreferences.selectedApps.length === 0) {
      return applications.filter(app => app.category === categoryId);
    }
    
    return applications.filter(app => 
      app.category === categoryId && 
      userPreferences.selectedApps.includes(app.id)
    );
  };

    return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalized Greeting Section */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {getUserName()} 👋
              </h1>
              <p className="mt-2 text-gray-600">Here's what's on your plate today:</p>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Unread Emails */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Unread Emails</span>
              </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.emails}</p>
                </div>

                {/* Messages */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                    <span className="text-sm font-medium text-gray-700">Unread Messages</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.messages}</p>
                </div>

                {/* Today's Meetings */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                    <span className="text-sm font-medium text-gray-700">Today's Meetings</span>
            </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.meetings}</p>
            </div>

                {/* Pending Tasks */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Pending Tasks</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.todos}</p>
          </div>

                {/* Upcoming Deadlines */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
                    <span className="text-sm font-medium text-gray-700">Upcoming Deadlines</span>
            </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.deadlines}</p>
        </div>

                {/* Pending Approvals */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Pending Approvals</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.approvals}</p>
      </div>

                {/* Recent Mentions */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Recent Mentions</span>
        </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.mentions}</p>
      </div>

                {/* Active Jira Issues */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
                    <span className="text-sm font-medium text-gray-700">Active Issues</span>
          </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{taskSummary.jiraIssues}</p>
                  </div>
                    </div>
          </div>
            
          <button
              onClick={() => setShowAppSelector(true)}
              className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm flex-shrink-0"
          >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize
            </button>
        </div>
                    </div>

        {categories.map(category => {
          const categoryApps = getFilteredApps(category.id);
          if (categoryApps.length === 0 || category.id === 'custom') return null;

          return (
            <div key={category.id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                <div className="h-px flex-1 bg-gray-200 ml-4"></div>
                  </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryApps.map(app => (
                    <AppCard
                      key={app.id}
                      app={app}
                    onClick={handleAppClick}
                    showTooltip={setTooltipApp}
                      hideTooltip={() => setTooltipApp(null)}
                    isFeatured={category.id === 'featured'}
                    />
        ))}
          </div>
        </div>
          );
        })}

      {/* App Selector Modal */}
      {showAppSelector && (
        <AppSelector
          onClose={() => setShowAppSelector(false)}
            applications={applications}
          selectedApps={userPreferences?.selectedApps || []}
          onSave={updateSelectedApps}
            categories={categories.filter(cat => cat.id !== 'custom')}
          />
        )}
      </div>
    </div>
  );
} 