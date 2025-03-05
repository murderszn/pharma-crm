export const nodeConfigs = {
  input: {
    title: 'Input Configuration',
    fields: [
      {
        id: 'source',
        label: 'Data Source',
        type: 'select',
        options: ['API', 'Database', 'File Upload', 'Stream', 'AI Generation'],
        required: true
      },
      {
        id: 'format',
        label: 'Data Format',
        type: 'select',
        options: ['JSON', 'CSV', 'XML', 'Plain Text'],
        required: true
      },
      {
        id: 'interval',
        label: 'Update Interval',
        type: 'select',
        options: ['Real-time', '1 minute', '5 minutes', '15 minutes', '1 hour', '1 day'],
        required: false
      },
      {
        id: 'aiModel',
        label: 'AI Model',
        type: 'select',
        options: ['GPT-4', 'GPT-3.5', 'Claude', 'Custom'],
        required: (config) => config.source === 'AI Generation',
        showWhen: (config) => config.source === 'AI Generation'
      },
      {
        id: 'prompt',
        label: 'Generation Prompt',
        type: 'textarea',
        placeholder: 'Enter your prompt for AI generation...',
        required: (config) => config.source === 'AI Generation',
        showWhen: (config) => config.source === 'AI Generation'
      },
      {
        id: 'temperature',
        label: 'Temperature',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
        required: false,
        showWhen: (config) => config.source === 'AI Generation'
      },
      {
        id: 'maxTokens',
        label: 'Max Tokens',
        type: 'number',
        min: 1,
        max: 4000,
        placeholder: '1000',
        required: false,
        showWhen: (config) => config.source === 'AI Generation'
      }
    ]
  },
  filter: {
    title: 'Filter Configuration',
    fields: [
      {
        id: 'condition',
        label: 'Filter Condition',
        type: 'text',
        placeholder: 'e.g. value > 100',
        required: true
      },
      {
        id: 'field',
        label: 'Target Field',
        type: 'text',
        required: true
      },
      {
        id: 'caseSensitive',
        label: 'Case Sensitive',
        type: 'checkbox',
        required: false
      }
    ]
  },
  transform: {
    title: 'Transform Configuration',
    fields: [
      {
        id: 'operation',
        label: 'Operation Type',
        type: 'select',
        options: ['Map', 'Reduce', 'Filter', 'Sort', 'Group'],
        required: true
      },
      {
        id: 'expression',
        label: 'Transform Expression',
        type: 'textarea',
        placeholder: 'Enter transformation logic',
        required: true
      }
    ]
  },
  agent: {
    title: 'AI Agent Configuration',
    fields: [
      {
        id: 'model',
        label: 'AI Model',
        type: 'select',
        options: ['GPT-4', 'GPT-3.5', 'Claude', 'Custom'],
        required: true
      },
      {
        id: 'prompt',
        label: 'System Prompt',
        type: 'textarea',
        placeholder: 'Enter system prompt',
        required: true
      },
      {
        id: 'temperature',
        label: 'Temperature',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
        required: false
      }
    ]
  },
  output: {
    title: 'Output Configuration',
    fields: [
      {
        id: 'destination',
        label: 'Data Destination',
        type: 'select',
        options: ['API', 'Database', 'File', 'Stream'],
        required: true
      },
      {
        id: 'format',
        label: 'Output Format',
        type: 'select',
        options: ['JSON', 'CSV', 'XML', 'Plain Text'],
        required: true
      }
    ]
  },
  api: {
    title: 'API Configuration',
    fields: [
      {
        id: 'endpoint',
        label: 'API Endpoint',
        type: 'text',
        required: true
      },
      {
        id: 'method',
        label: 'HTTP Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        required: true
      },
      {
        id: 'headers',
        label: 'Headers',
        type: 'textarea',
        placeholder: '{"Content-Type": "application/json"}',
        required: false
      }
    ]
  },
  database: {
    title: 'Database Configuration',
    fields: [
      {
        id: 'type',
        label: 'Database Type',
        type: 'select',
        options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
        required: true
      },
      {
        id: 'query',
        label: 'Query',
        type: 'textarea',
        placeholder: 'Enter your query',
        required: true
      }
    ]
  },
  webhook: {
    title: 'Webhook Configuration',
    fields: [
      {
        id: 'url',
        label: 'Webhook URL',
        type: 'text',
        required: true
      },
      {
        id: 'secret',
        label: 'Webhook Secret',
        type: 'password',
        required: false
      }
    ]
  },
  custom: {
    title: 'Custom Node Configuration',
    fields: [
      {
        id: 'code',
        label: 'Custom Code',
        type: 'textarea',
        placeholder: 'Enter your custom code',
        required: true
      },
      {
        id: 'language',
        label: 'Language',
        type: 'select',
        options: ['JavaScript', 'Python', 'Ruby', 'Shell'],
        required: true
      }
    ]
  }
}; 