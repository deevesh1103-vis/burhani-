import React from 'react';
import { CartItem } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck,
  Store
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div 
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="cart-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="font-bold text-base text-neutral-900">
              Shopping Cart
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
              {totalItems}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-bold text-neutral-800 text-base mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-4">
                Explore our catalog of sanitaryware, countertop basins, valves, and heavy duty manhole covers.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-black"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="flex gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-xs text-neutral-900 leading-snug line-clamp-2">
                        {item.product.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {item.product.sku}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-white px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-neutral-950">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary & Mobile Checkout Trigger */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-mono font-semibold text-neutral-900">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-mono text-neutral-700">
                  {formatINR(Math.round(subtotal * 0.18))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Coimbatore Express Delivery</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {subtotal > 2000 ? 'FREE' : formatINR(150)}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-sm text-neutral-900">Estimated Total</span>
              <span className="font-mono font-extrabold text-xl text-neutral-950">
                {formatINR(subtotal + Math.round(subtotal * 0.18) + (subtotal > 2000 ? 0 : 150))}
              </span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-lg shadow-neutral-900/10 active:scale-[0.99] transition-all"
            >
              <span>Proceed to Mobile Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                RBI Compliant Gateway
              </span>
              <span className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-neutral-400" />
                Town Hall Store Pickup
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
