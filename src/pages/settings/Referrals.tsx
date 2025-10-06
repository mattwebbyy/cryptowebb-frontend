// src/pages/settings/Referrals.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/axios';
import { toast } from 'react-toastify';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/SEO';
import { FiPlusCircle, FiList, FiCopy } from 'react-icons/fi';

// Configuration - easy to update if needed
const REFERRAL_BASE_URL = 'https://cryptowebb.com/ref/';

interface ReferralCode {
  id: string;
  platform: string;
  code: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface NewReferralCode {
  platform: string;
  code: string;
  description: string;
}

type RawReferralCode = Partial<ReferralCode> & {
  ID?: string;
  Platform?: string;
  Code?: string;
  Description?: string;
  Active?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
};

type ReferralApiResponse =
  | RawReferralCode[]
  | {
      referralCodes?: RawReferralCode[];
      data?: RawReferralCode[];
    }
  | Record<string, unknown>
  | null;

const extractReferralList = (payload: ReferralApiResponse): RawReferralCode[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    const withCodes = payload as { referralCodes?: RawReferralCode[]; data?: RawReferralCode[] };
    if (Array.isArray(withCodes.referralCodes)) {
      return withCodes.referralCodes;
    }
    if (Array.isArray(withCodes.data)) {
      return withCodes.data;
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) {
        return value as RawReferralCode[];
      }
      if (value && typeof value === 'object') {
        const nested = extractReferralList(value as ReferralApiResponse);
        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }
  return [];
};

const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize platform to "general" as it's the only option
  const [newCode, setNewCode] = useState<NewReferralCode>({
    platform: 'general', // Default to 'general'
    code: '',
    description: '',
  });

  const fetchReferralCodes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ReferralApiResponse>('/api/v1/users/referral-codes');

      const codesArray = extractReferralList(response);
      
      // Normalize the data by handling field capitalization differences
      if (codesArray.length > 0) {
        const normalizedCodes = codesArray.map((code) => ({
          id: code.ID || code.id || '',
          platform: code.Platform || code.platform || '',
          code: code.Code || code.code || '',
          description: code.Description || code.description || '',
          active: typeof code.Active !== 'undefined' ? code.Active : 
                 (typeof code.active !== 'undefined' ? code.active : true),
          created_at: code.CreatedAt || code.created_at || '',
          updated_at: code.UpdatedAt || code.updated_at || ''
        }));
        
        setReferralCodes(normalizedCodes);
      } else {
        setReferralCodes([]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch referral codes.';
      console.error('Error fetching referral codes:', error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchReferralCodes();
  }, [fetchReferralCodes]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCode((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Platform is now defaulted and non-empty, so the main check is for code
    if (!user || !newCode.code) {
      toast.warn('Referral Code is required.');
      return;
    }
    // Ensure platform is set (should be by default)
    if (!newCode.platform) {
      toast.warn('Platform is required.'); // Should not happen with default
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/users/referral-codes', newCode);
      toast.success('Referral code added successfully!');
      setNewCode({ platform: 'general', code: '', description: '' });
      fetchReferralCodes();
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const specificMessage = axiosError.response?.data?.error;
      const fallbackMessage = axiosError.message || 'Failed to add referral code. Please try again.';
      toast.error(specificMessage || fallbackMessage);
      console.error('Error adding referral code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated to copy full referral link
  const copyToClipboard = (code: string) => {
    const referralLink = `${REFERRAL_BASE_URL}${code}`;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy referral link.'));
  };

  // Helper function to format a referral link for display
  const formatReferralLink = (code: string) => {
    // Remove protocol (https://) for display
    const displayBaseUrl = REFERRAL_BASE_URL.replace(/^https?:\/\//, '');
    return `${displayBaseUrl}${code}`;
  };

  return (
    <>
      <SEO
        title="My Referral Codes"
        description="Manage your referral codes on CryptoWebb."
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Referral Management</h1>
        <p className="text-text-secondary text-lg">Create and manage your referral codes to earn rewards</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-full overflow-hidden">
        <Card className="p-6 bg-surface/95 backdrop-blur-sm border border-border hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-md">
            <h2 className="text-2xl font-bold text-text mb-8 flex items-center">
              <FiPlusCircle className="mr-3 text-primary" />
              Add New Referral Code
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="platform" className="block text-text font-medium mb-3">
                  Platform
                </label>
                <select
                  name="platform"
                  id="platform"
                  value={newCode.platform}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-surface/80 border border-border/50 rounded-xl text-text focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="general">General</option>
                  {/* Future platforms can be added here */}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="code" className="block text-text font-medium mb-3">
                  Referral Code
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={newCode.code}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-surface/80 border border-border/50 rounded-xl text-text placeholder-text-secondary/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your unique referral code"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-text font-medium mb-3">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={newCode.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-4 bg-surface/80 border border-border/50 rounded-xl text-text placeholder-text-secondary/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none backdrop-blur-sm"
                  placeholder="e.g., 10% off trading fees, bonus rewards, etc."
                />
              </div>
              
              <Button type="submit" variant="gradient" size="lg" isLoading={isSubmitting} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Referral Code'}
              </Button>
            </form>
            </Card>

        <Card className="p-6 bg-surface/95 backdrop-blur-sm border border-border hover:bg-surface transition-all duration-300 shadow-sm hover:shadow-md">
            <h2 className="text-2xl font-bold text-text mb-8 flex items-center">
              <FiList className="mr-3 text-primary" />
              Your Referral Codes
            </h2>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 text-text-secondary">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading your codes...
                </div>
              </div>
            )}
            
            {!isLoading && referralCodes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiList className="h-8 w-8 text-primary" />
                </div>
                <p className="text-text-secondary text-lg">No referral codes yet</p>
                <p className="text-text-secondary/60 text-sm mt-1">Create your first referral code to start earning rewards</p>
              </div>
            )}
            
            {!isLoading && referralCodes.length > 0 && (
              <div className="space-y-4">
                {referralCodes.map((refCode) => (
                  <div key={refCode.id} className="glass-morphism p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {refCode.platform}
                          </span>
                          {refCode.active && (
                            <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-text font-medium">Referral Link:</p>
                          <div className="font-mono bg-surface/80 p-3 rounded-xl text-primary text-sm overflow-x-auto border border-border/30">
                            {formatReferralLink(refCode.code)}
                          </div>
                        </div>
                        {refCode.description && (
                          <p className="text-text-secondary text-sm">
                            <span className="font-medium">Description:</span> {refCode.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(refCode.code)}
                          className="flex items-center gap-2"
                        >
                          <FiCopy className="h-4 w-4" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </Card>
      </div>
    </>
  );
};

export default ReferralsPage;
