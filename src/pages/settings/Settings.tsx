// src/pages/settings/Settings.tsx — API key management.
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Copy, Check, BookOpen, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL } from '@/lib/config';

type APIKey = {
  id: string;
  Name: string;
  prefix: string;
  created_at: string;
  ExpiresAt: string;
  last_used_at?: string;
};

type APIKeyResponse = APIKey & {
  key: string; // Only present when first created
};

const inputClass =
  'rounded-md bg-surface-2 border border-border px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/60';

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  // The zero date means "never expires"
  if (date.getTime() === 0) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const authHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token not found.');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const fetchApiKeys = async (): Promise<APIKey[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me/api-keys`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch API keys';
    try {
      errorMsg = (await response.json())?.error || errorMsg;
    } catch {
      /* non-JSON body */
    }
    throw new Error(errorMsg);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

const Settings = () => {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('30');
  const [generatedKey, setGeneratedKey] = useState<APIKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: keys, isLoading, error: fetchError } = useQuery<APIKey[], Error>({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys,
  });

  const generateMutation = useMutation<APIKeyResponse, Error, { name: string; expiresIn: number }>({
    mutationFn: async (payload) => {
      const expiryInSeconds = payload.expiresIn > 0 ? payload.expiresIn * 24 * 3600 : 0;
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/api-keys`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: payload.name, expires_in: expiryInSeconds }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to generate API key';
        try {
          errorMsg = (await response.json())?.error || errorMsg;
        } catch {
          /* non-JSON body */
        }
        throw new Error(errorMsg);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedKey(data);
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setNewKeyName('');
      setNewKeyExpiry('30');
      setCopied(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const revokeMutation = useMutation<void, Error, string>({
    mutationFn: async (keyId) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) {
        let errorMsg = `Failed to revoke API key (${response.status})`;
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            errorMsg = (await response.json())?.error || errorMsg;
          }
        } catch {
          /* non-JSON body */
        }
        throw new Error(errorMsg);
      }
    },
    onSuccess: () => {
      toast.success('API key revoked');
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Give the key a name');
      return;
    }
    setGeneratedKey(null);
    generateMutation.mutate({
      name: newKeyName.trim(),
      expiresIn: parseInt(newKeyExpiry, 10),
    });
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success('API key copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Create */}
      <section className="rounded-md border border-border bg-surface">
        <div className="px-5 pt-4 pb-3 border-b border-border flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Create API key</h2>
            <p className="text-[13px] text-text-secondary mt-0.5">
              Keys authenticate requests to the CryptoWebb API.
            </p>
          </div>
          <Link
            to="/docs"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            API docs
          </Link>
        </div>

        <form onSubmit={handleGenerate} className="p-5 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name, e.g. Production server"
            aria-label="Key name"
            className={`${inputClass} flex-1`}
            required
          />
          <select
            value={newKeyExpiry}
            onChange={(e) => setNewKeyExpiry(e.target.value)}
            aria-label="Expiration"
            className={inputClass}
          >
            <option value="7">Expires in 7 days</option>
            <option value="30">Expires in 30 days</option>
            <option value="90">Expires in 90 days</option>
            <option value="365">Expires in 1 year</option>
            <option value="0">Never expires</option>
          </select>
          <Button type="submit" variant="primary" size="sm" disabled={generateMutation.isPending}>
            {generateMutation.isPending ? 'Creating…' : 'Create key'}
          </Button>
        </form>

        {generatedKey && (
          <div className="mx-5 mb-5 rounded-md border border-warning/40 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-warning mb-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Copy this key now — it won't be shown again.
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 min-w-0 truncate rounded-md bg-surface-2 border border-border px-3 py-2 text-sm font-mono">
                {generatedKey.key}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyKey(generatedKey.key)}
                aria-label="Copy API key"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Active keys */}
      <section className="rounded-md border border-border bg-surface">
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <h2 className="text-sm font-semibold">Active keys</h2>
        </div>

        {isLoading && (
          <div className="px-5 py-8 text-center text-[13px] text-text-secondary">
            Loading keys…
          </div>
        )}

        {fetchError && (
          <div className="px-5 py-8 text-center text-[13px] text-error">
            {fetchError.message}
          </div>
        )}

        {!isLoading && !fetchError && (!keys || keys.length === 0) && (
          <div className="px-5 py-8 text-center text-[13px] text-text-secondary">
            No API keys yet — create one above to start using the API.
          </div>
        )}

        {!isLoading && !fetchError && keys && keys.length > 0 && (
          <div>
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" title={key.Name}>
                      {key.Name}
                    </span>
                    <code className="text-xs font-mono text-text-secondary bg-surface-2 border border-border rounded px-1.5 py-0.5">
                      {key.prefix}…
                    </code>
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    Created {formatDate(key.created_at)} · Expires {formatDate(key.ExpiresAt)}
                    {key.last_used_at && ` · Last used ${formatDate(key.last_used_at)}`}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-error/40 text-error hover:border-error hover:bg-error/10 shrink-0"
                  disabled={revokeMutation.isPending && revokeMutation.variables === key.id}
                  onClick={() => {
                    if (window.confirm(`Revoke "${key.Name}"? Requests using it will stop working immediately.`)) {
                      revokeMutation.mutate(key.id);
                    }
                  }}
                >
                  {revokeMutation.isPending && revokeMutation.variables === key.id
                    ? 'Revoking…'
                    : 'Revoke'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;
