// src/pages/docs/EndpointDetails.tsx — documentation panel for a single API endpoint.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { API_BASE_URL } from '@/lib/config';
import { CodeBlock } from './CodeBlock';
import type { ApiEndpoint, ApiExample, ApiParameter } from './endpoints';

export const methodBadgeClasses = (method: string) => {
  switch (method) {
    case 'GET':
      return 'text-success bg-success/10';
    case 'POST':
      return 'text-primary bg-primary/10';
    case 'PUT':
      return 'text-warning bg-warning/10';
    case 'DELETE':
      return 'text-error bg-error/10';
    default:
      return 'text-text-secondary bg-surface-2';
  }
};

const ParameterList = ({ title, params }: { title: string; params: ApiParameter[] }) => (
  <div className="mb-4 last:mb-0">
    <h5 className="text-sm font-medium mb-2">{title}</h5>
    <div className="space-y-2">
      {params.map((param) => (
        <div
          key={param.name}
          className="flex items-start justify-between gap-3 p-3 bg-surface-2 border border-border rounded-lg"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-sm font-mono text-primary">{param.name}</code>
              <span className="text-xs text-text-secondary">{param.type}</span>
              {param.required && <span className="text-xs text-warning">required</span>}
            </div>
            <p className="text-sm text-text-secondary mt-1">{param.description}</p>
          </div>
          {param.example && (
            <code className="text-xs bg-surface border border-border px-2 py-1 rounded shrink-0">
              {param.example}
            </code>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface LiveResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
}

interface EndpointDetailsProps {
  endpoint: ApiEndpoint;
  onTryEndpoint: (endpoint: ApiEndpoint, exampleIndex?: number) => void;
  apiResponse: LiveResponse | null;
  isLoading: boolean;
  apiError: string | null;
}

export const EndpointDetails = ({
  endpoint,
  onTryEndpoint,
  apiResponse,
  isLoading,
  apiError,
}: EndpointDetailsProps) => {
  const [selectedExample, setSelectedExample] = useState(0);

  const generateCurlCommand = (example: ApiExample) => {
    let curl = `curl -X ${example.request.method} "${API_BASE_URL}${example.request.url}"`;

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
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Endpoint Header */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-sm px-3 py-1 rounded-full font-mono font-semibold ${methodBadgeClasses(endpoint.method)}`}
            >
              {endpoint.method}
            </span>
            <code className="text-base font-mono break-all">{endpoint.path}</code>
          </div>

          {endpoint.auth !== 'none' && (
            <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full shrink-0">
              Auth required
            </span>
          )}
        </div>

        <p className="text-text-secondary mb-4">{endpoint.description}</p>

        {endpoint.examples.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTryEndpoint(endpoint, selectedExample)}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Testing…
              </>
            ) : (
              <>
                <Play className="w-4 h-4" aria-hidden="true" />
                Try it out
              </>
            )}
          </Button>
        )}
      </div>

      {/* Parameters */}
      {(endpoint.parameters || endpoint.queryParams) && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h4 className="text-base font-semibold mb-4">Parameters</h4>
          {endpoint.parameters && (
            <ParameterList title="Path parameters" params={endpoint.parameters} />
          )}
          {endpoint.queryParams && (
            <ParameterList title="Query parameters" params={endpoint.queryParams} />
          )}
        </div>
      )}

      {/* Examples */}
      {endpoint.examples.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h4 className="text-base font-semibold mb-4">Examples</h4>

          {endpoint.examples.length > 1 && (
            <div className="flex gap-2 mb-4 flex-wrap" role="group" aria-label="Example selector">
              {endpoint.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExample(index)}
                  aria-pressed={selectedExample === index}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedExample === index
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-text-secondary hover:text-text border border-border'
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <CodeBlock
              label="cURL"
              code={generateCurlCommand(endpoint.examples[selectedExample])}
            />
            <CodeBlock
              label="Response"
              code={JSON.stringify(endpoint.examples[selectedExample].response.body, null, 2)}
            />
          </div>
        </div>
      )}

      {/* Live API Response */}
      {(apiResponse || apiError) && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h4 className="text-base font-semibold mb-4">Live response</h4>

          {apiError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : apiResponse ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span
                  className={`px-2 py-1 rounded-full font-mono ${
                    apiResponse.status >= 200 && apiResponse.status < 300
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  {apiResponse.status} {apiResponse.statusText}
                </span>
                <span className="text-text-secondary">
                  Content-Type: {apiResponse.headers['content-type'] || 'application/json'}
                </span>
              </div>

              <CodeBlock
                label="Response body"
                code={JSON.stringify(apiResponse.data, null, 2)}
                maxHeight="24rem"
              />
            </div>
          ) : null}
        </div>
      )}
    </motion.div>
  );
};
