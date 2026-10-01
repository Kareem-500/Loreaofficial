import React from 'react';
import { AlertTriangle, Trash2, X, Archive, ShieldCheck } from 'lucide-react';
import { useOverlayAccessibility } from '../../hooks/useOverlayAccessibility';

interface AdminDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemDescription?: string;
  itemImageUrl?: string;
  itemSku?: string;
  isDeleting: boolean;
  destructiveActionText?: string;
  orderWarningNotice?: boolean;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemDescription,
  itemImageUrl,
  itemSku,
  isDeleting,
  destructiveActionText = 'Confirm Deletion',
  orderWarningNotice = true,
}) => {
  useOverlayAccessibility({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm Action"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start space-x-3.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-700">
            <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl font-light text-[#1D1D1B] leading-snug">
              {title}
            </h3>
            <p className="text-xs text-[#7C746B] mt-1">
              Please review the item details below before proceeding with this action.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7C746B] hover:text-[#1D1D1B] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="p-3.5 bg-white border border-[#EAE5DE] flex items-center space-x-3 mb-4">
          {itemImageUrl && (
            <img
              src={itemImageUrl}
              alt=""
              className="w-12 h-16 object-cover bg-[#EAE5DE] shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm font-normal text-[#1D1D1B] truncate">
              {itemDescription || 'Selected Item'}
            </p>
            {itemSku && (
              <p className="font-mono text-[10px] text-[#7C746B] uppercase tracking-wider mt-0.5">
                SKU: {itemSku}
              </p>
            )}
          </div>
        </div>

        {/* Financial & Order Integrity Notice */}
        {orderWarningNotice && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5 mb-6">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Order History Protection:</strong> If this product is referenced by any customer invoices or historical orders, the system will safely <em>archive</em> it instead of purging it, ensuring commercial records remain 100% accurate.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#EAE5DE]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs uppercase tracking-wider text-[#7C746B] hover:text-[#1D1D1B] cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs uppercase tracking-wider font-medium flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {isDeleting ? (
              <span>Processing...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{destructiveActionText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
