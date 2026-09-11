import React, { useState } from 'react';
import { STORE_INFO, storefrontImg, showroomImg, washbasinImg, manholeImg, plumbingImg } from '../data/initialData';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  CreditCard, 
  CheckCircle, 
  ExternalLink, 
  ShieldCheck, 
  Star,
  MessageSquare,
  Building,
  Calendar
} from 'lucide-react';

export const StoreLocationHours: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<number>(0);

  const photos = [
    { src: storefrontImg, label: 'Storefront Facade at Huzaifa Square (Mill Rd)' },
    { src: showroomImg, label: 'Massive Sanitaryware & Faucet Fixture Display' },
    { src: washbasinImg, label: 'Tabletop Wash Basins & Countertops Section' },
    { src: manholeImg, label: 'Warehouse Storage for FRP & Iron Drainage Covers' },
    { src: plumbingImg, label: 'Full Range of Plumbing Valves & Brass Fittings' },
  ];

  return (
    <div id="store-location-hours" className="max-w-6xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {STORE_INFO.building} · Town Hall Hub
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-neutral-900">{STORE_INFO.rating}</span>
                <span className="text-neutral-400 font-normal">
                  ({STORE_INFO.totalReviews} Google Reviews)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {STORE_INFO.name}
            </h1>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              Coimbatore's trusted destination for wholesale & retail sanitaryware, Parryware, Hindware, Jaquar fittings, Supreme pipes, brass valves, and heavy duty FRP manhole covers.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-700">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
                {STORE_INFO.address}
              </span>
              <span className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                {STORE_INFO.displayPhone}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call 09843128546</span>
            </a>
            <a
              href="https://wa.me/919843128546?text=Hello%20Burhani%20Hardware%20Mart,%20I%20need%20price%20quote%20and%20stock%20details"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* Showroom & Warehouse Gallery (Matching PDF photos) */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Showroom & Warehouse Inventory (Huzaifa Square, Mill Rd)
            </h3>
            <p className="text-xs text-neutral-500">
              Photographs of our extensive multi-floor display and warehouse ready-stock.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {activePhoto + 1} / {photos.length}
          </span>
        </div>

        {/* Featured Big Photo */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
          <img
            src={photos[activePhoto].src}
            alt={photos[activePhoto].label}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-xs font-medium">
            {photos[activePhoto].label}
          </div>
        </div>

        {/* Thumbnails row */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {photos.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all ${
                activePhoto === idx
                  ? 'border-amber-600 ring-2 ring-amber-500/20'
                  : 'border-neutral-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={p.src}
                alt={p.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: Embedded Google Maps & Operating Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Google Maps Embed iframe snippet */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  Google Maps Storefront Location
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Coimbatore Pin: 641001
              </span>
            </div>

            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner">
              <iframe
                title="Burhani Hardware Mart Location"
                src={STORE_INFO.googleMapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
            <span>
              <strong>Landmarks:</strong> Sukrawar Pettai, Near Town Hall, Mill Road.
            </span>
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
            >
              Open in Google Maps App <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Operating Hours & Payment Facilities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operating Hours Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-neutral-800" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  Business Operating Hours
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Open Today
              </span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {STORE_INFO.operatingHours.map((h, i) => (
                <div
                  key={i}
                  className={`py-2.5 flex items-center justify-between ${
                    h.isCurrentDay
                      ? 'font-bold text-neutral-900 bg-amber-50/50 -mx-2 px-2 rounded-lg'
                      : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {h.isCurrentDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    )}
                    <span>{h.day}</span>
                  </div>
                  <span className="font-mono">{h.hours}</span>
                </div>
              ))}
            </div>

            {/* Ganesh Chaturthi note from user prompt */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Festival Notice:</strong> On Ganesh Chaturthi & Observed Public Holidays, showroom hours may differ. Please call 09843128546 before visiting.
              </span>
            </div>
          </div>

          {/* Accepted In-Store Payment Modes */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs text-xs space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-800" />
              <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                Storefront Payment Facilities
              </h4>
            </div>
            <p className="text-neutral-500">
              We support all digital and point-of-sale modes for contractor billing & retail customer purchases:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Credit Cards', 'Debit Cards', 'UPI (GPay / PhonePe / Paytm)', 'RTGS / NEFT', 'Cash at Counter'].map(
                (m, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium border border-neutral-200"
                  >
                    ✓ {m}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
