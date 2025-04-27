
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
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
  Upload
} from 'lucide-react';

// Define menu items per role
const menuItems: Record<UserRole, { title: string; path: string; icon: React.ElementType }[]> = {
  'company-admin': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Profiles', path: '/profiles', icon: UserPlus },
    { title: 'Job Descriptions', path: '/job-descriptions', icon: FileText },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Candidates', path: '/candidates', icon: ClipboardCheck },
    { title: 'Budget', path: '/budget', icon: DollarSign },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'hiring-manager': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Teams', path: '/teams', icon: Users },
    { title: 'Profiles', path: '/profiles', icon: UserPlus },
    { title: 'Job Descriptions', path: '/job-descriptions', icon: FileText },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Budget', path: '/budget', icon: DollarSign },
    { title: 'Reports', path: '/reports', icon: PieChart },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'talent-scout': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Job Descriptions', path: '/job-descriptions', icon: FileText },
    { title: 'Resume Upload', path: '/resume-upload', icon: Upload },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Screenings', path: '/screenings', icon: FileSearch },
    { title: 'Feedback', path: '/feedback', icon: MessageSquare },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  'team-member': [
    { title: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { title: 'Interviews', path: '/interviews', icon: Calendar },
    { title: 'Candidates', path: '/candidates', icon: Users },
    { title: 'Feedback', path: '/feedback', icon: MessageSquare },
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

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const items = menuItems[user.role];

  return (
    <aside className={cn(
      "h-screen bg-sidebar fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <div className="text-sidebar-foreground font-bold text-xl">
              TalentSpark
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent"
          >
            <Menu size={20} />
          </button>
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
                  collapsed && "justify-center"
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
