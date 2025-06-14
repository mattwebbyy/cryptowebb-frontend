// src/pages/analytics/ApiDocumentation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { GlitchButton } from '@/components/ui/GlitchEffects';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Code,
  Play,
  Copy,
  CheckCircle,
  AlertTriangle,
  Book,
  Database,
  TrendingUp,
  Bell,
  Wifi,
  User,
  Key,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Types for API Documentation
interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
  auth: 'none' | 'jwt' | 'apikey' | 'admin';
  parameters?: ApiParameter[];
  queryParams?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
  examples: ApiExample[];
}

interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface ApiRequestBody {
  contentType: string;
  schema: any;
  example: any;
}

interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
  example?: any;
}

interface ApiExample {
  title: string;
  request: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    body: any;
  };
}

// API Documentation Data
const API_ENDPOINTS: ApiEndpoint[] = [
  // Data & Charts
  {
    id: 'list-metrics',
    method: 'GET',
    path: '/api/v1/data/metrics',
    description: 'List all available cryptocurrency metrics',
    category: 'Data & Charts',
    auth: 'none',
    queryParams: [
      { name: 'limit', type: 'integer', required: false, description: 'Maximum number of metrics to return', example: '50' },
      { name: 'offset', type: 'integer', required: false, description: 'Number of metrics to skip', example: '0' }
    ],
    responses: [
      {
        status: 200,
        description: 'List of available metrics',
        example: {
          metrics: [
            { id: 1, name: 'bitcoin-price', symbol: 'BTC', description: 'Bitcoin USD Price' },
            { id: 2, name: 'ethereum-price', symbol: 'ETH', description: 'Ethereum USD Price' }
          ]
        }
      }
    ],
    examples: [
      {
        title: 'Get all metrics',
        request: { url: '/api/v1/data/metrics', method: 'GET' },
        response: { status: 200, body: { metrics: [{ id: 1, name: 'bitcoin-price', symbol: 'BTC' }] } }
      }
    ]
  },
  {
    id: 'get-metric-info',
    method: 'GET',
    path: '/api/v1/data/metrics/:metric_id/info',
    description: 'Get detailed information about a specific metric',
    category: 'Data & Charts',
    auth: 'none',
    parameters: [
      { name: 'metric_id', type: 'integer', required: true, description: 'Unique identifier for the metric', example: '1' }
    ],
    responses: [
      {
        status: 200,
        description: 'Metric information',
        example: {
          id: 1,
          name: 'bitcoin-price',
          symbol: 'BTC',
          description: 'Bitcoin USD Price',
          unit: 'USD',
          category: 'Price',
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      }
    ],
    examples: [
      {
        title: 'Get Bitcoin price metric info',
        request: { url: '/api/v1/data/metrics/1/info', method: 'GET' },
        response: { status: 200, body: { id: 1, name: 'bitcoin-price', symbol: 'BTC' } }
      }
    ]
  },
  {
    id: 'get-timeseries-data',
    method: 'GET',
    path: '/api/v1/data/metrics/:metric_id/timeseries',
    description: 'Get time-series data for chart visualization',
    category: 'Data & Charts',
    auth: 'none',
    parameters: [
      { name: 'metric_id', type: 'integer', required: true, description: 'Unique identifier for the metric', example: '1' }
    ],
    queryParams: [
      { name: 'granularity', type: 'string', required: true, description: 'Time granularity (1m, 5m, 1h, 1d)', example: '1d' },
      { name: 'start_time', type: 'string', required: false, description: 'Start time (Unix timestamp or RFC3339)', example: '1704067200' },
      { name: 'end_time', type: 'string', required: false, description: 'End time (Unix timestamp or RFC3339)', example: '1704153600' },
      { name: 'limit', type: 'integer', required: false, description: 'Maximum number of data points', example: '1000' },
      { name: 'offset', type: 'integer', required: false, description: 'Number of data points to skip', example: '0' }
    ],
    responses: [
      {
        status: 200,
        description: 'Time-series data points',
        example: {
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 42000.50 },
            { timestamp: '2024-01-16T00:00:00Z', value: 43250.75 }
          ]
        }
      }
    ],
    examples: [
      {
        title: 'Get Bitcoin daily prices',
        request: { url: '/api/v1/data/metrics/1/timeseries?granularity=1d&limit=30', method: 'GET' },
        response: { status: 200, body: { data: [{ timestamp: '2024-01-15T00:00:00Z', value: 42000.50 }] } }
      }
    ]
  },

  // Technical Indicators
  {
    id: 'get-sma',
    method: 'GET',
    path: '/api/v1/indicators/sma/:metricID',
    description: 'Calculate Simple Moving Average for a metric',
    category: 'Technical Indicators',
    auth: 'none',
    parameters: [
      { name: 'metricID', type: 'integer', required: true, description: 'Metric ID to calculate SMA for', example: '1' }
    ],
    queryParams: [
      { name: 'period', type: 'integer', required: false, description: 'Moving average period', example: '20' },
      { name: 'granularity', type: 'string', required: false, description: 'Time granularity', example: '1d' },
      { name: 'start_time', type: 'string', required: false, description: 'Start time', example: '2024-01-01T00:00:00Z' },
      { name: 'end_time', type: 'string', required: false, description: 'End time', example: '2024-01-31T00:00:00Z' }
    ],
    responses: [
      {
        status: 200,
        description: 'SMA calculation results',
        example: {
          indicator: 'SMA',
          metricID: 1,
          period: 20,
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 41500.25 },
            { timestamp: '2024-01-16T00:00:00Z', value: 41750.50 }
          ]
        }
      }
    ],
    examples: [
      {
        title: 'Get 20-day SMA for Bitcoin',
        request: { url: '/api/v1/indicators/sma/1?period=20&granularity=1d', method: 'GET' },
        response: { status: 200, body: { indicator: 'SMA', period: 20, data: [] } }
      }
    ]
  },
  {
    id: 'get-rsi',
    method: 'GET',
    path: '/api/v1/indicators/rsi/:metricID',
    description: 'Calculate Relative Strength Index (RSI)',
    category: 'Technical Indicators',
    auth: 'none',
    parameters: [
      { name: 'metricID', type: 'integer', required: true, description: 'Metric ID to calculate RSI for', example: '1' }
    ],
    queryParams: [
      { name: 'period', type: 'integer', required: false, description: 'RSI period (default: 14)', example: '14' },
      { name: 'granularity', type: 'string', required: false, description: 'Time granularity', example: '1d' }
    ],
    responses: [
      {
        status: 200,
        description: 'RSI calculation results',
        example: {
          indicator: 'RSI',
          metricID: 1,
          period: 14,
          data: [
            { timestamp: '2024-01-15T00:00:00Z', value: 65.4 },
            { timestamp: '2024-01-16T00:00:00Z', value: 67.2 }
          ]
        }
      }
    ],
    examples: [
      {
        title: 'Get 14-day RSI for Bitcoin',
        request: { url: '/api/v1/indicators/rsi/1?period=14', method: 'GET' },
        response: { status: 200, body: { indicator: 'RSI', period: 14, data: [] } }
      }
    ]
  },

  // Authentication
  {
    id: 'user-login',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Authenticate user and receive JWT token',
    category: 'Authentication',
    auth: 'none',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        },
        required: ['email', 'password']
      },
      example: {
        email: 'user@example.com',
        password: 'securepassword123'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Login successful',
        example: {
          message: 'Login successful',
          user: { id: 1, email: 'user@example.com', role: 'user' },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'refresh_token_here'
        }
      },
      {
        status: 401,
        description: 'Invalid credentials',
        example: { error: 'Invalid email or password' }
      }
    ],
    examples: [
      {
        title: 'User login',
        request: {
          url: '/api/v1/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { email: 'user@example.com', password: 'password123' }
        },
        response: { status: 200, body: { message: 'Login successful', token: 'jwt_token_here' } }
      }
    ]
  },

  // User Profile
  {
    id: 'get-profile',
    method: 'GET',
    path: '/api/v1/users/me',
    description: 'Get current user profile information',
    category: 'User Management',
    auth: 'jwt',
    responses: [
      {
        status: 200,
        description: 'User profile data',
        example: {
          id: 1,
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z',
          subscription: {
            plan: 'pro',
            status: 'active',
            expiresAt: '2024-12-31T23:59:59Z'
          }
        }
      }
    ],
    examples: [
      {
        title: 'Get user profile',
        request: {
          url: '/api/v1/users/me',
          method: 'GET',
          headers: { 'Authorization': 'Bearer jwt_token_here' }
        },
        response: { status: 200, body: { id: 1, email: 'user@example.com', role: 'user' } }
      }
    ]
  }
];

// API Documentation Component
export const ApiDocumentation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Data & Charts']));
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get unique categories
  const categories = ['All', ...new Set(API_ENDPOINTS.map(endpoint => endpoint.category))];

  // Filter endpoints by category
  const filteredEndpoints = selectedCategory === 'All' 
    ? API_ENDPOINTS 
    : API_ENDPOINTS.filter(endpoint => endpoint.category === selectedCategory);

  // Group endpoints by category
  const endpointsByCategory = filteredEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'POST': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'PUT': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'DELETE': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'PATCH': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getAuthIcon = (auth: string) => {
    switch (auth) {
      case 'jwt': return <User className="w-4 h-4" />;
      case 'apikey': return <Key className="w-4 h-4" />;
      case 'admin': return <Settings className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Data & Charts': return <Database className="w-5 h-5" />;
      case 'Technical Indicators': return <TrendingUp className="w-5 h-5" />;
      case 'Authentication': return <User className="w-5 h-5" />;
      case 'User Management': return <User className="w-5 h-5" />;
      case 'Alerts': return <Bell className="w-5 h-5" />;
      case 'WebSocket': return <Wifi className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const tryEndpoint = async (endpoint: ApiEndpoint, exampleIndex: number = 0) => {
    const example = endpoint.examples[exampleIndex];
    if (!example) return;

    setIsLoading(true);
    setApiError(null);
    setApiResponse(null);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      const fullUrl = `${baseUrl}${example.request.url}`;

      const response = await fetch(fullUrl, {
        method: example.request.method,
        headers: {
          'Content-Type': 'application/json',
          ...example.request.headers
        },
        ...(example.request.body && { body: JSON.stringify(example.request.body) })
      });

      const data = await response.json();
      
      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold font-mono text-teal-600 dark:text-matrix-green mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            API Documentation
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Interactive documentation for the CryptoWebb API. Test endpoints directly from this interface.
          </motion.p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>REST API</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>JSON</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Real-time Data</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Endpoint List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-3 flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Endpoints
                </h3>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Endpoint List by Category */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {Object.entries(endpointsByCategory).map(([category, endpoints]) => (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {getCategoryIcon(category)}
                        {category}
                      </div>
                      {expandedCategories.has(category) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedCategories.has(category) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 space-y-1"
                        >
                          {endpoints.map((endpoint) => (
                            <button
                              key={endpoint.id}
                              onClick={() => setSelectedEndpoint(endpoint)}
                              className={`w-full text-left p-2 rounded-md transition-colors ${
                                selectedEndpoint?.id === endpoint.id
                                  ? 'bg-teal-100 dark:bg-teal-900/30 border-l-2 border-teal-600 dark:border-matrix-green'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs px-2 py-1 rounded font-mono ${getMethodColor(endpoint.method)}`}>
                                  {endpoint.method}
                                </span>
                                {getAuthIcon(endpoint.auth)}
                              </div>
                              <div className="text-sm text-gray-800 dark:text-gray-200 font-mono truncate">
                                {endpoint.path}
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content - Endpoint Details */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <EndpointDetails
                endpoint={selectedEndpoint}
                onTryEndpoint={tryEndpoint}
                apiResponse={apiResponse}
                isLoading={isLoading}
                apiError={apiError}
                onCopyToClipboard={copyToClipboard}
              />
            ) : (
              <Card className="p-12 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green text-center">
                <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Select an Endpoint
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose an endpoint from the sidebar to view its documentation and try it out.
                </p>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Endpoint Details Component
const EndpointDetails: React.FC<{
  endpoint: ApiEndpoint;
  onTryEndpoint: (endpoint: ApiEndpoint, exampleIndex?: number) => void;
  apiResponse: any;
  isLoading: boolean;
  apiError: string | null;
  onCopyToClipboard: (text: string) => void;
}> = ({ endpoint, onTryEndpoint, apiResponse, isLoading, apiError, onCopyToClipboard }) => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string, type: string) => {
    await onCopyToClipboard(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateCurlCommand = (example: ApiExample) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    let curl = `curl -X ${example.request.method} "${baseUrl}${example.request.url}"`;
    
    if (example.request.headers) {
      Object.entries(example.request.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }
    
    if (example.request.body) {
      curl += ` \\\n  -d '${JSON.stringify(example.request.body, null, 2)}'`;
    }
    
    return curl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Endpoint Header */}
      <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1 rounded font-mono font-semibold ${
              endpoint.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
              endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
            }`}>
              {endpoint.method}
            </span>
            <code className="text-lg font-mono text-gray-800 dark:text-gray-200">
              {endpoint.path}
            </code>
          </div>
          
          <div className="flex items-center gap-2">
            {endpoint.auth !== 'none' && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                Auth Required
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {endpoint.description}
        </p>
        
        <div className="flex gap-2">
          {endpoint.examples.length > 0 && (
            <GlitchButton
              onClick={() => onTryEndpoint(endpoint, selectedExample)}
              disabled={isLoading}
              className="gap-2"
              size="sm"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Try It Out
                </>
              )}
            </GlitchButton>
          )}
        </div>
      </Card>

      {/* Parameters */}
      {(endpoint.parameters || endpoint.queryParams) && (
        <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
          <h4 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
            Parameters
          </h4>
          
          {endpoint.parameters && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Path Parameters</h5>
              <div className="space-y-2">
                {endpoint.parameters.map((param) => (
                  <div key={param.name} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-teal-600 dark:text-matrix-green">
                          {param.name}
                        </code>
                        <span className="text-xs text-gray-500">{param.type}</span>
                        {param.required && (
                          <span className="text-xs text-red-500">required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {param.description}
                      </p>
                    </div>
                    {param.example && (
                      <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {param.example}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {endpoint.queryParams && (
            <div>
              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Query Parameters</h5>
              <div className="space-y-2">
                {endpoint.queryParams.map((param) => (
                  <div key={param.name} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-teal-600 dark:text-matrix-green">
                          {param.name}
                        </code>
                        <span className="text-xs text-gray-500">{param.type}</span>
                        {param.required && (
                          <span className="text-xs text-red-500">required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {param.description}
                      </p>
                    </div>
                    {param.example && (
                      <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {param.example}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Examples */}
      {endpoint.examples.length > 0 && (
        <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
          <h4 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
            Examples
          </h4>
          
          {endpoint.examples.length > 1 && (
            <div className="flex gap-2 mb-4">
              {endpoint.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExample(index)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedExample === index
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>
          )}
          
          <div className="space-y-4">
            {/* cURL Command */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">cURL</h5>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(generateCurlCommand(endpoint.examples[selectedExample]), 'curl')}
                  className="gap-1"
                >
                  {copiedCode === 'curl' ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {generateCurlCommand(endpoint.examples[selectedExample])}
              </pre>
            </div>
            
            {/* Response Example */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">Response</h5>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(JSON.stringify(endpoint.examples[selectedExample].response.body, null, 2), 'response')}
                  className="gap-1"
                >
                  {copiedCode === 'response' ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(endpoint.examples[selectedExample].response.body, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}

      {/* API Response */}
      {(apiResponse || apiError) && (
        <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
          <h4 className="text-lg font-semibold text-teal-600 dark:text-matrix-green mb-4">
            Live Response
          </h4>
          
          {apiError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Request Failed</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : apiResponse ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded font-mono ${
                  apiResponse.status >= 200 && apiResponse.status < 300
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {apiResponse.status} {apiResponse.statusText}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Content-Type: {apiResponse.headers['content-type'] || 'application/json'}
                </span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">Response Body</h5>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCode(JSON.stringify(apiResponse.data, null, 2), 'live-response')}
                    className="gap-1"
                  >
                    {copiedCode === 'live-response' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-96">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </motion.div>
  );
};

export default ApiDocumentation;