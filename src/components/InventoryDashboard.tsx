import React, { useState } from 'react';
import { Product, Order, EmailNotification, User } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  IndianRupee, 
  Edit3, 
  Save, 
  X, 
  Check, 
  Truck, 
  Clock, 
  Send,
  Layers,
  ChevronRight,
  ShieldCheck,
  Lock,
  User as UserIcon
} from 'lucide-react';

interface InventoryDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['orderStatus']) => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onUpdateOrderStatus,
  currentUser = null,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Plumbing Pipes & Valves');
  const [newPrice, setNewPrice] = useState(450);
  const [newStock, setNewStock] = useState(30);
  const [newSku, setNewSku] = useState('');
  const [newBrand, setNewBrand] = useState('Supreme / Astral');
  const [newMaterial, setNewMaterial] = useState('UPVC / Brass');
  const [newDimensions, setNewDimensions] = useState('1 Inch (25mm)');

  // Stats calculation
  const totalSkuCount = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 20).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditPrice(product.price);
    setEditStock(product.stock);
  };

  const saveEdit = (product: Product) => {
    onUpdateProduct({
      ...product,
      price: Number(editPrice),
      stock: Number(editStock),
    });
    setEditingProductId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `bhm-custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      rating: 4.8,
      reviewsCount: 1,
      stock: Number(newStock),
      sku: newSku || `BHM-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newBrand,
      images: [products[0]?.images[0] || ''],
      description: `Premium quality hardware part distributed by Burhani Hardware Mart, Coimbatore. Tested for durability and residential / commercial installations.`,
      material: newMaterial,
      dimensions: newDimensions,
      warranty: '2 Years Manufacturer Warranty',
      features: ['Corrosion resistant', 'Tested to IS standards', 'Genuine showroom stock'],
      featured: false,
    };

    onAddProduct(created);
    setShowAddModal(false);
    // Reset
    setNewTitle('');
    setNewPrice(450);
    setNewStock(30);
    setNewSku('');
  };

  return (
    <div id="inventory-dashboard" className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Store Operations & Warehouse Control
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
            Burhani Hardware Mart Inventory & Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Manage stock levels at Mill Road warehouse, adjust ₹ INR prices, and dispatch customer consignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auth status indicator */}
          {currentUser ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="font-bold truncate max-w-[140px]">{currentUser.name}</span>
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="underline text-[10px] text-amber-800 hover:text-amber-950 ml-1"
                >
                  Manage
                </button>
              )}
            </div>
          ) : (
            onOpenLogin && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Staff Sign In (PIN: 641001)</span>
              </button>
            )
          )}

          <div className="p-1 bg-neutral-100 rounded-xl flex">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Inventory ({totalSkuCount} SKUs)
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Order Fulfillment ({orders.length})
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              id="add-product-btn"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add SKU</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards (All values strictly in ₹ INR) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Total Catalog SKUs</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
              {totalSkuCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Available Stock Units</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900">
              {totalStockUnits}
            </span>
            <span className="text-xs text-neutral-400">Coimbatore Central</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Inventory Valuation (₹)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-950">
              {formatINR(totalValuation)}
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              ₹ INR
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Low Stock Alerts</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">
              {lowStockCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Reorder Soon
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT TABLE */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by title, brand or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'Sanitaryware & Closets', 'Wash Basins & Countertops', 'Faucets & Showers', 'Plumbing Pipes & Valves', 'Heavy Duty Manhole Covers & Chambers'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {cat === 'Heavy Duty Manhole Covers & Chambers' ? 'Manhole Covers' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4 text-right">Price (₹ INR)</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-right">Stock Valuation</th>
                  <th className="py-3 px-4 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => {
                  const isEditing = editingProductId === p.id;
                  const isLow = p.stock <= 20;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 bg-white">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <span className="font-semibold text-neutral-900 block truncate">
                              {p.title}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        <span className="inline-block max-w-[140px] truncate">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-neutral-700">
                        {p.brand}
                      </td>

                      {/* Price in ₹ INR with inline edit */}
                      <td className="py-3 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-neutral-500 font-mono">₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-amber-400 rounded text-right font-mono font-bold text-xs"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-neutral-950">
                            {formatINR(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Stock units with inline edit */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-amber-400 rounded text-center font-mono font-bold text-xs"
                          />
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                              isLow
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        )}
                      </td>

                      {/* Valuation */}
                      <td className="py-3 px-4 text-right font-mono text-neutral-700">
                        {formatINR(p.price * p.stock)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEdit(p)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Save Changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="p-1.5 rounded-lg bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 flex items-center gap-1 text-[11px] font-medium mx-auto transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS FULFILLMENT & AUTOMATED NOTIFICATIONS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50/50">
            <div>
              <h3 className="font-bold text-base text-neutral-900">
                Live Dispatch & Fulfillment Control
              </h3>
              <p className="text-xs text-neutral-500">
                Updating an order status automatically dispatches a verified email notification to the customer with live tracking updates.
              </p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Automated Email System Active
            </span>
          </div>

          <div className="divide-y divide-neutral-200">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 hover:bg-neutral-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-neutral-900">
                        {ord.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {ord.paymentMethod} · {ord.paymentStatus}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {ord.date}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-neutral-600">
                      <strong>{ord.customerName}</strong> ({ord.phone}) · {ord.address}, {ord.city}
                    </div>

                    <div className="mt-2 text-xs text-neutral-500 flex flex-wrap gap-2">
                      {ord.items.map((it, i) => (
                        <span key={i} className="bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          {it.quantity}x {it.product.title.split(' ')[0]} {it.product.title.split(' ')[1]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-neutral-400 block">Total Amount</span>
                      <span className="font-mono font-bold text-base text-neutral-950">
                        {formatINR(ord.total)}
                      </span>
                    </div>

                    {/* Status updater dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed at Warehouse</option>
                        <option value="Dispatched">Dispatched from Mill Rd</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div 
          id="add-product-modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  Add New Hardware / Sanitary Product
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter specifications and pricing in Indian Rupees (₹)
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.5-Inch Brass Non-Return Valve"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="Plumbing Pipes & Valves">Plumbing Pipes & Valves</option>
                    <option value="Sanitaryware & Closets">Sanitaryware & Closets</option>
                    <option value="Wash Basins & Countertops">Wash Basins & Countertops</option>
                    <option value="Faucets & Showers">Faucets & Showers</option>
                    <option value="Heavy Duty Manhole Covers & Chambers">Manhole Covers</option>
                    <option value="Plumbing Tools">Plumbing Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Astral / Jaquar"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Selling Price in Indian Rupees (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Material / Build
                  </label>
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Size / Dimension
                  </label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold shadow-xs"
                >
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
