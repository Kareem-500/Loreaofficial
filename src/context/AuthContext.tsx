import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, User, setStoredToken, isApiConfigured } from '../services/api';
import { supabase, isSupabaseConfigured, SupabaseProfile } from '../lib/supabase';
import { supabaseAuthService } from '../services/supabaseService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (formData: any) => Promise<{ verificationToken?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; previewResetToken?: string }>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string; verified: boolean }>;
  resendVerification: (email?: string) => Promise<{ message: string; previewToken?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert a Supabase Profile to the app's User interface
function mapSupabaseProfileToUser(profile: SupabaseProfile): User {
  const parts = (profile.full_name || '').split(' ');
  const firstName = parts[0] || 'Client';
  const lastName = parts.slice(1).join(' ') || '';

  return {
    id: profile.id,
    uuid: profile.id,
    email: profile.email,
    role: profile.role,
    firstName,
    lastName,
    phone: profile.phone || '',
    emailVerified: true,
    country: 'Egypt',
    createdAt: profile.created_at,
    permissions: profile.role === 'admin' ? ['admin_users.manage', 'products.edit', 'orders.edit'] : [],
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseConnected = isSupabaseConfigured();

  const refreshUser = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        const profile = await supabaseAuthService.getCurrentProfile();
        if (profile) {
          setUser(mapSupabaseProfileToUser(profile));
          setIsLoading(false);
          return;
        }
      }

      // Fallback or local dev session
      if (isApiConfigured) {
        const res = await api.auth.me();
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // If Supabase is configured, subscribe to Supabase Auth state changes
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await supabaseAuthService.getCurrentProfile();
          if (profile) {
            setUser(mapSupabaseProfileToUser(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe = false) => {
    if (isSupabaseConfigured()) {
      const data = await supabaseAuthService.signIn(email, password);
      if (data.user) {
        const profile = await supabaseAuthService.getCurrentProfile();
        if (profile) {
          setUser(mapSupabaseProfileToUser(profile));
          return;
        }
      }
    }

    const res = await api.auth.login(email, password, rememberMe);
    if (res.token) {
      setStoredToken(res.token);
    }
    setUser(res.user);
  };

  const register = async (formData: any) => {
    if (isSupabaseConfigured()) {
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.email;
      const data = await supabaseAuthService.signUp(formData.email, formData.password, fullName, formData.phone);
      if (data.user) {
        const profile = await supabaseAuthService.getCurrentProfile();
        if (profile) {
          setUser(mapSupabaseProfileToUser(profile));
        }
      }
      return {};
    }

    const res = await api.auth.register(formData);
    if (res.token) {
      setStoredToken(res.token);
    }
    setUser(res.user);
    return { verificationToken: res.verificationToken };
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabaseAuthService.signOut();
      }
      await api.auth.logout();
    } catch (e) {
      // ignore
    }
    setStoredToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    if (isSupabaseConfigured()) {
      await supabaseAuthService.resetPasswordForEmail(email);
      return { message: 'Password recovery email sent via Supabase Auth.' };
    }
    return await api.auth.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    if (isSupabaseConfigured()) {
      await supabaseAuthService.updatePassword(newPassword);
      return { message: 'Password successfully updated via Supabase Auth.' };
    }
    return await api.auth.resetPassword(token, newPassword, confirmPassword);
  };

  const verifyEmail = async (token: string) => {
    const res = await api.auth.verifyEmail(token);
    await refreshUser();
    return res;
  };

  const resendVerification = async (email?: string) => {
    return await api.auth.resendVerification(email);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(
    user && ['admin', 'super_admin', 'manager', 'support'].includes(user.role)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSupabaseConnected,
        login,
        register,
        logout,
        refreshUser,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
