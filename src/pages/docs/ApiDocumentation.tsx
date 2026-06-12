// src/pages/docs/ApiDocumentation.tsx — interactive API reference.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Book,
  Database,
  TrendingUp,
  Bell,
  Wifi,
  User,
  Key,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Select } from '@/components/ui/Input';
import { API_ENDPOINTS, type ApiEndpoint } from './endpoints';
import { EndpointDetails, methodBadgeClasses } from './EndpointDetails';

const getAuthIcon = (auth: string) => {
  switch (auth) {
    case 'jwt':
      return <User className="w-4 h-4 text-text-secondary" aria-label="JWT auth" />;
    case 'apikey':
      return <Key className="w-4 h-4 text-text-secondary" aria-label="API key auth" />;
    case 'admin':
      return <Settings className="w-4 h-4 text-text-secondary" aria-label="Admin only" />;
    default:
      return null;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Data & Charts':
      return <Database className="w-4 h-4" aria-hidden="true" />;
    case 'Technical Indicators':
      return <TrendingUp className="w-4 h-4" aria-hidden="true" />;
    case 'Authentication':
    case 'User Management':
      return <User className="w-4 h-4" aria-hidden="true" />;
    case 'Alerts':
      return <Bell className="w-4 h-4" aria-hidden="true" />;
    case 'WebSocket':
      return <Wifi className="w-4 h-4" aria-hidden="true" />;
    default:
      return <Code className="w-4 h-4" aria-hidden="true" />;
  }
};

interface LiveResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
}

export const ApiDocumentation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Data & Charts'])
  );
  const [apiResponse, setApiResponse] = useState<LiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const categories = ['All', ...new Set(API_ENDPOINTS.map((endpoint) => endpoint.category))];

  const filteredEndpoints =
    selectedCategory === 'All'
      ? API_ENDPOINTS
      : API_ENDPOINTS.filter((endpoint) => endpoint.category === selectedCategory);

  const endpointsByCategory = filteredEndpoints.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) {
        acc[endpoint.category] = [];
      }
      acc[endpoint.category].push(endpoint);
      return acc;
    },
    {} as Record<string, ApiEndpoint[]>
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const tryEndpoint = async (endpoint: ApiEndpoint, exampleIndex: number = 0) => {
    const example = endpoint.examples[exampleIndex];
    if (!example) return;

    setIsLoading(true);
    setApiError(null);
    setApiResponse(null);

    try {
      const response = await fetch(`${API_BASE_URL}${example.request.url}`, {
        method: example.request.method,
        headers: {
          'Content-Type': 'application/json',
          ...example.request.headers,
        },
        ...(example.request.body && { body: JSON.stringify(example.request.body) }),
      });

      const data = await response.json();

      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">API documentation</h1>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-6">
            Interactive documentation for the CryptoWebb API. Test endpoints directly from this
            page.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" aria-hidden="true" />
              <span>REST API</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" aria-hidden="true" />
              <span>JSON</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              <span>Real-time data</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Endpoint List */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-surface p-4 lg:sticky lg:top-24">
              <div className="mb-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary" aria-hidden="true" />
                  Endpoints
                </h2>

                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Endpoint List by Category */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {Object.entries(endpointsByCategory).map(([category, endpoints]) => (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      aria-expanded={expandedCategories.has(category)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {getCategoryIcon(category)}
                        {category}
                      </div>
                      {expandedCategories.has(category) ? (
                        <ChevronDown className="w-4 h-4 text-text-secondary" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-text-secondary" aria-hidden="true" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedCategories.has(category) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-3 space-y-1 overflow-hidden"
                        >
                          {endpoints.map((endpoint) => (
                            <button
                              key={endpoint.id}
                              onClick={() => setSelectedEndpoint(endpoint)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                selectedEndpoint?.id === endpoint.id
                                  ? 'bg-primary/10 border-l-2 border-primary'
                                  : 'hover:bg-surface-2'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${methodBadgeClasses(endpoint.method)}`}
                                >
                                  {endpoint.method}
                                </span>
                                {getAuthIcon(endpoint.auth)}
                              </div>
                              <div className="text-xs font-mono text-text-secondary truncate">
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
            </div>
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
              />
            ) : (
              <div className="rounded-xl border border-border bg-surface p-12 text-center">
                <Code
                  className="w-12 h-12 mx-auto mb-4 text-text-secondary/50"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-semibold mb-2">Select an endpoint</h3>
                <p className="text-text-secondary">
                  Choose an endpoint from the sidebar to view its documentation and try it out.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiDocumentation;
