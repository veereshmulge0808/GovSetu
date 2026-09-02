'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'GOVERNMENT_OFFICER'
  | 'PILOT_MANAGER'
  | 'PROCUREMENT_OFFICER'
  | 'EVALUATOR'
  | 'STARTUP_USER';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        // Also persist tokens in localStorage for the API client interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('govsetu_access_token', accessToken);
          localStorage.setItem('govsetu_refresh_token', refreshToken);
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('govsetu_access_token');
          localStorage.removeItem('govsetu_refresh_token');
          localStorage.removeItem('govsetu_user');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'govsetu_auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Role-based permission helpers
export const canCreateChallenge = (role?: UserRole) =>
  role && ['GOVERNMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(role);

export const canEvaluate = (role?: UserRole) =>
  role && ['EVALUATOR', 'ADMIN', 'SUPER_ADMIN'].includes(role);

export const isAdmin = (role?: UserRole) =>
  role && ['ADMIN', 'SUPER_ADMIN'].includes(role);

export const isGovernmentUser = (role?: UserRole) =>
  role && ['GOVERNMENT_OFFICER', 'PILOT_MANAGER', 'PROCUREMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(role);

export const isStartup = (role?: UserRole) => role === 'STARTUP_USER';

export const isEvaluator = (role?: UserRole) => role === 'EVALUATOR';
