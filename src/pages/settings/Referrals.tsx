// src/pages/settings/Referrals.tsx — create and share referral codes.
import React, { useState, useEffect, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { Copy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/axios';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/SEO';

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

const inputClass =
  'w-full rounded-md bg-surface-2 border border-border px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/60';

const labelClass = 'block mb-1.5 text-[13px] font-medium text-text';

const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [newCode, setNewCode] = useState<NewReferralCode>({
    platform: 'general',
    code: '',
    description: '',
  });

  const fetchReferralCodes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<ReferralApiResponse>('/api/v1/users/referral-codes');
      const codesArray = extractReferralList(response);

      setReferralCodes(
        codesArray.map((code) => ({
          id: code.ID || code.id || '',
          platform: code.Platform || code.platform || '',
          code: code.Code || code.code || '',
          description: code.Description || code.description || '',
          active:
            typeof code.Active !== 'undefined'
              ? code.Active
              : typeof code.active !== 'undefined'
                ? code.active
                : true,
          created_at: code.CreatedAt || code.created_at || '',
          updated_at: code.UpdatedAt || code.updated_at || '',
        }))
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch referral codes.';
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
    if (!user || !newCode.code) {
      toast.warning('Referral code is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/users/referral-codes', newCode);
      toast.success('Referral code added');
      setNewCode({ platform: 'general', code: '', description: '' });
      fetchReferralCodes();
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      toast.error(
        axiosError.response?.data?.error || axiosError.message || 'Failed to add referral code.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(`${REFERRAL_BASE_URL}${code}`)
      .then(() => toast.success('Referral link copied'))
      .catch(() => toast.error('Failed to copy referral link.'));
  };

  const displayLink = (code: string) =>
    `${REFERRAL_BASE_URL.replace(/^https?:\/\//, '')}${code}`;

  return (
    <>
      <SEO title="Referrals" description="Manage your referral codes on CryptoWebb." />

      <div className="space-y-6">
        {/* Create */}
        <section className="rounded-md border border-border bg-surface">
          <div className="px-5 pt-4 pb-3 border-b border-border">
            <h2 className="text-sm font-semibold">Add referral code</h2>
            <p className="text-[13px] text-text-secondary mt-0.5">
              Share your link — anyone who signs up through it is credited to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="platform" className={labelClass}>Platform</label>
                <select
                  name="platform"
                  id="platform"
                  value={newCode.platform}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label htmlFor="code" className={labelClass}>Referral code</label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={newCode.code}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="e.g. matt10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={newCode.description}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Optional — e.g. 10% off trading fees"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Adding…' : 'Add code'}
              </Button>
            </div>
          </form>
        </section>

        {/* Codes */}
        <section className="rounded-md border border-border bg-surface">
          <div className="px-5 pt-4 pb-3 border-b border-border">
            <h2 className="text-sm font-semibold">Your codes</h2>
          </div>

          {isLoading && (
            <div className="px-5 py-8 text-center text-[13px] text-text-secondary">
              Loading codes…
            </div>
          )}

          {!isLoading && referralCodes.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-text-secondary">
              No referral codes yet — add your first one above.
            </div>
          )}

          {!isLoading &&
            referralCodes.map((refCode) => (
              <div
                key={refCode.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono truncate">{displayLink(refCode.code)}</code>
                    {refCode.active && (
                      <span className="rounded px-1.5 py-0.5 text-[11px] font-medium bg-gain/10 text-gain shrink-0">
                        Active
                      </span>
                    )}
                    <span className="rounded px-1.5 py-0.5 text-[11px] bg-surface-2 border border-border text-text-secondary capitalize shrink-0">
                      {refCode.platform}
                    </span>
                  </div>
                  {refCode.description && (
                    <p className="text-xs text-text-secondary mt-1 truncate">
                      {refCode.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(refCode.code)}
                  className="shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Copy link
                </Button>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default ReferralsPage;
