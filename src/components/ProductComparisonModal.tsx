import React, { useState } from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  X, 
  ArrowLeftRight, 
  ShoppingBag, 
  Check, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Eye,
  ChevronDown,
  Layers,
  CheckCircle2,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  productA: Product | null;
  productB: Product | null;
  allProducts: Product[];
  onSelectProductA: (product: Product) => void;
  onSelectProductB: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  productA,
  productB,
  allProducts,
  onSelectProductA,
  onSelectProductB,
  onAddToCart,
  onQuickView,
}) => {
  if (!isOpen) return null;

  // Fallbacks if one or both products aren't set yet
  const first = productA || allProducts[0];
  const second = productB || (allProducts.find((p) => p.id !== first?.id) || allProducts[1] || allProducts[0]);

  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [addedA, setAddedA] = useState(false);
  const [addedB, setAddedB] = useState(false);
  const [selectorOpenA, setSelectorOpenA] = useState(false);
  const [selectorOpenB, setSelectorOpenB] = useState(false);
  const [searchFilterA, setSearchFilterA] = useState('');
  const [searchFilterB, setSearchFilterB] = useState('');

  if (!first || !second) return null;

  const handleSwap = () => {
    onSelectProductA(second);
    onSelectProductB(first);
  };

  const handleAddA = () => {
    onAddToCart(first, 1);
    setAddedA(true);
    setTimeout(() => setAddedA(false), 1500);
  };

  const handleAddB = () => {
    onAddToCart(second, 1);
    setAddedB(true);
    setTimeout(() => setAddedB(false), 1500);
  };

  const handleAddBoth = () => {
    onAddToCart(first, 1);
    onAddToCart(second, 1);
    setAddedA(true);
    setAddedB(true);
    setTimeout(() => {
      setAddedA(false);
      setAddedB(false);
    }, 1500);
  };

  // Price calculations
  const priceDiff = Math.abs(first.price - second.price);
  const cheaperProduct = first.price < second.price ? 'A' : first.price > second.price ? 'B' : 'equal';
  const percentDiff = Math.round((priceDiff / Math.max(first.price, second.price)) * 100);

  // Quick preset comparisons
  const presets = [
    {
      title: 'Closets & Sanitary',
      desc: 'Parryware Commode vs Luxury Vessel Basin',
      idA: 'bhm-02',
      idB: 'bhm-01',
    },
    {
      title: 'Plumbing Valves',
      desc: 'Supreme UPVC vs Astral CPVC Ball Valve',
      idA: 'bhm-04',
      idB: 'bhm-05',
    },
    {
      title: 'Heavy Drainage Covers',
      desc: '500x500mm FRP vs 600x600mm FRP Chamber',
      idA: 'bhm-03',
      idB: 'bhm-07',
    },
    {
      title: 'Faucets & Fittings',
      desc: 'Quarter-Turn Brass Tap vs Basin Mixer',
      idA: 'bhm-06',
      idB: 'bhm-08',
    },
  ];

  const handleApplyPreset = (idA: string, idB: string) => {
    const pA = allProducts.find((p) => p.id === idA);
    const pB = allProducts.find((p) => p.id === idB);
    if (pA) onSelectProductA(pA);
    if (pB) onSelectProductB(pB);
  };

  // Filter dropdown products
  const filteredProductsA = allProducts.filter((p) => 
    p.title.toLowerCase().includes(searchFilterA.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilterA.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilterA.toLowerCase())
  );

  const filteredProductsB = allProducts.filter((p) => 
    p.title.toLowerCase().includes(searchFilterB.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilterB.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilterB.toLowerCase())
  );

  // Helper for difference row background
  const isDiff = (valA: any, valB: any) => String(valA).trim() !== String(valB).trim();

  return (
    <div 
      id="product-comparison-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className="relative bg-white w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-neutral-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-xs">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Side-by-Side Product Comparison
                </h2>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Specs & Prices
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Compare technical dimensions, material composition, load ratings, warranties, and prices in ₹ INR.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="compare-swap-btn"
              type="button"
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
              title="Swap side-by-side positions"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-neutral-300" />
              <span className="hidden sm:inline">Swap Items</span>
            </button>

            <button
              id="compare-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Presets & Control Bar */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-800" /> Quick Pairs:
            </span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.idA, preset.idB)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-black hover:text-white text-neutral-800 border border-neutral-300 text-[11px] font-semibold transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-800 font-medium text-xs">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-black"
              />
              <span>Highlight Differences</span>
            </label>

            <button
              type="button"
              onClick={handleAddBoth}
              className="px-3 py-1 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Both to Cart</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Comparison Cards Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* PRODUCT A CARD */}
            <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-xs relative flex flex-col justify-between">
              <div>
                {/* Selector Dropdown */}
                <div className="relative mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <span>Product 1 (Left)</span>
                    <button
                      type="button"
                      onClick={() => setSelectorOpenA(!selectorOpenA)}
                      className="text-black hover:underline flex items-center gap-1 font-bold"
                    >
                      Change Product <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectorOpenA && (
                    <div className="absolute top-full left-0 right-0 z-30 bg-white rounded-xl shadow-xl border border-neutral-300 p-2 mt-1 max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Search product..."
                        value={searchFilterA}
                        onChange={(e) => setSearchFilterA(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <div className="space-y-1">
                        {filteredProductsA.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              onSelectProductA(prod);
                              setSelectorOpenA(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-neutral-100 ${
                              prod.id === first.id ? 'bg-neutral-100 font-bold text-black' : 'text-neutral-700'
                            }`}
                          >
                            <span className="truncate max-w-[200px]">{prod.title}</span>
                            <span className="font-mono text-neutral-900">{formatINR(prod.price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product A Media & Info */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative group">
                    <img
                      src={first.images[0]}
                      alt={first.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {onQuickView && (
                      <button
                        type="button"
                        onClick={() => onQuickView(first)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold gap-1"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                        {first.brand}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">{first.sku}</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-neutral-950 leading-snug line-clamp-2">
                      {first.title}
                    </h3>

                    <div className="flex items-center gap-1 mt-1.5 text-xs text-neutral-600">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 text-neutral-900">{first.rating}</span>
                      </div>
                      <span className="text-neutral-400">({first.reviewsCount} reviews)</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-emerald-700 font-medium">In Stock</span>
                    </div>
                  </div>
                </div>

                {/* Price & Value Badge */}
                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-black text-neutral-950">
                        {formatINR(first.price)}
                      </span>
                      {first.originalPrice && (
                        <span className="font-mono text-xs text-neutral-400 line-through">
                          {formatINR(first.originalPrice)}
                        </span>
                      )}
                    </div>
                    {first.originalPrice && (
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        Save {formatINR(first.originalPrice - first.price)} (
                        {Math.round(((first.originalPrice - first.price) / first.originalPrice) * 100)}% OFF)
                      </span>
                    )}
                  </div>

                  {cheaperProduct === 'A' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                      ₹{priceDiff.toLocaleString()} ({percentDiff}%) Cheaper
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleAddA}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    addedA
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
                  }`}
                >
                  {addedA ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add Product 1
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PRODUCT B CARD */}
            <div className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 shadow-xs relative flex flex-col justify-between">
              <div>
                {/* Selector Dropdown */}
                <div className="relative mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <span>Product 2 (Right)</span>
                    <button
                      type="button"
                      onClick={() => setSelectorOpenB(!selectorOpenB)}
                      className="text-black hover:underline flex items-center gap-1 font-bold"
                    >
                      Change Product <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectorOpenB && (
                    <div className="absolute top-full left-0 right-0 z-30 bg-white rounded-xl shadow-xl border border-neutral-300 p-2 mt-1 max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Search product..."
                        value={searchFilterB}
                        onChange={(e) => setSearchFilterB(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <div className="space-y-1">
                        {filteredProductsB.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              onSelectProductB(prod);
                              setSelectorOpenB(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-neutral-100 ${
                              prod.id === second.id ? 'bg-neutral-100 font-bold text-black' : 'text-neutral-700'
                            }`}
                          >
                            <span className="truncate max-w-[200px]">{prod.title}</span>
                            <span className="font-mono text-neutral-900">{formatINR(prod.price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product B Media & Info */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative group">
                    <img
                      src={second.images[0]}
                      alt={second.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {onQuickView && (
                      <button
                        type="button"
                        onClick={() => onQuickView(second)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold gap-1"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                        {second.brand}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">{second.sku}</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-neutral-950 leading-snug line-clamp-2">
                      {second.title}
                    </h3>

                    <div className="flex items-center gap-1 mt-1.5 text-xs text-neutral-600">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 text-neutral-900">{second.rating}</span>
                      </div>
                      <span className="text-neutral-400">({second.reviewsCount} reviews)</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-emerald-700 font-medium">In Stock</span>
                    </div>
                  </div>
                </div>

                {/* Price & Value Badge */}
                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-black text-neutral-950">
                        {formatINR(second.price)}
                      </span>
                      {second.originalPrice && (
                        <span className="font-mono text-xs text-neutral-400 line-through">
                          {formatINR(second.originalPrice)}
                        </span>
                      )}
                    </div>
                    {second.originalPrice && (
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        Save {formatINR(second.originalPrice - second.price)} (
                        {Math.round(((second.originalPrice - second.price) / second.originalPrice) * 100)}% OFF)
                      </span>
                    )}
                  </div>

                  {cheaperProduct === 'B' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                      ₹{priceDiff.toLocaleString()} ({percentDiff}%) Cheaper
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleAddB}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    addedB
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
                  }`}
                >
                  {addedB ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add Product 2
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE SPECIFICATIONS TABLE */}
          <div className="bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-xs">
            <div className="bg-neutral-100 px-4 sm:px-6 py-3 border-b border-neutral-300 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-800" />
                <span>Technical Specifications & Feature Matrix</span>
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                {highlightDifferences ? 'Colored rows indicate differing specifications' : 'All specifications listed'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                    <th className="py-3 px-4 sm:px-6 w-1/4">Specification</th>
                    <th className="py-3 px-4 sm:px-6 w-[37.5%] border-l border-neutral-200">
                      {first.title.substring(0, 32)}...
                    </th>
                    <th className="py-3 px-4 sm:px-6 w-[37.5%] border-l border-neutral-200">
                      {second.title.substring(0, 32)}...
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {/* Category */}
                  <tr className={highlightDifferences && isDiff(first.category, second.category) ? 'bg-amber-50/40' : ''}>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Category</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-700">
                      <span className="font-semibold text-neutral-900">{first.category}</span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-700">
                      <span className="font-semibold text-neutral-900">{second.category}</span>
                    </td>
                  </tr>

                  {/* Brand & Maker */}
                  <tr className={highlightDifferences && isDiff(first.brand, second.brand) ? 'bg-amber-50/40' : ''}>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Brand / Grade</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-bold text-neutral-900">
                      {first.brand}
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-bold text-neutral-900">
                      {second.brand}
                    </td>
                  </tr>

                  {/* Price Comparison */}
                  <tr className="bg-neutral-50/80 font-semibold">
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Store Price (INR)</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-mono text-sm font-bold text-neutral-950">
                      {formatINR(first.price)}
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-mono text-sm font-bold text-neutral-950">
                      {formatINR(second.price)}
                    </td>
                  </tr>

                  {/* Material */}
                  <tr className={highlightDifferences && isDiff(first.material, second.material) ? 'bg-amber-50/40' : ''}>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Material Construction</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800 font-medium">
                      {first.material}
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800 font-medium">
                      {second.material}
                    </td>
                  </tr>

                  {/* Dimensions */}
                  <tr className={highlightDifferences && isDiff(first.dimensions, second.dimensions) ? 'bg-amber-50/40' : ''}>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Dimensions / Sizing</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-mono text-neutral-800">
                      {first.dimensions}
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 font-mono text-neutral-800">
                      {second.dimensions}
                    </td>
                  </tr>

                  {/* Warranty */}
                  <tr className={highlightDifferences && isDiff(first.warranty, second.warranty) ? 'bg-amber-50/40' : ''}>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Warranty Coverage</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800 flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{first.warranty}</span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800 flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{second.warranty}</span>
                    </td>
                  </tr>

                  {/* Stock Availability */}
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900">Local Hub Stock</td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800">
                      <span className="font-semibold text-emerald-700">{first.stock} Units</span> ready for pickup / delivery
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-800">
                      <span className="font-semibold text-emerald-700">{second.stock} Units</span> ready for pickup / delivery
                    </td>
                  </tr>

                  {/* Key Features */}
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900 align-top">
                      Key Highlights & Features
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 align-top">
                      <ul className="space-y-1.5">
                        {first.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-neutral-700">
                            <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 align-top">
                      <ul className="space-y-1.5">
                        {second.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-neutral-700">
                            <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-neutral-900 align-top">
                      Overview & Application
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-600 leading-relaxed align-top">
                      {first.description}
                    </td>
                    <td className="py-3 px-4 sm:px-6 border-l border-neutral-200 text-neutral-600 leading-relaxed align-top">
                      {second.description}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation Verdict Box */}
          <div className="bg-neutral-100 rounded-2xl p-4 sm:p-5 border border-neutral-300 text-xs text-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">Burhani Hardware Selection Verdict</h4>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">
                  {first.category === second.category
                    ? `Comparing two options in "${first.category}". ${
                        cheaperProduct === 'A'
                          ? `"${first.title}" provides the most economical entry point at ${formatINR(first.price)}, while "${second.title}" delivers enhanced specifications.`
                          : `"${second.title}" offers budget savings at ${formatINR(second.price)}, while "${first.title}" features premium grade materials.`
                      }`
                    : `Cross-category comparison between ${first.category} and ${second.category}. Both are in-stock and available for immediate same-day dispatch in Coimbatore.`}
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300 transition-colors w-full sm:w-auto text-center"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
