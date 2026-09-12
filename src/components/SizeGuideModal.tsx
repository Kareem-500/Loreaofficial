import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', bustCm: '82 - 85', waistCm: '64 - 67', hipsCm: '90 - 93', bustIn: '32 - 33.5', waistIn: '25 - 26.5', hipsIn: '35.5 - 36.5' },
    { size: 'S', bustCm: '86 - 89', waistCm: '68 - 71', hipsCm: '94 - 97', bustIn: '34 - 35', waistIn: '27 - 28', hipsIn: '37 - 38' },
    { size: 'M', bustCm: '90 - 94', waistCm: '72 - 76', hipsCm: '98 - 102', bustIn: '35.5 - 37', waistIn: '28.5 - 30', hipsIn: '38.5 - 40' },
    { size: 'L', bustCm: '95 - 99', waistCm: '77 - 81', hipsCm: '103 - 107', bustIn: '37.5 - 39', waistIn: '30.5 - 32', hipsIn: '40.5 - 42' },
    { size: 'XL', bustCm: '100 - 105', waistCm: '82 - 87', hipsCm: '108 - 113', bustIn: '39.5 - 41.5', waistIn: '32.5 - 34.5', hipsIn: '42.5 - 44.5' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#F7F4EF] border border-[#EAE5DE] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE] mb-6">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-[#1D1D1B]" />
            <h3 className="font-serif text-2xl text-[#1D1D1B] font-light">
              Size & Silhouette Guide
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close Size Guide">
            <X className="w-5 h-5 text-[#1D1D1B] hover:text-[#B88F88]" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-[#7C746B] font-light">
            Our silhouettes are designed with relaxed, architectural drape. For a closer fit, consider sizing down.
          </p>
          <div className="flex border border-[#D4CCC2] text-xs">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-medium ${unit === 'cm' ? 'bg-[#1D1D1B] text-white' : 'text-[#1D1D1B]'}`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 font-medium ${unit === 'in' ? 'bg-[#1D1D1B] text-white' : 'text-[#1D1D1B]'}`}
            >
              IN
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto mb-8 border border-[#EAE5DE]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFECE6] border-b border-[#EAE5DE] text-[#7C746B] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Bust ({unit})</th>
                <th className="p-3">Waist ({unit})</th>
                <th className="p-3">Hips ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DE] text-[#1D1D1B]">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-[#FAF8F5]">
                  <td className="p-3 font-mono font-medium">{m.size}</td>
                  <td className="p-3">{unit === 'cm' ? m.bustCm : m.bustIn}</td>
                  <td className="p-3">{unit === 'cm' ? m.waistCm : m.waistIn}</td>
                  <td className="p-3">{unit === 'cm' ? m.hipsCm : m.hipsIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Advice */}
        <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DE] text-xs text-[#7C746B] space-y-1">
          <p className="font-medium text-[#1D1D1B]">Atelier Fitting Assistance:</p>
          <p>Need personalized guidance? Our Cairo concierge is available on WhatsApp daily from 10 AM to 10 PM CLT to provide exact tape measurements.</p>
        </div>
      </div>
    </div>
  );
};
