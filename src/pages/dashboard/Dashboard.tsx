// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  lastLogin?: string;
  createdAt?: string;
};

const fetchProfile = async (): Promise<Profile> => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/v1/users/me', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  const data = await response.json();
  return data.user; // Adjust based on your backend response structure
};

const Dashboard = () => {
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return <div className="p-6 text-matrix-green">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading profile: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 text-matrix-green">Dashboard</h1>
      <div className="p-6 bg-black/30 border border-matrix-green rounded shadow-lg">
        <h2 className="text-2xl text-matrix-green mb-2">
          Welcome, {profile?.firstName} {profile?.lastName}
        </h2>
        <p className="text-matrix-green">Email: {profile?.email}</p>
        {profile?.bio && <p className="mt-2 text-matrix-green">Bio: {profile.bio}</p>}
        {profile?.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="mt-4 rounded-full w-24 h-24 object-cover"
          />
        )}
        {profile?.lastLogin && (
          <p className="mt-2 text-sm text-matrix-green">
            Last login: {new Date(profile.lastLogin).toLocaleString()}
          </p>
        )}
      </div>
      {/* You could add additional sections here—for example, a list of referral codes */}
    </div>
  );
};

export default Dashboard;
