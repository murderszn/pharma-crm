import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { QuickStartGuide } from '../components/QuickStartGuide';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [calendarSource, setCalendarSource] = useState('all'); // all, outlook, google

  // Simulated calendar integration status
  const [connectedCalendars, setConnectedCalendars] = useState({
    outlook: true,
    google: false
  });

  // Group applications by category
  const categories = {
    fundraising: {
      title: "Fundraising & Development",
      description: "Comprehensive tools for grants, RFPs, and donor management",
      apps: ['social-media-manager', 'rfp-finder', 'rfp-manager', 'grant-finder', 'grant-writer', 'donor-crm', 'project-management']
    },
    storage: {
      title: "Document Storage",
      description: "Access and manage your organization's documents and files",
      apps: ['google-drive', 'sharepoint', 'azure-storage']
    },
    ai: {
      title: "AI & Analytics",
      description: "Leverage AI for insights and automation",
      apps: ['ai-toybox', 'business-intelligence']
    },
    operations: {
      title: "Operations",
      description: "Manage internal operations efficiently",
      apps: ['hr-system', 'expense-management', 'ms-teams']
    }
  };

  // Add new storage applications
  const storageApps = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      description: 'Access your organization\'s Google Drive files and folders',
      highlight: false
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      description: 'Connect to your Microsoft SharePoint sites and document libraries',
      highlight: false
    },
    {
      id: 'azure-storage',
      name: 'Azure Storage',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      description: 'Access files stored in Azure Blob Storage and File Share',
      highlight: false
    }
  ];

  // Combine all applications
  const applications = [
    // Fundraising & Development Tools
    {
      id: 'social-media-manager',
      name: 'Social Media Manager',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
      ),
      description: 'Generate and manage social media content with AI assistance',
      isAI: true
    },
    {
      id: 'rfp-finder',
      name: 'RFP Finder',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
      description: 'AI-powered RFP search tool',
      isAI: true
    },
    {
      id: 'rfp-manager',
      name: 'RFP Manager',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      description: 'Generate RFP responses with AI assistance. Create, edit, and manage RFP documents efficiently.',
      isAI: true
    },
    {
      id: 'grant-finder',
      name: 'Grant Finder',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.171-2.303 0-3.182C10.536 7.719 11.768 7.5 12 7.5c.725 0 1.45.22 2.003.659" />
        </svg>
      ),
      description: 'Find grant opportunities tailored to your needs. Search and filter through thousands of available grants.',
      isAI: true
    },
    {
      id: 'grant-writer',
      name: 'Grant Writer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      ),
      description: 'AI-powered grant writing assistant. Create compelling grant proposals with intelligent suggestions.',
      isAI: true
    },
    {
      id: 'donor-crm',
      name: 'Donor CRM',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
      description: 'Manage donor relationships, track contributions, and nurture supporter engagement',
      highlight: true
    },
    {
      id: 'project-management',
      name: 'Project Management',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      ),
      description: 'Track fundraising campaigns, grants, and program initiatives'
    },
    // AI & Analytics
    {
      id: 'ai-toybox',
      name: 'AI Toybox',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      description: 'Explore our suite of AI-powered tools. Generate content, analyze documents, and more.',
      isAI: true
    },
    {
      id: 'business-intelligence',
      name: 'Business Intelligence',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      description: 'Data analytics and insights'
    },
    // Business Tools
    {
      id: 'sales-crm',
      name: 'Sales CRM',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
      description: 'Manage customer relationships'
    },
    {
      id: 'hr-system',
      name: 'HR System',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
        </svg>
      ),
      description: 'Manage employee records and HR processes'
    },
    {
      id: 'expense-management',
      name: 'Expense Management',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      description: 'Track and manage expenses'
    },
    {
      id: 'ms-teams',
      name: 'Microsoft Teams',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: 'Internal communications and collaboration platform'
    },
    ...storageApps
  ];

  const tooltips = {
    'rfp-finder': 'Use AI to find and filter RFP opportunities that match your nonprofit\'s mission',
    'rfp-manager': 'Generate and manage RFP responses with AI assistance',
    'grant-finder': 'Discover grants tailored to your organization\'s programs',
    'grant-writer': 'Get AI help writing compelling grant proposals',
    'donor-crm': 'Comprehensive donor relationship management and engagement tracking',
    'project-management': 'Coordinate fundraising campaigns and track program initiatives',
    'ai-toybox': 'Explore our suite of AI tools for content and analysis',
    'business-intelligence': 'Access detailed analytics and impact insights',
    'google-drive': 'Access and manage your Google Drive files directly from the dashboard',
    'sharepoint': 'Connect to SharePoint for document management and collaboration',
    'azure-storage': 'Access your Azure Storage containers and file shares',
    'ms-teams': 'Connect with your team through chat, meetings, and collaboration tools',
    'social-media-manager': 'Create and manage social media content with AI assistance across multiple platforms'
  };

  const handleAppClick = (appId, appName) => {
    console.log(`Launching ${appName}`);
    
    // Handle navigation for storage apps
    if (appId === 'google-drive') {
      window.open('https://drive.google.com', '_blank');
      return;
    }
    
    if (appId === 'sharepoint') {
      window.open('https://www.office.com/launch/sharepoint', '_blank');
      return;
    }
    
    if (appId === 'azure-storage') {
      window.open('https://portal.azure.com/#blade/Microsoft_Azure_Storage/StorageAccountListBlade', '_blank');
      return;
    }

    if (appId === 'ms-teams') {
      window.open('https://teams.microsoft.com', '_blank');
      return;
    }

    // Handle navigation for all apps
    if (appId === 'ai-toybox') {
      navigate('/ai-toybox');
      return;
    }
    
    if (appId === 'grant-writer') {
      navigate('/grant-writer');
      return;
    }

    if (appId === 'rfp-finder') {
      navigate('/rfp-finder');
      return;
    }

    if (appId === 'grant-finder') {
      navigate('/grant-finder');
      return;
    }

    if (appId === 'rfp-manager') {
      navigate('/rfp-manager');
      return;
    }
    
    if (appId === 'social-media-manager') {
      navigate('/social-media-manager');
      return;
    }

    // Show a toast notification
    toast.info(`Launching ${appName}...`);
  };

  // Function to format date ranges for events
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // Add formatDate function
  const formatDate = (date, time) => {
    if (!date) return '';
    const eventDate = new Date(date);
    const formattedDate = eventDate.toLocaleDateString();
    return time ? `${formattedDate} ${time}` : formattedDate;
  };

  // Enhanced dummy events with more calendar-like properties
  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Fundraising Gala',
      startDate: '2024-04-15T18:00',
      endDate: '2024-04-15T21:00',
      type: 'fundraising',
      description: 'Annual charity gala with key donors and supporters',
      location: 'Grand Hotel Ballroom',
      source: 'outlook',
      attendees: ['john@example.com', 'mary@example.com']
    },
    {
      id: 2,
      title: 'Grant Application Deadline',
      startDate: '2024-04-22T17:00',
      endDate: '2024-04-22T17:00',
      type: 'grant',
      description: 'Education Innovation Fund application due',
      source: 'google',
      reminder: true
    },
    {
      id: 3,
      title: 'Board Meeting',
      date: '2024-04-25',
      time: '14:00',
      type: 'meeting',
      description: 'Quarterly board meeting to review program progress'
    },
    {
      id: 4,
      title: 'Volunteer Training',
      date: '2024-04-28',
      time: '10:00',
      type: 'training',
      description: 'New volunteer orientation and training session'
    },
    {
      id: 5,
      title: 'Community Outreach Event',
      date: '2024-05-01',
      time: '11:00',
      type: 'outreach',
      description: 'Community engagement and program awareness event'
    }
  ];

  // Function to get event type icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'fundraising':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.171-2.303 0-3.182C10.536 7.719 11.768 7.5 12 7.5c.725 0 1.45.22 2.003.659" />
          </svg>
        );
      case 'grant':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        );
      case 'meeting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        );
      case 'training':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        );
      case 'outreach':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        );
    }
  };

  const CalendarModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Calendar</h2>
            <div className="flex items-center space-x-4">
              {/* Calendar Source Filter */}
              <select
                value={calendarSource}
                onChange={(e) => setCalendarSource(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="all">All Calendars</option>
                <option value="outlook">Outlook</option>
                <option value="google">Google Calendar</option>
              </select>

              {/* View Type Selector */}
              <div className="flex rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setCalendarView('month')}
                  className={`px-3 py-1 rounded ${calendarView === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setCalendarView('week')}
                  className={`px-3 py-1 rounded ${calendarView === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarView('day')}
                  className={`px-3 py-1 rounded ${calendarView === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
                >
                  Day
                </button>
              </div>

              {/* Calendar Integration Status */}
              <div className="flex items-center space-x-2">
                <div className={`flex items-center ${connectedCalendars.outlook ? 'text-green-600' : 'text-gray-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className={`flex items-center ${connectedCalendars.google ? 'text-green-600' : 'text-gray-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg">
            {/* Calendar Navigation */}
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Events List */}
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {upcomingEvents
                .filter(event => calendarSource === 'all' || event.source === calendarSource)
                .map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg text-white ${
                          event.type === 'fundraising' ? 'bg-purple-500' :
                          event.type === 'grant' ? 'bg-blue-500' :
                          event.type === 'meeting' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}>
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                          <span className="text-xs text-gray-500">{event.source}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.startDate && event.endDate 
                            ? formatDateRange(event.startDate, event.endDate)
                            : formatDate(event.date, event.time)}
                        </p>
                        {event.location && (
                          <p className="mt-1 text-sm text-gray-600">
                            📍 {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Open in Google Calendar
            </button>
            <button
              onClick={() => window.open('https://outlook.office.com/calendar', '_blank')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Open in Outlook
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Access all your enterprise applications from one place</p>
        </div>
        <button
          onClick={() => setShowQuickStart(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Start Guide
        </button>
      </div>

      <QuickStartGuide 
        isOpen={showQuickStart} 
        onClose={() => setShowQuickStart(false)} 
      />
      
      {/* Application Categories */}
      {Object.entries(categories).map(([key, category]) => (
        <div key={key} className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
            <p className="text-gray-600 mt-1">{category.description}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications
              .filter(app => category.apps.includes(app.id))
              .map((app) => (
                <div
                  key={app.id}
                  className={`app-icon group relative flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 min-h-[240px] ${app.isAI ? 'ai-enabled' : ''}`}
                  onClick={() => handleAppClick(app.id, app.name)}
                  onMouseEnter={() => setActiveTooltip(app.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div className="text-primary-600 group-hover:text-primary-700 mb-4">
                    {app.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{app.description}</p>
                  {app.isAI && (
                    <span className="ai-badge absolute top-4 right-4">
                      AI Enabled
                    </span>
                  )}
                  {activeTooltip === app.id && tooltips[app.id] && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 w-64">
                      {tooltips[app.id]}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Upcoming Events Section */}
      <div className="mt-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-600 mt-1">Your schedule for the next few weeks</p>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              View Calendar
            </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                      {getEventIcon(event.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <span className={`event-badge`} data-type={event.type}>
                        {event.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.startDate && event.endDate 
                        ? formatDateRange(event.startDate, event.endDate)
                        : formatDate(event.date, event.time)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
} 