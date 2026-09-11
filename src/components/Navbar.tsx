import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Search, 
  Menu, 
  X, 
  Truck, 
  Layers, 
  Mail, 
  Star, 
  Clock,
  Building2,
  ChevronDown,
  Bot,
  Sparkles,
  ArrowLeftRight,
  User as UserIcon
} from 'lucide-react';
import { STORE_INFO } from '../data/initialData';
import { formatINR } from '../utils/formatters';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'tracking' | 'inventory' | 'emails' | 'location' | 'reviews';
  setActiveTab: (tab: 'catalog' | 'tracking' | 'inventory' | 'emails' | 'location' | 'reviews') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ordersCount: number;
  emailsCount: number;
  onOpenAIChat?: () => void;
  compareCount?: number;
  onOpenCompare?: () => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  ordersCount,
  emailsCount,
  onOpenAIChat,
  compareCount = 0,
  onOpenCompare,
  currentUser = null,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Product Catalog' },
    { id: 'tracking', label: 'Order Tracking', badge: ordersCount },
    { id: 'inventory', label: 'Inventory Dashboard' },
    { id: 'emails', label: 'Automated Emails', badge: emailsCount },
    { id: 'location', label: 'Location & Hours' },
    { id: 'reviews', label: 'Reviews (4.7 ★)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top micro announcement bar */}
      <div className="bg-neutral-900 text-neutral-300 px-4 py-1.5 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-white">Huzaifa Square Store Open Today:</span>
          <span>9:30 AM – 7:30 PM (Mill Rd, Sukrawar Pettai, Coimbatore)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:09843128546"
            className="hover:text-amber-400 font-mono flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            09843128546
          </a>
          <span>100% Genuine Parryware, Hindware, Jaquar & Supreme</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo emblem */}
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black font-mono text-xl shadow-md group-hover:bg-amber-600 transition-colors">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 leading-tight">
                BURHANI HARDWARE MART
              </h1>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Coimbatore
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Sanitaryware · Faucets · Plumbing Pipes · FRP Covers
            </p>
          </div>
        </div>

        {/* Search Bar for catalog */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search basins, commodes, ball valves, tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-neutral-50/50"
            />
          </div>
        </div>

        {/* Right Navigation & Cart Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Burhani AI Assistant button */}
          {onOpenAIChat && (
            <button
              id="nav-ai-chat-btn"
              type="button"
              onClick={onOpenAIChat}
              className="px-3 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white border border-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs group"
              title="Open Burhani AI Chatbot"
            >
              <Bot className="w-3.5 h-3.5 text-white transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Ask Burhani AI</span>
              <span className="sm:hidden">AI</span>
              <Sparkles className="w-3 h-3 text-neutral-300" />
            </button>
          )}

          {/* Compare Button */}
          {onOpenCompare && (
            <button
              id="nav-compare-btn"
              type="button"
              onClick={onOpenCompare}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border shadow-2xs ${
                compareCount > 0
                  ? 'bg-neutral-900 hover:bg-black text-white border-neutral-900'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
              }`}
              title="Compare 2 products side-by-side"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              {compareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>
          )}

          {/* Call button */}
          <a
            href="tel:09843128546"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>09843128546</span>
          </a>

          {/* User Account / Login button */}
          {onOpenLogin && (
            <button
              id="nav-login-btn"
              type="button"
              onClick={onOpenLogin}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-2xs ${
                currentUser
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white hover:bg-amber-50/60 text-neutral-800 border-neutral-300'
              }`}
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign in to Store Staff or Contractor portal'}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                currentUser ? 'bg-amber-600 text-white' : 'bg-neutral-100 text-neutral-700'
              }`}>
                {currentUser ? currentUser.name.charAt(0) : <UserIcon className="w-3 h-3" />}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none text-left">
                <span className="text-[11px] font-bold truncate max-w-[100px]">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                </span>
                <span className="text-[9px] text-neutral-500 capitalize">
                  {currentUser ? currentUser.role : 'Staff / Client'}
                </span>
              </div>
            </button>
          )}

          {/* Cart button */}
          <button
            id="nav-cart-trigger"
            type="button"
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono">{formatINR(cartTotal)}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-neutral-300 md:hidden text-neutral-700 hover:bg-neutral-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links Row */}
      <nav className="hidden md:flex border-t border-neutral-100 bg-neutral-50/70 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative w-full mb-2">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products in catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 bg-neutral-50"
            />
          </div>

          {onOpenAIChat && (
            <button
              type="button"
              onClick={() => {
                onOpenAIChat();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold flex items-center justify-between shadow-xs border border-neutral-800"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-white" />
                <span>Ask Burhani AI (Plumbing Specialist)</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
            </button>
          )}

          {onOpenLogin && (
            <button
              id="mobile-nav-login-btn"
              type="button"
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between shadow-2xs border border-amber-300 text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser ? currentUser.name.charAt(0) : <UserIcon className="w-3 h-3" />}
                </div>
                <span>{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Portal Sign In / Staff Login'}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {currentUser ? 'Active' : 'Login'}
              </span>
            </button>
          )}

          {onOpenCompare && (
            <button
              type="button"
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold flex items-center justify-between shadow-2xs border border-neutral-300 text-xs"
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-neutral-900" />
                <span>Product Comparison Matrix</span>
              </div>
              {compareCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
                  {compareCount} Selected
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500 font-normal">Side-by-side</span>
              )}
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left font-medium flex items-center justify-between ${
                  activeTab === item.id
                    ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
            <a href="tel:09843128546" className="font-bold flex items-center gap-1 text-neutral-900">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              09843128546
            </a>
            <span className="text-[11px] text-neutral-500">
              14/2, Mill Rd, Sukrawar Pettai
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
