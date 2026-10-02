import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Tag,
  Truck,
  Coins,
  ShieldCheck,
  Calendar,
  Plus,
  Check,
  AlertCircle,
  Clock,
  ArrowUpRight,
  X
} from 'lucide-react';
import { formatPrice } from '../../../utils/currency';
import { api } from '../../../services/api';

interface FinanceSectionProps {
  initialSubTab?: 'overview' | 'transactions' | 'discounts' | 'shipping_tax' | 'currency';
  onNotify: (type: 'success' | 'error', msg: string) => void;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  initialSubTab = 'overview',
  onNotify,
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'transactions' | 'discounts' | 'shipping_tax' | 'currency'>(initialSubTab);
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days' | '90days' | 'this_year' | 'all'>('30days');

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [financialSettings, setFinancialSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Coupon form modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number>(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(2000);
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState<number>(1000);
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState<number>(500);

  // Load finance data
  const loadFinanceData = async () => {
    try {
      setIsLoading(true);
      const [overviewRes, transRes, coupRes, settRes] = await Promise.all([
        api.admin.getFinanceOverview(timeframe),
        api.admin.getFinanceTransactions(),
        api.admin.getCoupons(),
        api.admin.getFinanceSettings(),
      ]);

      if (overviewRes) {
        setMetrics(overviewRes.metrics);
        setPaymentMethods(overviewRes.paymentMethods || []);
      }
      if (transRes) {
        setTransactions(transRes.transactions || []);
      }
      if (coupRes) {
        setCoupons(coupRes.coupons || []);
      }
      if (settRes) {
        setFinancialSettings(settRes.settings || {});
      }
    } catch (err: any) {
      console.error('Failed to load finance data:', err);
      onNotify('error', 'Failed to retrieve financial metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, [timeframe]);

  useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);

  // Handle saving financial and shipping settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      await api.admin.updateFinanceSettings(financialSettings);
      onNotify('success', 'Financial, tax, and shipping settings saved successfully.');
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle create coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      await api.admin.createCoupon({
        code: newCouponCode.trim(),
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        minOrderValue: Number(newCouponMinOrder),
        maxDiscount: newCouponType === 'percentage' ? Number(newCouponMaxDiscount) : null,
        usageLimit: Number(newCouponUsageLimit),
      });
      onNotify('success', `Coupon ${newCouponCode.toUpperCase()} created successfully.`);
      setIsCouponModalOpen(false);
      setNewCouponCode('');
      loadFinanceData();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to create coupon.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Finance Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE5DE] pb-3 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1D1D1B]">
            Financial Management & Accounting
          </h2>
          <p className="text-xs text-[#7C746B] font-light mt-0.5">
            Real-time commercial calculations, profit margins, tax compliance, and order transactions.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border border-[#D4CCC2] bg-white text-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Margins' },
            { id: 'transactions', label: 'Ledger Transactions' },
            { id: 'discounts', label: 'Discounts & Codes' },
            { id: 'shipping_tax', label: 'Tax & Shipping' },
            { id: 'currency', label: 'Currencies' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-2 font-mono uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                subTab === tab.id
                  ? 'bg-[#1D1D1B] text-white font-medium'
                  : 'text-[#7C746B] hover:text-[#1D1D1B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: FINANCIAL OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Timeframe Filter Bar */}
          <div className="flex items-center justify-between p-3.5 bg-white border border-[#EAE5DE]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#7C746B]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#1D1D1B] font-semibold">
                Accounting Timeframe:
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {[
                { id: 'today', label: 'Today' },
                { id: '7days', label: '7 Days' },
                { id: '30days', label: '30 Days' },
                { id: '90days', label: '90 Days' },
                { id: 'this_year', label: 'This Year' },
                { id: 'all', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeframe(t.id as any)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
                    timeframe === t.id
                      ? 'bg-[#BA945A] text-white font-medium'
                      : 'text-[#7C746B] hover:text-[#1D1D1B]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8 Commercial Financial Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Gross Revenue */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C746B] block">
                Gross Product Sales
              </span>
              <p className="font-serif text-2xl font-light text-[#1D1D1B]">
                {formatPrice(metrics?.grossRevenue || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                Sum of item prices × quantities
              </span>
            </div>

            {/* 2. Discounts Applied */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block">
                Total Discounts
              </span>
              <p className="font-serif text-2xl font-light text-amber-700">
                −{formatPrice(metrics?.totalDiscounts || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                Promotional coupons & VIP discounts
              </span>
            </div>

            {/* 3. Net Revenue */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B] font-semibold block">
                Net Product Revenue
              </span>
              <p className="font-serif text-2xl font-light text-[#1D1D1B]">
                {formatPrice(metrics?.netRevenue || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                Gross Sales − Discounts
              </span>
            </div>

            {/* 4. Cost of Goods Sold */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C746B] block">
                Cost of Goods (COGS)
              </span>
              <p className="font-serif text-2xl font-light text-[#7C746B]">
                {formatPrice(metrics?.costOfGoods || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                Fabric, atelier tailoring & direct costs
              </span>
            </div>

            {/* 5. Estimated Profit */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                Estimated Commercial Profit
              </span>
              <p className="font-serif text-2xl font-normal text-emerald-900">
                {formatPrice(metrics?.estimatedProfit || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-emerald-700 font-light block">
                Net Product Revenue − COGS
              </span>
            </div>

            {/* 6. Profit Margin */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                Gross Profit Margin
              </span>
              <p className="font-serif text-2xl font-normal text-emerald-900">
                {metrics?.profitMargin || 0}%
              </p>
              <span className="text-[10px] text-emerald-700 font-light block">
                (Estimated Profit / Net Revenue) × 100
              </span>
            </div>

            {/* 7. Shipping Revenue */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C746B] block">
                Shipping Collected
              </span>
              <p className="font-serif text-2xl font-light text-[#1D1D1B]">
                {formatPrice(metrics?.shippingRevenue || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                Non-complimentary delivery fees
              </span>
            </div>

            {/* 8. Taxes Collected */}
            <div className="p-4 bg-white border border-[#EAE5DE] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C746B] block">
                VAT / Taxes Collected
              </span>
              <p className="font-serif text-2xl font-light text-[#1D1D1B]">
                {formatPrice(metrics?.taxesCollected || 0, 'EGP')}
              </p>
              <span className="text-[10px] text-[#7C746B] font-light block">
                14% Egyptian Statutory Sales Tax
              </span>
            </div>
          </div>

          {/* Mathematical Formula Explanation Card */}
          <div className="p-5 bg-white border border-[#EAE5DE] space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block">
              FINANCIAL LOGIC & FORMULA SPECIFICATIONS (SINGLE SOURCE OF TRUTH)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[#55504A]">
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                <strong className="text-[#1D1D1B] block mb-1">Subtotal Formula:</strong>
                Subtotal = Gross Sales − Applied Discount
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                <strong className="text-[#1D1D1B] block mb-1">Order Total Formula:</strong>
                Order Total = Subtotal + Shipping Fee + Tax
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE]">
                <strong className="text-[#1D1D1B] block mb-1">Commercial Profit Formula:</strong>
                Profit = Net Product Revenue − Cost of Goods Sold
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          {paymentMethods.length > 0 && (
            <div className="bg-white border border-[#EAE5DE] p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold block mb-3">
                SETTLEMENT CHANNELS & PAYMENT BREAKDOWN
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((pm) => (
                  <div key={pm.payment_method} className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DE]">
                    <span className="text-xs font-medium text-[#1D1D1B] block truncate">
                      {pm.payment_method}
                    </span>
                    <p className="font-serif text-lg font-normal text-[#1D1D1B] mt-1">
                      {formatPrice(pm.total_amount, 'EGP')}
                    </p>
                    <span className="text-[10px] font-mono text-[#7C746B]">
                      {pm.count} completed order(s)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TRANSACTIONS LEDGER */}
      {subTab === 'transactions' && (
        <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EAE5DE] flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1D1D1B] font-semibold">
              COMMERCIAL LEDGER TRANSACTIONS ({transactions.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] font-mono text-[10px] text-[#7C746B] uppercase">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Subtotal</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Total Settled</th>
                  <th className="py-3 px-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DE]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#7C746B]">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.order_id || tx.order_number} className="hover:bg-[#FAF8F5]/80">
                      <td className="py-3 px-4 font-mono font-medium text-[#1D1D1B]">
                        {tx.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#1D1D1B] block">{tx.customer_name}</span>
                        <span className="text-[10px] text-[#7C746B] font-mono">{tx.customer_email}</span>
                      </td>
                      <td className="py-3 px-4 text-[#7C746B] font-mono text-[11px]">
                        {new Date(tx.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-[#1D1D1B]">
                        {tx.payment_method}
                      </td>
                      <td className="py-3 px-4 font-serif text-[#1D1D1B]">
                        {formatPrice(tx.subtotal, tx.currency || 'EGP')}
                      </td>
                      <td className="py-3 px-4 font-serif text-amber-700">
                        {tx.discount > 0 ? `−${formatPrice(tx.discount, tx.currency || 'EGP')}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-serif font-medium text-[#1D1D1B]">
                        {formatPrice(tx.amount, tx.currency || 'EGP')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase ${
                          tx.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DISCOUNTS & COUPONS */}
      {subTab === 'discounts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1D1D1B] font-semibold">
              ACTIVE PROMOTIONAL CODES & DISCOUNTS ({coupons.length})
            </span>
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-[#1D1D1B] hover:bg-[#BA945A] text-white text-xs uppercase tracking-wider font-medium flex items-center space-x-1.5 transition-colors cursor-pointer rounded-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="bg-white border border-[#EAE5DE] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE5DE] font-mono text-[10px] text-[#7C746B] uppercase">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount Type</th>
                    <th className="py-3 px-4">Value</th>
                    <th className="py-3 px-4">Min. Order</th>
                    <th className="py-3 px-4">Max. Cap</th>
                    <th className="py-3 px-4">Usage Count</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DE]">
                  {coupons.map((c) => (
                    <tr key={c.id || c.code} className="hover:bg-[#FAF8F5]/80">
                      <td className="py-3 px-4 font-mono font-bold text-[#1D1D1B]">
                        {c.code}
                      </td>
                      <td className="py-3 px-4 uppercase font-mono text-[11px] text-[#7C746B]">
                        {c.discount_type}
                      </td>
                      <td className="py-3 px-4 font-serif font-medium text-[#1D1D1B]">
                        {c.discount_type === 'percentage' ? `${c.discount_value}%` : formatPrice(c.discount_value, 'EGP')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#7C746B]">
                        {c.min_order_value ? formatPrice(c.min_order_value, 'EGP') : 'No min'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#7C746B]">
                        {c.max_discount ? formatPrice(c.max_discount, 'EGP') : 'None'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#1D1D1B]">
                        {c.times_used || 0} / {c.usage_limit || '∞'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800">
                          {c.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TAX & SHIPPING SETTINGS */}
      {subTab === 'shipping_tax' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax Settings */}
            <div className="p-5 bg-white border border-[#EAE5DE] space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#EAE5DE]">
                <Receipt className="w-4 h-4 text-[#BA945A]" />
                <h3 className="font-serif text-lg font-normal text-[#1D1D1B]">
                  Tax Configuration
                </h3>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={financialSettings.tax_enabled === 'true'}
                    onChange={(e) =>
                      setFinancialSettings((prev) => ({
                        ...prev,
                        tax_enabled: e.target.checked ? 'true' : 'false',
                      }))
                    }
                    className="w-4 h-4 text-[#BA945A] rounded-xs"
                  />
                  <span className="font-medium text-[#1D1D1B]">Enable Statutory Sales Tax</span>
                </label>
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={financialSettings.tax_rate || '14'}
                  onChange={(e) =>
                    setFinancialSettings((prev) => ({ ...prev, tax_rate: e.target.value }))
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B]"
                />
                <span className="text-[10px] text-[#7C746B] font-light mt-0.5 block">
                  Standard Egyptian VAT is 14%.
                </span>
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Tax Pricing Mode
                </label>
                <select
                  value={financialSettings.tax_mode || 'inclusive'}
                  onChange={(e) =>
                    setFinancialSettings((prev) => ({ ...prev, tax_mode: e.target.value }))
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B]"
                >
                  <option value="inclusive">Tax-Inclusive (Prices already contain tax)</option>
                  <option value="exclusive">Tax-Exclusive (Tax added at checkout)</option>
                </select>
              </div>
            </div>

            {/* Shipping Settings */}
            <div className="p-5 bg-white border border-[#EAE5DE] space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#EAE5DE]">
                <Truck className="w-4 h-4 text-[#BA945A]" />
                <h3 className="font-serif text-lg font-normal text-[#1D1D1B]">
                  Shipping & Courier Fees
                </h3>
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Free Shipping Threshold (EGP)
                </label>
                <input
                  type="number"
                  value={financialSettings.free_shipping_threshold || '2500'}
                  onChange={(e) =>
                    setFinancialSettings((prev) => ({
                      ...prev,
                      free_shipping_threshold: e.target.value,
                    }))
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B]"
                />
                <span className="text-[10px] text-[#7C746B] font-light mt-0.5 block">
                  Orders equal or above this value unlock complimentary delivery across Egypt.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Cairo & Giza Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={financialSettings.shipping_fee_cairo || '75'}
                    onChange={(e) =>
                      setFinancialSettings((prev) => ({
                        ...prev,
                        shipping_fee_cairo: e.target.value,
                      }))
                    }
                    className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Governorates Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={financialSettings.shipping_fee_governorates || '120'}
                    onChange={(e) =>
                      setFinancialSettings((prev) => ({
                        ...prev,
                        shipping_fee_governorates: e.target.value,
                      }))
                    }
                    className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs font-mono text-[#1D1D1B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Delivery Time Promise
                </label>
                <input
                  type="text"
                  value={
                    financialSettings.delivery_estimate ||
                    '24–48 hours across Cairo & Giza; 2–4 days for other governorates'
                  }
                  onChange={(e) =>
                    setFinancialSettings((prev) => ({
                      ...prev,
                      delivery_estimate: e.target.value,
                    }))
                  }
                  className="w-full bg-[#FAF8F5] border border-[#D4CCC2] px-3.5 py-2 text-xs text-[#1D1D1B]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-2.5 bg-[#1D1D1B] hover:bg-[#BA945A] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-medium cursor-pointer rounded-xs transition-colors"
            >
              {isSavingSettings ? 'Saving Configuration...' : 'Save Financial & Shipping Settings'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 5: CURRENCY CONFIGURATION */}
      {subTab === 'currency' && (
        <div className="p-5 bg-white border border-[#EAE5DE] space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#EAE5DE]">
            <Coins className="w-4 h-4 text-[#BA945A]" />
            <h3 className="font-serif text-lg font-normal text-[#1D1D1B]">
              Store Currency Architecture
            </h3>
          </div>

          <p className="text-xs text-[#7C746B] leading-relaxed max-w-2xl font-light">
            LORÉA’s financial accounting core is natively anchored in <strong>Egyptian Pounds (EGP / ج.م)</strong> to reflect primary Egyptian commerce, with automatic conversion tables to international currencies for international guests.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE]">
              <span className="font-mono text-xs uppercase text-[#BA945A] font-bold block mb-1">
                PRIMARY / BASE CURRENCY
              </span>
              <p className="font-serif text-xl text-[#1D1D1B]">Egyptian Pound (EGP)</p>
              <span className="font-mono text-xs text-[#7C746B] mt-1 block">Symbol: ج.م / LE</span>
            </div>

            <div className="p-4 bg-white border border-[#EAE5DE]">
              <span className="font-mono text-xs uppercase text-[#7C746B] font-bold block mb-1">
                US DOLLAR (USD)
              </span>
              <p className="font-serif text-xl text-[#1D1D1B]">~ 0.020 USD per 1 EGP</p>
              <span className="font-mono text-xs text-[#7C746B] mt-1 block">Symbol: $</span>
            </div>

            <div className="p-4 bg-white border border-[#EAE5DE]">
              <span className="font-mono text-xs uppercase text-[#7C746B] font-bold block mb-1">
                EURO (EUR)
              </span>
              <p className="font-serif text-xl text-[#1D1D1B]">~ 0.0185 EUR per 1 EGP</p>
              <span className="font-mono text-xs text-[#7C746B] mt-1 block">Symbol: €</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
              <h3 className="font-serif text-xl text-[#1D1D1B]">Create Promotional Coupon</h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-[#7C746B] hover:text-[#1D1D1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIPCAIRO20"
                  className="w-full bg-white border border-[#D4CCC2] px-3.5 py-2 font-mono uppercase text-[#1D1D1B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Type
                  </label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-white border border-[#D4CCC2] px-3 py-2 text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (EGP)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4CCC2] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Min. Order Amount (EGP)
                  </label>
                  <input
                    type="number"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4CCC2] px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-mono tracking-wider text-[#7C746B] block mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    value={newCouponUsageLimit}
                    onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4CCC2] px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 uppercase tracking-wider text-[#7C746B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1D1D1B] hover:bg-[#BA945A] text-white uppercase tracking-wider font-medium rounded-xs"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
