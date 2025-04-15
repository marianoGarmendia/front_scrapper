import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const sessionExpiry = localStorage.getItem('sessionExpiry');

  useEffect(() => {
    if (isAuthenticated) {
      // Check if session has expired
      if (sessionExpiry && new Date().getTime() > parseInt(sessionExpiry)) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('sessionExpiry');
        navigate('/login');
      }
    }
  }, [isAuthenticated, sessionExpiry, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}