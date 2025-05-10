// src/pages/dashboard/Referrals.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {apiClient} from '../../lib/axios';
import { toast } from 'react-toastify';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/SEO';
import { FiPlusCircle, FiList, FiCopy } from 'react-icons/fi'; // Example icons

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
  const [newCode, setNewCode] = useState<NewReferralCode>({
    platform: '',
    code: '',
    description: '',
  });

  const fetchReferralCodes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ReferralCode[]>('/users/referral-codes');
      setReferralCodes(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch referral codes.');
      console.error('Error fetching referral codes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReferralCodes();
  }, [fetchReferralCodes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCode((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !newCode.platform || !newCode.code) {
      toast.warn('Platform and Code are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/users/referral-codes', newCode);
      toast.success('Referral code added successfully!');
      setNewCode({ platform: '', code: '', description: '' });
      fetchReferralCodes(); // Refresh the list
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error === 'User already has a referral code for this platform') {
        toast.error('You already have a referral code for this platform.');
      } else {
        toast.error('Failed to add referral code. Please try again.');
      }
      console.error('Error adding referral code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy code.'));
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
              <input
                type="text"
                name="platform"
                id="platform"
                value={newCode.platform}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white placeholder-gray-400"
                placeholder="e.g., Binance, Coinbase"
              />
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
                      Code
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{refCode.platform}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{refCode.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{refCode.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(refCode.code)}
                          className="flex items-center"
                        >
                          <FiCopy className="mr-2" /> Copy
                        </Button>
                        {/* Add Edit/Delete buttons here if functionality is added in the future */}
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