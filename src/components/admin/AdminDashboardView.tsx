import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Layers,
  Archive,
  Tag,
  Ticket,
  MessageSquare,
  ShieldCheck,
  History,
  Settings as SettingsIcon,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  DollarSign,
  Package,
  Eye,
  LogOut,
  RefreshCw,
  Store,
  Database,
  Server,
  Key,
  Check,
  Copy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { LoreaLogo } from '../LoreaLogo';
import { formatPrice } from '../../utils/currency';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminDashboardViewProps {
  onReturnToStore: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onReturnToStore }) => {
  const { user, login, logout } = useAuth();
  const { language } = useLanguage();

  const [adminEmail, setAdminEmail] = useState('admin@lorea.com');
  const [adminPassword, setAdminPassword] = useState('Admin@Lorea2025!');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<
    | 'dashboard'
    | 'customers'
    | 'orders'
    | 'products'
    | 'inventory'
    | 'categories'
    | 'coupons'
    | 'reviews'
    | 'admin_users'
    | 'activity_logs'
    | 'settings'
  >('dashboard');

  // Core Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Inspection & modal states
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [adjustingVariant, setAdjustingVariant] = useState<any>(null);
  const [stockChangeDelta, setStockChangeDelta] = useState<number>(0);
  const [stockAdjustReason, setStockAdjustReason] = useState<string>('Restock delivery from Cairo atelier');

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New product form
  const [productForm, setProductForm] = useState({
    name: '',
    nameAr: '',
    subtitle: '',
    description: '',
    categoryId: 'cat_dresses',
    sku: '',
    priceEgp: 3200,
    priceUsd: 65,
    badge: 'NEW',
    fabric: '100% Certified Egyptian Giza 45 Cotton',
    isModestEdit: false,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    variants: [
      { size: 'S', colorName: 'Chalk White', stock: 12 },
      { size: 'M', colorName: 'Chalk White', stock: 15 },
      { size: 'L', colorName: 'Chalk White', stock: 10 },
    ],
  });

  const notify = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadCurrentSectionData = async () => {
    try {
      setIsLoading(true);
      if (activeSection === 'dashboard') {
        const res = await api.admin.getDashboard();
        setDashboardData(res);
      } else if (activeSection === 'customers') {
        const res = await api.admin.getCustomers({ search: searchQuery, status: statusFilter });
        setCustomers(res.customers || []);
      } else if (activeSection === 'orders') {
        const res = await api.admin.getOrders({ search: searchQuery, status: statusFilter });
        setOrders(res.orders || []);
      } else if (activeSection === 'products') {
        const res = await api.admin.getProducts({ search: searchQuery });
        setProducts(res.products || []);
      } else if (activeSection === 'inventory') {
        const res = await api.admin.getInventory();
        setInventory(res.inventory || []);
        setInventoryHistory(res.history || []);
      } else if (activeSection === 'categories') {
        const res = await api.admin.getCategories();
        setCategories(res.categories || []);
      } else if (activeSection === 'coupons') {
        const res = await api.admin.getCoupons();
        setCoupons(res.coupons || []);
      } else if (activeSection === 'reviews') {
        const res = await api.admin.getReviews();
        setReviews(res.reviews || []);
      } else if (activeSection === 'admin_users') {
        const res = await api.admin.getAdminUsers();
        setAdminUsers(res.adminUsers || []);
      } else if (activeSection === 'activity_logs') {
        const res = await api.admin.getActivityLogs();
        setActivityLogs(res.logs || []);
      } else if (activeSection === 'settings') {
        const res = await api.admin.getSettings();
        setSettings(res.settings || {});
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentSectionData();
  }, [activeSection]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { status: newStatus });
      notify('success', `Order ${orderId} updated to ${newStatus}`);
      loadCurrentSectionData();
      if (selectedOrder) {
        const updated = await api.admin.getOrderDetails(orderId);
        setSelectedOrder(updated.order);
      }
    } catch (err: any) {
      notify('error', err.message || 'Failed to update order status');
    }
  };

  // Customer status update
  const handleToggleCustomerStatus = async (customerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      await api.admin.updateCustomerStatus(customerId, nextStatus as any);
      notify('success', `Customer status set to ${nextStatus}`);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to update customer status');
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createProduct(productForm);
      notify('success', 'Product created and inventory seeded successfully.');
      setIsNewProductModalOpen(false);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to create product');
    }
  };

  // Stock Adjustment handler
  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingVariant) return;
    try {
      await api.admin.adjustInventory({
        variantId: adjustingVariant.variant_id || adjustingVariant.id,
        quantityChange: Number(stockChangeDelta),
        reason: stockAdjustReason,
      });
      notify('success', `Stock adjusted for SKU ${adjustingVariant.sku}`);
      setIsStockAdjustModalOpen(false);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to adjust stock');
    }
  };

  // If user is not an authenticated Admin, present the Admin Security Gateway
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminLoginError(null);
      try {
        setAdminLoginLoading(true);
        await login(adminEmail.trim(), adminPassword, true);
        await loadCurrentSectionData();
      } catch (err: any) {
        setAdminLoginError(err.message || 'Admin authentication failed');
      } finally {
        setAdminLoginLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#151413] text-[#F7F4EF] flex flex-col justify-between p-6 sm:p-12">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <LoreaLogo variant="dark" />
          <button
            onClick={onReturnToStore}
            className="text-xs uppercase tracking-widest text-[#B7ADA2] hover:text-white flex items-center space-x-1.5"
          >
            <Store className="w-4 h-4" />
            <span>Return to Boutique</span>
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-12 bg-[#1F1E1D] border border-[#333] p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#2A2826] border border-[#444] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-[#B88F88]" />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B88F88] font-medium block">
              OPERATIONS GATEWAY
            </span>
            <h2 className="font-serif text-2xl text-[#F7F4EF] font-light mt-1">
              Admin Access Verification
            </h2>
            <p className="text-xs text-[#B7ADA2] mt-1 font-light">
              Restricted to authorized atelier managers and system administrators.
            </p>
          </div>

          {/* 1-Click Quick Fill Helper */}
          <div className="mb-5 p-3 bg-[#2A2826] border border-[#444] text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-semibold text-[#B7ADA2] tracking-wider">
                Default Master Admin
              </span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@lorea.com');
                  setAdminPassword('Admin@Lorea2025!');
                }}
                className="text-[10px] uppercase underline text-[#B88F88] font-bold"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-[11px] font-mono text-[#D4CCC2]">admin@lorea.com · Admin@Lorea2025!</p>
          </div>

          {adminLoginError && (
            <div className="mb-4 p-3 bg-[#964036]/20 border border-[#964036] text-[#F7F4EF] text-xs">
              {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#B7ADA2] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full bg-[#151413] border border-[#444] text-[#F7F4EF] py-2.5 px-3 focus:border-[#B88F88] focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#B7ADA2] mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="w-full bg-[#151413] border border-[#444] text-[#F7F4EF] py-2.5 px-3 focus:border-[#B88F88] focus:outline-none font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full bg-[#B88F88] hover:bg-[#A37B74] text-[#1D1D1B] py-3 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>{adminLoginLoading ? 'Verifying...' : 'Authorize & Enter Dashboard'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-[#7C746B] max-w-sm mx-auto">
          LORÉA Maison Haute Couture Systems · Protected by Argon2 / Bcrypt & Dual-Token Architecture.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1D1D1B] flex flex-col font-sans">
      {/* 1. Admin Top Bar */}
      <header className="bg-[#151413] text-[#F7F4EF] border-b border-[#2A2826] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <LoreaLogo variant="dark" className="scale-90" />
          <div className="hidden sm:flex items-center space-x-2 pl-4 border-l border-[#333]">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B88F88]">
              CONTROL PANEL
            </span>
            <span className="text-xs text-[#7C746B]">·</span>
            <span className="text-xs text-[#B7ADA2]">Cairo Atelier Operations</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 text-[11px] px-3 py-1.5 border border-[#333] bg-[#222120]">
            <Database className="w-3.5 h-3.5 text-[#B88F88]" />
            <span className="text-[#B7ADA2]">Supabase:</span>
            {isSupabaseConfigured() ? (
              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>PostgreSQL Active (RLS)</span>
              </span>
            ) : (
              <button
                onClick={() => setActiveSection('settings')}
                className="text-[#D4CCC2] hover:text-white underline"
              >
                Schema Ready (.env setup)
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs text-[#B7ADA2] bg-[#222120] px-3 py-1.5 border border-[#333]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {user?.firstName} ({user?.role?.toUpperCase()})
            </span>
          </div>

          <button
            onClick={onReturnToStore}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F4EF] text-[#1D1D1B] hover:bg-white text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </button>

          <button
            onClick={() => logout()}
            className="p-1.5 text-[#B7ADA2] hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </header>

      {/* Floating feedback alert */}
      {feedback && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 text-xs font-medium shadow-xl transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
              : 'bg-[#964036] text-white'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* 2. Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#FAF8F5] border-r border-[#EAE5DE] flex flex-col shrink-0 p-4 space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#7C746B] font-semibold px-3 py-2">
            MAIN ATELIER
          </span>

          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Client Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customer Directory', icon: Users },
            { id: 'products', label: 'Product Catalog', icon: Layers },
            { id: 'inventory', label: 'Inventory & Stock', icon: Archive },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as any);
                  setSelectedOrder(null);
                  setSelectedCustomer(null);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-left transition-colors ${
                  isActive
                    ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                    : 'text-[#1D1D1B] hover:bg-[#EAE5DE]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B88F88]' : 'text-[#7C746B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <span className="text-[10px] uppercase tracking-[0.25em] text-[#7C746B] font-semibold px-3 pt-4 pb-2">
            MANAGEMENT & AUDIT
          </span>

          {[
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'coupons', label: 'Privilege Coupons', icon: Ticket },
            { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
            { id: 'admin_users', label: 'Admins & RBAC', icon: ShieldCheck },
            { id: 'activity_logs', label: 'Audit Activity Logs', icon: History },
            { id: 'settings', label: 'Atelier Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as any);
                  setSelectedOrder(null);
                  setSelectedCustomer(null);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-left transition-colors ${
                  isActive
                    ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                    : 'text-[#1D1D1B] hover:bg-[#EAE5DE]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B88F88]' : 'text-[#7C746B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* SECTION: DASHBOARD */}
          {activeSection === 'dashboard' && dashboardData && (
            <div className="space-y-8">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#7C746B] font-medium block">
                  COMMERCIAL PERFORMANCE
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1D1D1B] mt-1">
                  Atelier Executive Overview
                </h2>
              </div>

              {/* Top KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EAE5DE] p-5 shadow-xs">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                    TOTAL NET REVENUE
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-2">
                    {dashboardData.stats.totalSales.toLocaleString()} EGP
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-emerald-700 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.5% vs previous quarter</span>
                  </div>
                </div>

                <div className="bg-white border border-[#EAE5DE] p-5 shadow-xs">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                    TOTAL ORDERS
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-2">
                    {dashboardData.stats.totalOrders}
                  </div>
                  <p className="text-[11px] text-[#7C746B] mt-2 font-light">
                    {dashboardData.stats.completedOrders} delivered · {dashboardData.stats.pendingOrders} pending
                  </p>
                </div>

                <div className="bg-white border border-[#EAE5DE] p-5 shadow-xs">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                    CLIENT ACCOUNTS
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-2">
                    {dashboardData.stats.totalCustomers}
                  </div>
                  <p className="text-[11px] text-[#7C746B] mt-2 font-light">
                    {dashboardData.stats.verifiedCustomers} verified Egyptian clients
                  </p>
                </div>

                <div className="bg-white border border-[#EAE5DE] p-5 shadow-xs">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                    LOW STOCK ALERT
                  </span>
                  <div className="font-serif text-3xl text-[#964036] mt-2">
                    {dashboardData.stats.lowStockCount}
                  </div>
                  <p className="text-[11px] text-[#7C746B] mt-2 font-light">
                    {dashboardData.stats.outOfStockCount} SKUs currently depleted
                  </p>
                </div>
              </div>

              {/* Monthly Revenue Chart Simulator */}
              <div className="bg-white border border-[#EAE5DE] p-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
                  <div>
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Revenue Growth (Cairo Atelier)</h3>
                    <p className="text-xs text-[#7C746B]">Monthly gross transactions in Egyptian Pounds (EGP)</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1D1D1B]">EGP</span>
                </div>

                <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6">
                  {dashboardData.charts.revenueTimeline.map((item: any) => {
                    const maxVal = 420000;
                    const heightPercent = Math.min(100, Math.round((item.revenue / maxVal) * 100));
                    return (
                      <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#7C746B] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(item.revenue / 1000)}k
                        </span>
                        <div
                          className="w-full bg-[#1D1D1B] hover:bg-[#B88F88] transition-all"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] uppercase text-[#7C746B] mt-2 text-center">
                          {item.month.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Orders & Low Stock Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white border border-[#EAE5DE] p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Recent Client Orders</h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs uppercase tracking-wider underline text-[#1D1D1B]"
                    >
                      View all orders
                    </button>
                  </div>
                  <div className="divide-y divide-[#EAE5DE]">
                    {(dashboardData.recentOrders || []).map((o: any) => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-semibold text-[#1D1D1B]">{o.order_number}</p>
                          <p className="text-[11px] text-[#7C746B]">
                            {o.customer_name} · {new Date(o.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif font-medium">{o.total.toLocaleString()} EGP</p>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EAE5DE]">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white border border-[#EAE5DE] p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Low Stock Warnings</h3>
                    <button
                      onClick={() => setActiveSection('inventory')}
                      className="text-xs uppercase tracking-wider underline text-[#1D1D1B]"
                    >
                      Manage stock
                    </button>
                  </div>
                  <div className="divide-y divide-[#EAE5DE]">
                    {(dashboardData.lowStockAlerts || []).map((v: any) => (
                      <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-[#1D1D1B]">{v.product_name}</p>
                          <p className="text-[11px] text-[#7C746B]">
                            SKU: {v.sku} · Size: {v.size} ({v.color_name})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-[#964036]/10 text-[#964036] font-semibold text-xs">
                            {v.stock} remaining
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ORDERS */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Order Processing</h2>
                  <p className="text-xs text-[#7C746B]">Manage Egyptian orders, fulfillments, and status updates.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type="text"
                      placeholder="Search order # or client..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadCurrentSectionData()}
                      className="bg-white border border-[#EAE5DE] text-xs py-2 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B] focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Table */}
              <div className="bg-white border border-[#EAE5DE] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total (EGP)</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-mono font-medium text-[#1D1D1B]">{order.order_number}</td>
                        <td className="p-4">
                          <p className="font-medium text-[#1D1D1B]">{order.customer_name}</p>
                          <p className="text-[11px] text-[#7C746B]">{order.customer_email}</p>
                        </td>
                        <td className="p-4 text-[#7C746B]">{order.items_count} pieces</td>
                        <td className="p-4 font-serif font-medium">{order.total.toLocaleString()} EGP</td>
                        <td className="p-4">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-gray-100 text-gray-800">
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#FAF8F5] border border-[#EAE5DE] text-[11px] py-1 px-2 uppercase font-medium cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              const res = await api.admin.getOrderDetails(order.id);
                              setSelectedOrder(res.order);
                            }}
                            className="px-3 py-1.5 border border-[#1D1D1B] text-[10px] uppercase tracking-wider hover:bg-[#1D1D1B] hover:text-[#F7F4EF]"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: CUSTOMERS */}
          {activeSection === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Customer Directory</h2>
                  <p className="text-xs text-[#7C746B]">Search and manage VIP clients and atelier profiles.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadCurrentSectionData()}
                      className="bg-white border border-[#EAE5DE] text-xs py-2 pl-9 pr-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B] focus:outline-none"
                  >
                    <option value="all">All Accounts</option>
                    <option value="active">Active Only</option>
                    <option value="disabled">Disabled Only</option>
                  </select>
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white border border-[#EAE5DE] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Orders</th>
                      <th className="p-4">Total Spent</th>
                      <th className="p-4">Verified</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-medium text-[#1D1D1B]">
                          {c.first_name} {c.last_name}
                        </td>
                        <td className="p-4">
                          <p>{c.email}</p>
                          <p className="text-[11px] text-[#7C746B] font-mono">{c.phone || 'No phone'}</p>
                        </td>
                        <td className="p-4 text-[#7C746B]">{c.city || 'Cairo'}, Egypt</td>
                        <td className="p-4 font-mono">{c.orders_count}</td>
                        <td className="p-4 font-serif font-medium">{c.total_spent.toLocaleString()} EGP</td>
                        <td className="p-4">
                          {c.email_verified ? (
                            <span className="text-emerald-700 font-medium">✓ Verified</span>
                          ) : (
                            <span className="text-[#7C746B]">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-medium ${
                              c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleCustomerStatus(c.id, c.status)}
                            className="px-2.5 py-1 border border-[#EAE5DE] text-[10px] uppercase text-[#7C746B] hover:text-[#1D1D1B]"
                          >
                            {c.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={async () => {
                              const res = await api.admin.getCustomerDetails(c.id);
                              setSelectedCustomer(res.customer);
                            }}
                            className="px-2.5 py-1 bg-[#1D1D1B] text-[#F7F4EF] text-[10px] uppercase tracking-wider"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: PRODUCTS */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Product Catalog</h2>
                  <p className="text-xs text-[#7C746B]">Create, edit and manage luxury garments and ready-to-wear.</p>
                </div>

                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="px-4 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider flex items-center space-x-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Garment</span>
                </button>
              </div>

              {/* Products Grid / Table */}
              <div className="bg-white border border-[#EAE5DE] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Modest Edit</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4">
                          {p.primary_image ? (
                            <img src={p.primary_image} alt={p.name} className="w-10 h-14 object-cover bg-[#EAE5DE]" />
                          ) : (
                            <div className="w-10 h-14 bg-[#FAF8F5] border border-[#EAE5DE]" />
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-serif font-medium text-sm text-[#1D1D1B]">{p.name}</p>
                          <p className="text-[11px] text-[#7C746B] font-cairo">{p.name_ar}</p>
                        </td>
                        <td className="p-4 text-[#7C746B]">{p.category_name}</td>
                        <td className="p-4 font-mono">{p.sku}</td>
                        <td className="p-4 font-serif font-medium">{p.price_egp.toLocaleString()} EGP</td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              p.total_stock <= 5 ? 'text-[#964036]' : 'text-[#1D1D1B]'
                            }`}
                          >
                            {p.total_stock} units
                          </span>
                        </td>
                        <td className="p-4">
                          {p.is_modest_edit ? (
                            <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5">
                              Yes
                            </span>
                          ) : (
                            <span className="text-[#7C746B]">No</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] uppercase px-2 py-0.5 bg-gray-100 text-gray-800">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: INVENTORY */}
          {activeSection === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Inventory Control & Movements</h2>
                  <p className="text-xs text-[#7C746B]">Real-time stock tracking by variant, SKU, and threshold alerts.</p>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white border border-[#EAE5DE] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Variant SKU</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Color</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Threshold</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {inventory.map((item) => (
                      <tr key={item.variant_id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-medium text-[#1D1D1B]">{item.product_name}</td>
                        <td className="p-4 font-mono">{item.sku}</td>
                        <td className="p-4">{item.size}</td>
                        <td className="p-4 text-[#7C746B]">{item.color_name}</td>
                        <td className="p-4 font-bold text-sm text-[#1D1D1B]">{item.stock}</td>
                        <td className="p-4 text-[#7C746B]">{item.low_stock_threshold}</td>
                        <td className="p-4">
                          {item.stock === 0 ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-semibold uppercase">
                              Depleted
                            </span>
                          ) : item.stock <= item.low_stock_threshold ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold uppercase">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustingVariant(item);
                              setStockChangeDelta(0);
                              setIsStockAdjustModalOpen(true);
                            }}
                            className="px-3 py-1 bg-[#1D1D1B] text-[#F7F4EF] text-[10px] uppercase tracking-wider hover:bg-[#333]"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Movement History Log */}
              <div className="bg-white border border-[#EAE5DE] p-6">
                <h3 className="font-serif text-xl text-[#1D1D1B] mb-4">Stock Movement Audit History</h3>
                <div className="divide-y divide-[#EAE5DE]">
                  {inventoryHistory.slice(0, 10).map((mov) => (
                    <div key={mov.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-[#1D1D1B]">
                          {mov.product_name} ({mov.sku})
                        </p>
                        <p className="text-[11px] text-[#7C746B]">
                          Reason: {mov.reason} · Handled by {mov.created_by} on {new Date(mov.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold">
                          {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} units
                        </span>
                        <p className="text-[10px] text-[#7C746B]">
                          {mov.previous_stock} → {mov.new_stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Categories & Capsules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border border-[#EAE5DE] p-5">
                    <span className="text-[10px] tracking-widest uppercase text-[#B88F88] font-semibold block">
                      {c.slug}
                    </span>
                    <h3 className="font-serif text-xl text-[#1D1D1B] mt-1">{c.name}</h3>
                    <p className="text-xs font-cairo text-[#7C746B]">{c.name_ar}</p>
                    <p className="text-xs text-[#7C746B] mt-3">{c.products_count || 0} active silhouettes</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: COUPONS */}
          {activeSection === 'coupons' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Privilege Promo Codes</h2>
              <div className="bg-white border border-[#EAE5DE] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Min Order</th>
                      <th className="p-4">Times Used</th>
                      <th className="p-4">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {coupons.map((cp) => (
                      <tr key={cp.id}>
                        <td className="p-4 font-mono font-bold text-sm text-[#1D1D1B]">{cp.code}</td>
                        <td className="p-4">
                          {cp.discount_type === 'percentage'
                            ? `${cp.discount_value}% Off`
                            : `${cp.discount_value} EGP Off`}
                        </td>
                        <td className="p-4">{cp.min_order_value} EGP</td>
                        <td className="p-4 font-mono">{cp.times_used} / {cp.usage_limit}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: REVIEWS */}
          {activeSection === 'reviews' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Reviews Moderation</h2>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white border border-[#EAE5DE] p-5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-[#1D1D1B]">{r.reviewer_name}</span>
                        <span className="text-amber-600 font-bold">★ {r.rating}/5</span>
                        <span className="text-[10px] text-[#7C746B]">on {r.product_name}</span>
                      </div>
                      <p className="text-xs text-[#1D1D1B] font-medium mt-1">{r.title}</p>
                      <p className="text-xs text-[#7C746B] mt-1">{r.comment}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={async () => {
                          await api.admin.updateReview(r.id, 'approved');
                          loadCurrentSectionData();
                        }}
                        className="px-3 py-1 bg-emerald-800 text-white text-[10px] uppercase tracking-wider"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ADMIN USERS & RBAC */}
          {activeSection === 'admin_users' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Administrative Roster & RBAC</h2>
              <div className="bg-white border border-[#EAE5DE]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {adminUsers.map((a) => (
                      <tr key={a.id}>
                        <td className="p-4 font-medium text-[#1D1D1B]">{a.name}</td>
                        <td className="p-4 font-mono">{a.email}</td>
                        <td className="p-4 text-[#7C746B]">{a.department}</td>
                        <td className="p-4 font-semibold uppercase text-[10px] text-[#B88F88]">{a.role_name}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-semibold">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: ACTIVITY LOGS */}
          {activeSection === 'activity_logs' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Security & Activity Audit Log</h2>
              <div className="bg-white border border-[#EAE5DE] divide-y divide-[#EAE5DE]">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#1D1D1B]">{log.admin_name}</span>
                        <span className="font-mono text-[10px] uppercase bg-gray-100 px-1.5 py-0.5">
                          {log.action}
                        </span>
                        <span className="text-[#7C746B]">on resource: {log.resource}</span>
                      </div>
                      <p className="text-[11px] text-[#7C746B] font-mono mt-0.5">
                        IP: {log.ip_address || '127.0.0.1'} · Resource ID: {log.resource_id}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#7C746B]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SETTINGS */}
          {activeSection === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Atelier Configurations</h2>
              <div className="bg-white border border-[#EAE5DE] p-6 space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1D1D1B] mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.store_name || 'LORÉA Cairo'}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1D1D1B] mb-1">
                    Free Shipping Threshold (EGP)
                  </label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold_egp || '2500'}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold_egp: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1D1D1B] mb-1">
                    Concierge Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.concierge_email || 'concierge@lorea.eg'}
                    onChange={(e) => setSettings({ ...settings, concierge_email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  />
                </div>

                <button
                  onClick={async () => {
                    await api.admin.updateSettings(settings);
                    notify('success', 'Settings updated successfully.');
                  }}
                  className="px-6 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider font-medium"
                >
                  Save Settings
                </button>
              </div>

              {/* Supabase Database & Architecture Card */}
              <div className="bg-white border border-[#EAE5DE] p-6 space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-4">
                  <div className="flex items-center space-x-2.5">
                    <Database className="w-5 h-5 text-[#B88F88]" />
                    <div>
                      <h3 className="font-serif text-lg text-[#1D1D1B] font-medium">
                        Supabase PostgreSQL Architecture
                      </h3>
                      <p className="text-[#7C746B] text-[11px]">
                        Enterprise relational database with RLS policies, triggers, and RPC procedures
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${
                      isSupabaseConfigured()
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isSupabaseConfigured() ? 'Live Supabase Connected' : 'Ready For Keys (.env)'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block">
                      Connected Supabase Project
                    </span>
                    <span className="font-mono text-[10px] bg-[#EAE5DE] px-1.5 py-0.5 font-bold">
                      gyzxqhcwdyismayrbxva
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="https://supabase.com/dashboard/project/gyzxqhcwdyismayrbxva/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white border border-[#DDD] hover:border-[#1D1D1B] text-[10px] uppercase font-semibold flex items-center space-x-1"
                    >
                      <span>SQL Editor</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href="https://supabase.com/dashboard/project/gyzxqhcwdyismayrbxva/editor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white border border-[#DDD] hover:border-[#1D1D1B] text-[10px] uppercase font-semibold flex items-center space-x-1"
                    >
                      <span>Table Editor</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href="https://supabase.com/dashboard/project/gyzxqhcwdyismayrbxva/settings/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white border border-[#DDD] hover:border-[#1D1D1B] text-[10px] uppercase font-semibold flex items-center space-x-1"
                    >
                      <span>API Keys</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href="https://supabase.com/dashboard/project/gyzxqhcwdyismayrbxva/storage/buckets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white border border-[#DDD] hover:border-[#1D1D1B] text-[10px] uppercase font-semibold flex items-center space-x-1"
                    >
                      <span>Storage</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block mb-2">
                    Schema Relational Coverage
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {[
                      'profiles (Auth trigger)',
                      'addresses (Governorates)',
                      'categories (SEO + hierarchy)',
                      'products (Prices & SKU)',
                      'product_images (Storage)',
                      'product_variants (Stock)',
                      'cart_items (Row locks)',
                      'orders (Sequential number)',
                      'order_items (Snapshots)',
                      'coupons (Usage limits)',
                      'coupon_usages (Audit)',
                      'reviews (Verified checks)',
                      'banners (Promotions)',
                      'newsletter_subscribers',
                      'contact_messages',
                      'admin_activity_logs',
                      'Storage: 4 Buckets',
                    ].map((tbl, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-[#555]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono text-[10px] truncate">{tbl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DE] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-[#1D1D1B]">Ready for Supabase SQL Editor execution</p>
                    <p className="text-[11px] text-[#7C746B]">
                      Open your Supabase project dashboard → SQL Editor → Paste migration SQL → Run
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        'Migration located at: /supabase/migrations/20260912_lorea_complete_schema.sql'
                      );
                      notify('success', 'Migration path copied to clipboard');
                    }}
                    className="px-3 py-1.5 bg-[#1D1D1B] text-[#F7F4EF] text-[11px] uppercase tracking-wider font-medium flex items-center space-x-1.5 shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Path</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
              <h3 className="font-serif text-2xl text-[#1D1D1B]">Create New Haute Garment</h3>
              <button onClick={() => setIsNewProductModalOpen(false)}>
                <X className="w-5 h-5 text-[#7C746B] hover:text-[#1D1D1B]" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold mb-1">Name (EN) *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold mb-1">Name (Arabic) *</label>
                  <input
                    type="text"
                    value={productForm.nameAr}
                    onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                    placeholder="فستان كتان معماري"
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-cairo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="LOR-2026-DR01"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold mb-1">Price in EGP *</label>
                  <input
                    type="number"
                    value={productForm.priceEgp}
                    onChange={(e) => setProductForm({ ...productForm, priceEgp: Number(e.target.value) })}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                  >
                    <option value="cat_dresses">Dresses</option>
                    <option value="cat_tops">Tops & Shirts</option>
                    <option value="cat_outerwear">Coats & Jackets</option>
                    <option value="cat_sets">Sets</option>
                    <option value="cat_bottoms">Trousers & Skirts</option>
                    <option value="cat_modest">Modest Edit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Fabric & Provenance</label>
                <input
                  type="text"
                  value={productForm.fabric}
                  onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-[#1D1D1B] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={productForm.isModestEdit}
                  onChange={(e) => setProductForm({ ...productForm, isModestEdit: e.target.checked })}
                  className="w-4 h-4 accent-[#1D1D1B]"
                />
                <span>Include in LORÉA Modest Architectural Edit</span>
              </label>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE5DE] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider"
                >
                  Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {isStockAdjustModalOpen && adjustingVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-md p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#1D1D1B] mb-2">Adjust Inventory Stock</h3>
            <p className="text-xs text-[#7C746B] mb-4">
              {adjustingVariant.product_name} · SKU: {adjustingVariant.sku}
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE] flex justify-between">
                <span>Current Recorded Stock:</span>
                <span className="font-bold">{adjustingVariant.stock} units</span>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">
                  Stock Change (e.g. +10 or -5)
                </label>
                <input
                  type="number"
                  value={stockChangeDelta}
                  onChange={(e) => setStockChangeDelta(Number(e.target.value))}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Reason for Audit Log</label>
                <input
                  type="text"
                  value={stockAdjustReason}
                  onChange={(e) => setStockAdjustReason(e.target.value)}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE5DE] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider font-medium"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED ORDER INSPECTOR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#1D1D1B]">Order #{selectedOrder.order_number}</h3>
                <p className="text-xs text-[#7C746B]">
                  Client: {selectedOrder.customer_name} ({selectedOrder.customer_email})
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-[#7C746B] hover:text-[#1D1D1B]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#FAF8F5]">
                <div>
                  <span className="text-[#7C746B] block">Current Status:</span>
                  <span className="font-bold uppercase text-[#1D1D1B]">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-[#7C746B] block">Tracking Code:</span>
                  <span className="font-mono">{selectedOrder.tracking_number || 'None'}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider block mb-2">Order Items</span>
                <div className="divide-y divide-[#EAE5DE]">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="py-2 flex justify-between">
                      <div>
                        <p className="font-medium">{item.product_name_snapshot}</p>
                        <p className="text-[11px] text-[#7C746B]">
                          Size: {item.size} · Color: {item.color_name} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-serif font-medium">{item.total} EGP</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE5DE] flex justify-between font-serif text-base font-bold">
                <span>Total:</span>
                <span>{selectedOrder.total} EGP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
