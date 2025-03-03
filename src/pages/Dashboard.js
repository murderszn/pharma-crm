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
    collaboration: {
      title: "Collaboration & Communication",
      description: "Connect and collaborate with your team through various platforms",
      apps: ['microsoft-365', 'google-workspace', 'slack', 'zoom', 'teams', 'outlook', 'sharepoint']
    },
    crm: {
      title: "Customer Relationship Management",
      description: "Manage customer interactions and relationships effectively",
      apps: ['salesforce', 'hubspot', 'zendesk', 'donor-crm']
    },
    data: {
      title: "Data & Analytics",
      description: "Powerful tools for data processing, analytics, and visualization",
      apps: ['databricks', 'snowflake', 'tableau', 'sigma']
    },
    erp: {
      title: "Enterprise Resource Planning",
      description: "Comprehensive business process management solutions",
      apps: ['sap-erp', 'netsuite', 'dynamics-365']
    },
    project: {
      title: "Project Management",
      description: "Track and manage projects, tasks, and team collaboration",
      apps: ['asana', 'jira', 'monday', 'project-management']
    },
    hr: {
      title: "Human Resources",
      description: "Manage employee records, recruitment, and HR processes",
      apps: ['workday', 'bamboohr', 'hr-system']
    },
    cloud: {
      title: "Cloud & Infrastructure",
      description: "Cloud computing, storage, and infrastructure services",
      apps: ['aws', 'azure', 'gcp', 'dropbox', 'google-drive', 'sharepoint', 'azure-storage']
    },
    web: {
      title: "Web & Content",
      description: "Web presence and content management tools",
      apps: ['wordpress', 'social-media-manager']
    }
  };

  // Add new applications
  const newApps = [
    {
      id: 'microsoft-365',
      name: 'Microsoft 365',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
        </svg>
      ),
      description: 'Comprehensive suite for email, documents, and team collaboration',
      highlight: true
    },
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      ),
      description: 'Cloud-based productivity and collaboration tools',
      highlight: true
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      description: 'Video conferencing and virtual meetings platform',
      highlight: false
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: 'Leading CRM platform for customer relationship management',
      highlight: true
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      description: 'CRM and marketing automation platform',
      highlight: false
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
      description: 'Customer service and support platform',
      highlight: false
    },
    // ... continue with other existing applications ...

    // Add new ERP applications
    {
      id: 'sap-erp',
      name: 'SAP ERP',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      description: 'Comprehensive ERP system for business processes',
      highlight: true
    },
    {
      id: 'netsuite',
      name: 'Oracle NetSuite',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      description: 'Cloud-based ERP suite for business functions',
      highlight: false
    },
    {
      id: 'dynamics-365',
      name: 'Microsoft Dynamics 365',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
      ),
      description: 'Intelligent business applications suite',
      highlight: true
    }
  ];

  // Add remaining applications
  const additionalApps = [
    {
      id: 'asana',
      name: 'Asana',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      description: 'Project and task management platform',
      highlight: false
    },
    {
      id: 'jira',
      name: 'Jira',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
      ),
      description: 'Project management for software development',
      highlight: true
    },
    {
      id: 'monday',
      name: 'Monday.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
      ),
      description: 'Work operating system for project management',
      highlight: false
    },
    {
      id: 'workday',
      name: 'Workday',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: 'Cloud-based HR and finance management',
      highlight: true
    },
    {
      id: 'bamboohr',
      name: 'BambooHR',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: 'HR software for small and medium businesses',
      highlight: false
    },
    {
      id: 'aws',
      name: 'AWS',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
      description: 'Amazon Web Services cloud platform',
      highlight: true
    },
    {
      id: 'azure',
      name: 'Azure',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      ),
      description: 'Microsoft Azure cloud platform',
      highlight: true
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
      description: 'Google Cloud Platform',
      highlight: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      description: 'Cloud storage and file sharing',
      highlight: false
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      description: 'Content management system for websites',
      highlight: false
    }
  ];

  // Add new data & analytics applications
  const dataApps = [
    {
      id: 'databricks',
      name: 'Databricks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      description: 'Unified analytics platform for large-scale data engineering and collaborative data science',
      highlight: true
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
      description: 'Cloud data platform for storage, processing, and analytics at enterprise scale',
      highlight: true
    },
    {
      id: 'tableau',
      name: 'Tableau',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      description: 'Interactive data visualization and business intelligence platform',
      highlight: true
    },
    {
      id: 'sigma',
      name: 'Sigma Computing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      description: 'Cloud-native analytics and business intelligence for modern data teams',
      highlight: false
    }
  ];

  // Add new collaboration apps
  const collaborationApps = [
    {
      id: 'slack',
      name: 'Slack',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      description: 'Real-time messaging, file sharing, and team collaboration platform',
      highlight: true
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: 'Unified communication and collaboration platform with chat, meetings, and file sharing',
      highlight: true
    }
  ];

  // Update applications array to include collaboration apps
  const applications = [
    ...newApps,
    ...additionalApps,
    ...dataApps,
    ...collaborationApps,
    // ... existing applications ...
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
    'outlook-online': 'Access your email, calendar, and contacts through Microsoft Outlook',
    'slack': 'Connect and collaborate with your team through instant messaging, file sharing, and channels',
    'teams': 'All-in-one collaboration hub with chat, video meetings, file storage, and app integration',
    'social-media-manager': 'Create and manage social media content with AI assistance across multiple platforms',
    'databricks': 'Unified analytics platform for data engineering and collaborative data science',
    'snowflake': 'Cloud data platform for enterprise-scale data storage and analytics',
    'tableau': 'Create interactive visualizations and dashboards for data-driven insights',
    'sigma': 'Modern cloud analytics platform for exploring and visualizing data',
    'powerpoint-generator': 'Create PowerPoint presentations with customizable themes and moods using AI-powered VBA code generation'
  };

  const handleAppClick = (appId, appName) => {
    console.log(`Launching ${appName}`);
    
    // Handle navigation for all applications
    const appUrls = {
      'microsoft-365': 'https://www.office.com',
      'google-workspace': 'https://workspace.google.com',
      'zoom': 'https://zoom.us',
      'salesforce': 'https://login.salesforce.com',
      'hubspot': 'https://app.hubspot.com',
      'zendesk': 'https://www.zendesk.com/login',
      'sap-erp': 'https://www.sap.com/products/erp.html',
      'netsuite': 'https://system.netsuite.com',
      'dynamics-365': 'https://dynamics.microsoft.com',
      'asana': 'https://app.asana.com',
      'jira': 'https://id.atlassian.com',
      'monday': 'https://monday.com/login',
      'workday': 'https://www.workday.com',
      'bamboohr': 'https://www.bamboohr.com/login',
      'aws': 'https://aws.amazon.com/console',
      'azure': 'https://portal.azure.com',
      'gcp': 'https://console.cloud.google.com',
      'dropbox': 'https://www.dropbox.com/login',
      'wordpress': 'https://wordpress.com/log-in',
      'google-drive': 'https://drive.google.com',
      'sharepoint': 'https://www.office.com/launch/sharepoint',
      'teams': 'https://teams.microsoft.com',
      'outlook': 'https://outlook.office.com',
      'slack': 'https://slack.com/signin',
      'databricks': 'https://databricks.com/login',
      'snowflake': 'https://app.snowflake.com',
      'tableau': 'https://online.tableau.com',
      'sigma': 'https://app.sigmacomputing.com/login',
      'powerpoint-generator': '/powerpoint-generator'
    };

    if (appUrls[appId]) {
      window.open(appUrls[appId], '_blank');
      return;
    }

    // Handle existing navigation logic
    if (appId === 'google-drive') {
      window.open('https://drive.google.com', '_blank');
      return;
    }
    
    // Handle navigation for storage apps
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
    
    if (appId === 'outlook-online') {
      window.open('https://outlook.office.com', '_blank');
      return;
    }
    
    if (appId === 'slack') {
      window.open('https://slack.com/signin', '_blank');
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
          </svg>
        );
      case 'meeting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
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

  // Add new featuredAiApps array after the categories object
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
      id: 'rfp-finder',
      name: 'RFP Finder',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
        </svg>
      ),
      description: 'Use AI to find and filter RFP opportunities that match your nonprofit\'s mission',
      isAI: true
    },
    {
      id: 'rfp-manager',
      name: 'RFP Manager',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15" />
        </svg>
      ),
      description: 'Generate and manage RFP responses with AI assistance',
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
      description: 'Create and manage social media content with AI assistance across multiple platforms',
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
      description: 'Discover grants tailored to your organization\'s programs using AI matching',
      isAI: true
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
      name: 'PowerPoint Generator',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      description: 'Generate professional PowerPoint presentations with VBA code using AI assistance',
      isAI: true
    }
  ];

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
      
      {/* Featured AI Apps Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          Featured AI Apps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAiApps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleAppClick(app.id, app.name)}
              className="relative group cursor-pointer"
            >
              {/* Holographic outline effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 via-primary-400/50 to-primary-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              <div className="relative flex items-center space-x-4 bg-white p-6 rounded-xl border border-gray-200/50 hover:border-primary-500/50 transition-all duration-200">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-500/10 text-primary-600">
              {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {app.description}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      AI Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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