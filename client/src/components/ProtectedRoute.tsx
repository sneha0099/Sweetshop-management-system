import { useAuthStore } from '@/store/AuthStore';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'user' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    // If not authenticated, redirect to login with the current location
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is not verified, redirect to verify page
    if (!user.verified) {
        return <Navigate to="/verify" replace />;
    }

    // If a specific role is required, check if user has that role
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has required permissions
    return <>{children}</>;
}