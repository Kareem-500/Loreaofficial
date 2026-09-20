import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Currency } from '../../types';

interface TopAnnouncementBarProps {
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  isAuthenticated: boolean;
  userName?: string;
  onOpenAccount: () => void;
}

const ANNOUNCEMENTS = [
  "DISCOVER YOUR STYLE · LOREA WOMEN'S FASHION",
  "NEW SEASON · NEW STORIES",
  "EFFORTLESS STYLE · TIMELESS ELEGANCE",
  "DISCOVER THE NEW LOREA COLLECTION",
  "NEW ARRIVALS · NOW AT LOREA"
];

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  isAuthenticated,
  userName,
  onOpenAccount
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsFading(false);
      }, 400);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#151413] text-[#F7F4EF] text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase py-2 px-4 border-b border-[#2A2826] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative min-h-[22px]">
        {/* Left spacer for optical desktop balance */}
        <div className="hidden lg:block w-36" aria-hidden="true" />

        {/* Center: Subtle animated luxury announcement */}
        <div className="w-full lg:w-auto text-center flex-1 overflow-hidden px-2">
          <p
            className={`transition-all duration-400 ease-in-out font-light text-[#F7F4EF]/95 truncate ${
              isFading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {ANNOUNCEMENTS[currentIndex]}
          </p>
        </div>

        {/* Right: Currency / Language / Quick Account */}
        <div className="hidden lg:flex items-center justify-end space-x-3 text-[#B7ADA2] w-48 text-[10.5px]">
          {/* Language Switcher */}
          <button
            id="language-toggle-btn"
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="hover:text-[#BA945A] transition-colors flex items-center space-x-1 cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3 h-3 text-[#BA945A]" />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          <span className="text-[#4A453F]">·</span>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              id="currency-toggle-btn"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="hover:text-[#BA945A] transition-colors flex items-center space-x-0.5 cursor-pointer"
              aria-label="Select currency"
            >
              <span>{currency}</span>
              <span className="text-[8px] ml-0.5">▾</span>
            </button>
            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-20 bg-[#1D1D1B] border border-[#333] shadow-lg py-1 z-50 rounded-xs">
                {(['EGP', 'USD', 'EUR', 'AED'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onCurrencyChange(c);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1 hover:bg-[#2A2928] cursor-pointer ${
                      currency === c ? 'text-[#BA945A] font-bold' : 'text-[#F7F4EF]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#4A453F]">·</span>

          {/* Account status */}
          <button
            id="header-topbar-account-btn"
            onClick={onOpenAccount}
            className="hover:text-[#BA945A] transition-colors cursor-pointer truncate max-w-[80px]"
          >
            {isAuthenticated ? `${userName}` : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
