import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  FolderKanban,
  ClipboardList,
  Users,
  DollarSign,
  TrendingUp,
  Receipt,
  Tag,
  Truck,
  Coins,
  Package,
  Star,
  Settings,
  Shield,
  History,
  Store,
  ChevronDown,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { LoreaLogo } from '../LoreaLogo';

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'finance_overview'
  | 'finance_transactions'
  | 'finance_discounts'
  | 'finance_shipping_tax'
  | 'finance_currency'
  | 'inventory'
  | 'reviews'
  | 'settings_store'
  | 'settings_admin'
  | 'activity_logs';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onReturnToStore: () => void;
  onLogout: () => void;
  adminName: string;
  adminRole: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  productsCount?: number;
  lowStockCount?: number;
  pendingOrdersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  onReturnToStore,
  onLogout,
  adminName,
  adminRole,
  isMobileOpen,
  onCloseMobile,
  productsCount = 0,
  lowStockCount = 0,
  pendingOrdersCount = 0,
}) => {
  const isFinanceActive = activeSection.startsWith('finance_');
  const isCatalogActive = ['products', 'categories', 'collections'].includes(activeSection);
  const isSettingsActive = ['settings_store', 'settings_admin', 'activity_logs'].includes(activeSection);

  const handleNav = (sec: AdminSection) => {
    onSelectSection(sec);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#151413] text-[#FAF8F5] border-r border-[#2A2826] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2A2826] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LoreaLogo variant="dark" size="sm" />
          <span className="text-[10px] tracking-[0.24em] uppercase font-mono text-[#BA945A] font-medium border-l border-[#333] pl-2.5">
            ATELIER OPS
          </span>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-[#7C746B] hover:text-white p-1"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 text-xs">
        {/* 1. OVERVIEW */}
        <div>
          <span className="px-3 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7C746B] block mb-1.5 font-semibold">
            OVERVIEW
          </span>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-[#BA945A] text-white font-medium'
                : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Executive Dashboard</span>
          </button>
        </div>

        {/* 2. CATALOG */}
        <div>
          <span className="px-3 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7C746B] block mb-1.5 font-semibold">
            CATALOG & COMMERCE
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'products'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Products Catalog</span>
              </div>
              {productsCount > 0 && (
                <span className="text-[10px] bg-[#2A2826] text-[#FAF8F5] px-1.5 py-0.5 rounded-xs font-mono">
                  {productsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('categories')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'categories'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('collections')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'collections'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              <span>Featured Collections</span>
            </button>
          </div>
        </div>

        {/* 3. ORDERS & FULFILLMENT */}
        <div>
          <span className="px-3 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7C746B] block mb-1.5 font-semibold">
            ORDERS & CLIENTS
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'orders'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Customer Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-xs font-mono font-medium">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('customers')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'customers'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Clients & Profiles</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'inventory'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>Stock & Inventory</span>
              </div>
              {lowStockCount > 0 && (
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded-xs font-mono">
                  {lowStockCount} low
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('reviews')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'reviews'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 shrink-0" />
              <span>Reviews Moderation</span>
            </button>
          </div>
        </div>

        {/* 4. FINANCIAL ENGINE */}
        <div>
          <span className="px-3 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7C746B] block mb-1.5 font-semibold">
            FINANCIAL SYSTEM
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('finance_overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'finance_overview'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0 text-[#BA945A]" />
              <span>Financial Overview</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('finance_transactions')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'finance_transactions'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <span>Ledger Transactions</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('finance_discounts')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'finance_discounts'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              <span>Discounts & Promo Codes</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('finance_shipping_tax')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'finance_shipping_tax'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Tax & Shipping Settings</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('finance_currency')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'finance_currency'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span>Currencies (EGP/USD/EUR)</span>
            </button>
          </div>
        </div>

        {/* 5. SETTINGS & LOGS */}
        <div>
          <span className="px-3 text-[10px] uppercase font-mono tracking-[0.2em] text-[#7C746B] block mb-1.5 font-semibold">
            SETTINGS & AUDIT
          </span>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNav('settings_store')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'settings_store'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Store Configuration</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('settings_admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'settings_admin'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Staff & Roles (RBAC)</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('activity_logs')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xs transition-colors cursor-pointer ${
                activeSection === 'activity_logs'
                  ? 'bg-[#BA945A] text-white font-medium'
                  : 'text-[#B7ADA2] hover:bg-[#222] hover:text-white'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Audit Activity Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Profile & Store Return */}
      <div className="p-4 border-t border-[#2A2826] bg-[#100F0E] space-y-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-medium text-white truncate">{adminName}</p>
            <p className="text-[10px] text-[#BA945A] font-mono tracking-wider uppercase truncate">{adminRole}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out of Admin"
            className="p-1.5 text-[#7C746B] hover:text-red-400 hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onReturnToStore}
          className="w-full py-2 px-3 bg-[#1D1D1B] hover:bg-[#BA945A] text-white text-[11px] uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer rounded-xs"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Return to Boutique</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
