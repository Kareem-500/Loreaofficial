import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Shield,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  KeyRound,
  Laptop,
  Smartphone,
  Phone,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api, Order, Address, CustomerProfile } from '../../services/api';
import { Currency } from '../../types';
import { formatPrice } from '../../utils/currency';

interface CustomerAccountViewProps {
  currency: Currency;
  onOpenWishlistDrawer: () => void;
  onNavigateToShop: () => void;
  onSelectProductById: (productId: string) => void;
}

export const CustomerAccountView: React.FC<CustomerAccountViewProps> = ({
  currency,
  onOpenWishlistDrawer,
  onNavigateToShop,
  onSelectProductById,
}) => {
  const { user, logout, refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'profile' | 'security'>('overview');

  // Data states
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  // Loading & feedback states
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Address modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    governorate: 'Cairo',
    city: 'New Cairo',
    area: '',
    street: '',
    buildingNumber: '',
    apartment: '',
    floor: '',
    instructions: '',
    isDefault: false,
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Female',
    bio: '',
    marketingConsent: true,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, ordersRes, addressesRes, sessionsRes] = await Promise.all([
        api.account.getProfile().catch(() => ({ profile: null as any })),
        api.account.getOrders().catch(() => ({ orders: [] })),
        api.account.getAddresses().catch(() => ({ addresses: [] })),
        api.account.getSessions().catch(() => ({ sessions: [] })),
      ]);

      if (profileRes.profile) {
        setProfile(profileRes.profile);
        setProfileForm({
          firstName: profileRes.profile.first_name || '',
          lastName: profileRes.profile.last_name || '',
          phone: profileRes.profile.phone || '',
          dateOfBirth: profileRes.profile.date_of_birth || '',
          gender: profileRes.profile.gender || 'Female',
          bio: profileRes.profile.bio || '',
          marketingConsent: Boolean(profileRes.profile.marketing_consent),
        });
      }

      setOrders(ordersRes.orders || []);
      setAddresses(addressesRes.addresses || []);
      setSessions(sessionsRes.sessions || []);
    } catch (err) {
      console.error('Failed to load account data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Profile update handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.account.updateProfile(profileForm);
      await refreshUser();
      showNotification('success', language === 'ar' ? 'تم تحديث البيانات بنجاح.' : 'Profile updated successfully.');
      loadAccountData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update profile.');
    }
  };

  // Address create/edit handler
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await api.account.updateAddress(editingAddressId, addressForm);
        showNotification('success', language === 'ar' ? 'تم تحديث العنوان بنجاح.' : 'Address updated.');
      } else {
        await api.account.createAddress(addressForm);
        showNotification('success', language === 'ar' ? 'تمت إضافة العنوان الجديد.' : 'New address added.');
      }
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
      loadAccountData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm(language === 'ar' ? 'هل أنتِ متأكدة من حذف هذا العنوان؟' : 'Delete this saved address?')) return;
    try {
      await api.account.deleteAddress(id);
      showNotification('success', language === 'ar' ? 'تم حذف العنوان.' : 'Address deleted.');
      loadAccountData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete address.');
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('error', language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    try {
      await api.account.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      showNotification('success', language === 'ar' ? 'تم تغيير كلمة المرور بأمان.' : 'Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to change password.');
    }
  };

  const defaultAddress = addresses.find((a) => a.is_default === 1) || addresses[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 font-medium">Delivered</span>;
      case 'shipped':
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-sky-100 text-sky-800 font-medium">In Transit</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 font-medium">Processing</span>;
      case 'confirmed':
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-indigo-100 text-indigo-800 font-medium">Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-rose-100 text-rose-800 font-medium">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider bg-stone-200 text-stone-800 font-medium">Pending</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Greeting Banner */}
      <div className="bg-[#151413] text-[#F7F4EF] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B88F88] font-medium">
              ATELIER PRIVÉ CLIENT
            </span>
            {user?.emailVerified && (
              <span className="inline-flex items-center text-[10px] uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5">
                <Check className="w-2.5 h-2.5 mr-1" /> Verified
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F7F4EF] font-light">
            {language === 'ar' ? `مرحباً، ${user?.firstName || 'عميلتنا العزيزة'}` : `Welcome, ${user?.firstName || 'Valued Client'}`}
          </h1>
          <p className="text-xs sm:text-sm text-[#B7ADA2] font-light mt-1">
            {user?.email} · {language === 'ar' ? 'عضوية دار لوريا بالقاهرة' : 'LORÉA Cairo Maison Membership'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToShop()}
            className="px-4 py-2.5 bg-[#F7F4EF] text-[#1D1D1B] hover:bg-white text-xs uppercase tracking-widest font-medium transition-colors"
          >
            {language === 'ar' ? 'تصفح المجموعة' : 'Explore Collection'}
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2.5 bg-transparent border border-[#B7ADA2]/40 text-[#B7ADA2] hover:text-white hover:border-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t('account.logout')}</span>
          </button>
        </div>
      </div>

      {/* Floating feedback toast */}
      {feedback && (
        <div
          className={`mb-6 p-4 text-xs font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Main Grid: Navigation Tabs on left, Content on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: 'overview', label: t('account.overview'), icon: User },
            { id: 'orders', label: `${t('account.orders')} (${orders.length})`, icon: Package },
            { id: 'addresses', label: `${t('account.addresses')} (${addresses.length})`, icon: MapPin },
            { id: 'profile', label: t('account.profile'), icon: Edit2 },
            { id: 'security', label: t('account.security'), icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSelectedOrder(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs tracking-wider uppercase font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#1D1D1B] text-[#F7F4EF]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#1D1D1B] border border-[#EAE5DE]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B88F88]' : 'text-[#7C746B]'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 rtl:rotate-180 opacity-60`} />
              </button>
            );
          })}

          <button
            onClick={onOpenWishlistDrawer}
            className="w-full flex items-center justify-between px-4 py-3.5 text-xs tracking-wider uppercase font-medium transition-all text-left bg-white hover:bg-[#FAF8F5] text-[#1D1D1B] border border-[#EAE5DE] mt-3"
          >
            <div className="flex items-center space-x-3">
              <Heart className="w-4 h-4 text-[#B88F88]" />
              <span>{t('account.wishlist')}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#EAE5DE] p-5">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-medium block">
                    TOTAL ORDERS
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-1">{orders.length}</div>
                  <p className="text-[11px] text-[#7C746B] mt-1 font-light">
                    {orders.filter((o) => o.status === 'delivered').length} delivered successfully
                  </p>
                </div>

                <div className="bg-white border border-[#EAE5DE] p-5">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-medium block">
                    ACTIVE SHIPMENTS
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-1">
                    {orders.filter((o) => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
                  </div>
                  <p className="text-[11px] text-[#7C746B] mt-1 font-light">Dispatched from Cairo atelier</p>
                </div>

                <div className="bg-white border border-[#EAE5DE] p-5">
                  <span className="text-[10px] tracking-widest uppercase text-[#7C746B] font-medium block">
                    SAVED ADDRESSES
                  </span>
                  <div className="font-serif text-3xl text-[#1D1D1B] mt-1">{addresses.length}</div>
                  <p className="text-[11px] text-[#7C746B] mt-1 font-light">
                    {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.governorate}` : 'No address set'}
                  </p>
                </div>
              </div>

              {/* Default Address & Membership Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#EAE5DE] p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE] mb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#1D1D1B]">
                      Primary Delivery Address
                    </span>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-xs text-[#B88F88] hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  {defaultAddress ? (
                    <div className="text-xs space-y-1 text-[#1D1D1B] leading-relaxed">
                      <p className="font-medium text-sm">{defaultAddress.full_name}</p>
                      <p>{defaultAddress.street}, Bldg {defaultAddress.building_number}{defaultAddress.apartment ? `, Apt ${defaultAddress.apartment}` : ''}</p>
                      <p>{defaultAddress.city}, {defaultAddress.governorate}</p>
                      <p className="text-[#7C746B] pt-1">Phone: {defaultAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#7C746B] font-light">No saved address yet.</p>
                  )}
                </div>

                <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-[#EAE5DE] mb-4">
                    <Sparkles className="w-4 h-4 text-[#B88F88]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#1D1D1B]">
                      Atelier Privé Privileges
                    </span>
                  </div>
                  <ul className="text-xs text-[#7C746B] space-y-2 font-light">
                    <li>✓ Complimentary styling advice with our Cairo bespoke atelier</li>
                    <li>✓ Priority dispatch on limited-run Giza cotton and linen edits</li>
                    <li>✓ Extended 14-day complimentary exchange across Egypt</li>
                  </ul>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white border border-[#EAE5DE] p-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-4">
                  <h3 className="font-serif text-xl text-[#1D1D1B]">Recent Atelier Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs uppercase tracking-widest text-[#1D1D1B] underline hover:text-[#B88F88]"
                  >
                    View all orders →
                  </button>
                </div>

                {(orders || []).length === 0 ? (
                  <p className="text-xs text-[#7C746B] py-6 text-center font-light">
                    {t('common.empty_orders')}
                  </p>
                ) : (
                  <div className="divide-y divide-[#EAE5DE]">
                    {(orders || []).slice(0, 3).map((order) => (
                      <div key={order.id} className="py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-xs text-[#1D1D1B]">{order.order_number}</p>
                          <p className="text-[11px] text-[#7C746B]">
                            {new Date(order.created_at).toLocaleDateString()} · {order.items?.length || order.items_count || 1} items
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-serif text-sm text-[#1D1D1B]">
                            {formatPrice(order.total, currency)}
                          </span>
                          {getStatusBadge(order.status)}
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setActiveTab('orders');
                            }}
                            className="p-1 text-[#7C746B] hover:text-[#1D1D1B]"
                          >
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {selectedOrder ? (
                /* Detailed Order Inspector */
                <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
                    <div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B] mb-2 block"
                      >
                        ← Back to all orders
                      </button>
                      <h3 className="font-serif text-2xl text-[#1D1D1B]">
                        Order #{selectedOrder.order_number}
                      </h3>
                      <p className="text-xs text-[#7C746B]">
                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>

                  {/* Tracking Bar */}
                  <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#7C746B] block">
                        COURIER TRACKING (EGYPT DOMESTIC)
                      </span>
                      <p className="font-mono text-sm font-medium text-[#1D1D1B] mt-0.5">
                        {selectedOrder.tracking_number || 'Awaiting dispatch assignment'}
                      </p>
                    </div>
                    <div className="text-xs text-[#7C746B]">
                      Carrier: <span className="font-medium text-[#1D1D1B]">Bosta / LORÉA Private Courier</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-8">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1D1D1B] mb-4">
                      Pieces in this Order ({selectedOrder.items?.length || 0})
                    </h4>
                    <div className="divide-y divide-[#EAE5DE] border-t border-b border-[#EAE5DE]">
                      {(selectedOrder.items || []).map((item) => (
                        <div key={item.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name_snapshot}
                                className="w-14 h-18 object-cover bg-[#EAE5DE]"
                              />
                            ) : (
                              <div className="w-14 h-18 bg-[#FAF8F5] border border-[#EAE5DE]" />
                            )}
                            <div>
                              <p className="font-serif text-sm text-[#1D1D1B]">
                                {item.product_name_snapshot}
                              </p>
                              <p className="text-[11px] text-[#7C746B] mt-0.5">
                                SKU: {item.sku_snapshot} · Size: {item.size} · Color: {item.color_name}
                              </p>
                              <p className="text-xs text-[#1D1D1B] mt-1">
                                Qty: {item.quantity} × {formatPrice(item.price, currency)}
                              </p>
                            </div>
                          </div>
                          <span className="font-serif text-sm font-medium text-[#1D1D1B]">
                            {formatPrice(item.total, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Financial Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE5DE]">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1D1D1B] mb-2">
                        Delivery Address
                      </h4>
                      <div className="text-xs text-[#7C746B] space-y-1">
                        <p className="font-medium text-[#1D1D1B]">
                          {selectedOrder.shippingAddress?.fullName}
                        </p>
                        <p>
                          {selectedOrder.shippingAddress?.street}, Bldg {selectedOrder.shippingAddress?.buildingNumber}
                        </p>
                        <p>
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.governorate}
                        </p>
                        <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                        <p className="pt-1">Payment Method: {selectedOrder.payment_method}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-[#7C746B]">
                        <span>Subtotal:</span>
                        <span>{formatPrice(selectedOrder.subtotal, currency)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-[#964036]">
                          <span>Privilege Discount:</span>
                          <span>-{formatPrice(selectedOrder.discount, currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#7C746B]">
                        <span>Express Delivery:</span>
                        <span>
                          {selectedOrder.shipping_cost === 0
                            ? 'Complimentary'
                            : formatPrice(selectedOrder.shipping_cost, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-serif font-medium text-[#1D1D1B] pt-2 border-t border-[#EAE5DE]">
                        <span>Total Paid:</span>
                        <span>{formatPrice(selectedOrder.total, currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Orders List */
                <div className="bg-white border border-[#EAE5DE] p-6">
                  <h3 className="font-serif text-2xl text-[#1D1D1B] mb-6">
                    My Order Archive ({(orders || []).length})
                  </h3>
                  {(orders || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-[#EAE5DE] mx-auto mb-3" />
                      <p className="text-xs text-[#7C746B]">{t('common.empty_orders')}</p>
                      <button
                        onClick={onNavigateToShop}
                        className="mt-4 px-6 py-2.5 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-widest"
                      >
                        Explore Pieces
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#EAE5DE]">
                      {(orders || []).map((order) => (
                        <div
                          key={order.id}
                          className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-sm font-semibold text-[#1D1D1B]">
                                {order.order_number}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-xs text-[#7C746B] mt-1">
                              Ordered on {new Date(order.created_at).toLocaleDateString()} · {order.items_count || order.items?.length || 1} items
                            </p>
                            {order.tracking_number && (
                              <p className="text-[11px] font-mono text-[#7C746B] mt-0.5">
                                Tracking: {order.tracking_number}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-6">
                            <span className="font-serif text-base font-medium text-[#1D1D1B]">
                              {formatPrice(order.total, currency)}
                            </span>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-4 py-2 border border-[#1D1D1B] text-xs uppercase tracking-wider font-medium text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F7F4EF] transition-all"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#1D1D1B]">Address Book</h3>
                  <p className="text-xs text-[#7C746B]">
                    Manage your shipping locations across Cairo, Alexandria, and Egypt.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                      phone: user?.phone || '+20 ',
                      governorate: 'Cairo',
                      city: 'New Cairo',
                      area: '',
                      street: '',
                      buildingNumber: '',
                      apartment: '',
                      floor: '',
                      instructions: '',
                      isDefault: addresses.length === 0,
                    });
                    setIsAddressModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-xs text-[#7C746B] py-8 text-center font-light">
                  No saved addresses found. Please add a shipping destination.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 border relative transition-all ${
                        addr.is_default === 1
                          ? 'border-[#1D1D1B] bg-[#FAF8F5]'
                          : 'border-[#EAE5DE] bg-white'
                      }`}
                    >
                      {addr.is_default === 1 && (
                        <span className="absolute top-4 right-4 text-[9px] tracking-widest uppercase bg-[#1D1D1B] text-[#F7F4EF] px-2 py-0.5 font-medium">
                          DEFAULT
                        </span>
                      )}
                      <p className="font-medium text-sm text-[#1D1D1B] mb-1">{addr.full_name}</p>
                      <p className="text-xs text-[#7C746B]">
                        {addr.street}, Bldg {addr.building_number}
                        {addr.apartment ? `, Apt ${addr.apartment}` : ''}
                      </p>
                      <p className="text-xs text-[#7C746B]">
                        {addr.city}, {addr.governorate}
                      </p>
                      <p className="text-xs text-[#1D1D1B] pt-2 font-mono">{addr.phone}</p>

                      <div className="mt-4 pt-3 border-t border-[#EAE5DE] flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddressForm({
                              fullName: addr.full_name,
                              phone: addr.phone,
                              governorate: addr.governorate,
                              city: addr.city,
                              area: addr.area || '',
                              street: addr.street,
                              buildingNumber: addr.building_number,
                              apartment: addr.apartment || '',
                              floor: addr.floor || '',
                              instructions: addr.instructions || '',
                              isDefault: addr.is_default === 1,
                            });
                            setIsAddressModalOpen(true);
                          }}
                          className="text-[#1D1D1B] underline hover:text-[#B88F88] flex items-center space-x-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[#964036] hover:underline flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8">
              <h3 className="font-serif text-2xl text-[#1D1D1B] mb-2">Personal Information</h3>
              <p className="text-xs text-[#7C746B] mb-6">
                Update your client credentials and bespoke concierge preferences.
              </p>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-[#EAE5DE]/40 border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#7C746B] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Phone Number (+20)
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+20 100 123 4567"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Styling Category
                    </label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    >
                      <option value="Female">Women's Couture & Ready-to-Wear</option>
                      <option value="Unisex">Contemporary Minimalist</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                    Personal Wardrobe Notes
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Preferred fabrics, silhouettes, or bespoke size tailoring preferences..."
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs p-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-xs text-[#7C746B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.marketingConsent}
                      onChange={(e) => setProfileForm({ ...profileForm, marketingConsent: e.target.checked })}
                      className="w-4 h-4 accent-[#1D1D1B]"
                    />
                    <span>Receive curated seasonal lookbooks and private runway invitations.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-widest font-medium transition-all"
                >
                  {t('common.save')}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Change Password Form */}
              <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8">
                <h3 className="font-serif text-2xl text-[#1D1D1B] mb-2">Security & Password</h3>
                <p className="text-xs text-[#7C746B] mb-6">
                  Ensure your atelier profile remains protected with a strong, distinct password.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Min 8 chars with uppercase, digit, symbol"
                      required
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2.5 px-3 text-[#1D1D1B] focus:border-[#1D1D1B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333] text-[#F7F4EF] text-xs uppercase tracking-widest font-medium transition-all"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Active Sessions */}
              <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE] mb-4">
                  <h4 className="font-serif text-xl text-[#1D1D1B]">Active Login Sessions</h4>
                  <button
                    onClick={async () => {
                      await api.account.logoutAll();
                      logout();
                    }}
                    className="text-xs text-[#964036] hover:underline uppercase tracking-wider"
                  >
                    Sign Out All Devices
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 bg-[#FAF8F5] border border-[#EAE5DE] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {sess.device.includes('iPhone') ? (
                          <Smartphone className="w-5 h-5 text-[#7C746B]" />
                        ) : (
                          <Laptop className="w-5 h-5 text-[#7C746B]" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-[#1D1D1B]">
                            {sess.device}{' '}
                            {sess.isCurrent && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 ml-1">
                                This Browser
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[#7C746B]">
                            {sess.location} · IP: {sess.ip}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#7C746B]">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Create/Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DE] w-full max-w-lg p-6 sm:p-8 relative">
            <h3 className="font-serif text-2xl text-[#1D1D1B] mb-4">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Phone (+20) *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Governorate *
                  </label>
                  <select
                    value={addressForm.governorate}
                    onChange={(e) => setAddressForm({ ...addressForm, governorate: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  >
                    <option value="Cairo">Cairo</option>
                    <option value="Giza">Giza</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Red Sea (El Gouna)">Red Sea (El Gouna)</option>
                    <option value="South Sinai">South Sinai</option>
                    <option value="Dakahlia">Dakahlia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. New Cairo"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Area / Quarter
                  </label>
                  <input
                    type="text"
                    value={addressForm.area}
                    onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                    placeholder="e.g. 5th Settlement"
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                  Street Name *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. Teseen St."
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Bldg *
                  </label>
                  <input
                    type="text"
                    value={addressForm.buildingNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, buildingNumber: e.target.value })}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={addressForm.floor}
                    onChange={(e) => setAddressForm({ ...addressForm, floor: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1D1D1B] font-medium mb-1">
                    Apt #
                  </label>
                  <input
                    type="text"
                    value={addressForm.apartment}
                    onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DE] text-xs py-2 px-3 text-[#1D1D1B]"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 text-xs text-[#1D1D1B] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-[#1D1D1B]"
                />
                <span>Set as default delivery address</span>
              </label>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE5DE] text-xs uppercase tracking-wider text-[#7C746B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
