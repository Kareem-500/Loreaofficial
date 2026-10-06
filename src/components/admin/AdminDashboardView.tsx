import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Layers,
  FolderKanban,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Receipt,
  Tag,
  Truck,
  Coins,
  Package,
  Star,
  Settings as SettingsIcon,
  ShieldCheck,
  History,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Eye,
  LogOut,
  RefreshCw,
  Store,
  Database,
  Check,
  Copy,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Shield,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { LoreaLogo } from '../LoreaLogo';
import { formatPrice } from '../../utils/currency';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ProductsSection } from './sections/ProductsSection';
import { FinanceSection } from './sections/FinanceSection';
import { ProductDetailModal } from './sections/ProductDetailModal';
import { ProductFormModal } from './sections/ProductFormModal';
import { AdminDeleteConfirmModal } from './AdminDeleteConfirmModal';

interface AdminDashboardViewProps {
  onReturnToStore: () => void;
  initialSection?: string;
  initialEntityId?: string;
}

const DEFAULT_DASHBOARD_DATA = {
  stats: {
    totalSales: 18050,
    todaySales: 18050,
    todayOrders: 3,
    weekSales: 18050,
    weekOrders: 3,
    monthlySales: 18050,
    monthOrders: 3,
    totalOrders: 3,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 1,
    shippedOrders: 1,
    completedOrders: 1,
    cancelledOrders: 0,
    refundedOrders: 0,
    grossRevenue: 20550,
    discounts: 1250,
    netRevenue: 19300,
    shippingRevenue: 0,
    taxes: 0,
    estimatedCost: 6755,
    estimatedProfit: 12545,
    profitMargin: 65,
    totalProducts: 8,
    activeProducts: 8,
    draftProducts: 0,
    lowStockCount: 2,
    outOfStockCount: 0,
    totalCustomers: 4,
    activeCustomers: 4,
    newCustomers: 2,
    verifiedCustomers: 4,
  },
  recentOrders: [
    {
      id: 'order_seed_01',
      order_number: 'LOR-2026-001',
      customer_name: 'Nourhan El-Kady',
      total: 7800,
      status: 'delivered',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'order_seed_02',
      order_number: 'LOR-2026-002',
      customer_name: 'Nour Khalil',
      total: 5450,
      status: 'processing',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'order_seed_03',
      order_number: 'LOR-2026-003',
      customer_name: 'Laila Rostom',
      total: 4800,
      status: 'shipped',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  lowStockProducts: [],
  charts: {
    revenueTimeline: [
      { month: 'May 2026', revenue: 145000 },
      { month: 'Jun 2026', revenue: 198000 },
      { month: 'Jul 2026', revenue: 245000 },
      { month: 'Aug 2026', revenue: 290000 },
      { month: 'Sep 2026', revenue: 360000 },
      { month: 'Oct 2026', revenue: 410000 },
    ],
  },
};

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onReturnToStore,
  initialSection,
  initialEntityId,
}) => {
  const { user, login, logout } = useAuth();
  const { language } = useLanguage();

  // Admin login gateway states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Active section state
  const [activeSection, setActiveSection] = useState<AdminSection>(() => {
    if (initialSection) {
      const valid: AdminSection[] = [
        'dashboard', 'products', 'categories', 'collections', 'orders',
        'customers', 'finance_overview', 'finance_transactions', 'finance_discounts',
        'finance_shipping_tax', 'finance_currency', 'inventory', 'reviews',
        'settings_store', 'settings_admin', 'activity_logs'
      ];
      if (valid.includes(initialSection as AdminSection)) {
        return initialSection as AdminSection;
      }
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (initialSection) {
      const valid: AdminSection[] = [
        'dashboard', 'products', 'categories', 'collections', 'orders',
        'customers', 'finance_overview', 'finance_transactions', 'finance_discounts',
        'finance_shipping_tax', 'finance_currency', 'inventory', 'reviews',
        'settings_store', 'settings_admin', 'activity_logs'
      ];
      if (valid.includes(initialSection as AdminSection) && initialSection !== activeSection) {
        setActiveSection(initialSection as AdminSection);
      }
    }
  }, [initialSection]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data states
  const [dashboardData, setDashboardData] = useState<any>(DEFAULT_DASHBOARD_DATA);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Product Modals & Selection States
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any | null>(null);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Inspection & other modal states
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [adjustingVariant, setAdjustingVariant] = useState<any>(null);
  const [stockChangeDelta, setStockChangeDelta] = useState<number>(0);
  const [stockAdjustReason, setStockAdjustReason] = useState<string>('Restock delivery from Cairo atelier');

  // Category & Collection creation modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  });

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
  });

  // Global search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Telemetry states
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15); // 15 seconds live stream
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [isLivePolling, setIsLivePolling] = useState(true);

  const notify = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadCurrentSectionData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      if (activeSection === 'dashboard') {
        try {
          const [dashRes, prodRes] = await Promise.all([
            api.admin.getDashboard(),
            api.admin.getProducts(),
          ]);
          if (dashRes && dashRes.stats) {
            setDashboardData(dashRes);
          }
          if (prodRes && prodRes.products) {
            setProducts(prodRes.products);
          }
        } catch (dashErr) {
          console.warn('Dashboard live telemetry fetch warning:', dashErr);
        }
      } else if (activeSection === 'products') {
        const [prodRes, catRes, colRes] = await Promise.all([
          api.admin.getProducts(),
          api.admin.getCategories(),
          api.admin.getCollections().catch(() => ({ collections: [] })),
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
        setCollections(colRes.collections || []);
      } else if (activeSection === 'customers') {
        const res = await api.admin.getCustomers({ search: searchQuery, status: statusFilter });
        setCustomers(res.customers || []);
      } else if (activeSection === 'orders') {
        const res = await api.admin.getOrders({ search: searchQuery, status: statusFilter });
        setOrders(res.orders || []);
      } else if (activeSection === 'inventory') {
        const res = await api.admin.getInventory();
        setInventory(res.inventory || []);
        setInventoryHistory(res.history || []);
      } else if (activeSection === 'categories') {
        const res = await api.admin.getCategories();
        setCategories(res.categories || []);
      } else if (activeSection === 'collections') {
        const res = await api.admin.getCollections().catch(() => ({ collections: [] }));
        setCollections(res.collections || []);
      } else if (activeSection === 'reviews') {
        const res = await api.admin.getReviews();
        setReviews(res.reviews || []);
      } else if (activeSection === 'settings_admin') {
        const [usersRes, logsRes] = await Promise.all([
          api.admin.getAdminUsers(),
          api.admin.getActivityLogs(),
        ]);
        setAdminUsers(usersRes.adminUsers || []);
        setActivityLogs(logsRes.logs || []);
      } else if (activeSection === 'activity_logs') {
        const res = await api.admin.getActivityLogs();
        setActivityLogs(res.logs || []);
      } else if (activeSection === 'settings_store') {
        const res = await api.admin.getSettings();
        setSettings(res.settings || {});
      }
      setLastRefreshedAt(new Date());
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'manager')) {
      loadCurrentSectionData(false);
    }
  }, [activeSection, user]);

  // Live Auto-Refresh Polling Stream
  useEffect(() => {
    if (!isLivePolling || autoRefreshInterval <= 0) return;
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'manager')) return;

    const timer = setInterval(() => {
      loadCurrentSectionData(true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [isLivePolling, autoRefreshInterval, activeSection, user]);

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

  // Review status update
  const handleUpdateReviewStatus = async (reviewId: string, status: string) => {
    try {
      await api.admin.updateReview(reviewId, status);
      notify('success', `Review status set to ${status}`);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to update review status');
    }
  };

  // Create or Update Product in modal
  const handleSaveProduct = async (productData: any) => {
    try {
      setIsSavingProduct(true);
      if (productToEdit) {
        const productId = productToEdit.id || productToEdit.product_id;
        await api.admin.updateProduct(productId, productData);
        notify('success', `Garment ${productData.name} updated successfully.`);
      } else {
        await api.admin.createProduct(productData);
        notify('success', `Garment ${productData.name} published to catalog.`);
      }
      setIsProductFormOpen(false);
      setProductToEdit(null);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to save product');
      throw err;
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Duplicate Product
  const handleDuplicateProduct = async (product: any) => {
    try {
      const productId = product.id || product.product_id;
      const res = await api.admin.duplicateProduct(productId);
      notify('success', `Garment duplicated: ${res.product?.name || product.name} (Copy)`);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to duplicate product');
    }
  };

  // Status Change for Product
  const handleProductStatusChange = async (product: any, newStatus: 'active' | 'draft' | 'archived') => {
    try {
      const productId = product.id || product.product_id;
      await api.admin.updateProductStatus(productId, newStatus);
      notify('success', `Garment marked as ${newStatus}`);
      loadCurrentSectionData();
      if (selectedProductForDetail) {
        setSelectedProductForDetail({ ...selectedProductForDetail, status: newStatus });
      }
    } catch (err: any) {
      notify('error', err.message || 'Failed to update product status');
    }
  };

  // Delete Product confirmed
  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setIsDeletingProduct(true);
      const productId = productToDelete.id || productToDelete.product_id;
      const res = await api.admin.deleteProduct(productId);
      notify(
        'success',
        res.action === 'archived'
          ? `Product archived to preserve order history (${productToDelete.name}).`
          : `Product ${productToDelete.name} permanently deleted.`
      );
      setProductToDelete(null);
      if (selectedProductForDetail && (selectedProductForDetail.id === productId || selectedProductForDetail.product_id === productId)) {
        setSelectedProductForDetail(null);
      }
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to delete product');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Bulk Actions
  const handleBulkProductsAction = async (action: string, selectedIds: string[], payload?: any) => {
    try {
      const res = await api.admin.bulkProductsAction(action, selectedIds, payload);
      notify('success', `${res.message} (${res.affectedCount} garments affected)`);
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Bulk action failed');
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

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCategory(categoryForm);
      notify('success', `Category "${categoryForm.name}" created successfully.`);
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', nameAr: '', slug: '', description: '', image: '' });
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to create category');
    }
  };

  // Create Collection
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCollection(collectionForm);
      notify('success', `Collection "${collectionForm.name}" created successfully.`);
      setIsCollectionModalOpen(false);
      setCollectionForm({ name: '', nameAr: '', slug: '', description: '' });
      loadCurrentSectionData();
    } catch (err: any) {
      notify('error', err.message || 'Failed to create collection');
    }
  };

  // 1. If user is logged in as a non-admin (e.g. customer), show explicit 403 Forbidden screen
  if (user && user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'manager') {
    return (
      <div className="min-h-screen bg-[#151413] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        <div className="relative z-10 w-full max-w-md bg-[#1D1D1B] border border-[#2A2826] p-8 sm:p-10 shadow-2xl text-center">
          <LoreaLogo variant="dark" className="mx-auto scale-110 mb-4" />
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/60 border border-red-800/80 mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-red-300">
              403 ACCESS DENIED
            </span>
          </div>
          <h2 className="font-serif text-2xl font-light text-[#FAF8F5] mb-2">
            Administrative Clearance Required
          </h2>
          <p className="text-xs text-[#B7ADA2] leading-relaxed mb-6 font-light">
            You are currently signed in as a boutique customer account (<span className="text-white font-mono">{user.email}</span>). Administrative and operational portals are restricted to authorized personnel only.
          </p>
          <div className="space-y-3">
            <button
              onClick={onReturnToStore}
              className="w-full py-3 bg-[#BA945A] hover:bg-[#A38048] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              Return to Store
            </button>
            <button
              onClick={async () => {
                await logout();
                onReturnToStore();
              }}
              className="w-full py-2.5 bg-[#252422] hover:bg-[#333] text-[#B7ADA2] hover:text-white text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer border border-[#333]"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If user is unauthenticated, present the secure Atelier Operations Login Gateway
  if (!user) {
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminLoginError(null);
      if (!adminEmail.trim() || !adminPassword) {
        setAdminLoginError('Staff identity email and password are required.');
        return;
      }
      try {
        setAdminLoginLoading(true);
        await login(adminEmail.trim(), adminPassword, true);
        await loadCurrentSectionData();
      } catch (err: any) {
        setAdminLoginError(err.message || 'Administrative authentication failed. Please verify your credentials.');
      } finally {
        setAdminLoginLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#151413] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#BA945A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#1D1D1B] border border-[#2A2826] p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <LoreaLogo variant="dark" className="mx-auto scale-110 mb-4" />
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#252422] border border-[#333] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BA945A]" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#FAF8F5]">
                ATELIER OPERATIONS GATEWAY
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light text-[#FAF8F5]">
              Administrative Authorization
            </h2>
            <p className="text-xs text-[#7C746B] mt-1 font-light">
              Restricted to authorized atelier directors and operations staff.
            </p>
          </div>

          {adminLoginError && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7C746B] font-mono mb-1.5">
                Staff Identity / Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                placeholder="staff@loreaofficial.com"
                className="w-full bg-[#151413] border border-[#333] text-[#FAF8F5] px-3.5 py-2.5 focus:border-[#BA945A] focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7C746B] font-mono mb-1.5">
                Atelier Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-[#151413] border border-[#333] text-[#FAF8F5] px-3.5 py-2.5 focus:border-[#BA945A] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full mt-2 py-3 bg-[#BA945A] hover:bg-[#A38048] text-white text-xs uppercase tracking-[0.25em] font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {adminLoginLoading ? 'Verifying Security Token...' : 'Authenticate Admin Access'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2A2826] text-center space-y-3">
            <button
              onClick={onReturnToStore}
              className="text-xs text-[#7C746B] hover:text-[#FAF8F5] transition-colors flex items-center justify-center space-x-1.5 mx-auto"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Return to Boutique Homepage</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Header Title mapping
  const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Overview', subtitle: 'Atelier commercial performance and real-time telemetry' },
    products: { title: 'Product Catalog', subtitle: 'Garments, unit economics, variants, and stock status' },
    categories: { title: 'Category Taxonomy', subtitle: 'Organize haute couture and ready-to-wear hierarchies' },
    collections: { title: 'Curated Collections', subtitle: 'Editorial campaign lookbooks and featured edits' },
    orders: { title: 'Client Orders', subtitle: 'Egyptian orders processing, fulfillment, and status updates' },
    customers: { title: 'Client Directory', subtitle: 'VIP client relationships, lifetime value, and profiles' },
    finance_overview: { title: 'Financial Overview', subtitle: 'Net revenue, COGS, gross margin, and profits' },
    finance_transactions: { title: 'Ledger Transactions', subtitle: 'Audited financial orders, payment logs, and refunds' },
    finance_discounts: { title: 'Discounts & Privilege Codes', subtitle: 'Configure percentage, fixed coupons, and usage rules' },
    finance_shipping_tax: { title: 'Tax & Logistics Settings', subtitle: 'Egyptian VAT and Cairo/Giza courier delivery rates' },
    finance_currency: { title: 'Multi-Currency Control', subtitle: 'Egyptian Pound (EGP), USD, EUR base exchanges' },
    inventory: { title: 'Stock & Inventory Audit', subtitle: 'Warehouse units, low stock alerts, and audit logs' },
    reviews: { title: 'Reviews Moderation', subtitle: 'Client testimonials and verified purchase feedback' },
    settings_store: { title: 'Store Configuration', subtitle: 'Brand profile, customer care hotline, and policies' },
    settings_admin: { title: 'Access Control & Schema', subtitle: 'Role-Based Access Control and Supabase integration' },
    activity_logs: { title: 'Security Audit Trail', subtitle: 'Immutable ledger of administrative actions' },
  };

  const currentMeta = sectionTitles[activeSection] || { title: 'Admin Workspace', subtitle: 'LORÉA Operations' };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1D1D1B] flex flex-col font-sans select-none">
      {/* 1. Global Admin Top Bar */}
      <AdminHeader
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onReturnToStore={onReturnToStore}
        onRefresh={loadCurrentSectionData}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title={currentMeta.title}
        subtitle={currentMeta.subtitle}
        adminName={`${user.firstName} ${user.lastName}`}
      />

      {/* Floating feedback alert */}
      {feedback && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 text-xs font-medium shadow-2xl transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
              : 'bg-[#964036] text-white border border-red-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* 2. Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Unified Admin Sidebar (Desktop Persistent & Mobile Drawer) */}
        <AdminSidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            setSelectedOrder(null);
            setSelectedCustomer(null);
            const targetUrl = sec === 'dashboard' ? '/admin' : `/admin/${sec}`;
            if (window.location.pathname !== targetUrl) {
              window.history.pushState({}, '', targetUrl);
            }
          }}
          onReturnToStore={onReturnToStore}
          onLogout={async () => {
            await logout();
            onReturnToStore();
            window.history.replaceState({}, '', '/');
          }}
          adminName={`${user.firstName} ${user.lastName}`}
          adminRole={user.role}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          productsCount={products.length}
          lowStockCount={dashboardData?.stats?.lowStockCount || 0}
          pendingOrdersCount={dashboardData?.stats?.pendingOrders || 0}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          {/* SECTION: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && dashboardData && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Live Telemetry Control Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151413] text-[#FAF8F5] p-5 border border-[#2A2826] shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      {isLivePolling && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLivePolling ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                    </span>
                    <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-semibold text-[#BA945A]">
                      {isLivePolling ? 'LIVE TELEMETRY STREAM ACTIVE' : 'STREAM PAUSED'}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[11px] text-[#B7ADA2] font-mono">
                      Last sync: {lastRefreshedAt.toLocaleTimeString()}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide">
                    Atelier Executive Overview
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* Auto-refresh interval switcher */}
                  <div className="flex items-center bg-[#222120] border border-[#333] px-2 py-1 text-[11px] font-mono text-[#B7ADA2]">
                    <span className="mr-2 text-[10px] uppercase text-[#7C746B]">Polling:</span>
                    <select
                      value={autoRefreshInterval}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAutoRefreshInterval(val);
                        setIsLivePolling(val > 0);
                      }}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value={10} className="bg-[#151413]">10s</option>
                      <option value={15} className="bg-[#151413]">15s</option>
                      <option value={30} className="bg-[#151413]">30s</option>
                      <option value={60} className="bg-[#151413]">60s</option>
                      <option value={0} className="bg-[#151413]">Manual</option>
                    </select>
                  </div>

                  <button
                    onClick={() => loadCurrentSectionData(false)}
                    disabled={isLoading}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#252422] hover:bg-[#333] border border-[#3A3835] text-[#FAF8F5] transition-colors cursor-pointer text-xs"
                    title="Refresh Live Telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#BA945A] ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsProductFormOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#BA945A] hover:bg-[#A38048] text-white text-xs uppercase tracking-wider flex items-center space-x-1.5 font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Garment</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('finance_overview')}
                    className="px-3 py-1.5 bg-transparent border border-[#BA945A] text-[#BA945A] hover:bg-[#BA945A] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                  >
                    Finance Hub
                  </button>
                </div>
              </div>

              {/* SECTION 1: SALES VELOCITY & ORDER VOLUME */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.24em] uppercase font-mono text-[#7C746B] font-semibold">
                    01 · SALES VELOCITY & ORDER VOLUME
                  </span>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-[11px] uppercase tracking-wider text-[#BA945A] hover:underline"
                  >
                    All Orders →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <div className="bg-white border border-[#EAE5DE] p-4.5 shadow-xs hover:border-[#BA945A] transition-colors">
                    <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                      TOTAL SALES
                    </span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1.5 font-light">
                      {formatPrice(dashboardData.stats.totalSales || 0, 'EGP')}
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center space-x-1 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>{dashboardData.stats.totalOrders} total orders</span>
                    </p>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4.5 shadow-xs hover:border-[#BA945A] transition-colors">
                    <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                      TODAY'S SALES
                    </span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1.5 font-light">
                      {formatPrice(dashboardData.stats.todaySales || 0, 'EGP')}
                    </div>
                    <p className="text-[11px] text-[#7C746B] mt-1.5">
                      {dashboardData.stats.todayOrders || 0} orders placed today
                    </p>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4.5 shadow-xs hover:border-[#BA945A] transition-colors">
                    <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                      THIS WEEK
                    </span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1.5 font-light">
                      {formatPrice(dashboardData.stats.weekSales || 0, 'EGP')}
                    </div>
                    <p className="text-[11px] text-[#7C746B] mt-1.5">
                      {dashboardData.stats.weekOrders || 0} orders in last 7 days
                    </p>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4.5 shadow-xs hover:border-[#BA945A] transition-colors">
                    <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                      THIS MONTH
                    </span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1.5 font-light">
                      {formatPrice(dashboardData.stats.monthlySales || 0, 'EGP')}
                    </div>
                    <p className="text-[11px] text-[#7C746B] mt-1.5">
                      {dashboardData.stats.monthOrders || 0} orders this calendar month
                    </p>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4.5 shadow-xs hover:border-[#BA945A] transition-colors">
                    <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-semibold block">
                      ACTIVE FULFILLMENT
                    </span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1.5 font-light">
                      {dashboardData.stats.pendingOrders + dashboardData.stats.processingOrders}
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
                      {dashboardData.stats.pendingOrders} pending · {dashboardData.stats.processingOrders} in atelier
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: FINANCIAL INTELLIGENCE & AUDITING */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.24em] uppercase font-mono text-[#7C746B] font-semibold">
                    02 · FINANCIAL INTELLIGENCE & UNIT ECONOMICS
                  </span>
                  <button
                    onClick={() => setActiveSection('finance_overview')}
                    className="text-[11px] uppercase tracking-wider text-[#BA945A] hover:underline"
                  >
                    Ledger & P&L Statement →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7C746B] block">GROSS REVENUE</span>
                    <span className="font-serif text-lg text-[#1D1D1B] font-medium mt-1 block">
                      {formatPrice(dashboardData.stats.grossRevenue || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-rose-700 block">DISCOUNTS</span>
                    <span className="font-serif text-lg text-rose-800 font-medium mt-1 block">
                      -{formatPrice(dashboardData.stats.discounts || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7C746B] block">NET REVENUE</span>
                    <span className="font-serif text-lg text-emerald-800 font-medium mt-1 block">
                      {formatPrice(dashboardData.stats.netRevenue || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7C746B] block">SHIPPING FEES</span>
                    <span className="font-serif text-lg text-[#1D1D1B] font-medium mt-1 block">
                      {formatPrice(dashboardData.stats.shippingRevenue || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7C746B] block">VAT TAXES</span>
                    <span className="font-serif text-lg text-[#1D1D1B] font-medium mt-1 block">
                      {formatPrice(dashboardData.stats.taxes || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 rounded-xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#7C746B] block">EST. COGS</span>
                    <span className="font-serif text-lg text-[#7C746B] font-medium mt-1 block">
                      {formatPrice(dashboardData.stats.estimatedCost || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-emerald-300 p-3 rounded-xs bg-emerald-50/50">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-800 font-semibold block">EST. PROFIT</span>
                    <span className="font-serif text-lg text-emerald-900 font-bold mt-1 block">
                      {formatPrice(dashboardData.stats.estimatedProfit || 0, 'EGP')}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#BA945A]/40 p-3 rounded-xs bg-[#BA945A]/5">
                    <span className="text-[9px] uppercase tracking-wider text-[#BA945A] font-semibold block">PROFIT MARGIN</span>
                    <span className="font-serif text-lg text-[#BA945A] font-bold mt-1 block">
                      {dashboardData.stats.profitMargin || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CATALOG & INVENTORY HEALTH */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.24em] uppercase font-mono text-[#7C746B] font-semibold">
                    03 · CATALOG & INVENTORY HEALTH
                  </span>
                  <button
                    onClick={() => setActiveSection('products')}
                    className="text-[11px] uppercase tracking-wider text-[#BA945A] hover:underline"
                  >
                    Manage Garments →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#7C746B] block">TOTAL GARMENTS</span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1 font-light">
                      {dashboardData.stats.totalProducts}
                    </div>
                    <span className="text-[11px] text-[#7C746B] mt-1 block">Haute & Ready-to-wear</span>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-700 block">ACTIVE PUBLISHED</span>
                    <div className="font-serif text-2xl text-emerald-800 mt-1 font-light">
                      {dashboardData.stats.activeProducts}
                    </div>
                    <span className="text-[11px] text-emerald-700 mt-1 block">Live in boutique catalog</span>
                  </div>

                  <div className="bg-white border border-red-200 p-4 shadow-xs bg-red-50/30">
                    <span className="text-[10px] uppercase tracking-widest text-red-700 block">DEPLETED SKUS</span>
                    <div className="font-serif text-2xl text-red-700 mt-1 font-bold">
                      {dashboardData.stats.outOfStockCount || 0}
                    </div>
                    <span className="text-[11px] text-red-600 mt-1 block">Immediate restock needed</span>
                  </div>

                  <div className="bg-white border border-amber-200 p-4 shadow-xs bg-amber-50/30">
                    <span className="text-[10px] uppercase tracking-widest text-amber-800 block">LOW STOCK ALERTS</span>
                    <div className="font-serif text-2xl text-amber-800 mt-1 font-bold">
                      {dashboardData.stats.lowStockCount || 0}
                    </div>
                    <span className="text-[11px] text-amber-700 mt-1 block">Below safety threshold</span>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#7C746B] block">DRAFT EDITS</span>
                    <div className="font-serif text-2xl text-[#7C746B] mt-1 font-light">
                      {dashboardData.stats.draftProducts || 0}
                    </div>
                    <span className="text-[11px] text-[#7C746B] mt-1 block">Pre-release staging</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: CLIENT RELATIONSHIPS (CRM) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.24em] uppercase font-mono text-[#7C746B] font-semibold">
                    04 · CLIENT RELATIONSHIPS & ACCOUNTS
                  </span>
                  <button
                    onClick={() => setActiveSection('customers')}
                    className="text-[11px] uppercase tracking-wider text-[#BA945A] hover:underline"
                  >
                    Directory →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#7C746B] block">TOTAL PATRONS</span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1 font-light">
                      {dashboardData.stats.totalCustomers}
                    </div>
                    <span className="text-[11px] text-[#7C746B] mt-1 block">Registered client accounts</span>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-700 block">ACTIVE PATRONS</span>
                    <div className="font-serif text-2xl text-emerald-800 mt-1 font-light">
                      {dashboardData.stats.activeCustomers || dashboardData.stats.totalCustomers}
                    </div>
                    <span className="text-[11px] text-emerald-700 mt-1 block">Allowed boutique checkout</span>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#BA945A] block">NEW THIS WEEK</span>
                    <div className="font-serif text-2xl text-[#BA945A] mt-1 font-bold">
                      {dashboardData.stats.newCustomers || 0}
                    </div>
                    <span className="text-[11px] text-[#BA945A] mt-1 block">Recent client signups</span>
                  </div>

                  <div className="bg-white border border-[#EAE5DE] p-4 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#7C746B] block">VERIFIED ACCOUNTS</span>
                    <div className="font-serif text-2xl text-[#1D1D1B] mt-1 font-light">
                      {dashboardData.stats.verifiedCustomers}
                    </div>
                    <span className="text-[11px] text-[#7C746B] mt-1 block">Verified Egyptian profiles</span>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Chart */}
              <div className="bg-white border border-[#EAE5DE] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
                  <div>
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Revenue Growth (Cairo Atelier)</h3>
                    <p className="text-xs text-[#7C746B]">Monthly gross transactions in Egyptian Pounds (EGP)</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#BA945A] font-mono">
                    EGP ATELIER INDEX
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6">
                  {dashboardData.charts?.revenueTimeline?.map((item: any) => {
                    const maxVal = 420000;
                    const heightPercent = Math.min(100, Math.round((item.revenue / maxVal) * 100));
                    return (
                      <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#7C746B] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(item.revenue / 1000)}k
                        </span>
                        <div
                          className="w-full bg-[#1D1D1B] group-hover:bg-[#BA945A] transition-all rounded-xs"
                          style={{ height: `${Math.max(8, heightPercent)}%` }}
                        />
                        <span className="text-[10px] uppercase text-[#7C746B] mt-2 text-center font-mono">
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
                <div className="bg-white border border-[#EAE5DE] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Recent Client Orders</h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs uppercase tracking-wider underline text-[#1D1D1B] hover:text-[#BA945A]"
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
                          <p className="font-serif font-medium">{formatPrice(o.total, 'EGP')}</p>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EAE5DE] rounded-xs font-mono">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white border border-[#EAE5DE] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
                    <h3 className="font-serif text-xl text-[#1D1D1B]">Low Stock Warnings</h3>
                    <button
                      onClick={() => setActiveSection('inventory')}
                      className="text-xs uppercase tracking-wider underline text-[#1D1D1B] hover:text-[#BA945A]"
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
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 font-semibold text-xs rounded-xs">
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

          {/* SECTION: PRODUCT MANAGEMENT */}
          {activeSection === 'products' && (
            <div className="max-w-7xl mx-auto">
              <ProductsSection
                products={products}
                categories={categories}
                collections={collections}
                onOpenAddModal={() => {
                  setProductToEdit(null);
                  setIsProductFormOpen(true);
                }}
                onViewProduct={(prod) => setSelectedProductForDetail(prod)}
                onEditProduct={(prod) => {
                  setProductToEdit(prod);
                  setIsProductFormOpen(true);
                }}
                onDuplicateProduct={handleDuplicateProduct}
                onDeleteProduct={(prod) => setProductToDelete(prod)}
                onStatusChange={handleProductStatusChange}
                onBulkAction={handleBulkProductsAction}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* SECTION: FINANCIAL SYSTEM */}
          {activeSection.startsWith('finance_') && (
            <div className="max-w-7xl mx-auto">
              <FinanceSection
                initialSubTab={
                  activeSection === 'finance_transactions'
                    ? 'transactions'
                    : activeSection === 'finance_discounts'
                    ? 'discounts'
                    : activeSection === 'finance_shipping_tax'
                    ? 'shipping_tax'
                    : activeSection === 'finance_currency'
                    ? 'currency'
                    : 'overview'
                }
                onNotify={notify}
              />
            </div>
          )}

          {/* SECTION: CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Category Taxonomy</h2>
                  <p className="text-xs text-[#7C746B]">Manage silhouettes, ready-to-wear lines, and modest edits.</p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider flex items-center space-x-2 font-medium hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#BA945A]" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Visual</th>
                      <th className="p-4">Name (English)</th>
                      <th className="p-4">Arabic Name</th>
                      <th className="p-4">Slug Identifier</th>
                      <th className="p-4">Products</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4">
                          {c.image ? (
                            <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded-xs border border-[#EAE5DE]" />
                          ) : (
                            <div className="w-10 h-10 bg-[#FAF8F5] border border-[#EAE5DE] flex items-center justify-center text-[#7C746B]">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-medium text-[#1D1D1B]">{c.name}</td>
                        <td className="p-4 font-cairo text-[#7C746B]">{c.name_ar}</td>
                        <td className="p-4 font-mono text-[#7C746B]">{c.slug}</td>
                        <td className="p-4 font-mono">{c.products_count || 0} pieces</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-medium rounded-xs">
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

          {/* SECTION: COLLECTIONS */}
          {activeSection === 'collections' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Curated Collections</h2>
                  <p className="text-xs text-[#7C746B]">Editorial campaign lookbooks and featured seasonal themes.</p>
                </div>
                <button
                  onClick={() => setIsCollectionModalOpen(true)}
                  className="px-4 py-2 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider flex items-center space-x-2 font-medium hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#BA945A]" />
                  <span>Create Collection</span>
                </button>
              </div>

              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Collection Title</th>
                      <th className="p-4">Arabic Title</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {collections.map((col) => (
                      <tr key={col.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-medium text-[#1D1D1B]">{col.name}</td>
                        <td className="p-4 font-cairo text-[#7C746B]">{col.name_ar}</td>
                        <td className="p-4 font-mono text-[#7C746B]">{col.slug}</td>
                        <td className="p-4 text-[#7C746B] max-w-xs truncate">{col.description || 'Editorial collection'}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-medium rounded-xs">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    {collections.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#7C746B]">
                          No custom collections created yet. Standard catalog in effect.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: ORDERS */}
          {activeSection === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Order Processing</h2>
                  <p className="text-xs text-[#7C746B]">Manage Egyptian orders, fulfillments, and status updates.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
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
                    className="bg-white border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Order Table */}
              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Inspect</th>
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
                        <td className="p-4 text-[#7C746B] font-mono">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-[#7C746B]">{order.items_count} pcs</td>
                        <td className="p-4 font-serif font-medium">{formatPrice(order.total, 'EGP')}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs ${
                              order.payment_status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
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
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              const res = await api.admin.getOrderDetails(order.id);
                              setSelectedOrder(res.order);
                            }}
                            className="px-3 py-1.5 border border-[#1D1D1B] text-[10px] uppercase tracking-wider hover:bg-[#1D1D1B] hover:text-[#FAF8F5] transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#7C746B]">
                          No client orders matched your current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: CUSTOMERS */}
          {activeSection === 'customers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Customer Directory</h2>
                  <p className="text-xs text-[#7C746B]">VIP patrons, guest accounts, and verified Egyptian client records.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7C746B] absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
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
                    className="bg-white border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Accounts</option>
                    <option value="active">Active Only</option>
                    <option value="disabled">Disabled Only</option>
                  </select>
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Location</th>
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
                        <td className="p-4 font-serif font-medium">{formatPrice(c.total_spent || 0, 'EGP')}</td>
                        <td className="p-4">
                          {c.email_verified ? (
                            <span className="text-emerald-700 font-medium">✓ Verified</span>
                          ) : (
                            <span className="text-[#7C746B]">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-medium rounded-xs ${
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
                            className="px-2.5 py-1 bg-[#1D1D1B] text-[#F7F4EF] text-[10px] uppercase tracking-wider hover:bg-black"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#7C746B]">
                          No client profiles found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: INVENTORY */}
          {activeSection === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Inventory & Stock Management</h2>
                  <p className="text-xs text-[#7C746B]">Monitor variant levels, low-stock alerts, and perform audited adjustments.</p>
                </div>
              </div>

              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Color</th>
                      <th className="p-4">Current Units</th>
                      <th className="p-4">Threshold</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-mono font-medium text-[#1D1D1B]">{item.sku}</td>
                        <td className="p-4 font-medium">{item.product_name}</td>
                        <td className="p-4 font-mono">{item.size}</td>
                        <td className="p-4 text-[#7C746B]">{item.color_name}</td>
                        <td className="p-4 font-serif font-bold text-sm">{item.stock}</td>
                        <td className="p-4 font-mono text-[#7C746B]">{item.low_stock_threshold || 5}</td>
                        <td className="p-4">
                          {item.stock === 0 ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] uppercase font-bold rounded-xs">
                              Depleted
                            </span>
                          ) : item.stock <= (item.low_stock_threshold || 5) ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase font-medium rounded-xs">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-medium rounded-xs">
                              Optimal
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
                            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#1D1D1B] text-[10px] uppercase tracking-wider hover:bg-[#1D1D1B] hover:text-[#FAF8F5] transition-colors"
                          >
                            Adjust
                          </button>
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
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Client Reviews Moderation</h2>
                <p className="text-xs text-[#7C746B]">Moderate verified purchase feedback and client testimonials.</p>
              </div>

              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Feedback</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-medium text-[#1D1D1B]">{r.product_name || 'Haute Garment'}</td>
                        <td className="p-4">{r.customer_name || 'Verified Client'}</td>
                        <td className="p-4 text-amber-500 font-bold">★ {r.rating}.0</td>
                        <td className="p-4 max-w-sm text-[#7C746B]">
                          <p className="font-medium text-[#1D1D1B]">{r.title}</p>
                          <p className="line-clamp-2">{r.comment}</p>
                        </td>
                        <td className="p-4 text-[#7C746B] font-mono">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-xs ${
                              r.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          {r.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateReviewStatus(r.id, 'approved')}
                              className="px-2 py-1 bg-emerald-700 text-white text-[10px] uppercase tracking-wider rounded-xs"
                            >
                              Approve
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateReviewStatus(r.id, 'rejected')}
                              className="px-2 py-1 bg-red-700 text-white text-[10px] uppercase tracking-wider rounded-xs"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#7C746B]">
                          No reviews currently pending moderation.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: STORE SETTINGS */}
          {activeSection === 'settings_store' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Store Configuration</h2>
                <p className="text-xs text-[#7C746B]">Configure brand parameters, atelier coordinates, and delivery policies.</p>
              </div>

              <div className="bg-white border border-[#EAE5DE] p-6 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#7C746B] mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      defaultValue="LORÉA Haute Couture"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 text-[#1D1D1B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#7C746B] mb-1">
                      Atelier Location
                    </label>
                    <input
                      type="text"
                      defaultValue="Zamalek & New Cairo, Egypt"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 text-[#1D1D1B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#7C746B] mb-1">
                      Concierge Email
                    </label>
                    <input
                      type="email"
                      defaultValue="concierge@lorea.com"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 text-[#1D1D1B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#7C746B] mb-1">
                      VIP Hotline
                    </label>
                    <input
                      type="tel"
                      defaultValue="+20 100 892 4432"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 text-[#1D1D1B]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE5DE] flex justify-end">
                  <button
                    onClick={() => notify('success', 'Store settings updated successfully.')}
                    className="px-6 py-2.5 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-black transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ADMIN SETTINGS & RBAC */}
          {activeSection === 'settings_admin' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Staff Access & Security</h2>
                <p className="text-xs text-[#7C746B]">Manage role-based privileges, active administrators, and database integrity.</p>
              </div>

              {/* Administrators Table */}
              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Privileges</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {adminUsers.map((adm) => (
                      <tr key={adm.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 font-medium text-[#1D1D1B]">
                          {adm.firstName} {adm.lastName}
                        </td>
                        <td className="p-4 font-mono text-[#7C746B]">{adm.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-[#BA945A]/20 text-[#8F703B] font-mono text-[10px] uppercase font-semibold rounded-xs">
                            {adm.role}
                          </span>
                        </td>
                        <td className="p-4 text-[#7C746B]">Full Catalog & Financial Engine</td>
                        <td className="p-4">
                          <span className="text-emerald-700 font-medium">Active</span>
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
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#1D1D1B]">Security Audit Trail</h2>
                <p className="text-xs text-[#7C746B]">Audited log of actions performed by administrative staff members.</p>
              </div>

              <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] uppercase text-[10px] tracking-wider text-[#7C746B]">
                    <tr>
                      <th className="p-4">Time</th>
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Entity</th>
                      <th className="p-4">Record ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DE]">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors font-mono">
                        <td className="p-4 text-[#7C746B]">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4 font-medium text-[#1D1D1B]">{log.admin_name}</td>
                        <td className="p-4 text-emerald-800 font-semibold">{log.action}</td>
                        <td className="p-4 text-[#7C746B]">{log.entity}</td>
                        <td className="p-4 text-[#7C746B]">{log.entity_id || '—'}</td>
                      </tr>
                    ))}
                    {activityLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#7C746B]">
                          No logged activity records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. MODALS AND DRAWERS */}

      {/* PRODUCT FORM MODAL (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
        collections={collections}
        isSaving={isSavingProduct}
      />

      {/* PRODUCT DETAIL MODAL (Inspect) */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onEdit={(prod) => {
          setSelectedProductForDetail(null);
          setProductToEdit(prod);
          setIsProductFormOpen(true);
        }}
        onDuplicate={handleDuplicateProduct}
        onDelete={(prod) => {
          setSelectedProductForDetail(null);
          setProductToDelete(prod);
        }}
        onStatusChange={handleProductStatusChange}
      />

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      <AdminDeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDeleteProduct}
        title="Delete Garment"
        itemDescription={productToDelete?.name}
        itemImageUrl={productToDelete?.primary_image}
        itemSku={productToDelete?.sku}
        isDeleting={isDeletingProduct}
        destructiveActionText="Confirm Deletion"
        orderWarningNotice={true}
      />

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
                  className="px-6 py-2 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-black"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-md p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#1D1D1B] mb-4">Create New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Name (EN) *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Name (Arabic) *</label>
                <input
                  type="text"
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-cairo"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Slug Identifier *</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. evening-gowns"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-mono"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-mono"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE5DE] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-black"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COLLECTION MODAL */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-md p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#1D1D1B] mb-4">Create New Collection</h3>
            <form onSubmit={handleCreateCollection} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Collection Title (EN) *</label>
                <input
                  type="text"
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Collection Title (Arabic) *</label>
                <input
                  type="text"
                  value={collectionForm.nameAr}
                  onChange={(e) => setCollectionForm({ ...collectionForm, nameAr: e.target.value })}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-cairo"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Slug *</label>
                <input
                  type="text"
                  value={collectionForm.slug}
                  onChange={(e) => setCollectionForm({ ...collectionForm, slug: e.target.value })}
                  placeholder="e.g. resort-2026"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3 font-mono"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider font-semibold mb-1">Description</label>
                <textarea
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 px-3"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE5DE] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D1D1B] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-black"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED ORDER INSPECTOR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#1D1D1B]">Order #{selectedOrder.order_number}</h3>
                <p className="text-xs text-[#7C746B]">
                  Client: {selectedOrder.customer_name} ({selectedOrder.customer_email})
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-[#FAF8F5] rounded-xs">
                <X className="w-5 h-5 text-[#7C746B] hover:text-[#1D1D1B]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                <div>
                  <span className="text-[#7C746B] block">Current Status:</span>
                  <span className="font-bold uppercase text-[#1D1D1B]">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-[#7C746B] block">Payment Method:</span>
                  <span className="font-bold uppercase text-[#1D1D1B]">{selectedOrder.payment_method}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider block mb-2">Order Items Snapshot</span>
                <div className="divide-y divide-[#EAE5DE] border border-[#EAE5DE] p-3 bg-[#FAF8F5]">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[#1D1D1B]">{item.product_name_snapshot}</p>
                        <p className="text-[11px] text-[#7C746B]">
                          Size: {item.size} · Color: {item.color_name} · Qty: {item.quantity} · SKU: {item.sku_snapshot}
                        </p>
                      </div>
                      <span className="font-serif font-medium">{formatPrice(item.total, 'EGP')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#7C746B]">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal, 'EGP')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Privilege:</span>
                    <span>-{formatPrice(selectedOrder.discount, 'EGP')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7C746B]">
                  <span>Courier Shipping (Cairo/Giza):</span>
                  <span>{formatPrice(selectedOrder.shipping_cost, 'EGP')}</span>
                </div>
                <div className="flex justify-between text-[#7C746B]">
                  <span>Estimated VAT:</span>
                  <span>{formatPrice(selectedOrder.tax, 'EGP')}</span>
                </div>
                <div className="pt-2 border-t border-[#EAE5DE] flex justify-between font-serif text-base font-bold text-[#1D1D1B]">
                  <span>Total Collected:</span>
                  <span>{formatPrice(selectedOrder.total, 'EGP')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-xl p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#1D1D1B]">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </h3>
                <p className="text-xs text-[#7C746B]">VIP Client Profile</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-[#FAF8F5] rounded-xs">
                <X className="w-5 h-5 text-[#7C746B] hover:text-[#1D1D1B]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#EAE5DE]">
                <div>
                  <span className="text-[#7C746B] block">Email:</span>
                  <span className="font-mono font-medium">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-[#7C746B] block">Phone:</span>
                  <span className="font-mono font-medium">{selectedCustomer.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#7C746B] block">Lifetime Orders:</span>
                  <span className="font-serif text-lg font-bold">{selectedCustomer.orders_count || 0}</span>
                </div>
                <div>
                  <span className="text-[#7C746B] block">Lifetime Value (LTV):</span>
                  <span className="font-serif text-lg font-bold text-[#BA945A]">
                    {formatPrice(selectedCustomer.total_spent || 0, 'EGP')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-base text-[#1D1D1B] mb-2">Registered Delivery Addresses</h4>
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((addr: any) => (
                      <div key={addr.id} className="p-3 bg-[#FAF8F5] border border-[#EAE5DE] text-xs">
                        <p className="font-medium text-[#1D1D1B]">{addr.full_name} ({addr.phone})</p>
                        <p className="text-[#7C746B]">
                          {addr.street}, Bldg {addr.building_number}, Apt {addr.apartment || '-'}
                        </p>
                        <p className="text-[#7C746B]">{addr.city}, {addr.governorate}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7C746B] italic">No saved delivery addresses on file.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
