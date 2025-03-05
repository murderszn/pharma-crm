import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define features array
const features = [
  {
    title: "Apps Hub",
    description: "Access a centralized marketplace of pre-built AI applications ready for instant deployment. Customize and integrate apps to match your specific business needs.",
    metrics: "100+ Enterprise Apps",
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    title: "Gen AI Tools",
    description: "Leverage cutting-edge generative AI capabilities for content creation, data analysis, and problem-solving. Transform ideas into actionable outputs instantly.",
    metrics: "10x Faster Creation",
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "Agentic AI & Workflows",
    description: "Create intelligent AI agents that autonomously execute complex workflows. Automate end-to-end processes with smart decision-making capabilities.",
    metrics: "85% Task Automation",
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

// Define pricing plans array
const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for getting started with AI",
    price: "15",
    billingPeriod: "/user/month",
    features: [
      "1 custom AI agent",
      "Basic workflow automation",
      "Standard AI models",
      "Community support",
      "Basic analytics dashboard",
      "Email support"
    ],
    cta: "Start Building",
    popular: false
  },
  {
    name: "Professional",
    description: "For teams ready to scale AI operations",
    price: "20",
    billingPeriod: "/user/month",
    features: [
      "Up to 3 custom AI agents",
      "Advanced workflow automation",
      "Premium AI models",
      "Priority support",
      "Advanced analytics",
      "API access",
      "Dedicated success manager"
    ],
    cta: "Start Building",
    popular: true
  },
  {
    name: "Enterprise + Consulting",
    description: "Custom solutions with expert guidance",
    enterprise: true,
    startingPrice: "20",
    features: [
      "Everything in Professional",
      "Custom AI model development",
      "Dedicated AI architect",
      "Implementation consulting",
      "Custom integrations",
      "24/7 priority support",
      "Training & onboarding",
      "Quarterly strategy reviews"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header with CTA */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 8.5M12 6V12M12 6L8 8.5M12 12L16 9.5M12 12V18M12 12L8 9.5M12 18L16 15.5M12 18L8 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                AURABLOX
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="hidden md:block px-4 py-2 text-gray-600 font-semibold hover:text-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition duration-200 shadow-sm"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-semibold text-primary-700 bg-primary-50 rounded-full">
              Complete Enterprise AI Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Enterprise with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
                Intelligent AI Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              One platform for all your AI needs: Apps Hub for instant solutions, Gen AI Tools for creation, and Agentic AI for intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition duration-200 shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>Start Building</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="https://www.youtube.com/watch?v=your-demo-video-id"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transform hover:scale-105 transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </a>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Deploy in minutes</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>

          {/* Platform Visualization */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
            <div className="relative max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Sources</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium">Documents & Data</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium">User Interactions</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <span className="text-sm font-medium">Enterprise Systems</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Processing Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 shadow-lg border border-primary-200">
                    <div className="absolute inset-0 bg-grid-primary-600/[0.05] rounded-2xl" />
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AURABLOX AI Engine</h3>
                      <div className="space-y-4">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.02, 1],
                            rotate: [0, 1, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary-700">Processing</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-100" />
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-200" />
                            </div>
                          </div>
                        </motion.div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="h-2 bg-primary-200 rounded-full w-3/4" />
                          <div className="h-2 bg-primary-100 rounded-full w-1/2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Intelligent Outputs</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm font-medium">Predictive Insights</span>
                        </div>
                        <span className="text-xs font-semibold text-green-600">95% Accuracy</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-sm font-medium">Automated Actions</span>
                        </div>
                        <span className="text-xs font-semibold text-green-600">85% Faster</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">ROI Impact</span>
                        </div>
                        <span className="text-xs font-semibold text-green-600">+60% Revenue</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Complete AI Platform for Enterprise Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From ready-to-use apps to custom AI agents, our platform provides everything you need to transform your business operations with AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 min-h-[80px]">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-primary-600 font-semibold">
                    {feature.metrics}
                  </span>
                  <button
                    onClick={() => navigate('/demo')}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our affordable plans and scale with consulting expertise
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Per user/month</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Expert support included</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className={`relative rounded-2xl h-full flex flex-col ${
                  plan.popular
                    ? "bg-white border-2 border-primary-500 shadow-xl md:scale-105"
                    : "bg-white border border-gray-200 shadow-sm"
                } overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 left-0 bg-primary-500 text-white text-sm font-semibold py-2 px-4 text-center">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 flex flex-col flex-grow ${plan.popular ? "pt-16" : "pt-8"}`}>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6 min-h-[48px]">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      {plan.enterprise ? (
                        <>
                          <span className="text-3xl font-bold text-gray-900">Custom Pricing</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl font-semibold text-gray-900">$</span>
                          <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                          <span className="ml-2 text-gray-600">{plan.billingPeriod}</span>
                        </>
                      )}
                    </div>
                    {plan.enterprise && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        Starting at ${plan.startingPrice}/user/month + consulting
                      </p>
                    )}
                  </div>

                  <div className="flex-grow">
                    <ul className="mb-8 space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="ml-3 text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate(plan.enterprise ? '/contact-sales' : '/login')}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl'
                        : plan.enterprise
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                        : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expert Consulting Services Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Expert Consulting Services
            </h3>
            <p className="text-xl text-gray-600 text-center mb-12">
              Get personalized guidance from our AI experts to maximize your success
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Implementation</h4>
                <p className="text-gray-600">
                  Expert assistance in setting up and configuring your AI solutions for optimal performance.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Training</h4>
                <p className="text-gray-600">
                  Comprehensive training programs to help your team master our AI tools and capabilities.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Strategy</h4>
                <p className="text-gray-600">
                  Strategic consulting to align AI capabilities with your business objectives and growth plans.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;