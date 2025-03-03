import React, { useState } from 'react';
import { toast } from '../components/Toast';
import { geminiApi } from '../services/geminiApi';
import { QuickStart } from '../components/QuickStart';

export function PowerPointGenerator() {
  const [slideContent, setSlideContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('professional');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVBA, setGeneratedVBA] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [previewSlides, setPreviewSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const moodOptions = [
    { value: 'professional', label: 'Professional', description: 'Clean, corporate style with emphasis on clarity' },
    { value: 'creative', label: 'Creative', description: 'Dynamic layouts with artistic elements' },
    { value: 'informative', label: 'Informative', description: 'Data-focused with clear hierarchy' },
    { value: 'energetic', label: 'Energetic', description: 'Bold colors and engaging visuals' }
  ];

  const themeOptions = [
    { value: 'default', label: 'Default', description: 'Classic PowerPoint theme' },
    { value: 'apex', label: 'Apex', description: 'Modern, minimalist design' },
    { value: 'ion', label: 'Ion', description: 'Bold, technology-focused theme' },
    { value: 'custom', label: 'Custom', description: 'Customized theme based on mood' }
  ];

  const quickStartGuides = [
    {
      title: "Content Creation",
      description: "Start by entering your presentation content. Break sections with double newlines or [new slide] to create separate slides.",
      keywords: ["Content", "Slides", "Structure"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Style & Theme",
      description: "Choose your presentation mood and theme. Each combination creates a unique visual style for your slides.",
      keywords: ["Design", "Mood", "Theme"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      title: "Generate & Preview",
      description: "Click Generate to create your presentation. The AI will generate VBA code and show you a live preview of your slides.",
      keywords: ["Generate", "Preview", "AI"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    },
    {
      title: "Download & Customize",
      description: "1. Download the PPTX file\n2. Open in PowerPoint\n3. Press Alt + F11 for VBA editor\n4. Copy & paste the generated code\n5. Run the macro to apply changes",
      keywords: ["Download", "VBA", "Customize"],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    }
  ];

  const parseVBACodeToSlides = (vbaCode) => {
    // Ensure we have the complete VBA code
    if (!vbaCode.includes('End Sub')) {
      console.error('Incomplete VBA code received');
      return [];
    }

    // Extract slide content and formatting from VBA code
    const slideMatches = vbaCode.match(/With sld(\r?\n|\n|\r|.)*?End With/g) || [];
    
    return slideMatches.map((slideMatch, index) => {
      // Extract slide properties using non-greedy matches
      const titleMatch = slideMatch.match(/\.Shapes\.Title\.TextFrame\.TextRange\.Text = "(.*?)"/);
      const contentMatch = slideMatch.match(/\.Shapes\.TextFrame\.TextRange\.Text = "(.*?)"/);
      const layoutMatch = slideMatch.match(/\.Layout = ppLayout(\w+)/);
      const colorMatch = slideMatch.match(/\.ColorScheme\.Colors\(ppBackground\) = RGB\((.*?)\)/);
      
      // Parse background color if present
      let background = 'white';
      if (colorMatch && colorMatch[1]) {
        const [r, g, b] = colorMatch[1].split(',').map(n => parseInt(n.trim()));
        background = `rgb(${r}, ${g}, ${b})`;
      }

      // Determine layout and content
      const layout = layoutMatch ? layoutMatch[1].toLowerCase() : (index === 0 ? 'title' : 'content');
      const title = titleMatch ? titleMatch[1].replace(/\\n/g, '\n') : '';
      const content = contentMatch ? contentMatch[1].replace(/\\n/g, '\n') : '';

      // Extract any custom formatting using non-greedy matches
      const fontMatch = slideMatch.match(/\.Font\.Name = "(.*?)"/);
      const fontSizeMatch = slideMatch.match(/\.Font\.Size = (\d+)/);
      const colorTextMatch = slideMatch.match(/\.Font\.Color\.RGB = RGB\((.*?)\)/);
      
      return {
        id: index,
        layout,
        title,
        content: content || title, // Use title as content for title slides
        background,
        style: {
          fontFamily: fontMatch ? fontMatch[1] : undefined,
          fontSize: fontSizeMatch ? `${fontSizeMatch[1]}px` : undefined,
          color: colorTextMatch ? `rgb(${colorTextMatch[1]})` : undefined
        }
      };
    });
  };

  const generateSlides = async () => {
    if (!slideContent.trim()) {
      toast.error('Please enter content for your slides');
      return;
    }

    setIsGenerating(true);
    setGeneratedVBA('');
    setPreviewSlides([]);
    setDownloadUrl(null);

    try {
      // Step 1: Generate VBA Code with complete example
      const prompt = `Create a PowerPoint VBA macro named 'GeneratePresentation' that generates a presentation with the following content:

${slideContent}

Use these specifications:
- Mood: ${selectedMood}
- Theme: ${selectedTheme}

The VBA code must:
1. Create a new presentation
2. Set the theme and apply mood-appropriate styling
3. Create slides with proper content distribution
4. Include proper error handling
5. Add animations and transitions
6. Format text and layouts according to the mood

IMPORTANT: 
- Include all text content, colors (as RGB values), fonts, and formatting in the VBA code
- Use proper line breaks with "\\n" in strings for multi-line content
- Ensure each slide section is complete with proper With/End With blocks
- Include error handling and cleanup code
- The code must be complete and executable

Format the VBA code exactly like this example:
Sub GeneratePresentation()
    On Error GoTo ErrorHandler
    
    Dim ppt As Presentation
    Set ppt = Application.ActivePresentation
    
    'Create Title Slide
    Dim sld As Slide
    Set sld = ppt.Slides.Add(1, ppLayoutTitle)
    With sld
        .Shapes.Title.TextFrame.TextRange.Text = "Title Text"
        .Shapes.Title.TextFrame.TextRange.Font.Name = "Arial"
        .Shapes.Title.TextFrame.TextRange.Font.Size = 44
        .Shapes.Title.TextFrame.TextRange.Font.Color.RGB = RGB(0, 0, 0)
        .FollowMasterBackground = False
        .Background.Fill.ForeColor.RGB = RGB(255, 255, 255)
    End With
    
ExitSub:
    Exit Sub
    
ErrorHandler:
    MsgBox "Error " & Err.Number & ": " & Err.Description
    Resume ExitSub
End Sub`;

      const response = await geminiApi.generateText(prompt);
      
      if (response.error) {
        toast.error('Error generating VBA code');
        return;
      }

      const vbaCode = response.message || response;
      
      // Verify we have complete VBA code
      if (!vbaCode.includes('End Sub')) {
        toast.error('Generated VBA code was incomplete');
        return;
      }

      setGeneratedVBA(vbaCode);
      toast.success('VBA code generated successfully!');

      // Step 2: Generate Preview from VBA Code
      const parsedSlides = parseVBACodeToSlides(vbaCode);
      if (parsedSlides.length > 0) {
        setPreviewSlides(parsedSlides);
        setCurrentSlide(0);
        toast.success('Preview generated from VBA code');
      } else {
        toast.error('Could not generate preview from VBA code');
      }

      // Step 3: Prepare Download
      const formData = new FormData();
      formData.append('vbaCode', vbaCode);
      formData.append('fileName', 'presentation.pptx');

      const response2 = await fetch('/api/generate-powerpoint', {
        method: 'POST',
        body: formData
      });

      if (!response2.ok) {
        throw new Error('Failed to generate PowerPoint file');
      }

      const blob = await response2.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success('PowerPoint file ready for download!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to complete the generation process');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyVBACode = () => {
    if (!generatedVBA) {
      toast.error('No VBA code generated yet');
      return;
    }
    navigator.clipboard.writeText(generatedVBA);
    toast.success('VBA code copied to clipboard!');
  };

  const downloadPowerPoint = () => {
    if (!downloadUrl) {
      toast.error('PowerPoint file not ready yet');
      return;
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'presentation.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading PowerPoint file...');
  };

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, previewSlides.length - 1));
  };

  const previousSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

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
                <span className="text-sm text-primary-100">AI-Powered Presentations</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                PowerPoint Slide Generator
              </h1>
              <p className="text-lg text-primary-200 max-w-xl">
                Create professional presentations with AI-powered content and styling
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart Layouts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary-200">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>VBA Integration</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">4+</div>
                    <div className="text-xs text-primary-300">Themes</div>
                  </div>
                  <div className="w-px h-12 bg-primary-700/50"></div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary-400">AI</div>
                    <div className="text-xs text-primary-300">Powered</div>
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
            {/* Input Section */}
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Content
                </label>
                <textarea
                  value={slideContent}
                  onChange={(e) => setSlideContent(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your presentation content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentation Mood
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {moodOptions.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.label} - {mood.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentation Theme
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {themeOptions.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label} - {theme.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateSlides}
                  disabled={isGenerating}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
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
                    'Generate PowerPoint'
                  )}
                </button>

                {downloadUrl && (
                  <button
                    onClick={downloadPowerPoint}
                    className="px-6 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PPTX
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {/* Preview Section */}
              {previewSlides.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">VBA-Generated Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={previousSlide}
                        disabled={currentSlide === 0}
                        className={`p-2 rounded-lg ${currentSlide === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-600">
                        Slide {currentSlide + 1} of {previewSlides.length}
                      </span>
                      <button
                        onClick={nextSlide}
                        disabled={currentSlide === previewSlides.length - 1}
                        className={`p-2 rounded-lg ${currentSlide === previewSlides.length - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="aspect-[16/9] rounded-lg overflow-hidden shadow-lg"
                    style={{ 
                      background: previewSlides[currentSlide].background,
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    <div className="h-full p-8 flex flex-col">
                      {previewSlides[currentSlide].layout === 'title' ? (
                        <div className="flex-1 flex items-center justify-center">
                          <h2 
                            className="text-3xl font-bold text-center"
                            style={previewSlides[currentSlide].style}
                          >
                            {previewSlides[currentSlide].content}
                          </h2>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center">
                          <div 
                            className="prose max-w-none"
                            style={previewSlides[currentSlide].style}
                          >
                            {previewSlides[currentSlide].content.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* VBA Code Section */}
              {generatedVBA && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Generated VBA Code</h3>
                    <button
                      onClick={copyVBACode}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-800 text-gray-100 rounded-lg overflow-x-auto">
                    <code>{generatedVBA}</code>
                  </pre>
                </div>
              )}

              {/* Instructions */}
              {generatedVBA && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    <li>Click the "Download PPTX" button to get your presentation</li>
                    <li>Open the PowerPoint file in Microsoft PowerPoint</li>
                    <li>If you want to modify the VBA code:</li>
                    <ol className="list-decimal list-inside ml-4 mt-2 space-y-1 text-blue-700">
                      <li>Press Alt + F11 to open the VBA editor</li>
                      <li>Copy the generated VBA code</li>
                      <li>Paste it into a new module in the VBA editor</li>
                      <li>Run the macro to apply any modifications</li>
                    </ol>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickStart guides={quickStartGuides} />
    </div>
  );
}

export default PowerPointGenerator; 