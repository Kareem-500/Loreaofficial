import React, { useState } from 'react';
import { X, User, Package, MapPin, Heart, Shield, LogOut, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoginView } from './auth/LoginView';
import { RegisterView } from './auth/RegisterView';
import { ForgotPasswordModal } from './auth/ForgotPasswordModal';
import { Currency } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onNavigateToFullAccount: () => void;
  onNavigateToAdmin: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currency,
  wishlistCount,
  onOpenWishlist,
  onNavigateToFullAccount,
  onNavigateToAdmin,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language } = useLanguage();

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#F7F4EF] border border-[#EAE5DE] shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          aria-label="Close Account Modal"
          className="absolute top-4 right-4 p-1.5 text-[#1D1D1B] hover:text-[#B88F88] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Authentication Screen (Login or Register) */
          <div>
            {authView === 'login' ? (
              <LoginView
                onSuccess={() => {
                  onClose();
                  onNavigateToFullAccount();
                }}
                onNavigateToRegister={() => setAuthView('register')}
                onNavigateToForgotPassword={() => setIsForgotModalOpen(true)}
                onContinueAsGuest={() => onClose()}
              />
            ) : (
              <RegisterView
                onSuccess={() => {
                  onClose();
                  onNavigateToFullAccount();
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
              <User className="w-5 h-5 text-[#1D1D1B] stroke-[1.5]" />
              <h3 className="font-serif text-2xl text-[#1D1D1B] font-light">
                {language === 'ar' ? 'ملف عميلة الدار' : 'Client Atelier Profile'}
              </h3>
            </div>

            {/* Member Greeting Banner */}
            <div className="p-5 bg-[#FAF8F5] border border-[#EAE5DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-serif text-xl text-[#1D1D1B]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#7C746B] font-light mt-0.5">
                  {user?.email} · {language === 'ar' ? 'عضوية دار لوريا' : 'Atelier Privé Member'}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase bg-[#1D1D1B] text-[#F7F4EF] px-3 py-1 font-medium w-fit">
                {user?.role === 'admin' || user?.role === 'super_admin' ? 'MAISON ADMIN' : 'VIP CLIENT'}
              </span>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullAccount();
                }}
                className="p-4 bg-white border border-[#EAE5DE] hover:border-[#1D1D1B] text-left transition-colors group flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold uppercase tracking-wider block text-[#1D1D1B]">
                    {language === 'ar' ? 'مركز الحساب الكامل' : 'Account Dashboard'}
                  </span>
                  <span className="text-[#7C746B] text-[11px] block mt-0.5">
                    {language === 'ar' ? 'الطلبات، العناوين، الأمان' : 'Orders, addresses & security'}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#7C746B] group-hover:text-[#1D1D1B]" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="p-4 bg-white border border-[#EAE5DE] hover:border-[#1D1D1B] text-left transition-colors group flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold uppercase tracking-wider block text-[#1D1D1B]">
                    {language === 'ar' ? 'قائمة الأمنيات' : 'Saved Wishlist'}
                  </span>
                  <span className="text-[#7C746B] text-[11px] block mt-0.5">
                    {wishlistCount} {language === 'ar' ? 'قطع محفوظة' : 'pieces saved'}
                  </span>
                </div>
                <Heart className="w-4 h-4 text-[#B88F88]" />
              </button>
            </div>

            {/* Admin shortcut if user is admin */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <div className="p-4 bg-[#151413] text-[#F7F4EF] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#B88F88]" />
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B88F88] block">
                      OPERATIONS PORTAL
                    </span>
                    <p className="text-xs font-medium">Access LORÉA Admin Control Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAdmin();
                  }}
                  className="px-3 py-1.5 bg-[#F7F4EF] text-[#1D1D1B] text-xs uppercase tracking-wider font-semibold hover:bg-white"
                >
                  Enter Admin →
                </button>
              </div>
            )}

            {/* Logout button */}
            <div className="pt-4 border-t border-[#EAE5DE] flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullAccount();
                }}
                className="text-[#1D1D1B] underline hover:text-[#B88F88]"
              >
                {language === 'ar' ? 'تعديل البيانات والعناوين' : 'Edit profile & shipping addresses'}
              </button>

              <button
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="text-[#964036] hover:underline flex items-center space-x-1 uppercase tracking-wider font-medium"
              >
                <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
