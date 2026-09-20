import React from 'react';
import { Sparkles, ArrowRight, Home, ShoppingBag, Layers } from 'lucide-react';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateStore: () => void;
  onNavigateCollections: () => void;
  onNavigateNewIn: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onNavigateStore,
  onNavigateCollections,
  onNavigateNewIn
}) => {
  return (
    <div className="bg-[#F7F4EF] min-h-[75vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full text-center bg-white border border-[#EAE5DE] p-8 sm:p-14 shadow-sm">
        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#BA945A] font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>404 · PAGE NOT LOCATED</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1D1D1B] tracking-tight mb-4">
          Silhouette Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#7C746B] font-light leading-relaxed max-w-md mx-auto mb-8">
          The atelier page or piece you are searching for might have been moved, renamed, or temporarily archived in our Cairo workshop.
        </p>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <button
            onClick={onNavigateStore}
            className="p-4 border border-[#EAE5DE] hover:border-[#1D1D1B] bg-[#FAF8F5] hover:bg-white transition-all text-left group"
          >
            <ShoppingBag className="w-4 h-4 text-[#BA945A] mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1B] group-hover:text-[#BA945A]">
              The Store
            </p>
            <p className="text-[11px] text-[#7C746B] mt-0.5 font-light">All ready-to-wear</p>
          </button>

          <button
            onClick={onNavigateNewIn}
            className="p-4 border border-[#EAE5DE] hover:border-[#1D1D1B] bg-[#FAF8F5] hover:bg-white transition-all text-left group"
          >
            <Sparkles className="w-4 h-4 text-[#BA945A] mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1B] group-hover:text-[#BA945A]">
              New In
            </p>
            <p className="text-[11px] text-[#7C746B] mt-0.5 font-light">Latest arrivals</p>
          </button>

          <button
            onClick={onNavigateCollections}
            className="p-4 border border-[#EAE5DE] hover:border-[#1D1D1B] bg-[#FAF8F5] hover:bg-white transition-all text-left group"
          >
            <Layers className="w-4 h-4 text-[#BA945A] mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1B] group-hover:text-[#BA945A]">
              Collections
            </p>
            <p className="text-[11px] text-[#7C746B] mt-0.5 font-light">8 Curated edits</p>
          </button>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-[#1D1D1B] text-[#F7F4EF] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#BA945A] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
