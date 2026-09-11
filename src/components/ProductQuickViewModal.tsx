import React, { useState, useRef, MouseEvent } from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  ZoomIn, 
  ZoomOut, 
  ShoppingBag, 
  Star, 
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeftRight
} from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isComparing?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isComparing = false,
  onToggleCompare,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(2.2);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [addedAnimation, setAddedAnimation] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const activeImg = product.images[activeImageIndex] || product.images[0];

  return (
    <div 
      id="product-quick-view-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="product-quick-view-dialog"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 shadow-md border border-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column: Interactive Image Gallery with Zoom */}
          <div className="p-6 bg-neutral-100/70 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
            {/* Main Interactive Zoom Stage */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-neutral-500">
                <span className="font-medium tracking-wide uppercase text-neutral-600">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-medium">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Hover to Zoom Lens
                </span>
              </div>

              <div
                ref={imageContainerRef}
                id="interactive-zoom-stage"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-neutral-200 cursor-crosshair shadow-inner"
              >
                {/* Standard Base Image */}
                <img
                  src={activeImg}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-opacity duration-150 ${
                    isZoomed ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Magnified Image Layer */}
                {isZoomed && (
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      backgroundImage: `url(${activeImg})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: `${zoomScale * 100}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                {/* Zoom Level Pill overlay */}
                <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setZoomScale(Math.max(1.5, zoomScale - 0.5)); }}
                    className="hover:text-amber-400 p-0.5"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-medium">{zoomScale.toFixed(1)}x</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setZoomScale(Math.min(3.5, zoomScale + 0.5)); }}
                    className="hover:text-amber-400 p-0.5"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      id={`thumbnail-select-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} angle ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality & Origin Assurance */}
            <div className="mt-4 pt-4 border-t border-neutral-200/80 text-xs text-neutral-600 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Genuine Burhani Mart Stock
              </span>
              <span className="text-neutral-500">
                SKU: <strong className="text-neutral-700">{product.sku}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Brand & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-700 tracking-wider uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-semibold text-neutral-800">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {product.title}
              </h2>

              {/* Price section - Strictly Indian Rupee (₹) */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-neutral-950 font-mono tracking-tight">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-neutral-400 line-through font-mono">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save {formatINR(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Inclusive of all taxes (GST 18%). Free store pickup at Coimbatore.
              </p>

              {/* Stock status */}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units ready at Mill Rd Warehouse)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Out of Stock - Pre-order available
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Specifications Grid */}
              <div className="mt-5 bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-neutral-500 block">Material</span>
                    <span className="font-semibold text-neutral-800">{product.material}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Dimensions</span>
                    <span className="font-semibold text-neutral-800">{product.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Warranty</span>
                    <span className="font-semibold text-neutral-800">{product.warranty}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Availability</span>
                    <span className="font-semibold text-emerald-700">Same-Day Coimbatore Delivery</span>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="mt-4">
                <span className="text-xs font-bold text-neutral-700 tracking-wide uppercase block mb-2">
                  Key Technical Highlights
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions: Quantity + Add to Cart + Buy Now */}
            <div className="mt-6 pt-5 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-neutral-300 rounded-xl bg-neutral-50 p-1 w-full sm:w-32">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-neutral-800 px-2">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="quickview-add-to-cart-btn"
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
                    addedAnimation
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                {/* Compare Button */}
                {onToggleCompare && (
                  <button
                    id="quickview-compare-btn"
                    type="button"
                    onClick={() => onToggleCompare(product)}
                    className={`py-3 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      isComparing
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    }`}
                    title={isComparing ? 'Remove from comparison' : 'Compare side-by-side with another item'}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span className="hidden sm:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
                  </button>
                )}

                {/* Express Buy Now */}
                <button
                  id="quickview-buy-now-btn"
                  type="button"
                  onClick={() => onBuyNow(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-black text-white shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Buy Now</span>
                  <span className="font-mono text-xs opacity-90">
                    ({formatINR(product.price * quantity)})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  Express dispatch from Mill Rd, Town Hall
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                  7 Days Replacement Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
