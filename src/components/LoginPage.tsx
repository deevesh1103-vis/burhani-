import React, { useState } from 'react';
import { User } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Briefcase, 
  Phone, 
  X,
  KeyRound
} from 'lucide-react';

export type LoginTheme = 'amber' | 'terracotta' | 'slate' | 'emerald';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  initialRole?: 'admin' | 'customer';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  initialRole = 'admin',
}) => {
  if (!isOpen) return null;

  // Active tab: 'staff' for store admin/sales desk, 'customer' for contractors/clients
  const [roleTab, setRoleTab] = useState<'staff' | 'customer'>(
    initialRole === 'admin' ? 'staff' : 'customer'
  );

  // Customizable Theme State - enables dynamic color variations
  const [theme, setTheme] = useState<LoginTheme>('amber');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState(
    roleTab === 'staff' ? 'admin@burhanihardware.in' : 'karthik.plumbing@gmail.com'
  );
  const [password, setPassword] = useState('burhani2026');
  const [staffPin, setStaffPin] = useState('641001');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Theme palettes configuration
  const themeStyles = {
    amber: {
      name: 'Warm Amber & Sandstone',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      headerBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-stone-800 text-white',
      accentText: 'text-amber-700',
      primaryBtn: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-600/20',
      cardBorder: 'border-amber-200/90',
      tabActive: 'bg-amber-600 text-white shadow-xs',
      inputFocus: 'focus:ring-amber-500 focus:border-amber-500',
      dot: 'bg-amber-500',
      cardBg: 'bg-amber-50/40',
    },
    terracotta: {
      name: 'Terracotta & Bronze',
      badge: 'bg-orange-100 text-orange-950 border-orange-300',
      headerBg: 'bg-gradient-to-br from-orange-700 via-rose-800 to-neutral-900 text-white',
      accentText: 'text-orange-800',
      primaryBtn: 'bg-gradient-to-r from-orange-700 to-rose-700 hover:from-orange-800 hover:to-rose-800 text-white shadow-md shadow-orange-700/20',
      cardBorder: 'border-orange-200/90',
      tabActive: 'bg-orange-700 text-white shadow-xs',
      inputFocus: 'focus:ring-orange-600 focus:border-orange-600',
      dot: 'bg-orange-600',
      cardBg: 'bg-orange-50/40',
    },
    slate: {
      name: 'Industrial Slate & Navy',
      badge: 'bg-slate-100 text-slate-900 border-slate-300',
      headerBg: 'bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950 text-white',
      accentText: 'text-slate-800',
      primaryBtn: 'bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black text-white shadow-md shadow-slate-900/25',
      cardBorder: 'border-slate-300/80',
      tabActive: 'bg-slate-900 text-white shadow-xs',
      inputFocus: 'focus:ring-slate-700 focus:border-slate-700',
      dot: 'bg-slate-700',
      cardBg: 'bg-slate-50/60',
    },
    emerald: {
      name: 'Forest Architectural Emerald',
      badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      headerBg: 'bg-gradient-to-br from-emerald-700 via-teal-800 to-neutral-900 text-white',
      accentText: 'text-emerald-800',
      primaryBtn: 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white shadow-md shadow-emerald-700/20',
      cardBorder: 'border-emerald-200/90',
      tabActive: 'bg-emerald-700 text-white shadow-xs',
      inputFocus: 'focus:ring-emerald-600 focus:border-emerald-600',
      dot: 'bg-emerald-600',
      cardBg: 'bg-emerald-50/40',
    },
  };

  const activeTheme = themeStyles[theme];

  // Handle Tab switch
  const handleTabSwitch = (tab: 'staff' | 'customer') => {
    setRoleTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (tab === 'staff') {
      setEmailOrPhone('admin@burhanihardware.in');
      setPassword('burhani2026');
      setStaffPin('641001');
    } else {
      setEmailOrPhone('karthik.plumbing@gmail.com');
      setPassword('karthik123');
    }
  };

  // Quick Demo fill
  const fillStaffDemo = () => {
    setRoleTab('staff');
    setEmailOrPhone('manager@burhanihardware.in');
    setPassword('burhani2026');
    setStaffPin('641001');
    setErrorMessage(null);
  };

  const fillContractorDemo = () => {
    setRoleTab('customer');
    setEmailOrPhone('9843128546');
    setPassword('contractor2026');
    setErrorMessage(null);
  };

  // Submit login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    if (roleTab === 'staff') {
      if (staffPin !== '641001' && staffPin !== '1234' && staffPin.length < 4) {
        setErrorMessage('Invalid Staff Counter PIN. Try default PIN: 641001');
        return;
      }

      const staffUser: User = {
        id: 'usr-admin-01',
        name: 'M. Saifuddin (Store Manager)',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'admin@burhanihardware.in',
        phone: '09843128546',
        role: 'admin',
        storeBranch: 'Huzaifa Square, Town Hall, Coimbatore',
      };

      setSuccessMessage('Store Manager authentication verified! Opening dashboard...');
      setTimeout(() => {
        onLogin(staffUser);
        onClose();
      }, 700);
    } else {
      // Customer / Contractor Login
      const customerUser: User = {
        id: 'usr-cust-02',
        name: 'Karthik S. (Lead Plumbing Contractor)',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'karthik.contractor@gmail.com',
        phone: emailOrPhone.includes('@') ? '9843128546' : emailOrPhone,
        role: 'customer',
        firmName: 'Classic Sanitary & Plumbing Works',
      };

      setSuccessMessage('Welcome back, Karthik! Loading contractor account...');
      setTimeout(() => {
        onLogin(customerUser);
        onClose();
      }, 700);
    }
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="login-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border ${activeTheme.cardBorder} overflow-hidden my-auto transition-all`}
      >
        {/* Top Header with Theme Gradient */}
        <div className={`p-6 ${activeTheme.headerBg} relative`}>
          <button
            id="login-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-mono font-black text-xl shadow-inner">
              B
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                Burhani Hardware Mart
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                {currentUser ? 'Account & Session' : 'Portal Sign In'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-white/85 max-w-sm">
            Huzaifa Square, Town Hall, Coimbatore. Authorized distributor of Parryware, Hindware, Jaquar & Supreme.
          </p>

          {/* Color Palette Switcher - allows user to dynamically change login page color */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Accent:</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setTheme('amber')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  theme === 'amber' ? 'bg-white text-amber-900 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Warm Amber & Sandstone"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Amber</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('terracotta')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  theme === 'terracotta' ? 'bg-white text-orange-950 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Terracotta & Bronze"
              >
                <span className="w-2 h-2 rounded-full bg-orange-600 inline-block" />
                <span>Terracotta</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('slate')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  theme === 'slate' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Industrial Slate & Navy"
              >
                <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                <span>Slate</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('emerald')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  theme === 'emerald' ? 'bg-white text-emerald-950 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Forest Architectural Emerald"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                <span>Emerald</span>
              </button>
            </div>
          </div>
        </div>

        {/* If user is already logged in, show active user session */}
        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className={`p-4 rounded-2xl ${activeTheme.cardBg} border ${activeTheme.cardBorder} flex items-start gap-4`}>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center font-bold text-lg text-neutral-800">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900 text-base truncate">
                    {currentUser.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${activeTheme.badge}`}>
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 truncate mt-0.5">
                  {currentUser.email}
                </p>
                {currentUser.storeBranch && (
                  <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-neutral-400" />
                    {currentUser.storeBranch}
                  </p>
                )}
                {currentUser.firmName && (
                  <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-neutral-400" />
                    {currentUser.firmName}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Authenticated session active. You have full authorized access to inventory, pricing updates, and order dispatches.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs text-center transition-all ${activeTheme.primaryBtn}`}
              >
                Continue to Store
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setSuccessMessage('Logged out successfully.');
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="p-6 space-y-5">
            {/* Role switch tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-2xl">
              <button
                id="login-staff-tab-btn"
                type="button"
                onClick={() => handleTabSwitch('staff')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  roleTab === 'staff'
                    ? activeTheme.tabActive
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Store Staff & Admin</span>
              </button>

              <button
                id="login-customer-tab-btn"
                type="button"
                onClick={() => handleTabSwitch('customer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  roleTab === 'customer'
                    ? activeTheme.tabActive
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Contractor & Client</span>
              </button>
            </div>

            {/* Error or Success notification banners */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Phone field */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {roleTab === 'staff' ? 'Store Staff ID or Email' : 'Contractor Mobile Number / Email'}
                </label>
                <div className="relative">
                  <input
                    id="login-email-input"
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder={roleTab === 'staff' ? 'admin@burhanihardware.in' : 'e.g. 9843128546'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-white ${activeTheme.inputFocus} outline-none transition-all`}
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-400">
                    {roleTab === 'staff' ? <Briefcase className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {roleTab === 'staff' ? 'Portal Security Password' : 'Password or Account PIN'}
                </label>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-white ${activeTheme.inputFocus} outline-none transition-all pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Staff Counter PIN if staff portal */}
              {roleTab === 'staff' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-neutral-500" />
                      <span>Counter Authorization PIN</span>
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      (Town Hall Hub: 641001)
                    </span>
                  </div>
                  <input
                    id="login-staff-pin-input"
                    type="password"
                    maxLength={6}
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    placeholder="641001"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono tracking-widest text-neutral-900 bg-white ${activeTheme.inputFocus} outline-none transition-all`}
                  />
                </div>
              )}

              {/* Remember Me & Quick fill demo */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-neutral-300"
                  />
                  <span>Keep me signed in</span>
                </label>

                <button
                  type="button"
                  onClick={roleTab === 'staff' ? fillStaffDemo : fillContractorDemo}
                  className={`text-[11px] font-bold ${activeTheme.accentText} hover:underline flex items-center gap-1`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-fill Demo</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTheme.primaryBtn}`}
              >
                <span>{roleTab === 'staff' ? 'Access Inventory & Order Desk' : 'Sign In as Contractor / Client'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Switcher helper */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Quick Test Credentials:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillStaffDemo}
                  className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium"
                >
                  Staff (Admin)
                </button>
                <button
                  type="button"
                  onClick={fillContractorDemo}
                  className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium"
                >
                  Contractor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
