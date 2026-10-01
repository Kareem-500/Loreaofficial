import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useOverlayAccessibility } from '../hooks/useOverlayAccessibility';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  useOverlayAccessibility({
    isOpen,
    onClose
  });

  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', bustCm: '82 - 85', waistCm: '64 - 67', hipsCm: '90 - 93', bustIn: '32 - 33.5', waistIn: '25 - 26.5', hipsIn: '35.5 - 36.5' },
    { size: 'S', bustCm: '86 - 89', waistCm: '68 - 71', hipsCm: '94 - 97', bustIn: '34 - 35', waistIn: '27 - 28', hipsIn: '37 - 38' },
    { size: 'M', bustCm: '90 - 94', waistCm: '72 - 76', hipsCm: '98 - 102', bustIn: '35.5 - 37', waistIn: '28.5 - 30', hipsIn: '38.5 - 40' },
    { size: 'L', bustCm: '95 - 99', waistCm: '77 - 81', hipsCm: '103 - 107', bustIn: '37.5 - 39', waistIn: '30.5 - 32', hipsIn: '40.5 - 42' },
    { size: 'XL', bustCm: '100 - 105', waistCm: '82 - 87', hipsCm: '108 - 113', bustIn: '39.5 - 41.5', waistIn: '32.5 - 34.5', hipsIn: '42.5 - 44.5' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size and Silhouette Guide"
    >
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-[#1D1D1B]" />
            <h3 className="font-serif text-2xl text-[#1D1D1B] font-light">
              Size & Silhouette Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Size Guide (ESC)"
            className="w-9 h-9 flex items-center justify-center p-1.5 text-[#1D1D1B] hover:text-[#BA945A] hover:bg-white rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <p className="text-xs text-[#7C746B] font-light max-w-md">
            Our silhouettes are designed with relaxed, architectural drape. For a closer fit, consider sizing down.
          </p>
          <div className="flex border border-[#D4CCC2] text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-medium cursor-pointer ${unit === 'cm' ? 'bg-[#1D1D1B] text-white' : 'text-[#1D1D1B] bg-white'}`}
            >
              CM
            </button>
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 font-medium cursor-pointer ${unit === 'in' ? 'bg-[#1D1D1B] text-white' : 'text-[#1D1D1B] bg-white'}`}
            >
              IN
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto mb-6 border border-[#EAE5DE] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0EDE8] border-b border-[#EAE5DE] font-mono text-[10px] tracking-wider uppercase text-[#7C746B]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Size</th>
                <th className="py-2.5 px-4 font-semibold">Bust ({unit})</th>
                <th className="py-2.5 px-4 font-semibold">Waist ({unit})</th>
                <th className="py-2.5 px-4 font-semibold">Hips ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DE]">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#1D1D1B]">{m.size}</td>
                  <td className="py-2.5 px-4 text-[#55504A]">
                    {unit === 'cm' ? m.bustCm : m.bustIn}
                  </td>
                  <td className="py-2.5 px-4 text-[#55504A]">
                    {unit === 'cm' ? m.waistCm : m.waistIn}
                  </td>
                  <td className="py-2.5 px-4 text-[#55504A]">
                    {unit === 'cm' ? m.hipsCm : m.hipsIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#7C746B] font-light">
          Need personalized sizing assistance? Our client concierge is available via live assistance or WhatsApp.
        </p>
      </div>
    </div>
  );
};
