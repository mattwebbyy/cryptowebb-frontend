// src/pages/settings/Profile.tsx — personal details and password.
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/config';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phoneNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inputClass =
  'w-full rounded-md bg-surface-2 border border-border px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/60';

const labelClass = 'block mb-1.5 text-[13px] font-medium text-text';

const Profile = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makeAuthRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to continue');
      navigate('/login');
      throw new Error('No auth token');
    }

    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await makeAuthRequest('/api/v1/users/me');
        if (!response.ok) throw new Error('Failed to load profile');

        const data = await response.json();
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          bio: data.bio || '',
          phoneNumber: data.phoneNumber || '',
        });
        setAvatarUrl(data.avatarUrl || '');
      } catch {
        toast.error('Failed to load profile data');
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WEBP files are allowed');
      return;
    }

    try {
      setStatus('submitting');

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      const response = await makeAuthRequest('/api/v1/users/me/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: base64, fileName: file.name }),
      });

      let data;
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to upload avatar');
      }

      toast.success('Avatar updated');
      if (data?.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setStatus('idle');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await makeAuthRequest('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Profile saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setStatus('idle');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setStatus('submitting');
      const response = await makeAuthRequest('/api/v1/users/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const responseData = await response.text();
        let message = 'Failed to change password';
        try {
          message = JSON.parse(responseData).error || message;
        } catch {
          /* non-JSON error body */
        }
        throw new Error(message);
      }

      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <section className="rounded-md border border-border bg-surface">
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <h2 className="text-sm font-semibold">Profile</h2>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Your name and details as they appear across CryptoWebb.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-5 space-y-4">
          {/* Avatar row */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-md bg-surface-2 border border-border flex items-center justify-center overflow-hidden hover:border-text-secondary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Change profile picture"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-5 h-5 text-text-secondary" aria-hidden="true" />
              )}
            </button>
            <div className="text-[13px] text-text-secondary">
              <div className="text-sm font-medium text-text">Profile picture</div>
              Click to upload — JPEG, PNG or WEBP, max 5MB.
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className={labelClass}>Phone number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="Optional"
            />
          </div>

          <div>
            <label htmlFor="bio" className={labelClass}>Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Optional"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" variant="primary" size="sm" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-md border border-border bg-surface">
        <div className="px-5 pt-4 pb-3 border-b border-border">
          <h2 className="text-sm font-semibold">Password</h2>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Use at least 8 characters. You'll stay signed in on this device.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="currentPassword" className={labelClass}>Current password</label>
            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={inputClass}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className={labelClass}>New password</label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm new password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" variant="outline" size="sm" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Changing…' : 'Change password'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
