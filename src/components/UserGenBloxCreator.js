import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from './Toast';

const PERSONA_TEMPLATES = {
  'creative-writer': {
    title: 'Story Weaver',
    defaultPrompt: 'You are a creative writing assistant skilled in crafting engaging narratives.',
    fields: ['genre', 'tone', 'style', 'targetAudience'],
    suggestions: {
      genre: ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Historical'],
      tone: ['Serious', 'Humorous', 'Dark', 'Whimsical', 'Professional'],
      style: ['Descriptive', 'Concise', 'Poetic', 'Conversational', 'Technical'],
      targetAudience: ['Children', 'Young Adult', 'Adult', 'Professional', 'Academic']
    }
  },
  'persona-coach': {
    title: 'Life Coach AI',
    defaultPrompt: 'You are a supportive life coach focused on helping clients achieve their goals.',
    fields: ['expertise', 'approach', 'focusArea', 'coachingStyle'],
    suggestions: {
      expertise: ['Career', 'Wellness', 'Relationships', 'Personal Growth', 'Leadership'],
      approach: ['Directive', 'Non-directive', 'Holistic', 'Solution-focused', 'Behavioral'],
      focusArea: ['Goal Setting', 'Habit Formation', 'Work-Life Balance', 'Stress Management', 'Performance'],
      coachingStyle: ['Motivational', 'Analytical', 'Empathetic', 'Challenging', 'Supportive']
    }
  },
  'expert-advisor': {
    title: 'Domain Expert',
    defaultPrompt: 'You are an expert consultant providing specialized knowledge and insights.',
    fields: ['domain', 'expertise', 'methodology', 'communicationStyle'],
    suggestions: {
      domain: ['Technology', 'Business', 'Science', 'Arts', 'Education'],
      expertise: ['Strategic', 'Technical', 'Operational', 'Research', 'Advisory'],
      methodology: ['Data-driven', 'Experience-based', 'Research-backed', 'Best Practices', 'Innovative'],
      communicationStyle: ['Technical', 'Simplified', 'Visual', 'Interactive', 'Executive']
    }
  },
  'task-master': {
    title: 'Task Assistant',
    defaultPrompt: 'You are a specialized task assistant focused on optimizing workflows and processes.',
    fields: ['taskType', 'industry', 'processStyle', 'outputFormat'],
    suggestions: {
      taskType: ['Project Management', 'Content Creation', 'Data Analysis', 'Research', 'Planning'],
      industry: ['Technology', 'Healthcare', 'Education', 'Finance', 'Marketing'],
      processStyle: ['Agile', 'Waterfall', 'Hybrid', 'Lean', 'Custom'],
      outputFormat: ['Reports', 'Presentations', 'Workflows', 'Documentation', 'Analysis']
    }
  }
};

const SuggestionButton = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full h-10 px-3 text-sm rounded-lg transition-all duration-200
      flex items-center justify-center
      ${selected
        ? 'bg-primary-100 text-primary-800 border-2 border-primary-500 font-medium'
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
      }
    `}
  >
    {children}
  </button>
);

export default function UserGenBloxCreator({ type }) {
  const navigate = useNavigate();
  const template = PERSONA_TEMPLATES[type];
  const [formData, setFormData] = useState({});
  const [customPrompt, setCustomPrompt] = useState('');
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Invalid AI Persona Type</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Here we would typically make an API call to create the AI persona
      // For now, we'll simulate the creation with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('AI Persona created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create AI Persona. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-primary-600">
            <h2 className="text-2xl font-bold text-white">{template.title} Creator</h2>
            <p className="mt-1 text-primary-100">Customize your AI persona's characteristics and behavior</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Persona Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a name for your AI persona"
                required
              />
            </div>

            {/* Template Fields */}
            <div className="grid grid-cols-1 gap-8">
              {template.fields.map(field => (
                <div key={field} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {template.suggestions[field].map(suggestion => (
                      <SuggestionButton
                        key={suggestion}
                        selected={formData[field] === suggestion}
                        onClick={() => handleFieldChange(field, suggestion)}
                      >
                        {suggestion}
                      </SuggestionButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Custom Instructions (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any specific instructions or preferences for your AI persona..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="h-12 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !name}
                className={`h-12 px-6 rounded-lg shadow-sm text-sm font-medium text-white
                  ${isGenerating || !name
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Persona...
                  </span>
                ) : (
                  'Create AI Persona'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 