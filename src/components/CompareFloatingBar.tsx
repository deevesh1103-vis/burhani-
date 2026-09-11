import React from 'react';
import { Product } from '../types';
import { ArrowLeftRight, X, Sparkles, Scale } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface CompareFloatingBarProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  selectedProducts,
  onRemoveProduct,
  onClear,
  onOpenCompare,
}) => {
  if (selectedProducts.length === 0) return null;

  const count = selectedProducts.length;
  const isReady = count === 2;

  return (
    <aside 
      id="compare-floating-dock"
      aria-label="Product comparison tray"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] sm:w-auto max-w-xl animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-black text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left Status & Previews */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            {/* Slot 1 */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img
                  src={selectedProducts[0].images[0]}
                  alt={selectedProducts[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveProduct(selectedProducts[0].id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-700 hover:bg-neutral-500 text-white flex items-center justify-center text-[10px]"
                title="Remove"
              >
                ×
              </button>
            </div>

            <span className="text-neutral-500 text-xs font-bold font-mono">VS</span>

            {/* Slot 2 */}
            {count >= 2 ? (
              <div className="relative group">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <img
                    src={selectedProducts[1].images[0]}
                    alt={selectedProducts[1].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveProduct(selectedProducts[1].id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-700 hover:bg-neutral-500 text-white flex items-center justify-center text-[10px]"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg border border-dashed border-neutral-600 flex items-center justify-center text-[10px] text-neutral-400 shrink-0 text-center px-0.5">
                Pick 2nd
              </div>
            )}
          </div>

          <div className="hidden md:block min-w-0">
            <div className="text-xs font-bold truncate">
              {isReady ? '2 Products Selected' : '1 of 2 Selected'}
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              {isReady ? 'Ready for side-by-side specs' : 'Select another product to compare'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="open-comparison-dock-btn"
            type="button"
            onClick={onOpenCompare}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isReady
                ? 'bg-white text-black hover:bg-neutral-200 ring-2 ring-white/30'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare Now</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Clear comparison selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
