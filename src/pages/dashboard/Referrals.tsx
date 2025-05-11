// src/pages/dashboard/Referrals.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
      // Make the API call with proper typing
      const response = await apiClient.get<any>('/api/v1/users/referral-codes');
      
      let codesArray: any[] = [];
      
      // The response.data is the correct way to access data in Axios responses
      if (response.data && typeof response.data === 'object') {
        // Check if response.data has a referralCodes property
        if (response.data.referralCodes && Array.isArray(response.data.referralCodes)) {
          codesArray = response.data.referralCodes;
        } 
        // Check if response.data is directly the array
        else if (Array.isArray(response.data)) {
          codesArray = response.data;
        } 
        // Last resort - search for any arrays in the response.data
        else {
          const findArrays = (obj: any): any[] => {
            if (!obj || typeof obj !== 'object') return [];
            
            for (const key in obj) {
              if (Array.isArray(obj[key])) {
                return obj[key];
              } else if (obj[key] && typeof obj[key] === 'object') {
                const found = findArrays(obj[key]);
                if (found.length > 0) return found;
              }
            }
            
            return [];
          };
          
          codesArray = findArrays(response.data);
        }
      }
      
      // Normalize the data by handling field capitalization differences
      if (codesArray.length > 0) {
        const normalizedCodes = codesArray.map((code: any) => ({
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
      console.error('Error fetching referral codes:', error);
      toast.error('Failed to fetch referral codes.');
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
      // Using the full path
      await apiClient.post('/api/v1/users/referral-codes', newCode);
      toast.success('Referral code added successfully!');
      // Reset form, keeping platform as 'general'
      setNewCode({ platform: 'general', code: '', description: '' });
      fetchReferralCodes(); // Refresh the list
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.error === 'User already has a referral code for this platform') {
          toast.error('Referral code for this platform already exists.');
        } else if (error.response.data.error === 'Invalid platform') {
          toast.error('Invalid platform selected. Please refresh and try again.'); // Should ideally not happen with dropdown
        } else {
          toast.error(error.response.data.error || 'Failed to add referral code. Please try again.');
        }
      } else {
        toast.error('Failed to add referral code. Please try again.');
      }
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">Manage Your Referral Codes</h1>

        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FiPlusCircle className="mr-3 text-accent" />
            Add New Referral Code
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-1">
                Platform
              </label>
              <select
                name="platform"
                id="platform"
                value={newCode.platform}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white"
              >
                <option value="general">General</option>
                {/* If you add more platforms to backend's isValidPlatform, add them here:
                <option value="binance">Binance</option>
                <option value="hyperliquid">Hyperliquid</option>
                */}
              </select>
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                Referral Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                value={newCode.code}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white placeholder-gray-400"
                placeholder="Your unique referral code"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                id="description"
                value={newCode.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white placeholder-gray-400"
                placeholder="e.g., 10% off trading fees"
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Code'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FiList className="mr-3 text-accent" />
            Your Referral Codes
          </h2>
          {isLoading && <p className="text-gray-400">Loading your codes...</p>}
          {!isLoading && referralCodes.length === 0 && (
            <p className="text-gray-400">You haven't added any referral codes yet.</p>
          )}
          {!isLoading && referralCodes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Referral Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-750 divide-y divide-gray-600">
                  {referralCodes.map((refCode) => (
                    <tr key={refCode.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {refCode.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="font-mono bg-gray-800 p-2 rounded overflow-x-auto max-w-xs">
                          {formatReferralLink(refCode.code)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {refCode.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(refCode.code)}
                          className="flex items-center"
                        >
                          <FiCopy className="mr-2" /> Copy Link
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default ReferralsPage;