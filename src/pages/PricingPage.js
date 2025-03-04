import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PricingPage() {
  const navigate = useNavigate();

  const handleContactSales = () => {
    navigate('/contact-sales');
  };

  const features = {
    basic: [
      'Access to AURABLOX platform',
      'Enterprise card links',
      'Basic AI Toybox access',
      'Standard support',
      'Up to 10 users',
      'Monthly usage reports'
    ],
    premium: [
      'Everything in Basic tier',
      'Premium AURABLOX AI agents',
      'Advanced AI Toybox features',
      'Priority support',
      'Unlimited users',
      'Custom integrations',
      'Quarterly business reviews'
    ],
    enterprise: [
      'Everything in Premium tier',
      'Dedicated account manager',
      'Custom development services',
      'Advanced security features',
      'SLA guarantees',
      'White-labeling options',
      'On-premise deployment available'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Simple, transparent</span>
            <span className="block text-primary-600">subscription pricing</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Choose the perfect plan for your team. Scale as you grow with our flexible per-user pricing.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Tier */}
          <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">Basic</h3>
              <p className="mt-4 text-sm text-gray-500">Essential tools for teams getting started with AURABLOX.</p>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">$15</span>
                <span className="text-base font-medium text-gray-500">/user/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-4 flex-1">
              {features.basic.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleContactSales}
              className="mt-8 block w-full rounded-lg border border-primary-600 bg-primary-600 px-6 py-4 text-center text-base font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>

          {/* Premium Tier */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary-500 bg-white p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 sm:-top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 px-3 py-2 text-sm font-semibold text-white text-center">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold leading-5 text-gray-900">Premium</h3>
              <p className="mt-4 text-sm text-gray-500">Advanced AI capabilities for growing organizations.</p>
              <div className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$20</span>
                <span className="text-base font-medium text-gray-500">/user/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-4 flex-1">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleContactSales}
              className="mt-8 block w-full rounded-lg border border-primary-600 bg-primary-600 px-6 py-4 text-center text-base font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="mb-8">
              <h3 className="text-lg font-semibold leading-5 text-gray-900">Enterprise</h3>
              <p className="mt-4 text-sm text-gray-500">Custom solutions with dedicated development services.</p>
              <div className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$20</span>
                <span className="text-base font-medium text-gray-500">/user/month</span>
                <span className="block text-base font-medium text-gray-500 mt-2">+</span>
                <span className="text-2xl font-bold tracking-tight text-gray-900">$299</span>
                <span className="text-base font-medium text-gray-500">/hour</span>
                <span className="block text-sm text-gray-500 mt-1">for consulting & development</span>
              </div>
            </div>
            <ul className="mb-8 space-y-4 flex-1">
              {features.enterprise.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleContactSales}
              className="mt-8 block w-full rounded-lg border-2 border-primary-600 bg-white px-6 py-4 text-center text-base font-medium text-primary-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How does per-user pricing work?</h3>
              <p className="text-gray-600">Our subscription is based on the number of user accounts you need. You can add or remove users at any time, and your billing will adjust accordingly.</p>
            </div>
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What are Premium AI agents?</h3>
              <p className="text-gray-600">Premium AI agents provide advanced automation capabilities, including custom workflows, enhanced content generation, and specialized industry-specific tools.</p>
            </div>
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How are consulting hours billed?</h3>
              <p className="text-gray-600">Consulting and development hours are tracked and billed monthly. We provide detailed reports of all work performed and only bill for actual time spent on your projects.</p>
            </div>
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Yes, you can change your subscription tier at any time. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-24 text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to transform your workflow?</h2>
          <p className="text-lg sm:text-xl text-gray-500 mb-6 sm:mb-8">Get started with AURABLOX today and experience the difference.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleContactSales}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleContactSales}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 