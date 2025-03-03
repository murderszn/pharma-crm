import React, { useState } from 'react';
import { toast } from '../components/Toast';
import { geminiApi } from '../services/geminiApi';
import { QuickStart } from '../components/QuickStart';

export function SocialMediaManager() {
  const [postInput, setPostInput] = useState('');
  const [brandVoice, setBrandVoice] = useState('professional');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin']);
  const [contentType, setContentType] = useState('thought_leadership');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [keyObjectives, setKeyObjectives] = useState([]);
  const [customHashtags, setCustomHashtags] = useState('');

  const platformOptions = [
    { value: 'linkedin', label: 'LinkedIn', icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' },
    { value: 'facebook', label: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
    { value: 'instagram', label: 'Instagram', icon: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z' },
    { value: 'twitter', label: 'X (Twitter)', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { value: 'blog', label: 'Blog Post', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { value: 'newsletter', label: 'Newsletter', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' }
  ];

  const voiceOptions = [
    { value: 'conversational', label: 'Conversational & Authentic' },
    { value: 'friendly', label: 'Warm & Friendly' },
    { value: 'expert', label: 'Expert & Approachable' },
    { value: 'storyteller', label: 'Engaging Storyteller' },
    { value: 'community', label: 'Community-Focused' }
  ];

  const contentTypeOptions = [
    { value: 'story', label: 'Personal Story or Experience' },
    { value: 'insight', label: 'Helpful Insight or Tip' },
    { value: 'discussion', label: 'Conversation Starter' },
    { value: 'behind_scenes', label: 'Behind the Scenes' },
    { value: 'celebration', label: 'Team or Customer Celebration' },
    { value: 'learning', label: 'Learning or Growth Moment' }
  ];

  const objectiveOptions = [
    { value: 'engagement', label: 'Drive Engagement' },
    { value: 'awareness', label: 'Raise Awareness' },
    { value: 'leads', label: 'Generate Leads' },
    { value: 'traffic', label: 'Drive Website Traffic' },
    { value: 'authority', label: 'Build Authority' },
    { value: 'community', label: 'Build Community' }
  ];

  const handleObjectiveToggle = (objective) => {
    setKeyObjectives(prev => {
      if (prev.includes(objective)) {
        return prev.filter(obj => obj !== objective);
      }
      return [...prev, objective];
    });
  };

  const handlePlatformToggle = (platformValue) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformValue)) {
        return prev.filter(p => p !== platformValue);
      }
      return [...prev, platformValue];
    });
  };

  const generatePost = async () => {
    if (!postInput.trim()) {
      toast.error('Please provide content details');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsGenerating(true);
    try {
      const newPosts = [];

      for (const platform of selectedPlatforms) {
        const prompt = `Create a natural, conversational ${platform} post about: ${postInput}

        Personality Guide:
        - Write as a real person sharing authentic thoughts and experiences
        - Use a ${brandVoice} tone that feels genuine and relatable
        - Focus on ${contentType.replace('_', ' ')} in a way that resonates with ${targetAudience}
        - Aim to ${keyObjectives.join(' and ')} through authentic connection
        - Include relevant hashtags naturally: ${customHashtags}

        Key Elements:
        - Start with a hook that draws people in naturally
        - Share genuine thoughts or experiences
        - Ask questions to encourage real conversation
        - Use natural language and avoid corporate speak
        - Include emojis sparingly and authentically
        - End with an engaging question or genuine call to action

        Platform-Specific Style:
        - LinkedIn: Professional but human, share real experiences
        - Facebook: Friendly and community-focused, like talking to friends
        - Instagram: Authentic and relatable, focus on storytelling
        - Twitter: Casual and conversational, join the discussion naturally
        - Blog: Personal and detailed, like having a deep conversation
        - Newsletter: Friendly and direct, like writing to a friend

        Make it feel like a real person is sharing their thoughts, not a brand pushing content.
        ${platform === 'newsletter' ? 'For newsletter, include a personal, engaging subject line prefixed with "Subject:" on the first line.' : ''}`;

        const response = await geminiApi.generateText(prompt);
        
        if (response.error) {
          toast.error(`Error generating ${platform} post: ${response.error}`);
        } else {
          newPosts.push({
            id: Date.now() + Math.random(),
            platform: platform,
            content: response.message || response,
            timestamp: new Date().toISOString()
          });
        }
      }

      if (newPosts.length > 0) {
        setGeneratedPosts([...newPosts, ...generatedPosts]);
        toast.success(`Generated authentic posts for ${newPosts.length} platform(s)!`);
      }
    } catch (error) {
      console.error('Error generating posts:', error);
      toast.error('Failed to generate posts');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const quickStartGuides = [
    {
      title: "Content Strategy",
      description: "Define your message and choose your target platforms. Set your brand voice and content type to ensure consistent messaging.",
      keywords: ["Message", "Platforms", "Brand Voice"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      title: "AI Generation",
      description: "Let our AI create platform-specific content that resonates with your audience while maintaining your brand identity.",
      keywords: ["AI Writing", "Platform Optimization", "Engagement"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Review & Schedule",
      description: "Review your generated posts, make any final adjustments, and prepare them for publishing across your platforms.",
      keywords: ["Review", "Schedule", "Publish"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

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
                <span className="text-sm text-primary-100">AI-Powered Content</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Social Media Manager
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Create, schedule, and manage your social media content with AI assistance
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multi-Platform</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Scheduling</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">5+</div>
                    <div className="text-xs text-primary-300">Platforms</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">24/7</div>
                    <div className="text-xs text-primary-300">Scheduling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Topic or Message
                </label>
                <textarea
                  value={postInput}
                  onChange={(e) => setPostInput(e.target.value)}
                  rows="4"
                  placeholder="What would you like to post about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms (Select Multiple)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        selectedPlatforms.includes(platform.value)
                          ? 'bg-primary-50 border-primary-500 text-primary-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path d={platform.icon} fill="currentColor" />
                      </svg>
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Voice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Voice
                </label>
                <select
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {voiceOptions.map((voice) => (
                    <option key={voice.value} value={voice.value}>
                      {voice.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {contentTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Tech professionals, Healthcare providers, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Key Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Objectives
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {objectiveOptions.map((objective) => (
                    <button
                      key={objective.value}
                      onClick={() => handleObjectiveToggle(objective.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        keyObjectives.includes(objective.value)
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {objective.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Hashtags
                </label>
                <input
                  type="text"
                  value={customHashtags}
                  onChange={(e) => setCustomHashtags(e.target.value)}
                  placeholder="#YourBrand #Industry #Campaign"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <button
                onClick={generatePost}
                disabled={isGenerating}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Generate Post'
                )}
              </button>
            </div>

            {/* Right Column - Generated Posts */}
            <div>
              <div className="space-y-6">
                {generatedPosts.length > 0 ? (
                  generatedPosts.map((post) => (
                    <div key={post.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
                            <path d={platformOptions.find(p => p.value === post.platform)?.icon} fill="currentColor" />
                          </svg>
                          <span className="font-medium text-gray-900">
                            {platformOptions.find(p => p.value === post.platform)?.label}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(post.content)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">{post.content}</div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        Generated {new Date(post.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No posts generated</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first social media post.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default SocialMediaManager; 