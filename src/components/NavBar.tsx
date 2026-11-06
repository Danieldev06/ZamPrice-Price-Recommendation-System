import { useState } from 'react';
import { NOTIFICATIONS } from '../data/sampleData';
import { useAuth } from '../context/AuthContext';
// Import the professional icons
import { 
  Bell, 
  ArrowLeft, 
  Home, 
  Search, 
  ShoppingBasket, 
  Tag, 
  User, 
  LogOut, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

type Page =
  | 'login' | 'landing' | 'dashboard' | 'search' | 'compare' | 'basket'
  | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets'
  | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'search',       label: 'Compare Prices' },
  { id: 'basket',       label: 'My Basket' },
  { id: 'alerts',       label: 'Price Alerts' },
  { id: 'history',      label: 'Price History' },
  { id: 'deals',        label: 'Deals' },
  { id: 'supermarkets', label: 'Supermarkets' },
];

const ALL_NAV: { id: Page; label: string }[] = [
  ...NAV_ITEMS,
  { id: 'substitutions', label: 'Alternatives' },
  { id: 'budget',        label: 'Smart Budget' },
  { id: 'location',      label: 'Find Stores' },
  { id: 'profile',       label: 'Profile' },
  { id: 'admin',         label: 'Admin Dashboard' },
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const { user, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Shopper';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  if (currentPage === 'landing' || currentPage === 'login') return null;

  if (currentPage === 'admin') {
    return (
      <nav className="flex items-center justify-between px-6 py-3 bg-[#081730] border-b border-[#0F2547] sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-black text-xs">Z</div>
            <span className="text-white font-bold" style={{ fontFamily: 'Outfit' }}>ZamPrice</span>
            <span className="ml-1 px-2 py-0.5 rounded text-xs bg-[#D97706]/20 text-[#D97706] font-semibold flex items-center gap-1">
              <ShieldAlert size={12} /> Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to App
          </button>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition-colors flex items-center gap-1.5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ── Desktop top nav ── */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-[#0F2547] border-b border-[#1A3A6B] sticky top-0 z-50 shadow-sm">
        
        {/* Left side: Back + Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {currentPage !== 'dashboard' && (
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-black text-sm shadow-sm">
              Z
            </div>
            <span className="text-white font-black text-lg" style={{ fontFamily: 'Outfit' }}>ZamPrice</span>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 overflow-x-auto mx-4 flex-1 justify-center">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-[#1A3A6B] text-white'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1A3A6B]/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate('substitutions')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentPage === 'substitutions'
                ? 'bg-[#1A3A6B] text-white'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1A3A6B]/50'
            }`}
          >
            Alternatives
          </button>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-2.5 py-1.5 rounded-lg border border-[#D97706]/30 text-[#D97706] text-xs font-semibold hover:bg-[#D97706]/10 transition-colors flex items-center gap-1"
            >
              <ShieldAlert size={14} /> Admin
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }}
              className="relative w-9 h-9 rounded-lg bg-[#1A3A6B] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {showNotifs && <NotificationsDropdown onClose={() => setShowNotifs(false)} />}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg bg-[#1A3A6B] hover:bg-[#243E72] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#D97706] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm text-white font-medium">{firstName}</span>
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 z-50">
                <button onClick={() => { onNavigate('profile'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2">
                  <User size={16} /> My Profile
                </button>
                <div className="h-px bg-[#E2E8F0] my-1" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile top nav ── */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0F2547] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {currentPage !== 'dashboard' && (
            <button onClick={() => onNavigate('dashboard')} className="text-[#94A3B8]">
              <ArrowLeft size={20} />
            </button>
          )}
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-black text-xs">Z</div>
            <span className="text-white font-bold" style={{ fontFamily: 'Outfit' }}>ZamPrice</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowMenu(false); }}
            className="relative w-8 h-8 rounded-lg bg-[#1A3A6B] flex items-center justify-center text-white"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={() => { setShowMenu(!showMenu); setShowNotifs(false); }}
            className="w-8 h-8 rounded-lg bg-[#1A3A6B] flex items-center justify-center text-white text-lg"
          >
            {showMenu ? '✕' : '☰'}
          </button>
        </div>

        {showNotifs && <NotificationsDropdown onClose={() => setShowNotifs(false)} />}

        {showMenu && (
          <div className="absolute top-full left-0 right-0 bg-[#0F2547] border-t border-[#1A3A6B] p-4 flex flex-col gap-1 shadow-xl z-50">
            {ALL_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setShowMenu(false); }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#1A3A6B] text-white'
                    : item.id === 'admin'
                    ? 'text-[#D97706]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1A3A6B]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-[#1A3A6B] my-1" />
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile bottom nav (Upgraded Icons) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F2547] border-t border-[#1A3A6B] flex safe-area-inset-bottom shadow-2xl">
        {(
          [
            { id: 'dashboard',     label: 'Home',    icon: <Home size={20} /> },
            { id: 'search',        label: 'Compare', icon: <Search size={20} /> },
            { id: 'basket',        label: 'Basket',  icon: <ShoppingBasket size={20} /> },
            { id: 'deals',         label: 'Deals',   icon: <Tag size={20} /> },
            { id: 'profile',       label: 'Profile', icon: <User size={20} /> },
          ] as { id: Page; label: string; icon: React.ReactNode }[]
        ).map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] font-medium transition-colors ${
              currentPage === item.id ? 'text-[#D97706]' : 'text-[#475569] hover:text-[#94A3B8]'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] z-50 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
        <div>
          <span className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Notifications</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold">
            {NOTIFICATIONS.filter(n => !n.read).length} new
          </span>
        </div>
        <button onClick={onClose} className="text-[#94A3B8] hover:text-[#64748B] text-lg leading-none">✕</button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {NOTIFICATIONS.map(n => (
          <div
            key={n.id}
            className={`px-5 py-3.5 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${!n.read ? 'bg-[#EFF6FF]' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5 flex-shrink-0">
                {n.type === 'price_drop' ? '📉' : n.type === 'alert_reached' ? '🎯' : n.type === 'deal' ? '🔥' : n.type === 'in_stock' ? '📦' : '🔔'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1E293B]">{n.title}</div>
                <div className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.message}</div>
                <div className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">{n.time}</div>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-[#0F2547] mt-2 flex-shrink-0" />}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
        <button className="text-xs text-[#0F2547] font-semibold hover:underline">View all notifications →</button>
      </div>
    </div>
  );
}