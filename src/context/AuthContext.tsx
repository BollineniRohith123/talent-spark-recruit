
import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ceo' | 'branch-manager' | 'marketing-head' | 'marketing-supervisor' | 'marketing-recruiter' | 'marketing-associate' | 'applicant';

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
  'ceo': {
    id: '1',
    name: 'Alex Johnson',
    email: 'ceo@talentspark.com',
    role: 'ceo',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'branch-manager': {
    id: '2',
    name: 'Morgan Smith',
    email: 'manager@talentspark.com',
    role: 'branch-manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'marketing-head': {
    id: '3',
    name: 'Taylor Reed',
    email: 'marketing-head@talentspark.com',
    role: 'marketing-head',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'marketing-supervisor': {
    id: '4',
    name: 'Jordan Lee',
    email: 'marketing-supervisor@talentspark.com',
    role: 'marketing-supervisor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'marketing-recruiter': {
    id: '5',
    name: 'Jamie Garcia',
    email: 'recruiter@talentspark.com',
    role: 'marketing-recruiter',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'marketing-associate': {
    id: '6',
    name: 'Robin Taylor',
    email: 'associate@talentspark.com',
    role: 'marketing-associate',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'applicant': {
    id: '7',
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
    if (email.includes('ceo')) {
      setUser(demoUsers['ceo']);
    } else if (email.includes('branch-manager')) {
      setUser(demoUsers['branch-manager']);
    } else if (email.includes('marketing-head')) {
      setUser(demoUsers['marketing-head']);
    } else if (email.includes('marketing-supervisor')) {
      setUser(demoUsers['marketing-supervisor']);
    } else if (email.includes('recruiter')) {
      setUser(demoUsers['marketing-recruiter']);
    } else if (email.includes('associate')) {
      setUser(demoUsers['marketing-associate']);
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
