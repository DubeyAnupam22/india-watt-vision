
import { toast } from "@/components/ui/use-toast";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User roles
export type UserRole = 'admin' | 'researcher' | 'public';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock user data - in a real app, this would be authenticated against a backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@waste2watt.in',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Research Analyst',
    email: 'researcher@waste2watt.in',
    role: 'researcher'
  },
  {
    id: '3',
    name: 'Public Viewer',
    email: 'viewer@waste2watt.in',
    role: 'public'
  }
];

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  canUploadData: () => boolean;
  canEditData: () => boolean;
  canViewReports: () => boolean;
  canGenerateReports: () => boolean;
}

// Create auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // In a real app, this would call an API
        const foundUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (foundUser && password === 'password') { // Simple mock password check
          set({ user: foundUser, isAuthenticated: true });
          toast({
            title: "Login successful",
            description: `Welcome back, ${foundUser.name}!`,
          });
          return true;
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
      },
      
      canUploadData: () => {
        const user = get().user;
        return user?.role === 'admin' || user?.role === 'researcher';
      },
      
      canEditData: () => {
        const user = get().user;
        return user?.role === 'admin';
      },
      
      canViewReports: () => {
        return get().isAuthenticated;
      },
      
      canGenerateReports: () => {
        const user = get().user;
        return user?.role === 'admin' || user?.role === 'researcher';
      }
    }),
    {
      name: 'waste2watt-auth',
    }
  )
);
