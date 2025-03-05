import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { nodeTypes as customNodeTypes } from '../components/nodes/CustomNodes';
import { BetaBadge, BetaMessage } from '../components/BetaDisclaimer';
import { NodeConfigModal } from '../components/nodes/NodeConfigModal';

// Node Types Definition with descriptions
const nodeTypeDefinitions = {
  input: {
    label: 'Input Source',
    description: 'Import data from external sources',
    category: 'Data Sources'
  },
  filter: {
    label: 'Filter',
    description: 'Filter and validate data',
    category: 'Processing'
  },
  transform: {
    label: 'Transform',
    description: 'Transform and manipulate data',
    category: 'Processing'
  },
  agent: {
    label: 'AI Agent',
    description: 'Intelligent AI processing',
    category: 'AI'
  },
  output: {
    label: 'Output',
    description: 'Export or save results',
    category: 'Data Destinations'
  },
  api: {
    label: 'API Connection',
    description: 'Connect to external APIs',
    category: 'Integrations'
  },
  database: {
    label: 'Database',
    description: 'Database operations',
    category: 'Data Sources'
  },
  webhook: {
    label: 'Webhook',
    description: 'Handle webhook events',
    category: 'Integrations'
  },
  custom: {
    label: 'Custom Logic',
    description: 'Custom processing logic',
    category: 'Processing'
  }
};

// Initial nodes for demonstration
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Input Source',
      description: 'Start your workflow here'
    },
    position: { x: 250, y: 5 }
  },
];

const VisualPlayground = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [lastAddedNode, setLastAddedNode] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const categories = ['All', 'Data Sources', 'Processing', 'AI', 'Data Destinations', 'Integrations'];

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible(prev => !prev);
  }, []);

  // Update fullscreen handler
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowWrapper.current.getBoundingClientRect();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const coordinates = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: String(Date.now()),
        type,
        position: coordinates,
        data: { 
          label: nodeTypeDefinitions[type].label,
          description: nodeTypeDefinitions[type].description,
          config: {}
        }
      };

      // Add the new node
      setNodes((nds) => {
        // If this is the first dropped node (only initial input node exists)
        if (nds.length === 1 && nds[0].type === 'input') {
          // Create connection from input node to the new node
          setEdges((eds) => eds.concat({
            id: `e${nds[0].id}-${newNode.id}`,
            source: nds[0].id,
            target: newNode.id,
            animated: true
          }));
          setLastAddedNode(newNode);
          return nds.concat(newNode);
        }
        
        // For subsequent nodes, connect to the last added node if it exists
        if (lastAddedNode) {
          setEdges((eds) => eds.concat({
            id: `e${lastAddedNode.id}-${newNode.id}`,
            source: lastAddedNode.id,
            target: newNode.id,
            animated: true
          }));
        }
        
        return nds.concat(newNode);
      });

      // Store this as the last added node
      setLastAddedNode(newNode);
      
      // Open configuration modal for the new node
      setSelectedNode(newNode);
      setIsConfigModalOpen(true);
    },
    [reactFlowInstance, lastAddedNode, setNodes, setEdges]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('visual-playground-flow', JSON.stringify(flow));
      // Show success message
      alert('Workflow saved successfully!');
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem('visual-playground-flow'));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        reactFlowInstance.setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [reactFlowInstance, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setIsConfigModalOpen(true);
  }, []);

  const handleConfigUpdate = useCallback((nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                config
              }
            }
          : node
      )
    );
  }, [setNodes]);

  const getAISuggestion = (node) => {
    if (!node || !node.type) return "Select a node to get AI suggestions";
    
    const suggestions = {
      input: "Connect this to a Filter node to clean your data before processing",
      filter: "Add transformation logic after filtering to prepare data for AI processing",
      transform: "Consider connecting this to an AI Agent for intelligent processing",
      agent: "Add error handling and output formatting after AI processing",
      output: "Make sure to validate data before final output",
      api: "Add rate limiting and error handling for API calls",
      database: "Consider caching frequently accessed data",
      webhook: "Add request validation and error handling",
      custom: "Document your custom logic for team collaboration"
    };
    return suggestions[node.type] || "Consider the flow of data through your workflow";
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredNodeTypes = Object.entries(nodeTypeDefinitions)
    .filter(([_, def]) => 
      (selectedCategory === 'All' || def.category === selectedCategory) &&
      (def.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
       def.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Beta Header - only show when not in fullscreen */}
      {!isFullScreen && (
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
                  <span className="text-sm text-primary-100">Visual Workflow Builder</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center">
                  AURABLOX Visual Playground
                  <BetaBadge className="ml-3" />
                </h1>
                <p className="text-lg text-primary-200 max-w-xl">
                  Build and manage integrations using an intuitive drag-and-drop interface with AI assistance
                </p>
                <BetaMessage />
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-primary-200">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-Assisted Building</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-primary-200">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time Preview</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center space-x-4 bg-primary-800/50 backdrop-blur-xl px-6 py-4 rounded-xl border border-primary-700/50">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">9+</div>
                      <div className="text-xs text-primary-300">Node Types</div>
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
      )}

      <style jsx>{`
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>

      {/* Main content */}
      <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'relative h-[calc(100vh-16rem)]'} flex`}>
        {/* Sidebar with toggle button */}
        <div className={`
          ${isFullScreen ? 'h-full' : 'h-full'} 
          ${isSidebarVisible ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200 flex flex-col z-20 overflow-hidden
        `}>
          {/* Sidebar header with branding */}
          <div className="p-3 border-b border-gray-200 flex flex-col">
            {isFullScreen && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-900">AURABLOX</span>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <h2 className="text-sm font-semibold text-gray-900">Node Library</h2>
          </div>

          {/* Search and filters */}
          <div className="p-3 space-y-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search nodes..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Node list */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredNodeTypes.map(([type, def]) => (
                <div
                  key={type}
                  className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm cursor-move hover:shadow-md transition-all duration-200 hover:border-primary-500"
                  onDragStart={(event) => onDragStart(event, type)}
                  draggable
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg ${customNodeTypes[type] ? 'bg-gray-50' : 'bg-primary-50'} flex items-center justify-center`}>
                      {customNodeTypes[type]?.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{def.label}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{def.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle sidebar button - only show when sidebar is hidden */}
        {!isSidebarVisible && (
          <button
            onClick={toggleSidebar}
            className="absolute left-4 top-4 z-30 p-2 rounded-md bg-white shadow-lg hover:bg-gray-50 group"
          >
            <div className="absolute left-full ml-2 px-2 py-1 bg-white rounded shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <span className="text-sm text-gray-600">Open Node Library</span>
            </div>
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Main flow area */}
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={customNodeTypes}
              onInit={setReactFlowInstance}
              fitView
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position="top-right" className={`bg-white p-4 rounded-lg shadow-lg space-y-2 ${isFullScreen ? 'z-[90]' : 'z-20'}`}>
                <button
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={onSave}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Save Workflow</span>
                </button>
                <button
                  className="w-full border border-primary-600 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={onRestore}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Restore</span>
                </button>
                <button
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6m-6 0v6m0-6L4 4m11 5h6m-6 0v6m0-6l5-5m0 11v5h-5m0 0l5-5m-11 0H4m0 0v5m0-5l5 5" />
                      </svg>
                      <span>Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>Fullscreen</span>
                    </>
                  )}
                </button>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Configuration Modal - update z-index and styling for fullscreen */}
        <NodeConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          node={selectedNode}
          onUpdate={handleConfigUpdate}
          className="z-[150]"
        />

        {/* AI Assistant Modal - update z-index and styling for fullscreen */}
        <Transition appear show={isAIModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-[150]"
            onClose={() => setIsAIModalOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[151]">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      AI Assistant Suggestions
                    </Dialog.Title>
                    <button
                      onClick={() => setIsAIModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedNode ? getAISuggestion(selectedNode) : "Select a node to get AI suggestions"}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors duration-200"
                      onClick={() => setIsAIModalOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default VisualPlayground; 