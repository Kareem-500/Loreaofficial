import { Currency } from '../types';

// Approximate conversion rates anchored on EGP (base market)
const RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 0.020, // ~50 EGP per USD
  EUR: 0.0185,
  AED: 0.074
};

export const formatPrice = (priceEgp: number, currency: Currency = 'EGP'): string => {
  if (currency === 'EGP') {
    return `LE ${priceEgp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === 'USD') {
    const usd = (priceEgp * RATES.USD).toFixed(2);
    return `$${usd}`;
  }
  if (currency === 'EUR') {
    const eur = (priceEgp * RATES.EUR).toFixed(2);
    return `€${eur}`;
  }
  if (currency === 'AED') {
    const aed = (priceEgp * RATES.AED).toFixed(2);
    return `AED ${aed}`;
  }
  return `LE ${priceEgp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDualPrice = (priceEgp: number, currency: Currency): { primary: string; secondary: string } => {
  const primary = formatPrice(priceEgp, currency);
  const secondary = currency === 'EGP' ? formatPrice(priceEgp, 'USD') : `${priceEgp.toLocaleString('en-US')} EGP`;
  return { primary, secondary };
};
