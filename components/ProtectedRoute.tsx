
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types.ts';

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but lacks the role, send them to their role's default dashboard
    const redirectPath = 
      user.role === UserRole.ADMIN ? '/admin' : 
      user.role === UserRole.DOCTOR ? '/doctor' : '/patient';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
