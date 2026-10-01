import React from 'react';
import { Menu, Search, Store, RefreshCw, Bell, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onReturnToStore: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  title: string;
  subtitle?: string;
  adminName: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  onReturnToStore,
  onRefresh,
  isLoading,
  searchQuery,
  onSearchChange,
  title,
  subtitle,
  adminName,
}) => {
  return (
    <header className="bg-[#151413] text-[#FAF8F5] border-b border-[#2A2826] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & Section Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-[#FAF8F5] hover:bg-[#222] rounded-xs cursor-pointer -ml-2"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-lg sm:text-xl font-light text-white tracking-wide leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-[11px] text-[#7C746B] font-light mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center/Right: Global Search & Quick Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search Input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#7C746B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records, SKU, client..."
            className="w-full bg-[#1D1D1B] border border-[#333] text-white text-xs pl-8 pr-3 py-1.5 focus:outline-hidden focus:border-[#BA945A] placeholder-[#7C746B]"
          />
        </div>

        {/* Live Sync / Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh Data"
          className="p-2 text-[#B7ADA2] hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#BA945A]' : ''}`} />
        </button>

        {/* Security badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-[#222] border border-[#333] text-[10px] font-mono uppercase tracking-wider text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE OPS</span>
        </div>

        {/* Return to Boutique shortcut */}
        <button
          type="button"
          onClick={onReturnToStore}
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#BA945A] hover:bg-[#A68A5C] text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer rounded-xs"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Boutique</span>
        </button>
      </div>
    </header>
  );
};
