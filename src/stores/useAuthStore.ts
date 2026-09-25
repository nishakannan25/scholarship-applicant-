import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserProfile, token: string) => void;
  updateUser: (partialUser: Partial<UserProfile>) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

// Helper to get initial stored user profile
const getStoredUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem('scholarpath_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  accessToken: storedUser ? 'mock-jwt-token' : null,
  isAuthenticated: !!storedUser,
  isLoading: false,

  login: (user, token) => {
    localStorage.setItem('scholarpath_user', JSON.stringify(user));
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (partialUser) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...partialUser };
      localStorage.setItem('scholarpath_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  logout: () => {
    localStorage.removeItem('scholarpath_user');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  restoreSession: async () => {
    const user = getStoredUser();
    if (user) {
      set({
        user,
        accessToken: 'mock-jwt-token',
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
