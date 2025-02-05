import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type APIKey = {
  id: string;
  name: string;
  prefix: string;
  created_at: string;  // Updated to match backend
  expires_at: string;  // Updated to match backend
  last_used_at?: string;
};

type APIKeyResponse = APIKey & {
  key: string; // Only present when first created
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    // Convert UTC string to Date object
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } catch (e) {
    console.error('Date parsing error:', e, dateString);
    return 'Invalid Date';
  }
};

const Settings = () => {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('30');
  const [generatedKey, setGeneratedKey] = useState<APIKeyResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { data: keys, isLoading } = useQuery<APIKey[]>({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/api/v1/users/me/api-keys', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch API keys');
      }
      
      const data = await response.json();
      console.log('Fetched API keys:', data); // Debug log
      return data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (payload: { name: string; expiresIn: number }) => {
      const token = localStorage.getItem('token');
      console.log('Generating key with payload:', payload); // Debug log
      
      const response = await fetch('http://localhost:8080/api/v1/users/me/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: payload.name,
          expires_in: payload.expiresIn * 24 * 3600, // Convert days to seconds
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate API key');
      }

      const data = await response.json();
      console.log('Generated key response:', data); // Debug log
      return data;
    },
    onSuccess: (data: APIKeyResponse) => {
      setGeneratedKey(data);
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setNewKeyName('');
    },
  });
  const revokeMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const token = localStorage.getItem('token');
      console.log('Revoking key:', keyId);  // Debug log
      
      const response = await fetch(`http://localhost:8080/api/v1/users/me/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Revoke error:', errorData);  // Debug log
        throw new Error(errorData.error || 'Failed to revoke API key');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
    onError: (error) => {
      console.error('Revoke mutation error:', error);  // Debug log
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate({
      name: newKeyName,
      expiresIn: parseInt(newKeyExpiry),
    });
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-matrix-green">API Key Management</h2>
      
      <div className="space-y-8">
        <div className="bg-black/30 p-6 rounded-lg border border-matrix-green/50 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-matrix-green">Generate New API Key</h3>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block mb-2 text-matrix-green font-medium">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter a name for your API key"
                className="w-full p-3 bg-black/50 border border-matrix-green/50 rounded-lg 
                         text-matrix-green placeholder-matrix-green/30 focus:border-matrix-green 
                         focus:outline-none focus:ring-1 focus:ring-matrix-green/50"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-matrix-green font-medium">Expiration Period</label>
              <select
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
                className="w-full p-3 bg-black/50 border border-matrix-green/50 rounded-lg 
                         text-matrix-green focus:border-matrix-green focus:outline-none 
                         focus:ring-1 focus:ring-matrix-green/50"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
                <option value="0">Never</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full py-3 bg-matrix-green/20 hover:bg-matrix-green/30 
                       border border-matrix-green rounded-lg text-matrix-green 
                       font-medium transition duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate API Key'}
            </button>
          </form>

          {generatedKey && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-matrix-green animate-fadeIn">
              <p className="text-matrix-green font-medium mb-2">
                Your new API key has been generated. Copy it now, it won't be shown again:
              </p>
              <div className="relative mt-2">
                <code className="block p-4 bg-black/70 rounded-lg text-matrix-green 
                              font-mono text-sm break-all border border-matrix-green/30">
                  {generatedKey.key}
                </code>
                <button
                  onClick={() => handleCopyKey(generatedKey.key)}
                  className="absolute top-2 right-2 px-3 py-1.5 text-xs 
                           bg-matrix-green/20 hover:bg-matrix-green/30 
                           border border-matrix-green rounded-md
                           transition duration-200 ease-in-out"
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing API Keys */}
        <div className="bg-black/30 p-6 rounded-lg border border-matrix-green/50 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-matrix-green">Active API Keys</h3>
          
          {isLoading ? (
            <div className="text-matrix-green text-center py-4">Loading API keys...</div>
          ) : !keys?.length ? (
            <div className="text-matrix-green/70 text-center py-4">No active API keys found</div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} 
                     className="p-4 bg-black/50 rounded-lg border border-matrix-green/30 
                              hover:border-matrix-green/50 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-lg font-medium text-matrix-green">{key.name}</h4>
                      <div className="space-y-1 text-sm text-matrix-green/70">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Created:</span>
                          <span>{formatDate(key.created_at)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Expires:</span>
                          <span>{formatDate(key.expires_at)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Prefix:</span>
                          <span className="font-mono">{key.prefix}</span>
                        </p>
                        {key.last_used_at && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Last Used:</span>
                            <span>{formatDate(key.last_used_at)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => revokeMutation.mutate(key.id)}
                      disabled={revokeMutation.isPending}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 
                               border border-red-500/50 hover:border-red-500 
                               rounded-md text-red-400 text-sm transition
                               duration-200 ease-in-out disabled:opacity-50"
                    >
                      {revokeMutation.isPending ? 'Revoking...' : 'Revoke Key'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;