import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoPaymentModal = ({ plan, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handleDemoPayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Subscribe to {plan.name}
        </h3>
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Selected Plan: {plan.name}</p>
          <p className="text-gray-600 mb-4">Price: ${plan.price}/month</p>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              This is a demo payment flow. No actual payment will be processed.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDemoPayment}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export function PricingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSuccess = () => {
    // In a real implementation, this would create a user account and subscription
    navigate('/login');
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams",
      price: 99,
      features: [
        "Up to 5 team members",
        "Basic AI tools",
        "Standard integrations",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      description: "Best for growing companies",
      price: 199,
      features: [
        "Up to 20 team members",
        "Advanced AI tools",
        "Premium integrations",
        "Priority support",
        "Advanced analytics",
        "Custom workflows",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: 399,
      features: [
        "Unlimited team members",
        "Full AI toolkit",
        "Custom integrations",
        "24/7 dedicated support",
        "Enterprise analytics",
        "Custom development",
        "SLA guarantee",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-12 w-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 8.5M12 6V12M12 6L8 8.5M12 12L16 9.5M12 12V18M12 12L8 9.5M12 18L16 15.5M12 18L8 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="ml-3 text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                AURABLOX
              </h2>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl ${
                plan.popular
                  ? "bg-white border-2 border-primary-500 shadow-xl"
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3 px-6 rounded-lg font-semibold ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600"
                    : "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
                } transition duration-200`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Payment Modal */}
      {selectedPlan && (
        <DemoPaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default PricingPage; 