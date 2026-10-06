import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoginView } from './auth/LoginView';
import { RegisterView } from './auth/RegisterView';
import { ForgotPasswordModal } from './auth/ForgotPasswordModal';
import { Currency } from '../types';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onNavigateToFullAccount: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currency,
  wishlistCount,
  onOpenWishlist,
  onNavigateToFullAccount,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language } = useLanguage();

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('reset_token') || params.get('code'));
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reset_token') || params.get('code')) {
        setIsForgotModalOpen(true);
      }
    }
  }, []);

  // ESC and body scroll lock
  useOverlayAccessibility({
    isOpen,
    onClose
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Client Account"
    >
      {/* 1. Backdrop (Click outside closes) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Modal Card Container (Clicks inside do not close) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl p-6 sm:p-8 my-auto z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Account Modal (ESC)"
          title="Close (ESC)"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center p-1.5 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-white rounded-xs transition-colors z-20 cursor-pointer active:scale-95"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {!isAuthenticated ? (
          /* Authentication Screen (Login or Register) */
          <div>
            {/* Header Tabs: SIGN IN / REGISTER */}
            <div className="flex border-b border-[#EAE5DE] mb-6">
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className={`flex-1 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer border-b-2 ${
                  authView === 'login'
                    ? 'border-[#1D1D1B] text-[#1D1D1B]'
                    : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthView('register')}
                className={`flex-1 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer border-b-2 ${
                  authView === 'register'
                    ? 'border-[#1D1D1B] text-[#1D1D1B]'
                    : 'border-transparent text-[#7C746B] hover:text-[#1D1D1B]'
                }`}
              >
                Create Account
              </button>
            </div>

            {authView === 'login' ? (
              <LoginView
                onSuccess={() => {
                  onClose();
                }}
                onNavigateToRegister={() => setAuthView('register')}
                onNavigateToForgotPassword={() => setIsForgotModalOpen(true)}
                onContinueAsGuest={() => onClose()}
              />
            ) : (
              <RegisterView
                onSuccess={() => {
                  onClose();
                }}
                onNavigateToLogin={() => setAuthView('login')}
              />
            )}

            <ForgotPasswordModal
              isOpen={isForgotModalOpen}
              onClose={() => setIsForgotModalOpen(false)}
              onNavigateToLogin={() => {
                setIsForgotModalOpen(false);
                setAuthView('login');
              }}
            />
          </div>
        ) : (
          /* Authenticated Client Quick Summary */
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-[#EAE5DE]">
              <User className="w-5 h-5 text-[#1D1D1B] stroke-[1.4]" />
              <h3 className="font-serif text-2xl text-[#1D1D1B] font-light">
                {language === 'ar' ? 'ملف عميلة الدار' : 'Client Profile'}
              </h3>
            </div>

            {/* Member Greeting Banner */}
            <div className="p-5 bg-white border border-[#EAE5DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-serif text-xl text-[#1D1D1B]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#7C746B] font-light mt-0.5 font-mono">
                  {user?.email}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase bg-[#1D1D1B] text-[#FAF8F5] px-3 py-1 font-mono w-fit">
                MEMBER
              </span>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullAccount();
                }}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAE5DE] hover:border-[#BA945A] transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4 text-[#7C746B] group-hover:text-[#BA945A]" />
                  <span className="text-xs uppercase tracking-wider text-[#1D1D1B] font-medium">
                    Order History & Deliveries
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7C746B] group-hover:text-[#BA945A] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAE5DE] hover:border-[#BA945A] transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-[#7C746B] group-hover:text-[#BA945A]" />
                  <span className="text-xs uppercase tracking-wider text-[#1D1D1B] font-medium">
                    Saved Pieces ({wishlistCount})
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7C746B] group-hover:text-[#BA945A] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-[#EAE5DE] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="inline-flex items-center space-x-2 text-xs text-[#964036] hover:text-[#1D1D1B] uppercase tracking-wider font-medium cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullAccount();
                }}
                className="text-xs text-[#7C746B] hover:text-[#1D1D1B] underline underline-offset-4 uppercase tracking-wider cursor-pointer"
              >
                Manage Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
