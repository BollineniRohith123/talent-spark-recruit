
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/context/AuthContext';

interface AuthProtectionProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthProtection = ({ children, allowedRoles = [] }: AuthProtectionProps) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required, or user has an allowed role, allow access
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // If user doesn't have required role, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default AuthProtection;
