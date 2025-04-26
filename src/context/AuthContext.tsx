
import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'company-admin' | 'hiring-manager' | 'talent-scout' | 'team-member' | 'applicant';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  'company-admin': {
    id: '1',
    name: 'Alex Johnson',
    email: 'admin@recruitai.com',
    role: 'company-admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'hiring-manager': {
    id: '2',
    name: 'Morgan Smith',
    email: 'manager@recruitai.com',
    role: 'hiring-manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'talent-scout': {
    id: '3',
    name: 'Jamie Garcia',
    email: 'scout@recruitai.com',
    role: 'talent-scout',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'team-member': {
    id: '4',
    name: 'Robin Taylor',
    email: 'member@recruitai.com',
    role: 'team-member',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'applicant': {
    id: '5',
    name: 'Casey Wilson',
    email: 'applicant@example.com',
    role: 'applicant',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // For demo purposes only
  const login = async (email: string, password: string) => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple email-based role assignment for demo
    if (email.includes('admin')) {
      setUser(demoUsers['company-admin']);
    } else if (email.includes('manager')) {
      setUser(demoUsers['hiring-manager']);
    } else if (email.includes('scout')) {
      setUser(demoUsers['talent-scout']);
    } else if (email.includes('member')) {
      setUser(demoUsers['team-member']);
    } else {
      setUser(demoUsers['applicant']);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // For demo purposes - allows switching roles
  const setRole = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
