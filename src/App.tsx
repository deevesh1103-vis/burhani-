import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, EmailNotification, User } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_EMAILS, 
  STORE_INFO,
  storefrontImg,
  showroomImg
} from './data/initialData';
import { formatINR } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { CartDrawer } from './components/CartDrawer';
import { MobileCheckout } from './components/MobileCheckout';
import { OrderTrackingPanel } from './components/OrderTrackingPanel';
import { InventoryDashboard } from './components/InventoryDashboard';
import { EmailNotificationCenter } from './components/EmailNotificationCenter';
import { StoreLocationHours } from './components/StoreLocationHours';
import { ReviewsSection } from './components/ReviewsSection';
import { AIChatBot } from './components/AIChatBot';
import { LoginPage } from './components/LoginPage';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  PhoneCall, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Bot,
  ArrowLeftRight
} from 'lucide-react';

export default function App() {
  // Persistent or initial states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bhm_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bhm_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('bhm_emails');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EMAILS;
      }
    }
    return INITIAL_EMAILS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bhm_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracking' | 'inventory' | 'emails' | 'location' | 'reviews'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedOrderIdForTracking, setSelectedOrderIdForTracking] = useState<string>(
    INITIAL_ORDERS[0]?.id || ''
  );
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<string | null>(null);

  // Side-by-side Product Comparison State
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bhm_compare');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bhm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bhm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bhm_user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setOrderSuccessBanner(`Welcome, ${user.name}! Authenticated as ${user.role.toUpperCase()}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrderSuccessBanner('Signed out of Burhani portal session.');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bhm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bhm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bhm_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('bhm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bhm_compare', JSON.stringify(compareProducts));
  }, [compareProducts]);

  // Comparison handlers
  const handleToggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length < 2) {
        return [...prev, product];
      }
      // If already 2, replace the 2nd one
      return [prev[0], product];
    });
  };

  const handleRemoveCompareProduct = (productId: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareProducts([]);
  };

  const handleOpenCompareModal = () => {
    if (compareProducts.length === 0 && products.length >= 2) {
      setCompareProducts([products[0], products[1]]);
    } else if (compareProducts.length === 1 && products.length >= 2) {
      const second = products.find((p) => p.id !== compareProducts[0].id) || products[1];
      setCompareProducts([compareProducts[0], second]);
    }
    setIsCompareModalOpen(true);
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setSelectedQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order, newEmail: EmailNotification) => {
    // 1. Add order
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Add email notification to automated system
    setEmails((prev) => [newEmail, ...prev]);

    // 3. Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = newOrder.items.find((it) => it.product.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity),
          };
        }
        return prod;
      })
    );

    // 4. Set tracking focus and show success banner
    setSelectedOrderIdForTracking(newOrder.id);
    setOrderSuccessBanner(
      `Order ${newOrder.id} placed successfully! An automated email confirmation was dispatched to ${newOrder.email}.`
    );
    setActiveTab('tracking');

    setTimeout(() => {
      setOrderSuccessBanner(null);
    }, 9000);
  };

  // Inventory modifications
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (created: Product) => {
    setProducts((prev) => [created, ...prev]);
  };

  // Order status advancement with automated email dispatch
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    let targetOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          targetOrder = ord;
          const updatedTimeline = ord.timeline.map((evt) => {
            if (evt.title.toLowerCase().includes(newStatus.toLowerCase())) {
              return { ...evt, completed: true, timestamp: 'Updated Just Now' };
            }
            return evt;
          });

          return {
            ...ord,
            orderStatus: newStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    // Generate automated tracking notification email
    if (targetOrder) {
      const automatedEmail: EmailNotification = {
        id: `email-update-${Date.now()}`,
        orderId: targetOrder.id,
        recipient: targetOrder.email,
        subject: `Update: Order ${targetOrder.id} Status is now ${newStatus} 🚚`,
        type: newStatus === 'Delivered' ? 'delivery_complete' : 'tracking_update',
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Delivered',
        contentSnippet: `Your hardware shipment ${targetOrder.id} has progressed to "${newStatus}". Track live with Burhani Express Coimbatore Fleet.`,
        orderStatusSnapshot: newStatus,
        orderDetails: {
          customerName: targetOrder.customerName,
          totalAmount: targetOrder.total,
          itemCount: targetOrder.items.length,
          itemsList: targetOrder.items.map((i) => ({
            name: i.product.title,
            qty: i.quantity,
            price: i.price,
          })),
          trackingNumber: targetOrder.trackingNumber,
          address: `${targetOrder.address}, ${targetOrder.city}`,
        },
      };

      setEmails((prev) => [automatedEmail, ...prev]);
    }
  };

  const handleResendEmail = (emailId: string) => {
    const target = emails.find((e) => e.id === emailId);
    if (target) {
      setOrderSuccessBanner(`Automated email notification re-sent successfully to ${target.recipient}!`);
    }
  };

  // Filter and sort catalog
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = cartSubtotal + Math.round(cartSubtotal * 0.18) + (cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 150);

  const categories = [
    'All',
    'Sanitaryware & Closets',
    'Wash Basins & Countertops',
    'Faucets & Showers',
    'Plumbing Pipes & Valves',
    'Heavy Duty Manhole Covers & Chambers',
    'Plumbing Tools',
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* App Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        ordersCount={orders.length}
        emailsCount={emails.length}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        compareCount={compareProducts.length}
        onOpenCompare={handleOpenCompareModal}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Success Notification Banner if order placed */}
      {orderSuccessBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="max-w-6xl mx-auto w-full flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{orderSuccessBanner}</span>
          </div>
          <button
            onClick={() => setOrderSuccessBanner(null)}
            className="text-white/80 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: PRODUCT CATALOG & STOREFRONT */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Storefront Hero Showcase */}
            <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white border border-neutral-800 shadow-xl">
              {/* Background store night image with subtle gradient overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={storefrontImg}
                  alt="Burhani Hardware Mart Huzaifa Square Coimbatore"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-900/60" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Coimbatore's Premier Hardware & Sanitaryware Destination</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  BURHANI HARDWARE MART
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Huzaifa Square, 14/2 Mill Road, Sukrawar Pettai, Coimbatore. Full wholesale & retail stocks of Parryware, Hindware, Jaquar sanitary fittings, Supreme UPVC ball valves, and heavy duty FRP manhole inspection chamber covers.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    100% Genuine Guaranteed Materials
                  </span>
                  <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4 text-amber-400" />
                    Same-Day Local Coimbatore Dispatch
                  </span>
                  <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 font-mono font-bold text-emerald-300">
                    All Values in ₹ INR (Zero USD $)
                  </span>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-grid-header');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
                  >
                    <span>Browse Minimalist Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAIChatOpen(true)}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs sm:text-sm border border-neutral-200 flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Bot className="w-4 h-4 text-black" />
                    <span>Ask Burhani AI</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('location')}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
                  >
                    View Storefront & Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Filter and Sort Header */}
            <div id="catalog-grid-header" className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    Product Catalog
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Showing {sortedProducts.length} hardware and sanitaryware items available at Coimbatore Hub.
                  </p>
                </div>

                {/* Controls: Compare & Sort */}
                <div className="flex items-center gap-2.5">
                  <button
                    id="catalog-compare-trigger-btn"
                    type="button"
                    onClick={handleOpenCompareModal}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                      compareProducts.length > 0
                        ? 'bg-neutral-900 hover:bg-black text-white border-neutral-900'
                        : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                    }`}
                    title="Compare 2 products side-by-side"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Compare</span>
                    {compareProducts.length > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-mono font-black flex items-center justify-center">
                        {compareProducts.length}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-normal">Table</span>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High (₹)</option>
                      <option value="price-high">Price: High to Low (₹)</option>
                      <option value="rating">Customer Rating (★)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white font-bold shadow-xs'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedQuickViewProduct(p)}
                    onAddToCart={handleAddToCart}
                    isComparing={compareProducts.some((p) => p.id === product.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
                <p className="text-neutral-500 text-sm">
                  No products found matching your search. Try changing categories or search terms.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CUSTOMER ORDER TRACKING PANEL */}
        {activeTab === 'tracking' && (
          <OrderTrackingPanel
            orders={orders}
            selectedOrderId={selectedOrderIdForTracking}
            onSelectOrder={(id) => setSelectedOrderIdForTracking(id)}
          />
        )}

        {/* VIEW 3: INVENTORY & FULFILLMENT DASHBOARD */}
        {activeTab === 'inventory' && (
          <InventoryDashboard
            products={products}
            orders={orders}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* VIEW 4: AUTOMATED EMAIL NOTIFICATION SYSTEM */}
        {activeTab === 'emails' && (
          <EmailNotificationCenter
            emails={emails}
            onResendEmail={handleResendEmail}
          />
        )}

        {/* VIEW 5: STORE LOCATION, GOOGLE MAPS & HOURS */}
        {activeTab === 'location' && <StoreLocationHours />}

        {/* VIEW 6: VERIFIED REVIEWS */}
        {activeTab === 'reviews' && <ReviewsSection />}
      </main>

      {/* Quick View Modal with Zoom Functionality */}
      <ProductQuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isComparing={
          selectedQuickViewProduct
            ? compareProducts.some((p) => p.id === selectedQuickViewProduct.id)
            : false
        }
        onToggleCompare={handleToggleCompare}
      />

      {/* Side-by-Side Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        productA={compareProducts[0] || products[0] || null}
        productB={compareProducts[1] || products[1] || null}
        allProducts={products}
        onSelectProductA={(p) => {
          setCompareProducts((prev) => [
            p,
            prev[1] || products.find((x) => x.id !== p.id) || products[0],
          ]);
        }}
        onSelectProductB={(p) => {
          setCompareProducts((prev) => [
            prev[0] || products[0],
            p,
          ]);
        }}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => {
          setIsCompareModalOpen(false);
          setSelectedQuickViewProduct(p);
        }}
      />

      {/* Floating Comparison Dock Bar */}
      {!isCompareModalOpen && (
        <CompareFloatingBar
          selectedProducts={compareProducts}
          onRemoveProduct={handleRemoveCompareProduct}
          onClear={handleClearCompare}
          onOpenCompare={handleOpenCompareModal}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Mobile-Optimized Checkout Modal with Integrated Payment Gateway */}
      <MobileCheckout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderPlaced={handleOrderPlaced}
        onClearCart={() => setCart([])}
      />

      {/* Mobile Sticky Conversion Bottom Bar (When cart has items on small screens) */}
      {cartCount > 0 && !isCheckoutOpen && !isCartOpen && (
        <div 
          id="mobile-sticky-conversion-bar"
          className="fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 sm:hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">
                {cartCount} Items Selected
              </span>
              <span className="font-mono text-lg font-extrabold text-neutral-950">
                {formatINR(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-neutral-200 text-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-base">
                B
              </div>
              <span className="text-neutral-900 text-base font-bold tracking-tight">BURHANI HARDWARE MART</span>
            </div>
            <p className="text-neutral-600 font-normal leading-relaxed text-sm">
              Huzaifa Square, 14/2, Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore, Tamil Nadu 641001. Complete plumbing, sanitaryware, and heavy hardware supplies.
            </p>
          </div>

          <div>
            <span className="text-neutral-900 block mb-3 font-semibold uppercase tracking-wider text-sm">
              OPERATING HOURS
            </span>
            <p className="text-neutral-600 font-normal text-sm leading-relaxed">
              Mon – Sat: 9:30 am – 7:30 pm<br />
              Sunday: 10:00 am – 12:00 pm<br />
              <span className="italic text-neutral-500 font-normal">(Festival hours might differ on Ganesh Chaturthi)</span>
            </p>
          </div>

          <div>
            <span className="text-neutral-900 block mb-3 font-semibold uppercase tracking-wider text-sm">
              DIRECT CONTACT
            </span>
            <p className="text-neutral-600 font-normal text-sm leading-relaxed">
              Phone: <a href="tel:09843128546" className="text-neutral-800 font-normal font-mono hover:underline">09843128546</a><br />
              WhatsApp: <span className="text-neutral-800 font-normal">+91 98431 28546</span><br />
              Email: <span className="text-neutral-800 font-normal">orders@burhanihardware.in</span>
            </p>
          </div>

          <div>
            <span className="text-neutral-900 block mb-3 font-semibold uppercase tracking-wider text-sm">
              SECURITY & PAYMENT
            </span>
            <p className="text-neutral-600 font-normal text-sm leading-relaxed">
              UPI, RuPay, Visa, MasterCard, Net Banking & Store Counter Pickup. 256-Bit SSL Encrypted. Currency in Indian Rupees (₹).
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-100 py-4 text-center text-neutral-500 font-normal text-xs sm:text-sm">
          © {new Date().getFullYear()} Burhani Hardware Mart, Coimbatore. All rights reserved.
        </div>
      </footer>

      {/* Burhani AI Chat Assistant */}
      <AIChatBot
        isOpen={isAIChatOpen}
        onToggle={() => setIsAIChatOpen((prev) => !prev)}
        onNavigateTab={setActiveTab}
        onSelectCategory={setSelectedCategory}
        products={products}
      />

      {/* Staff & Contractor Login / Account Modal */}
      <LoginPage
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
