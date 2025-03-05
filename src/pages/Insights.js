import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { QuickStart } from '../components/QuickStart';
import { BetaBadge, BetaMessage } from '../components/BetaDisclaimer';

export function Insights() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedView, setSelectedView] = useState('overview');
  
  // Quick Start Guides
  const quickStartGuides = [
    {
      title: "Overview",
      description: "Get a high-level view of your organization's AI tools and app usage with real-time analytics and insights.",
      keywords: ["Dashboard", "Analytics", "Metrics"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "AI Integration Metrics",
      description: "Monitor AI performance across all integrated applications and analyze automation efficiency.",
      keywords: ["AI", "Integration", "Performance"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Enterprise Apps Analytics",
      description: "Track usage patterns and performance metrics across your enterprise application suite.",
      keywords: ["Enterprise", "Usage", "Analytics"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Enhanced data for AURABLOX analytics including both site and enterprise apps
  const appUsageData = {
    'AI Assistant': {
      totalUsers: 2456,
      activeToday: 876,
      popularFeatures: [
        { name: 'Natural Language Queries', usage: 1543 },
        { name: 'Document Analysis', usage: 892 },
        { name: 'Code Generation', usage: 654 },
        { name: 'Data Insights', usage: 432 }
      ],
      satisfaction: 4.8,
      successRate: '92%',
      aiInteractions: 25678,
      avgResponseTime: '1.2s'
    },
    'Social Media Manager': {
      totalUsers: 1876,
      activeToday: 654,
      popularFeatures: [
        { name: 'AI Content Generation', usage: 1234 },
        { name: 'Analytics Dashboard', usage: 987 },
        { name: 'Campaign Automation', usage: 765 },
        { name: 'Engagement Tracking', usage: 543 }
      ],
      satisfaction: 4.7,
      successRate: '89%',
      postsGenerated: 18934,
      engagementRate: '24%'
    },
    'Grant Writer': {
      totalUsers: 987,
      activeToday: 342,
      popularFeatures: [
        { name: 'AI Writing Assistant', usage: 876 },
        { name: 'Template Library', usage: 654 },
        { name: 'Budget Calculator', usage: 432 },
        { name: 'Collaboration Tools', usage: 321 }
      ],
      satisfaction: 4.6,
      successRate: '85%',
      proposalsGenerated: 4567,
      averageGrantSize: '$175,000'
    },
    'Salesforce': {
      totalUsers: 3456,
      activeToday: 1234,
      popularFeatures: [
        { name: 'Lead Management', usage: 2345 },
        { name: 'Sales Analytics', usage: 1876 },
        { name: 'Pipeline View', usage: 1543 },
        { name: 'Task Automation', usage: 987 }
      ],
      satisfaction: 4.5,
      successRate: '88%',
      dealsTracked: 12456,
      revenueManaged: '$25M'
    },
    'Microsoft 365': {
      totalUsers: 4567,
      activeToday: 2345,
      popularFeatures: [
        { name: 'Teams Collaboration', usage: 3456 },
        { name: 'Document Sharing', usage: 2987 },
        { name: 'Email Management', usage: 2654 },
        { name: 'Calendar Sync', usage: 1876 }
      ],
      satisfaction: 4.7,
      successRate: '91%',
      documentsManaged: 45678,
      meetingsScheduled: 8765
    }
  };

  const aiMetrics = [
    {
      name: 'AI Assistant',
      tasks: 25678,
      success: 23623,
      outputs: 'Responses',
      chainedWith: ['Document Analyzer', 'Code Generator', 'Data Insights']
    },
    {
      name: 'Social Media Manager',
      tasks: 18934,
      success: 16852,
      outputs: 'Posts',
      chainedWith: ['Content Analyzer', 'Engagement Predictor', 'Scheduler']
    },
    {
      name: 'Grant Writer',
      tasks: 4567,
      success: 3882,
      outputs: 'Proposals',
      chainedWith: ['Budget Calculator', 'Impact Analyzer', 'Template Engine']
    }
  ];

  const enterpriseMetrics = [
    {
      name: 'Salesforce',
      users: 3456,
      active: 1234,
      storage: '2.3TB',
      integrations: ['Email', 'Calendar', 'Social Media']
    },
    {
      name: 'Microsoft 365',
      users: 4567,
      active: 2345,
      storage: '5.1TB',
      integrations: ['Teams', 'SharePoint', 'OneDrive']
    },
    {
      name: 'Google Workspace',
      users: 3234,
      active: 1876,
      storage: '4.2TB',
      integrations: ['Gmail', 'Drive', 'Meet']
    }
  ];

  const systemHealthData = {
    uptime: '99.99%',
    responseTime: '185ms',
    activeUsers: 3456,
    aiTasksCompleted: 49179,
    errorRate: '0.08%',
    resourceUtilization: '72%',
    totalStorage: '12.4TB',
    apiCalls: '1.2M/day'
  };

  const activityTrends = [
    { time: '00:00', users: 876, aiTasks: 1234, enterprise: 2345, success: 3789 },
    { time: '04:00', users: 543, aiTasks: 876, enterprise: 1654, success: 2654 },
    { time: '08:00', users: 1876, aiTasks: 2345, enterprise: 3456, success: 6543 },
    { time: '12:00', users: 2345, aiTasks: 3456, enterprise: 4567, success: 8765 },
    { time: '16:00', users: 2876, aiTasks: 3987, enterprise: 5234, success: 9876 },
    { time: '20:00', users: 1654, aiTasks: 2765, enterprise: 3876, success: 7654 }
  ];

  const integrationMetrics = [
    { date: 'Mon', aiCalls: 8765, apiSuccess: 8234, latency: 190 },
    { date: 'Tue', aiCalls: 9876, apiSuccess: 9234, latency: 185 },
    { date: 'Wed', aiCalls: 11234, apiSuccess: 10876, latency: 178 },
    { date: 'Thu', aiCalls: 10876, apiSuccess: 10234, latency: 182 },
    { date: 'Fri', aiCalls: 12345, apiSuccess: 11987, latency: 175 },
    { date: 'Sat', aiCalls: 7654, apiSuccess: 7234, latency: 195 },
    { date: 'Sun', aiCalls: 6543, apiSuccess: 6234, latency: 188 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modern SaaS Header */}
      <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-2xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"></div>
          <div className="absolute -left-48 -top-48 h-96 w-96">
            <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-500/40 via-primary-300/10 to-primary-400/40 blur-xl opacity-30"></div>
          </div>
          <div className="absolute -right-48 -bottom-48 h-96 w-96">
            <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-400/40 via-primary-300/10 to-primary-500/40 blur-xl opacity-30"></div>
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-800/50 border border-primary-700/50 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
                <span className="text-sm text-primary-100">Live Analytics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center">
                AI Insights
                <BetaBadge className="ml-3" />
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Comprehensive analytics across your entire workspace
              </p>
              <BetaMessage className="mt-2" />
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time Monitoring</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-Powered Analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Enterprise Integration</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">{systemHealthData.activeUsers}</div>
                    <div className="text-xs text-primary-300">Active Users</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">{systemHealthData.aiTasksCompleted}</div>
                    <div className="text-xs text-primary-300">AI Tasks Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="overview">Overview</option>
            <option value="ai-metrics">AI Metrics</option>
            <option value="enterprise">Enterprise Apps</option>
            <option value="system">System Health</option>
          </select>
        </div>
      </div>

      {/* Enhanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* App Usage Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Application Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(appUsageData).map(([name, data]) => ({
                name: name.split(' ')[0],
                total: data.totalUsers,
                active: data.activeToday
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#0088FE" name="Total Users" />
                <Bar dataKey="active" fill="#00C49F" name="Active Today" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-6">AI Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={integrationMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="aiCalls" stroke="#0088FE" name="AI Calls" />
                <Line type="monotone" dataKey="apiSuccess" stroke="#00C49F" name="Successful Calls" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(systemHealthData).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Activity Timeline</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#0088FE" fill="#0088FE" name="Active Users" />
              <Area type="monotone" dataKey="aiTasks" stackId="1" stroke="#00C49F" fill="#00C49F" name="AI Tasks" />
              <Area type="monotone" dataKey="enterprise" stackId="1" stroke="#FFBB28" fill="#FFBB28" name="Enterprise Usage" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Agent Performance */}
        {aiMetrics.map((agent) => (
          <div key={agent.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Tasks: {agent.tasks.toLocaleString()}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-emerald-600">
                  {((agent.success / agent.tasks) * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">Success</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Integration Chain:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {agent.chainedWith.map((chain) => (
                  <span
                    key={chain}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Integration Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {enterpriseMetrics.map((app) => (
          <div key={app.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Active: {app.active.toLocaleString()} / {app.users.toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Storage: {app.storage}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Active Integrations:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {app.integrations.map((integration) => (
                  <span
                    key={integration}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickStart guides={quickStartGuides} />

      <style jsx>{`
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
} 