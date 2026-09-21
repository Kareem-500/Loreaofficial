import React from 'react';
import { LoreaAIStyleAssistant } from './LoreaAIStyleAssistant';
import { Product, Currency, ProductColor } from '../types';

export interface AIVirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  allProducts?: Product[];
  currency?: Currency;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color?: ProductColor) => void;
}

/**
 * Backward-compatible adapter forwarding to the new LORÉA AI Style Assistant suite.
 */
export const AIVirtualTryOnModal: React.FC<AIVirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  product,
  currency = 'EGP',
  onAddToCart
}) => {
  return (
    <LoreaAIStyleAssistant
      isOpen={isOpen}
      onClose={onClose}
      initialProduct={product}
      currency={currency}
      onAddToCart={(prod, size, colName) => {
        const foundColor = prod.colors?.find(c => c.name === colName) || prod.colors?.[0];
        onAddToCart(prod, size as 'XS' | 'S' | 'M' | 'L' | 'XL', foundColor);
      }}
    />
  );
};

export default AIVirtualTryOnModal;
