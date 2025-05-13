import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  BarChart3,
  Users,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  UserCog,
  Settings,
  LogOut,
  Menu,
  Building,
  FileSearch,
  FileText,
  UserPlus,
  DollarSign,
  PieChart,
  Upload,
  Briefcase,
  Shield
} from 'lucide-react';

// Define menu items per role
const menuItems: Record<UserRole, { title: string; path: string; icon: React.ElementType }[]> = {
  'ceo': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Admin Panel', path: '/admin', icon: Shield },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Employee Directory', path: '/profiles', icon: UserPlus },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Candidates', path: '/candidates', icon: ClipboardCheck },
    { title: 'Screenings', path: '/screenings', icon: FileSearch },
    { title: 'Interviews', path: '/interviews', icon: Calendar },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Profit Calculator', path: '/profit-calculator', icon: DollarSign },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'branch-manager': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Employee Directory', path: '/profiles', icon: UserPlus },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Candidates', path: '/candidates', icon: ClipboardCheck },
    { title: 'Screenings', path: '/screenings', icon: FileSearch },
    { title: 'Interviews', path: '/interviews', icon: Calendar },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Profit Calculator', path: '/profit-calculator', icon: DollarSign },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'marketing-head': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Employee Directory', path: '/profiles', icon: UserPlus },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Profit Calculator', path: '/profit-calculator', icon: DollarSign },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'marketing-supervisor': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Profit Calculator', path: '/profit-calculator', icon: DollarSign },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'marketing-recruiter': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Screenings', path: '/screenings', icon: FileSearch },
    { title: 'Employee Directory', path: '/profiles', icon: UserPlus },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'marketing-associate': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Jobs Management', path: '/jobs-management', icon: Briefcase },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Interviews', path: '/interviews', icon: Calendar },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Employee Directory', path: '/profiles', icon: UserPlus },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'applicant': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'My Application', path: '/application', icon: ClipboardCheck },
    { title: 'Screenings', path: '/screenings', icon: FileSearch },
    { title: 'Interviews', path: '/interviews', icon: Calendar },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
};

interface AppSidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
}

const AppSidebar = ({
  isOpen = true,
  onOpenChange,
  isMobile = false
}: AppSidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Update parent component when sidebar is collapsed/expanded
  useEffect(() => {
    if (onOpenChange && !isMobile) {
      onOpenChange(!collapsed);
    }
  }, [collapsed, onOpenChange, isMobile]);

  if (!user) return null;

  const items = menuItems[user.role];

  // Render sidebar content
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        {(!collapsed || isMobile) && (
          <div className="text-sidebar-foreground font-bold text-xl">
            QORE
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 px-2 py-4 overflow-y-auto">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && !isMobile && "justify-center"
              )}
              onClick={() => isMobile && onOpenChange?.(false)}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {(!collapsed || isMobile) && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "flex items-center w-full px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && !isMobile && "justify-center"
          )}
        >
          <LogOut size={20} />
          {(!collapsed || isMobile) && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );

  // Mobile sidebar uses Sheet component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-[280px] bg-sidebar text-sidebar-foreground">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside className={cn(
      "h-screen bg-sidebar fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {renderSidebarContent()}
    </aside>
  );
};

export default AppSidebar;
