import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
      title: "AI Agent Performance",
      description: "Monitor your AI agents' performance, success rates, and integration patterns across your workspace.",
      keywords: ["AI Agents", "Success Rate", "Integration"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "System Health",
      description: "Track system performance, resource utilization, and overall platform health in real-time.",
      keywords: ["Health", "Performance", "Monitoring"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Simulated data for Aurablox analytics
  const appUsageData = {
    'Social Media Manager': {
      totalUsers: 1245,
      activeToday: 456,
      popularFeatures: [
        { name: 'Post Generation', usage: 892 },
        { name: 'Content Calendar', usage: 567 },
        { name: 'Analytics', usage: 432 },
        { name: 'Team Collaboration', usage: 345 }
      ],
      satisfaction: 4.8,
      successRate: '89%',
      postsGenerated: 15678,
      engagementRate: '23%'
    },
    'Grant Writer': {
      totalUsers: 789,
      activeToday: 234,
      popularFeatures: [
        { name: 'Proposal Templates', usage: 567 },
        { name: 'Impact Metrics', usage: 432 },
        { name: 'Budget Calculator', usage: 321 },
        { name: 'Collaboration Tools', usage: 234 }
      ],
      satisfaction: 4.7,
      successRate: '82%',
      proposalsGenerated: 3456,
      averageGrantSize: '$125,000'
    },
    'RFP Manager': {
      totalUsers: 567,
      activeToday: 189,
      popularFeatures: [
        { name: 'Response Generator', usage: 432 },
        { name: 'Requirements Analysis', usage: 345 },
        { name: 'Team Review', usage: 234 },
        { name: 'Document Export', usage: 189 }
      ],
      satisfaction: 4.6,
      successRate: '78%',
      proposalsSubmitted: 2345,
      winRate: '45%'
    }
  };

  const aiAgentMetrics = [
    {
      name: 'Social Media Manager',
      tasks: 15678,
      success: 13965,
      outputs: 'Posts',
      chainedWith: ['Content Analyzer', 'Image Generator']
    },
    {
      name: 'Grant Writer',
      tasks: 3456,
      success: 2834,
      outputs: 'Proposals',
      chainedWith: ['RFP Manager', 'Impact Analyzer']
    },
    {
      name: 'RFP Manager',
      tasks: 2345,
      success: 1829,
      outputs: 'Responses',
      chainedWith: ['Document Analyzer', 'Grant Writer']
    }
  ];

  const systemHealthData = {
    uptime: '99.9%',
    responseTime: '245ms',
    activeUsers: 2345,
    aiTasksCompleted: 21479,
    errorRate: '0.12%',
    resourceUtilization: '67%'
  };

  const activityTrends = [
    { time: '00:00', users: 456, aiTasks: 789, success: 745 },
    { time: '04:00', users: 234, aiTasks: 456, success: 432 },
    { time: '08:00', users: 789, aiTasks: 1234, success: 1198 },
    { time: '12:00', users: 1234, aiTasks: 1789, success: 1687 },
    { time: '16:00', users: 1567, aiTasks: 2134, success: 2023 },
    { time: '20:00', users: 890, aiTasks: 1456, success: 1389 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                <span className="text-sm text-primary-100">Live Analytics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center">
                Aurablox Insights
                <BetaBadge className="ml-3" />
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Real-time analytics for your AI-powered workspace
              </p>
              <BetaMessage className="mt-2" />
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Analytics</span>
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
                    <div className="text-2xl font-bold text-primary-400">{systemHealthData.uptime}</div>
                    <div className="text-xs text-primary-300">Uptime</div>
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
            <option value="ai-agents">AI Agents</option>
            <option value="apps">Apps</option>
            <option value="system">System Health</option>
          </select>
        </div>
      </div>

      {/* App Usage and AI Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* App Usage Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">App Usage</h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(appUsageData).map(([name, data]) => ({
                name: name.split(' ')[0], // Shorter names for mobile
                users: data.totalUsers,
                active: data.activeToday
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="users" fill="#0088FE" name="Total Users" />
                <Bar dataKey="active" fill="#00C49F" name="Active Today" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Agent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">AI Agent Activity</h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiAgentMetrics.map(agent => ({
                    name: agent.name.length > 12 ? agent.name.substring(0, 12) + '...' : agent.name, // Truncate long names
                    value: agent.tasks
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {aiAgentMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 sm:mb-8">
        {Object.entries(systemHealthData).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="mt-1 sm:mt-2">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Activity Timeline</h3>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityTrends} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="users" fill="#0088FE" name="Active Users" />
              <Bar dataKey="aiTasks" fill="#00C49F" name="AI Tasks" />
              <Bar dataKey="success" fill="#FFBB28" name="Successful Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {aiAgentMetrics.map((agent) => (
          <div key={agent.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Total Tasks: {agent.tasks}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-emerald-600">
                  {((agent.success / agent.tasks) * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">Success Rate</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Chained with:</p>
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
      <QuickStart guides={quickStartGuides} />

      <style jsx>{`
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
} 