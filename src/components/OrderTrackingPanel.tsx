import React, { useState } from 'react';
import { Order } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Printer, 
  Mail, 
  ShieldCheck, 
  ExternalLink,
  Store,
  FileText
} from 'lucide-react';

interface OrderTrackingPanelProps {
  orders: Order[];
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
  onSendTrackingEmailPrompt?: (order: Order) => void;
}

export const OrderTrackingPanel: React.FC<OrderTrackingPanelProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onSendTrackingEmailPrompt,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Find active order or default to the most recent
  const currentOrder = 
    orders.find((o) => o.id === selectedOrderId) || 
    (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase().includes(query) ||
        o.phone.includes(query) ||
        o.email.toLowerCase().includes(query.toLowerCase()) ||
        o.trackingNumber.toUpperCase().includes(query)
    );
    if (found) {
      setSearchError(null);
      onSelectOrder(found.id);
    } else {
      setSearchError(`No order found matching "${searchInput}". Please check your order ID or phone number.`);
    }
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Dispatched':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div id="order-tracking-panel" className="max-w-5xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Real-Time Tracking Service
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
              Customer Order & Dispatch Tracker
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Track your sanitaryware and hardware consignments from our Mill Road hub.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Order ID (e.g. BHM-84291) or Phone"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {searchError && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>{searchError}</span>
            <button
              type="button"
              onClick={() => setSearchError(null)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Order Tabs */}
        {orders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-500 font-medium flex-shrink-0">Recent Orders:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => onSelectOrder(ord.id)}
                className={`px-3 py-1 rounded-lg border font-mono font-medium whitespace-nowrap transition-all ${
                  currentOrder?.id === ord.id
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {ord.id} ({ord.customerName.split(' ')[0]}) · {ord.orderStatus}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column: Live Tracking Timeline & Goods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <span className="text-xs text-neutral-400 font-mono">Order Number</span>
                  <h3 className="text-xl font-mono font-bold text-neutral-900">
                    {currentOrder.id}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Placed on {currentOrder.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      currentOrder.orderStatus
                    )}`}
                  >
                    ● {currentOrder.orderStatus}
                  </span>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3 py-1 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    GST Invoice
                  </button>
                </div>
              </div>

              {/* Courier & Tracking Code */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-xl bg-neutral-50 text-xs">
                <div>
                  <span className="text-neutral-500 block">Carrier</span>
                  <strong className="text-neutral-900 font-medium">
                    {currentOrder.carrier}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Waybill / Waybill No</span>
                  <strong className="font-mono text-neutral-900">
                    {currentOrder.trackingNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Payment</span>
                  <strong className="text-emerald-700 font-medium">
                    {currentOrder.paymentStatus} via {currentOrder.paymentMethod}
                  </strong>
                </div>
              </div>

              {/* Step Progress Timeline */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-4">
                  Consignment Journey
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                  {currentOrder.timeline.map((event, idx) => (
                    <div key={idx} className="relative group">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] transition-colors ${
                          event.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-white border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {event.completed ? '✓' : idx + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span
                            className={`text-sm font-bold ${
                              event.completed ? 'text-neutral-900' : 'text-neutral-500'
                            }`}
                          >
                            {event.title}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Consignment Items */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                Items in This Shipment ({currentOrder.items.length})
              </h4>
              <div className="divide-y divide-neutral-100">
                {currentOrder.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 block text-xs sm:text-sm">
                          {it.product.title}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          SKU: {it.product.sku} · Qty: {it.quantity} units
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-neutral-900 block">
                        {formatINR(it.price * it.quantity)}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        ({formatINR(it.price)} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Support Dispatch */}
          <div className="space-y-6">
            {/* Delivery Recipient Details */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs text-xs space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-neutral-700 text-xs border-b pb-2">
                Shipping Destination
              </h4>

              <div>
                <span className="text-neutral-400 block">Recipient:</span>
                <strong className="text-neutral-900 text-sm">{currentOrder.customerName}</strong>
              </div>

              <div>
                <span className="text-neutral-400 block">Address:</span>
                <p className="text-neutral-800 leading-relaxed font-medium">
                  {currentOrder.address}, {currentOrder.city} - {currentOrder.pincode}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-neutral-400 block">Contact Phone:</span>
                  <a
                    href={`tel:${currentOrder.phone}`}
                    className="text-neutral-800 font-mono font-semibold hover:underline"
                  >
                    +91 {currentOrder.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 block">Email:</span>
                  <span className="text-neutral-800 truncate block">
                    {currentOrder.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs text-xs space-y-2.5">
              <h4 className="font-bold uppercase tracking-wider text-neutral-700 text-xs border-b pb-2">
                Payment Summary
              </h4>

              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatINR(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST (18%)</span>
                <span className="font-mono">{formatINR(currentOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {currentOrder.shippingFee === 0 ? 'FREE' : formatINR(currentOrder.shippingFee)}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-neutral-950">
                <span>Total Paid</span>
                <span className="font-mono text-base">{formatINR(currentOrder.total)}</span>
              </div>
            </div>

            {/* Support Hotline */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Phone className="w-4 h-4" />
                <span>Need Delivery Assistance?</span>
              </div>
              <p className="text-amber-800">
                Contact our Mill Road store dispatch desk directly for immediate location assistance or contractor delivery scheduling.
              </p>
              <a
                href="tel:09843128546"
                className="inline-flex items-center gap-1.5 font-bold font-mono text-neutral-900 bg-white px-3 py-2 rounded-xl border border-amber-300 shadow-xs hover:bg-neutral-50 transition-colors"
              >
                Call: 09843128546
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200 text-neutral-500">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-800 text-base">No Orders Available</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Place an order from the catalog to see real-time dispatch tracking.
          </p>
        </div>
      )}

      {/* GST Tax Invoice Modal */}
      {showInvoiceModal && currentOrder && (
        <div 
          id="invoice-modal-backdrop"
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-300 my-auto text-neutral-900 relative print:p-0">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-900 print:hidden"
            >
              ✕
            </button>

            {/* Invoice Printable Content */}
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">BURHANI HARDWARE MART</h2>
                  <p className="text-xs text-neutral-600">
                    Huzaifa Square, 14/2, Mill Rd, Sukrawar Pettai<br />
                    Town Hall, Coimbatore, Tamil Nadu 641001<br />
                    Phone: 09843128546 | Email: orders@burhanihardware.in<br />
                    <strong>GSTIN: 33AAHFB8491J1Z8</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                    Tax Invoice / Bill of Supply
                  </span>
                  <h3 className="text-base font-mono font-bold">{currentOrder.id}</h3>
                  <span className="text-xs text-neutral-500">Date: {currentOrder.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-3.5 rounded-xl">
                <div>
                  <span className="text-neutral-500 block font-semibold">Billed To:</span>
                  <strong className="text-sm">{currentOrder.customerName}</strong>
                  <p className="text-neutral-700 mt-0.5">
                    {currentOrder.address}<br />
                    {currentOrder.city}, Tamil Nadu - {currentOrder.pincode}<br />
                    Phone: +91 {currentOrder.phone}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500 block font-semibold">Payment & Transport:</span>
                  <p className="text-neutral-700">
                    Payment Method: <strong>{currentOrder.paymentMethod}</strong> ({currentOrder.paymentStatus})<br />
                    Carrier: <strong>{currentOrder.carrier}</strong><br />
                    Waybill: <strong>{currentOrder.trackingNumber}</strong><br />
                    Place of Supply: <strong>Tamil Nadu (33)</strong>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b text-neutral-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">HSN</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Rate</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {currentOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-medium">{it.product.title}</td>
                        <td className="py-2.5 text-center font-mono">6910 / 8481</td>
                        <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{formatINR(it.price)}</td>
                        <td className="py-2.5 text-right font-mono font-bold">
                          {formatINR(it.price * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">{formatINR(currentOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span className="font-mono">{formatINR(currentOrder.tax / 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span className="font-mono">{formatINR(currentOrder.tax / 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-mono">{formatINR(currentOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2 font-bold text-sm">
                    <span>Total Invoice Amount:</span>
                    <span className="font-mono">{formatINR(currentOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 border-t pt-3 text-center">
                This is a computer-generated tax invoice issued by Burhani Hardware Mart, Coimbatore under GST ACT 2017.
              </div>

              <div className="flex justify-end gap-2 print:hidden pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Tax Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
