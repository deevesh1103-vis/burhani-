import React, { useState } from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/formatters';
import { Eye, ShoppingBag, Check, Star, AlertCircle, ArrowLeftRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isComparing?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isComparing = false,
  onToggleCompare,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className={`group relative bg-white rounded-2xl border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
        isComparing ? 'border-neutral-900 ring-2 ring-neutral-900' : 'border-neutral-200/90'
      }`}
    >
      {/* Top Media Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category & Stock Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-800 px-2.5 py-0.5 rounded-md shadow-xs border border-neutral-200 backdrop-blur-xs">
            {product.brand}
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Compare Toggle Button */}
        {onToggleCompare && (
          <button
            id={`compare-toggle-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-md border transition-all flex items-center gap-1.5 backdrop-blur-xs z-10 ${
              isComparing
                ? 'bg-black text-white border-black'
                : 'bg-white/95 text-neutral-800 border-neutral-300 hover:bg-black hover:text-white'
            }`}
            title={isComparing ? 'Remove from comparison' : 'Select to compare side-by-side'}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>
        )}

        {/* Quick View Button overlay */}
        <button
          id={`quick-view-btn-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/95 text-neutral-800 shadow-md border border-neutral-200/80 opacity-0 group-hover:opacity-100 hover:bg-neutral-900 hover:text-white transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
          title="Quick View with Zoom Lens"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and SKU */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span className="text-[11px] font-mono">{product.sku}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-neutral-700 text-xs">{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-700 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.material} · {product.dimensions}
          </p>
        </div>

        {/* Price and Cart Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg sm:text-xl font-bold text-neutral-950">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-xs text-neutral-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              In Stock · Coimbatore Hub
            </span>
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-neutral-900 hover:bg-black text-white active:scale-95 shadow-sm'
            }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
