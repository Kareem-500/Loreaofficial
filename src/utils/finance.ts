/**
 * LORÉA Haute Couture E-Commerce Financial Calculation Engine
 * Unified source of truth for commercial and accounting formulas across:
 * - Product Catalog & Profit Margin Analysis
 * - Cart, Checkout & Free Shipping Threshold Meters
 * - Orders & Customer Invoices
 * - Admin Executive Dashboard & Real-Time Financial Reports
 */

export interface OrderItemFinancialInput {
  price: number;
  quantity: number;
  costPrice?: number;
}

export interface FinancialCalculationResult {
  grossSales: number;
  discountAmount: number;
  subtotal: number;
  taxableAmount: number;
  taxAmount: number;
  shippingFee: number;
  isFreeShipping: boolean;
  orderTotal: number;
  costOfGoods: number;
  estimatedProfit: number;
  profitMarginPercent: number;
}

export interface StoreFinancialConfig {
  currencyCode: string;
  currencySymbol: string;
  taxEnabled: boolean;
  taxRatePercent: number;
  taxMode: 'inclusive' | 'exclusive';
  standardShippingFee: number;
  freeShippingThreshold: number;
}

export const DEFAULT_FINANCIAL_CONFIG: StoreFinancialConfig = {
  currencyCode: 'EGP',
  currencySymbol: 'ج.م',
  taxEnabled: false,
  taxRatePercent: 14,
  taxMode: 'inclusive',
  standardShippingFee: 75,
  freeShippingThreshold: 2500,
};

/**
 * Calculates complete order financials using standard luxury e-commerce accounting:
 * 1. Gross Sales = Sum of (Product Price × Quantity)
 * 2. Applied Discount = Discount Amount
 * 3. Subtotal = Gross Sales - Discount
 * 4. Shipping = Subtotal >= Free Shipping Threshold ? 0 : Shipping Fee
 * 5. Tax = Tax Enabled ? (Tax Mode === 'exclusive' ? Subtotal × (Tax Rate / 100) : included in subtotal) : 0
 * 6. Order Total = Subtotal + Tax (if exclusive) + Shipping
 * 7. Cost of Goods = Sum of (Cost Price × Quantity)
 * 8. Estimated Profit = Subtotal - Cost of Goods
 * 9. Profit Margin = (Estimated Profit / Subtotal) × 100
 */
export function calculateOrderFinancials(
  items: OrderItemFinancialInput[],
  discountAmount: number = 0,
  config: Partial<StoreFinancialConfig> = {}
): FinancialCalculationResult {
  const activeConfig: StoreFinancialConfig = {
    ...DEFAULT_FINANCIAL_CONFIG,
    ...config,
  };

  const grossSales = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const safeDiscount = Math.min(grossSales, Math.max(0, Number(discountAmount) || 0));
  const subtotal = Math.max(0, grossSales - safeDiscount);

  // Shipping logic
  const isFreeShipping = subtotal >= activeConfig.freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : activeConfig.standardShippingFee;

  // Tax calculation
  let taxAmount = 0;
  let taxableAmount = subtotal;

  if (activeConfig.taxEnabled) {
    if (activeConfig.taxMode === 'exclusive') {
      taxAmount = Number((subtotal * (activeConfig.taxRatePercent / 100)).toFixed(2));
    } else {
      // Inclusive: tax is already inside the subtotal: Tax = Subtotal - (Subtotal / (1 + rate))
      taxAmount = Number((subtotal - subtotal / (1 + activeConfig.taxRatePercent / 100)).toFixed(2));
    }
  }

  const orderTotal = activeConfig.taxMode === 'exclusive'
    ? Number((subtotal + taxAmount + shippingFee).toFixed(2))
    : Number((subtotal + shippingFee).toFixed(2));

  // Cost of Goods Sold (COGS)
  const costOfGoods = items.reduce((sum, item) => {
    // If specific cost price is not provided, estimate luxury production at 35% of retail price
    const unitCost = item.costPrice !== undefined && item.costPrice > 0
      ? item.costPrice
      : (item.price || 0) * 0.35;
    return sum + unitCost * (item.quantity || 1);
  }, 0);

  const estimatedProfit = Math.max(0, subtotal - costOfGoods);
  const profitMarginPercent = subtotal > 0
    ? Number(((estimatedProfit / subtotal) * 100).toFixed(1))
    : 0;

  return {
    grossSales,
    discountAmount: safeDiscount,
    subtotal,
    taxableAmount,
    taxAmount,
    shippingFee,
    isFreeShipping,
    orderTotal,
    costOfGoods,
    estimatedProfit,
    profitMarginPercent,
  };
}

/**
 * Calculates single product unit economics
 */
export function calculateUnitEconomics(priceEgp: number, costPriceEgp?: number): {
  cost: number;
  markupMultiplier: number;
  estimatedProfit: number;
  profitMarginPercent: number;
} {
  const price = Number(priceEgp) || 0;
  const cost = costPriceEgp !== undefined && costPriceEgp > 0 ? Number(costPriceEgp) : price * 0.35;
  const estimatedProfit = Math.max(0, price - cost);
  const profitMarginPercent = price > 0 ? Number(((estimatedProfit / price) * 100).toFixed(1)) : 0;
  const markupMultiplier = cost > 0 ? Number((price / cost).toFixed(2)) : 1;

  return {
    cost,
    markupMultiplier,
    estimatedProfit,
    profitMarginPercent,
  };
}
