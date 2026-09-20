import React, { useState, useRef, useEffect, useId } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Camera,
  RefreshCw,
  ShoppingBag,
  Check,
  ChevronRight,
  ArrowRight,
  Sliders,
  Download,
  Info,
  Layers,
  Heart
} from 'lucide-react';
import { Product, Currency, ProductColor } from '../types';
import { formatPrice } from '../utils/currency';
import { getApiUrl } from '../services/api';

interface AIVirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  allProducts?: Product[];
  currency?: Currency;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color?: ProductColor) => void;
}

// Model silhouette presets for instant try-on without uploading photo
const MODEL_PRESETS = [
  {
    id: 'preset-classic',
    name: 'Model Maya',
    subtitle: 'Classic Frame (175 cm)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'preset-petite',
    name: 'Model Layla',
    subtitle: 'Petite Frame (163 cm)',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'preset-curvy',
    name: 'Model Salma',
    subtitle: 'Curvy Frame (170 cm)',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'preset-modest',
    name: 'Model Nour',
    subtitle: 'Modest / Hijab Edit (168 cm)',
    image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop'
  }
];

export const AIVirtualTryOnModal: React.FC<AIVirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts = [],
  currency = 'EGP' as Currency,
  onAddToCart
}) => {
  const fileInputId = useId();
  // Selected garment
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product || null);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  // User photo / model
  const [userImage, setUserImage] = useState<string>(MODEL_PRESETS[0].image);
  const [isUserUploaded, setIsUserUploaded] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-classic');

  // Try-on state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0-100%
  const [addedToBag, setAddedToBag] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState('');

  // AI Insights
  const [aiFeedback, setAiFeedback] = useState<{
    fitScore: number;
    fitAnalysis: string;
    stylingAdvice: string;
    recommendedSize: string;
    occasionTips: string;
  }>({
    fitScore: 97,
    fitAnalysis: 'The architectural drape flows naturally along the vertical torso line with refined proportion balance.',
    stylingAdvice: 'Pair with pointed kitten mules in ivory and sculptural hammered gold jewelry.',
    recommendedSize: 'M',
    occasionTips: 'Gallery receptions, sunset dinners, and coastal luxury gatherings.'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderedTryOnUrl, setRenderedTryOnUrl] = useState<string | null>(null);

  // Sync incoming product
  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0] as any);
      }
    } else if (allProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(allProducts[0]);
      if (allProducts[0].colors && allProducts[0].colors.length > 0) {
        setSelectedColor(allProducts[0].colors[0]);
      }
    }
  }, [product, allProducts]);

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUserImage(reader.result);
        setIsUserUploaded(true);
        setSelectedPresetId('');
        setHasGenerated(false);
        setRenderedTryOnUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Model
  const handleSelectPreset = (preset: typeof MODEL_PRESETS[0]) => {
    setUserImage(preset.image);
    setSelectedPresetId(preset.id);
    setIsUserUploaded(false);
    setHasGenerated(false);
    setRenderedTryOnUrl(null);
  };

  // Render Virtual Try-On Composite Canvas
  const compositeTryOnImage = async (userImgSrc: string, garmentImgSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(userImgSrc);
        return;
      }

      const imgUser = new Image();
      imgUser.crossOrigin = 'anonymous';

      imgUser.onload = () => {
        canvas.width = imgUser.naturalWidth || 800;
        canvas.height = imgUser.naturalHeight || 1200;

        // Draw base user image
        ctx.drawImage(imgUser, 0, 0, canvas.width, canvas.height);

        // Load garment
        const imgGarment = new Image();
        imgGarment.crossOrigin = 'anonymous';

        imgGarment.onload = () => {
          // Calculate proportional garment placement over torso
          const garmentWidth = canvas.width * 0.72;
          const garmentHeight = (imgGarment.naturalHeight / imgGarment.naturalWidth) * garmentWidth;
          const garmentX = (canvas.width - garmentWidth) / 2;
          const garmentY = canvas.height * 0.22; // Align with chest/torso

          ctx.save();
          // Soft blending overlay with tailored shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 6;

          // Subtle blend mode for natural fabric integration
          ctx.globalAlpha = 0.94;
          ctx.drawImage(imgGarment, garmentX, garmentY, garmentWidth, garmentHeight);

          // Subtle couture studio lighting vignette
          ctx.restore();
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
          gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            resolve(dataUrl);
          } catch {
            resolve(garmentImgSrc);
          }
        };

        imgGarment.onerror = () => {
          resolve(userImgSrc);
        };

        imgGarment.src = garmentImgSrc;
      };

      imgUser.onerror = () => {
        resolve(userImgSrc);
      };

      imgUser.src = userImgSrc;
    });
  };

  // Run AI Virtual Try-On
  const handleRunTryOn = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    setGenerationError('');

    try {
      // 1. Call server-side Gemini AI for bespoke analysis
      const garmentImg = selectedColor?.image || selectedProduct.images?.[0] || '';
      const response = await fetch(getApiUrl('/api/ai/virtual-try-on'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          garmentId: selectedProduct.id,
          garmentName: selectedProduct.name,
          garmentCategory: selectedProduct.category,
          garmentImage: garmentImg,
          garmentFabric: selectedProduct.fabric,
          selectedColor: selectedColor?.name || 'Standard',
          selectedSize
        })
      });

      if (!response.ok) {
        throw new Error('The atelier stylist is temporarily unavailable.');
      }
      const data = await response.json();
      if (data.fitAnalysis) {
        setAiFeedback({
          fitScore: data.fitScore || 96,
          fitAnalysis: data.fitAnalysis,
          stylingAdvice: data.stylingAdvice || '',
          recommendedSize: data.recommendedSize || selectedSize,
          occasionTips: data.occasionTips || ''
        });
      }

      // 2. Render composite visual try-on
      const resultUrl = await compositeTryOnImage(userImage, garmentImg);
      setRenderedTryOnUrl(resultUrl);
      setHasGenerated(true);
      setShowComparison(false);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'The virtual styling service is unavailable.');
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    onAddToCart(selectedProduct, selectedSize, selectedColor || undefined);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `LOREA-AI-TryOn-${selectedProduct?.name || 'Look'}.jpg`;
    link.href = renderedTryOnUrl || userImage;
    link.click();
  };

  if (!isOpen) return null;

  const currentGarmentImage =
    selectedColor?.image || selectedProduct?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] border border-[#EAE5DE] shadow-2xl rounded-xs overflow-hidden z-10 my-auto flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE5DE] bg-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-full bg-[#1D1D1B] text-[#BA945A] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg sm:text-xl text-[#1D1D1B] tracking-wide font-normal">
                  AI Virtual Fitting Room
                </h2>
                <span className="text-[9px] tracking-[0.2em] uppercase font-mono px-2 py-0.5 bg-[#F2EEE9] text-[#BA945A] font-semibold border border-[#EAE5DE]">
                  Atelier AI
                </span>
              </div>
              <p className="text-[11px] text-[#7C746B] font-light">
                Upload your photo or choose a silhouette model to see how LORÉA garments drape and fit on your frame
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7C746B] hover:text-[#1D1D1B] hover:bg-[#F2EEE9] transition-colors cursor-pointer"
            aria-label="Close AI Fitting Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          {/* LEFT: Virtual Try-On Canvas & Photo Upload (7 Columns) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-[#EAE5DE] bg-[#F4EFEA]/60">
            {/* Visual Canvas Area */}
            <div className="relative aspect-3/4 w-full bg-[#EAE5DE] overflow-hidden rounded-xs border border-[#D4CCC2] shadow-inner mb-4 flex items-center justify-center">
              {/* Generating Animation */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-center p-6">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-2 border-[#BA945A]/30 rounded-full" />
                    <div className="absolute inset-0 border-2 border-[#BA945A] border-t-transparent rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#BA945A] animate-pulse" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-[#F7F4EF] font-medium block mb-1">
                    Fitting Silhouette with Gemini AI
                  </span>
                  <p className="text-[11px] text-[#D4CCC2] font-light max-w-xs">
                    Aligning architectural seams, calculating fabric drape tension, and harmonizing lighting...
                  </p>
                </div>
              )}

              {/* Rendered Fitted Output OR Base Photo */}
              {hasGenerated && renderedTryOnUrl ? (
                showComparison ? (
                  /* Interactive Split Comparison */
                  <div className="relative w-full h-full select-none overflow-hidden">
                    {/* After Image (Fitted) */}
                    <img
                      src={renderedTryOnUrl}
                      alt="Fitted Look"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Before Image (Original User Photo) clipped */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={userImage}
                        alt="Original Silhouette"
                        className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    {/* Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center text-[9px] font-mono text-[#1D1D1B]">
                        ↔
                      </div>
                    </div>
                    {/* Interactive slider control */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      aria-label="Before and after comparison slider"
                    />
                    {/* Labels */}
                    <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-black/60 text-white text-[9px] uppercase tracking-wider font-mono backdrop-blur-xs">
                      Original Photo
                    </span>
                    <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-[#BA945A] text-white text-[9px] uppercase tracking-wider font-mono shadow-xs">
                      AI Fitted Silhouette
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={renderedTryOnUrl}
                      alt="AI Virtual Fitted Look"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-[#1D1D1B]/80 text-[#BA945A] backdrop-blur-xs text-[10px] tracking-[0.2em] uppercase font-semibold border border-[#BA945A]/40 shadow-sm flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>AI Fitted</span>
                      </span>
                    </div>
                  </div>
                )
              ) : (
                /* Pre-generation user or model photo preview */
                <div className="relative w-full h-full group">
                  <img
                    src={userImage}
                    alt="Active Silhouette"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Overlay indicating it's ready */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D4CCC2]">
                        {isUserUploaded ? 'Your Uploaded Photo' : 'Selected Model Preset'}
                      </span>
                      <p className="text-xs font-light text-white/90">
                        Ready for virtual tailoring with {selectedProduct?.name || 'garment'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Bottom Controls (Comparison & Actions) */}
            {hasGenerated && (
              <div className="flex items-center justify-between py-2 px-1 mb-3">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className={`px-3 py-1.5 text-[11px] tracking-wider uppercase font-medium border transition-colors inline-flex items-center space-x-1.5 cursor-pointer ${
                    showComparison
                      ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B]'
                      : 'bg-white text-[#1D1D1B] border-[#D4CCC2] hover:border-[#1D1D1B]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showComparison ? 'Exit Comparison' : 'Before / After Slider'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-[11px] tracking-wider uppercase font-medium bg-white text-[#1D1D1B] border border-[#D4CCC2] hover:border-[#1D1D1B] transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                  title="Download Fitted Look"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Look</span>
                </button>
              </div>
            )}

            {generationError && (
              <p role="alert" className="mt-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2">
                {generationError}
              </p>
            )}

            {/* Photo Selection / Upload Bar */}
            <div className="mt-auto pt-4 border-t border-[#EAE5DE]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#1D1D1B]">
                  1. Your Photo or Model:
                </span>
                <label
                  htmlFor={fileInputId}
                  className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#BA945A] hover:underline cursor-pointer inline-flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  <span>Upload Your Photo</span>
                </label>
                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Model Preset Avatars */}
              <div className="grid grid-cols-4 gap-2">
                {MODEL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center p-1.5 border transition-all text-center rounded-xs cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'border-[#BA945A] bg-white ring-1 ring-[#BA945A] shadow-xs'
                        : 'border-[#EAE5DE] bg-white/70 hover:border-[#B7ADA2]'
                    }`}
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-10 h-10 rounded-full object-cover object-center mb-1 border border-[#EAE5DE]"
                    />
                    <span className="text-[10px] font-medium text-[#1D1D1B] truncate w-full">
                      {preset.name}
                    </span>
                    <span className="text-[8px] text-[#7C746B] truncate w-full font-light">
                      {preset.subtitle.split('(')[1]?.replace(')', '') || ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Garment Configuration, AI Evaluation & Actions (5 Columns) */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-white">
            <div>
              {/* Step 2: Selected Garment Card */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#1D1D1B]">
                    2. Selected Silhouette
                  </span>
                  {allProducts.length > 1 && (
                    <div className="relative">
                      <select
                        value={selectedProduct?.id || ''}
                        onChange={(e) => {
                          const found = allProducts.find((p) => p.id === e.target.value);
                          if (found) {
                            setSelectedProduct(found);
                            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
                            setHasGenerated(false);
                            setRenderedTryOnUrl(null);
                          }
                        }}
                        className="text-[10px] uppercase tracking-wider text-[#7C746B] border border-[#EAE5DE] bg-[#FAF8F5] px-2 py-1 pr-6 focus:outline-none cursor-pointer"
                      >
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {selectedProduct && (
                  <div className="flex items-center space-x-3.5 p-3 bg-[#FAF8F5] border border-[#EAE5DE] rounded-xs">
                    <img
                      src={currentGarmentImage}
                      alt={selectedProduct.name}
                      className="w-16 h-20 object-cover object-center bg-[#EAE5DE] shrink-0 border border-[#EAE5DE]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#BA945A] block truncate">
                        {selectedProduct.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#1D1D1B] truncate font-medium">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-xs font-mono font-normal text-[#1D1D1B] mt-0.5">
                        {formatPrice(selectedProduct.priceEgp, currency)}
                      </p>
                      <p className="text-[10px] text-[#7C746B] truncate mt-0.5">
                        {selectedProduct.fabric}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Color & Size Selectors */}
              <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-[#F2ECE4]">
                {/* Colors */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[#7C746B] font-medium mb-1.5">
                    Color: <strong className="text-[#1D1D1B] font-normal">{selectedColor?.name || 'Standard'}</strong>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProduct?.colors || [{ name: 'Standard', hex: '#1D1D1B' }]).map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c);
                          setHasGenerated(false);
                        }}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          selectedColor?.name === c.name
                            ? 'ring-2 ring-[#BA945A] ring-offset-1 border-transparent scale-110'
                            : 'border-[#B7ADA2] hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-[#7C746B] font-medium mb-1.5">
                    Size: <strong className="text-[#1D1D1B] font-normal">{selectedSize}</strong>
                  </label>
                  <div className="flex space-x-1">
                    {(['XS', 'S', 'M', 'L', 'XL'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSize(s);
                          setHasGenerated(false);
                        }}
                        className={`px-2 py-1 text-[10px] font-mono transition-colors border cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#1D1D1B] text-[#F7F4EF] border-[#1D1D1B]'
                            : 'bg-white text-[#7C746B] border-[#EAE5DE] hover:border-[#1D1D1B]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Try-On CTA Button */}
              <button
                id="generate-ai-tryon-btn"
                onClick={handleRunTryOn}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#BA945A] hover:text-white transition-all text-xs tracking-[0.24em] uppercase font-medium flex items-center justify-center space-x-2 shadow-md mb-5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating
                    ? 'Tailoring Look with AI...'
                    : hasGenerated
                    ? 'Re-Fit Silhouette'
                    : 'Generate AI Fitting'}
                </span>
              </button>

              {/* Step 3: Atelier AI Feedback Section */}
              <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-4 rounded-xs mb-5">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE] mb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#BA945A] font-semibold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Atelier AI Stylist Report
                  </span>
                  <span className="text-[10px] font-mono text-[#1D1D1B] font-semibold bg-white px-2 py-0.5 border border-[#EAE5DE]">
                    {aiFeedback.fitScore}% Fit Harmony
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#4A453F]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7C746B] block font-medium">
                      Silhouette Drape:
                    </span>
                    <p className="font-light text-[11px] leading-relaxed text-[#1D1D1B]">
                      {aiFeedback.fitAnalysis}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7C746B] block font-medium">
                      Styling Recommendation:
                    </span>
                    <p className="font-light text-[11px] leading-relaxed text-[#1D1D1B]">
                      {aiFeedback.stylingAdvice}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DE]/80 text-[10px]">
                    <span className="text-[#7C746B]">Recommended Atelier Size:</span>
                    <span className="font-semibold text-[#BA945A] font-mono">
                      {aiFeedback.recommendedSize}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Add to Bag CTA */}
            <div className="pt-3 border-t border-[#EAE5DE] space-y-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-4 text-xs tracking-[0.22em] uppercase font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  addedToBag
                    ? 'bg-[#BA945A] text-white'
                    : 'bg-[#1D1D1B] text-[#F7F4EF] hover:bg-[#333]'
                }`}
              >
                {addedToBag ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add Fitted Look to Bag ({selectedSize}) • {formatPrice(selectedProduct?.priceEgp || 0, currency)}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-center text-[11px] uppercase tracking-[0.18em] text-[#7C746B] hover:text-[#1D1D1B] cursor-pointer"
              >
                Continue Browsing Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
