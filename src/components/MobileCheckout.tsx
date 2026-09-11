import React, { useState } from 'react';
import { CartItem, Order, EmailNotification } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  QrCode,
  Store,
  PhoneCall
} from 'lucide-react';

interface MobileCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: Order, emailNotification: EmailNotification) => void;
  onClearCart: () => void;
}

export const MobileCheckout: React.FC<MobileCheckoutProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  onClearCart,
}) => {
  if (!isOpen) return null;

  // Checkout flow state
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Shipping, 3: Payment
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Coimbatore');
  const [pincode, setPincode] = useState('641001');

  // Delivery choice
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'pickup' | 'standard'>('express');

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'StorePickup'>('UPI');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('8492');
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST standard
  const shippingFee = deliveryMethod === 'pickup' ? 0 : subtotal > 2000 ? 0 : 150;
  const total = subtotal + tax + shippingFee;

  // Auto-fill common Coimbatore pin codes
  const quickPincodes = [
    { pin: '641001', area: 'Town Hall / Sukrawar Pettai (Store Hub)' },
    { pin: '641018', area: 'Race Course Road' },
    { pin: '641002', area: 'RS Puram' },
    { pin: '641004', area: 'Peelamedu' },
    { pin: '641012', area: 'Gandhipuram' },
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!customerName || !phone || !email || !address) {
        setFormError('Please fill in your name, phone, email, and address before continuing.');
        return;
      }
      setFormError(null);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'Card') {
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpModal(true);
      }, 900);
    } else {
      // Direct UPI / Pickup simulated gateway processing
      setTimeout(() => {
        finalizeOrder();
      }, 1400);
    }
  };

  const handleVerifyOtp = () => {
    if (inputOtp.trim() !== otpCode && inputOtp.trim() !== '8492') {
      setOtpError('Invalid OTP code. Please enter 8492');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setShowOtpModal(false);
      finalizeOrder();
    }, 1000);
  };

  const finalizeOrder = () => {
    const newOrderId = `BHM-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `TN-COIM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName,
      email,
      phone,
      address,
      city,
      pincode,
      items: cartItems.map((ci) => ({
        product: ci.product,
        quantity: ci.quantity,
        price: ci.product.price,
      })),
      subtotal,
      tax,
      shippingFee,
      total,
      paymentMethod: paymentMethod === 'StorePickup' ? 'StorePickup' : paymentMethod,
      paymentStatus: paymentMethod === 'StorePickup' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      trackingNumber: trackingNum,
      carrier: deliveryMethod === 'pickup' ? 'Burhani Showroom Desk (Huzaifa Square)' : 'Burhani Express Coimbatore Fleet',
      timeline: [
        {
          title: 'Order Confirmed',
          timestamp: 'Just now',
          description: `Payment ${paymentMethod === 'StorePickup' ? 'Pay-at-counter authorized' : `of ${formatINR(total)} captured via ${paymentMethod}`}. Order placed.`,
          completed: true,
        },
        {
          title: 'Processing at Mill Rd Warehouse',
          timestamp: 'Pending queue',
          description: 'Staff verifying ceramic integrity & packing valves and fittings.',
          completed: false,
        },
        {
          title: 'Dispatched for Local Delivery',
          timestamp: 'Expected Today',
          description: 'Van driver assigned for Coimbatore destination.',
          completed: false,
        },
        {
          title: 'Delivered',
          timestamp: 'Estimated within 24-48 hrs',
          description: 'Handoff with verified receipt.',
          completed: false,
        },
      ],
    };

    // Automated Email Notification System
    const newEmail: EmailNotification = {
      id: `email-${Date.now()}`,
      orderId: newOrderId,
      recipient: email,
      subject: `Order Confirmed: ${newOrderId} - Burhani Hardware Mart, Coimbatore`,
      type: 'order_confirmation',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Delivered',
      contentSnippet: `Dear ${customerName}, your hardware order for ${cartItems.length} items (${formatINR(total)}) has been successfully confirmed.`,
      orderStatusSnapshot: 'Placed',
      orderDetails: {
        customerName,
        totalAmount: total,
        itemCount: cartItems.length,
        itemsList: cartItems.map((ci) => ({
          name: ci.product.title,
          qty: ci.quantity,
          price: ci.product.price,
        })),
        trackingNumber: trackingNum,
        address: `${address}, ${city} - ${pincode}`,
      },
    };

    onOrderPlaced(newOrder, newEmail);
    onClearCart();
    setIsProcessing(false);
    onClose();
  };

  return (
    <div 
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-950/70 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
    >
      <div 
        id="checkout-sheet"
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
              {step}/3
            </span>
            <div>
              <h2 className="font-bold text-neutral-900 text-base leading-tight">
                {step === 1 && 'Delivery & Contact Details'}
                {step === 2 && 'Choose Delivery Speed'}
                {step === 3 && 'Secure Payment Gateway'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                Burhani Hardware Mart · 256-Bit SSL Encrypted
              </p>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 h-1">
          <div 
            className="bg-amber-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: Address & Contact */}
          {step === 1 && (
            <form id="step-1-form" onSubmit={handleNextStep} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  Coimbatore Special: Fast same-day dispatch directly from our Town Hall hub.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name / Contractor Firm
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="e.g. S. Karthik or Classic Finishing"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Mobile Number (For WhatsApp / SMS alerts)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">
                      +91
                    </span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="9843128546"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address (For Automated Invoice & Tracking)
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    placeholder="deevesh1103@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Delivery Street Address / Site Location
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  placeholder="Door No, Street Name, Landmark (e.g. Near Sukrawar Pettai / Mill Rd)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    City / District
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Coimbatore PIN Code
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Quick Pincode selector */}
              <div>
                <span className="text-[11px] text-neutral-500 block mb-1.5">
                  Popular Coimbatore Delivery Hubs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPincodes.map((qp) => (
                    <button
                      key={qp.pin}
                      type="button"
                      onClick={() => {
                        setPincode(qp.pin);
                        if (!address.includes(qp.area)) {
                          setAddress((prev) => (prev ? `${prev}, ${qp.area}` : qp.area));
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        pincode === qp.pin
                          ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                      }`}
                    >
                      {qp.pin} ({qp.area.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  id="checkout-step1-continue"
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  Continue to Delivery Method <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label 
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-amber-600 bg-amber-50/40 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-700" />
                        Same-Day Express Coimbatore Dispatch
                      </span>
                      <span className="font-mono font-bold text-xs text-emerald-700">
                        {subtotal > 2000 ? 'FREE' : formatINR(150)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      Direct transport from Mill Rd store via specialized van for ceramic & fragile goods. Guaranteed delivery within 4–6 hours.
                    </p>
                  </div>
                </label>

                <label 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-amber-600 bg-amber-50/40 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-neutral-800" />
                        Self Pickup at Huzaifa Square Store
                      </span>
                      <span className="font-mono font-bold text-xs text-emerald-700">FREE</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      Pick up ready stock at 14/2, Mill Rd, Sukrawar Pettai, Town Hall, Coimbatore. We inspect materials together before loading.
                    </p>
                  </div>
                </label>
              </div>

              {/* Order summary mini view */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 mt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Order Items ({cartItems.length})
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {cartItems.map((ci) => (
                    <div key={ci.product.id} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-800 truncate max-w-[240px]">
                        {ci.quantity}x {ci.product.title}
                      </span>
                      <span className="font-mono font-semibold text-neutral-900">
                        {formatINR(ci.product.price * ci.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200 mt-3 pt-3 flex justify-between font-bold text-sm text-neutral-900">
                  <span>Estimated Total (incl. 18% GST)</span>
                  <span className="font-mono text-base text-neutral-950">{formatINR(total)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-neutral-300 font-semibold text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  id="checkout-step2-continue"
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  Proceed to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Integrated Payment Gateway */}
          {step === 3 && (
            <form id="step-3-form" onSubmit={handleInitiatePayment} className="space-y-4">
              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'Card'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'NetBanking'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  Net Banking
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">
                      Select UPI App
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'bhim', label: 'BHIM UPI' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiProvider(app.id as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                          upiProvider === app.id
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-200/80">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId('customer@okhdfcbank')}
                        className="px-2.5 py-1.5 text-[11px] bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium"
                      >
                        Sample ID
                      </button>
                    </div>
                  </div>

                  {/* QR Option snippet */}
                  <div className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-neutral-700" />
                      <span className="text-neutral-700">
                        Scan Store Dynamic BharatQR
                      </span>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'Card' && (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      Credit / Debit Card (RuPay, Visa, MasterCard)
                    </span>
                    <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 8912 3456 7890"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senthil Kumar"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by Visa & RuPay Secure OTP with RBI Tokenization compliance.
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'NetBanking' && (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-800 block">
                    Choose Your Bank
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Canara Bank', 'Indian Bank'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl border text-left text-xs font-medium transition-all ${
                            selectedBank === bank
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Or Store Counter Pickup Payment */}
              <button
                type="button"
                onClick={() => setPaymentMethod('StorePickup')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  paymentMethod === 'StorePickup'
                    ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Pay at Coimbatore Store Counter upon Pickup
                </span>
                <span className="text-[11px] opacity-80">Huzaifa Square</span>
              </button>

              {/* Total Calculation breakdown */}
              <div className="bg-neutral-100/80 rounded-xl p-3.5 space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% Hardware & Sanitary standard)</span>
                  <span className="font-mono text-neutral-900">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-neutral-900">
                    {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-neutral-300 pt-2 flex justify-between font-bold text-sm text-neutral-950">
                  <span>Total Amount Payable</span>
                  <span className="font-mono text-base">{formatINR(total)}</span>
                </div>
              </div>

              {/* Submit Payment */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl border border-neutral-300 font-semibold text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  id="checkout-pay-now-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting Gateway...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatINR(total)} Securely</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[10px] text-neutral-400">
                Automated order confirmation email will be dispatched immediately to{' '}
                <strong className="text-neutral-600">{email || 'your email'}</strong>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 3D Secure / OTP Simulation Modal */}
      {showOtpModal && (
        <div 
          id="otp-verification-modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">3D Secure Authentication</h3>
                  <p className="text-[10px] text-neutral-500">RBI Mandatory 2FA Check</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowOtpModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl mb-4 text-xs text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>Merchant:</span>
                <strong className="text-neutral-900">Burhani Hardware Mart</strong>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <strong className="font-mono text-neutral-900">{formatINR(total)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mock OTP Code:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">8492</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Enter 4-Digit One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="8492"
                  value={inputOtp}
                  onChange={(e) => {
                    setInputOtp(e.target.value);
                    setOtpError('');
                  }}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {otpError && <p className="text-xs text-rose-600 mt-1">{otpError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputOtp('8492')}
                  className="px-3 py-2 text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl"
                >
                  Auto-fill
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs"
                >
                  {isProcessing ? 'Verifying...' : `Confirm & Authorize`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
