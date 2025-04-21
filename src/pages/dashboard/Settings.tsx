import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type APIKey = {
  id: string;
  Name: string; // Keep original casing if that's what backend returns
  prefix: string;
  created_at: string;
  ExpiresAt: string; // Keep original casing
  last_used_at?: string;
};

type APIKeyResponse = APIKey & {
  key: string; // Only present when first created
};

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
        console.error('Invalid Date object created for:', dateString);
        return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: 'UTC' // Displaying in UTC as per original code
    }).format(date);
  } catch (e) {
    console.error('Date formatting error:', e, dateString);
    return 'Invalid Date';
  }
};


const Settings = () => {
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('30'); // Default to 30 days
  const [generatedKey, setGeneratedKey] = useState<APIKeyResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchApiKeys = async (): Promise<APIKey[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found.');

    const response = await fetch('http://localhost:8080/api/v1/users/me/api-keys', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      let errorMsg = 'Failed to fetch API keys';
      try {
        const errorData = await response.json();
        errorMsg = errorData?.error || errorMsg;
      } catch (e) {
        // Ignore if response is not JSON
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('Fetched API keys:', data); // Debug log
    // Ensure data is an array, default to empty array if not
    return Array.isArray(data) ? data : [];
  };

  const { data: keys, isLoading, error: fetchError } = useQuery<APIKey[], Error>({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys,
  });

  const generateApiKey = async (payload: { name: string; expiresIn: number }): Promise<APIKeyResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found.');

    console.log('Generating key with payload:', payload); // Debug log
    // Ensure expiresIn is handled correctly, especially 'Never' (0)
    const expiryInSeconds = payload.expiresIn > 0 ? payload.expiresIn * 24 * 3600 : 0;

    const response = await fetch('http://localhost:8080/api/v1/users/me/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: payload.name,
        expires_in: expiryInSeconds, // Send expiry in seconds
      }),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to generate API key';
      try {
        const errorData = await response.json();
        errorMsg = errorData?.error || errorMsg;
      } catch (e) {
       // Ignore if response is not JSON
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('Generated key response:', data); // Debug log
    return data;
  };

  const generateMutation = useMutation<APIKeyResponse, Error, { name: string; expiresIn: number }>({
    mutationFn: generateApiKey,
    onSuccess: (data) => {
      setGeneratedKey(data);
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setNewKeyName('');
      setNewKeyExpiry('30'); // Reset expiry dropdown
      setCopySuccess(false); // Reset copy status
    },
    onError: (error) => {
        console.error("Generate API Key Error:", error.message);
        // Optionally: display error to user using a toast notification or state variable
    }
  });

  const revokeApiKey = async (keyId: string): Promise<void> => {
    const token = localStorage.getItem('token');
     if (!token) throw new Error('Authentication token not found.');

    console.log('Revoking key:', keyId);  // Debug log

    const response = await fetch(`http://localhost:8080/api/v1/users/me/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Often not needed for DELETE, but can be included
      },
    });

    if (!response.ok) {
       let errorMsg = 'Failed to revoke API key';
      try {
        // Attempt to parse error only if response has content and indicates JSON
        if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData?.error || errorMsg;
        } else {
            errorMsg = `${errorMsg} (Status: ${response.status})`;
        }
      } catch (e) {
         errorMsg = `${errorMsg} (Status: ${response.status})`;
      }
      console.error('Revoke error response:', response.status, errorMsg); // Debug log
      throw new Error(errorMsg);
    }

    // Check if response has content before trying to parse JSON
    // For DELETE requests, often a 204 No Content is returned
    if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        try {
           return await response.json();
        } catch(e) {
           console.warn("Could not parse JSON response for DELETE, but status was OK.");
           return; // Or handle as needed
        }
    }
    // Return void or handle 204 No Content appropriately
    return;
  };


  const revokeMutation = useMutation<void, Error, string>({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      console.log('Revoke successful, invalidating query.'); // Debug log
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
    onError: (error) => {
      console.error('Revoke mutation error:', error.message); // Debug log
      // Optionally: display error to user
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
        alert("Please provide a name for the API key."); // Simple validation
        return;
    }
    const expiresInDays = parseInt(newKeyExpiry, 10);
     // Close the generated key display if a new one is requested
    setGeneratedKey(null);
    generateMutation.mutate({
      name: newKeyName.trim(),
      expiresIn: expiresInDays,
    });
  };

  const handleCopyKey = async (key: string) => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not available.');
      // Fallback or error message
      return;
    }
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy key:', err);
      // Optionally display an error message to the user
    }
  };

   // --- Render Logic ---

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-matrix-green">API Key Management</h2>

      <div className="space-y-8">
        {/* Generate New Key Section */}
        <div className="bg-black/30 p-6 rounded-lg border border-matrix-green/50 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-matrix-green">Generate New API Key</h3>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="keyName" className="block mb-2 text-matrix-green font-medium">Key Name</label>
              <input
                id="keyName"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., My Development Key"
                className="w-full p-3 bg-black/50 border border-matrix-green/50 rounded-lg
                           text-matrix-green placeholder-matrix-green/30 focus:border-matrix-green
                           focus:outline-none focus:ring-1 focus:ring-matrix-green/50"
                required
              />
            </div>

            <div>
              <label htmlFor="keyExpiry" className="block mb-2 text-matrix-green font-medium">Expiration Period</label>
              <select
                id="keyExpiry"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
                className="w-full p-3 bg-black/50 border border-matrix-green/50 rounded-lg
                           text-matrix-green focus:border-matrix-green focus:outline-none
                           focus:ring-1 focus:ring-matrix-green/50 appearance-none"
                // Consider adding an arrow indicator for the select dropdown if needed
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
                <option value="0">Never Expires</option> {/* Clarify '0' meaning */}
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

          {/* Display Generated Key */}
          {generateMutation.error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/70 rounded-lg text-red-300 text-sm">
                Error generating key: {generateMutation.error.message}
            </div>
           )}

          {generatedKey && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-matrix-green animate-fadeIn">
              <p className="text-matrix-green font-medium mb-2">
                Your new API key has been generated. <strong className="text-yellow-400">Copy it now, it won't be shown again:</strong>
              </p>
              {/* Flex container for key and copy button */}
              <div className="flex items-center justify-between mt-2 gap-4">
                {/* API Key Display: allow scroll on overflow */}
                <pre className="flex-1 p-3 bg-black/70 rounded-lg text-matrix-green
                              font-mono text-sm overflow-x-auto border border-matrix-green/30
                              scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-matrix-green/50"
                      style={{ minWidth: 0 }} // Prevents flex item from overflowing its container
                      >
                  {generatedKey.key}
                </pre>
                {/* Copy Button: prevent shrinking */}
                <button
                  onClick={() => handleCopyKey(generatedKey.key)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs
                             bg-matrix-green/20 hover:bg-matrix-green/30
                             border border-matrix-green rounded-md
                             transition duration-200 ease-in-out"
                  aria-label="Copy API Key"
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing API Keys Section */}
        <div className="bg-black/30 p-6 rounded-lg border border-matrix-green/50 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-matrix-green">Active API Keys</h3>

          {/* Loading State */}
          {isLoading && (
            <div className="text-matrix-green text-center py-4">Loading API keys...</div>
          )}

          {/* Fetch Error State */}
           {fetchError && (
                <div className="p-3 bg-red-900/50 border border-red-500/70 rounded-lg text-red-300 text-sm text-center">
                    Error loading keys: {fetchError.message}
                </div>
           )}


          {/* Empty State (after loading, no error) */}
          {!isLoading && !fetchError && (!keys || keys.length === 0) && (
            <div className="text-matrix-green/70 text-center py-4">No active API keys found.</div>
          )}

           {/* Revoke Error State */}
           {revokeMutation.error && (
                <div className="mt-4 mb-4 p-3 bg-red-900/50 border border-red-500/70 rounded-lg text-red-300 text-sm">
                    Error revoking key: {revokeMutation.error.message}
                </div>
           )}

          {/* Display Keys (after loading, no error, keys exist) */}
          {!isLoading && !fetchError && keys && keys.length > 0 && (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2
                           scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-matrix-green/50">
              {keys.map((key) => (
                <div key={key.id}
                     className="p-4 bg-black/50 rounded-lg border border-matrix-green/30
                                hover:border-matrix-green/50 transition-colors duration-200">
                  <div className="flex justify-between items-start gap-4">
                    {/* Key Details */}
                    <div className="space-y-1 flex-1 min-w-0"> {/* min-w-0 prevents overflow issues with flex */}
                       <h4 className="text-lg font-medium text-matrix-green truncate" title={key.Name}>{key.Name}</h4>
                      <div className="space-y-1 text-sm text-matrix-green/70">
                        <p className="flex items-center gap-2 flex-wrap"> {/* flex-wrap for smaller screens */}
                          <span className="font-medium">Created:</span>
                          <span>{formatDate(key.created_at)}</span>
                        </p>
                        <p className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">Expires:</span>
                          {/* Check for non-expiring keys if backend uses a specific value like null or zero date */}
                          <span>{formatDate(key.ExpiresAt) === formatDate(new Date(0).toISOString()) || formatDate(key.ExpiresAt) === 'N/A' ? 'Never' : formatDate(key.ExpiresAt)}</span>
                        </p>
                        {key.last_used_at && (
                          <p className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">Last Used:</span>
                            <span>{formatDate(key.last_used_at)}</span>
                          </p>
                        )}
                         <p className="flex items-center gap-2 flex-wrap font-mono text-xs">
                            <span className="font-medium">Prefix:</span>
                            <span>{key.prefix}...</span>
                         </p>
                      </div>
                    </div>
                    {/* Revoke Button */}
                    <button
                      onClick={() => {
                        // Optional: Add confirmation dialog
                        if (window.confirm(`Are you sure you want to revoke the key "${key.Name}"? This action cannot be undone.`)) {
                           revokeMutation.mutate(key.id);
                        }
                      }}
                      // Disable button if this specific key is being revoked
                      disabled={revokeMutation.isPending && revokeMutation.variables === key.id}
                      className={`px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30
                                 border border-red-500/50 hover:border-red-500
                                 rounded-md text-red-400 text-sm transition
                                 duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                                 flex-shrink-0 ml-auto`} // Use ml-auto if needed, though justify-between should handle it
                        aria-label={`Revoke API key ${key.Name}`}
                    >
                      {(revokeMutation.isPending && revokeMutation.variables === key.id) ? 'Revoking...' : 'Revoke'}
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