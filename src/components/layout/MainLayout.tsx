
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a slight delay for the animation to take effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If no user, don't render the layout (will be handled by auth protection)
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={`ml-64 min-h-screen transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main className="pt-24 px-8 pb-12">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
