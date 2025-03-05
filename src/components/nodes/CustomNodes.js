import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const nodeStyles = {
  input: {
    background: 'bg-blue-50',
    border: 'border-blue-500',
    icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  filter: {
    background: 'bg-purple-50',
    border: 'border-purple-500',
    icon: (
      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    )
  },
  transform: {
    background: 'bg-green-50',
    border: 'border-green-500',
    icon: (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  agent: {
    background: 'bg-yellow-50',
    border: 'border-yellow-500',
    icon: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  output: {
    background: 'bg-red-50',
    border: 'border-red-500',
    icon: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    )
  },
  api: {
    background: 'bg-indigo-50',
    border: 'border-indigo-500',
    icon: (
      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  database: {
    background: 'bg-pink-50',
    border: 'border-pink-500',
    icon: (
      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    )
  },
  webhook: {
    background: 'bg-cyan-50',
    border: 'border-cyan-500',
    icon: (
      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  custom: {
    background: 'bg-gray-50',
    border: 'border-gray-500',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
};

const CustomNode = ({ type, data }) => {
  const style = nodeStyles[type] || nodeStyles.custom;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border ${style.background} ${style.border}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-500"
      />
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center mr-2">
          {style.icon}
        </div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500">{data.description}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-500"
      />
    </div>
  );
};

export const nodeTypes = {
  input: memo((props) => <CustomNode {...props} type="input" />),
  filter: memo((props) => <CustomNode {...props} type="filter" />),
  transform: memo((props) => <CustomNode {...props} type="transform" />),
  agent: memo((props) => <CustomNode {...props} type="agent" />),
  output: memo((props) => <CustomNode {...props} type="output" />),
  api: memo((props) => <CustomNode {...props} type="api" />),
  database: memo((props) => <CustomNode {...props} type="database" />),
  webhook: memo((props) => <CustomNode {...props} type="webhook" />),
  custom: memo((props) => <CustomNode {...props} type="custom" />)
}; 