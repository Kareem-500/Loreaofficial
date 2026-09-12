import { Currency } from '../types';

// Approximate conversion rates anchored on EGP (base market)
const RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 0.020, // ~50 EGP per USD
  EUR: 0.0185,
  AED: 0.074
};

export const formatPrice = (priceEgp: number, currency: Currency): string => {
  if (currency === 'EGP') {
    return `${priceEgp.toLocaleString('en-US')} EGP`;
  }
  if (currency === 'USD') {
    const usd = Math.round(priceEgp * RATES.USD);
    return `$${usd}`;
  }
  if (currency === 'EUR') {
    const eur = Math.round(priceEgp * RATES.EUR);
    return `€${eur}`;
  }
  if (currency === 'AED') {
    const aed = Math.round(priceEgp * RATES.AED);
    return `${aed} AED`;
  }
  return `${priceEgp} EGP`;
};

export const formatDualPrice = (priceEgp: number, currency: Currency): { primary: string; secondary: string } => {
  const primary = formatPrice(priceEgp, currency);
  const secondary = currency === 'EGP' ? formatPrice(priceEgp, 'USD') : `${priceEgp.toLocaleString('en-US')} EGP`;
  return { primary, secondary };
};
