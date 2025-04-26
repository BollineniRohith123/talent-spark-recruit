
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from 'lucide-react';

// Fake notifications for demo
const demoNotifications = [
  { id: 1, message: "New candidate matched for Data Scientist position", read: false },
  { id: 2, message: "Interview scheduled with John Doe", read: false },
  { id: 3, message: "Casey Wilson completed screening", read: true },
];

// Role display names
const roleNames: Record<UserRole, string> = {
  'company-admin': 'Company Admin',
  'hiring-manager': 'Hiring Manager',
  'talent-scout': 'Talent Scout',
  'team-member': 'Team Member',
  'applicant': 'Applicant'
};

const Navbar = () => {
  const { user, logout, setRole } = useAuth();
  const [notifications, setNotifications] = useState(demoNotifications);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For demo - mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header 
      className={`fixed top-0 right-0 left-0 z-30 p-4 transition-all duration-200 ml-64
        ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b' : ''}
      `}
    >
      <div className="flex justify-between items-center">
        {/* Page title could go here */}
        <div className="flex-1"></div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div>
                      <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Just now
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <p>{user.name}</p>
                    <p className="text-xs text-muted-foreground">{roleNames[user.role]}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Role switcher for demo purposes */}
                <DropdownMenuLabel>Demo: Switch Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setRole('company-admin')}>
                  Company Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('hiring-manager')}>
                  Hiring Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('talent-scout')}>
                  Talent Scout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('team-member')}>
                  Team Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('applicant')}>
                  Applicant
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
