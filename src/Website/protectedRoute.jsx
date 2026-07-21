import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, requireProfile = true, requireAdmin = false }) => {
  const { token, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If we have a token but user data hasn't loaded yet, show a loader
  if (token && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
      </div>
    );
  }

  // If route requires complete profile and user hasn't completed it
  if (requireProfile && user && !user.isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  // If route requires admin role and user is not an admin
  if (requireAdmin && user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};