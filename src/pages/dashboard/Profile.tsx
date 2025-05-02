import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const makeAuthRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    if (!token) {
      toast.error('Please log in to continue');
      navigate('/login');
      throw new Error('No auth token');
    }

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    return fetch(`${API_URL}${url}`, {
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
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Add file size check
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Add file type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WEBP files are allowed');
      return;
    }

    try {
      setStatus('submitting');

      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      const response = await makeAuthRequest('/api/v1/users/me/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: base64,
          fileName: file.name,
        }),
      });

      let data;
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to upload avatar');
      }

      toast.success('Avatar uploaded successfully');
      // Update the avatar URL state
      if (data?.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const responseData = await response.text();
      console.log('Password change response:', responseData);

      if (!response.ok) {
        const error = JSON.parse(responseData);
        throw new Error(error.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-mono text-matrix-green mb-8">Profile Settings</h1>

        {/* Avatar Section */}
        <Card className="p-6 bg-black/90 border border-matrix-green">
          <div className="flex items-center space-x-4">
            <div
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full bg-matrix-green/20 border-2 border-matrix-green flex items-center justify-center cursor-pointer hover:bg-matrix-green/30 transition-colors overflow-hidden"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-matrix-green" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-mono text-matrix-green">Profile Picture</h3>
              <p className="text-gray-400">Click to upload a new avatar</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Card>

        {/* Profile Form */}
        <Card className="p-6 bg-black/90 border border-matrix-green">
          <h3 className="text-xl font-mono text-matrix-green mb-6">Personal Information</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-matrix-green font-mono mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
                />
              </div>
              <div>
                <label className="block text-matrix-green font-mono mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                rows={4}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green resize-none"
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
              />
            </div>

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-matrix-green hover:bg-matrix-green/80 text-black font-mono"
            >
              {status === 'submitting' ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Card>

        {/* Password Change Form */}
        <Card className="p-6 bg-black/90 border border-matrix-green">
          <h3 className="text-xl font-mono text-matrix-green mb-6">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-matrix-green font-mono mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
                required
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green"
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-matrix-green hover:bg-matrix-green/80 text-black font-mono"
            >
              {status === 'submitting' ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
