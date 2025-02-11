// src/hooks/useAdminGuard.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAdminGuard = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/blog');
        }
    }, [user, isLoading, navigate]);

    return { isAdmin: user?.role === 'admin', isLoading };
};