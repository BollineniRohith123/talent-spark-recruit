
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  
  // If no user, don't render the layout (will be handled by auth protection)
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="pt-24 px-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
