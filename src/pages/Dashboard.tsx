import { useState } from 'react';
import { DEALS, PRODUCTS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const RECENT_CHANGES = [
  { product: '5kg Mealie Meal', store: 'Shoprite', from: 195, to: 185, type: 'drop' },
  { product: '5L Cooking Oil', store: 'Choppies', from: 185, to: 159, type: 'drop' },
  { product: '2L Cooking Oil', store: 'Shoprite', from: 68, to: 75, type: 'rise' },
  { product: 'Eggs 18pcs', store: 'Pick n Pay', from: 42, to: 40, type: 'drop' },
];

const QUICK_ACTIONS = [
  { icon: '📊', label: 'Compare Prices', desc: '1,000+ products live', page: 'search' as Page, colorClass: 'bg-[#EFF6FF] border-[#BFDBFE]' },
  { icon: '📉', label: 'Price History', desc: 'See 30-day trends', page: 'history' as Page, colorClass: 'bg-[#F0FDF4] border-[#BBF7D0]' },
  { icon: '🔔', label: 'Price Alerts', desc: '3 active alerts', page: 'alerts' as Page, colorClass: 'bg-[#FEF9C3] border-[#FDE68A]' },
  { icon: '🔄', label: 'Alternatives', desc: 'Find cheaper options', page: 'substitutions' as Page, colorClass: 'bg-[#FEF3C7] border-[#FCD34D]/30' },
];

export default function Dashboard({ onNavigate }: Props) {
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8 space-y-8">

      {/* Welcome row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-[#94A3B8] font-medium mb-1">Thursday, 4 September 2024 · Lusaka, Zambia</div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F2547] leading-tight" style={{ fontFamily: 'Outfit' }}>
            Welcome back, <span className="text-[#D97706]">Chanda</span> 👋
          </h1>
          <p className="text-[#64748B] mt-1">What are you shopping for today?</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onNavigate('budget')} className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            💡 Budget Mode
          </button>
          <button onClick={() => onNavigate('optimise')} className="px-4 py-2.5 rounded-xl bg-[#D97706] text-white text-sm font-bold hover:bg-[#B45309] transition-colors">
            🏆 Optimise Basket
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">🔍</span>
          <input
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search products across all supermarkets — mealie meal, cooking oil, sugar…"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#E2E8F0] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] shadow-sm transition-all"
          />
        </div>
        <button type="submit" className="px-6 py-4 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors shadow-sm">
          Search
        </button>
      </form>

      {/* Price changes ticker */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] px-5 py-3.5 flex items-center gap-4 overflow-hidden shadow-sm">
        <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest whitespace-nowrap flex-shrink-0">
          Price Changes Today
        </div>
        <div className="flex gap-6 overflow-x-auto pb-0.5">
          {RECENT_CHANGES.map((c, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-lg ${c.type === 'drop' ? '' : ''}`}>{c.type === 'drop' ? '📉' : '📈'}</span>
              <div className="text-xs">
                <span className="font-semibold text-[#1E293B]">{c.product}</span>
                <span className="text-[#94A3B8] mx-1">@</span>
                <span className="text-[#64748B]">{c.store}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#94A3B8] line-through">K{c.from}</span>
                <span className={`text-xs font-bold ${c.type === 'drop' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>K{c.to}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${c.type === 'drop' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                  {c.type === 'drop' ? '▼' : '▲'}K{Math.abs(c.to - c.from)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Basket', value: '12 items', sub: 'Updated today', icon: '🛒', bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', accent: '#1D4ED8', onClick: 'basket' as Page },
          { label: 'Estimated Cost', value: 'K438', sub: 'Best optimised price', icon: '💳', bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', accent: '#16A34A', onClick: 'basket' as Page },
          { label: 'Potential Savings', value: 'K63', sub: 'vs. single-store', icon: '💰', bg: 'bg-[#FEF9C3]', border: 'border-[#FDE68A]', accent: '#CA8A04', onClick: 'optimise' as Page },
          { label: 'Best Store', value: 'Shoprite', sub: 'For your basket', icon: '🏆', bg: 'bg-[#FDF4FF]', border: 'border-[#E9D5FF]', accent: '#7C3AED', onClick: 'supermarkets' as Page },
        ].map(card => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.onClick)}
            className={`p-5 rounded-2xl text-left hover:shadow-md transition-all border-2 group ${card.bg} ${card.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-[#94A3B8] text-xs group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-2xl font-black" style={{ fontFamily: 'Outfit', color: card.accent }}>{card.value}</div>
            <div className="text-xs font-semibold text-[#475569] mt-1">{card.label}</div>
            <div className="text-xs text-[#94A3B8] mt-0.5">{card.sub}</div>
          </button>
        ))}
      </div>

      {/* Main Grid: Recommendation + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Recommendation — 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-[#0F2547] rounded-2xl p-6 text-white relative overflow-hidden h-full">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#D97706]/10 -translate-y-20 translate-x-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#16A34A]/10 translate-y-14 -translate-x-12 pointer-events-none" />
            <div className="absolute top-1/2 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-xl">🏆</div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-widest">AI Smart Recommendation</div>
                    <div className="font-bold text-base leading-tight" style={{ fontFamily: 'Outfit' }}>Recommended Shopping Plan</div>
                  </div>
                </div>
                <span className="text-xs text-[#4ADE80] bg-[#16A34A]/20 border border-[#16A34A]/30 px-2.5 py-1 rounded-full font-medium">Live</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-[10px] text-[#64748B] mb-1 uppercase tracking-wide">Stores to visit</div>
                  <div className="font-black text-lg" style={{ fontFamily: 'Outfit' }}>Shoprite<br /><span className="text-[#D97706]">+ Choppies</span></div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-[10px] text-[#64748B] mb-1 uppercase tracking-wide">Original Total</div>
                  <div className="font-bold text-2xl text-[#94A3B8] line-through" style={{ fontFamily: 'Outfit' }}>K501</div>
                </div>
                <div className="bg-[#16A34A]/20 border border-[#16A34A]/40 rounded-xl p-4">
                  <div className="text-[10px] text-[#86EFAC] mb-1 uppercase tracking-wide">Optimised Total</div>
                  <div className="font-black text-2xl text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K438</div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-1">You save</div>
                  <div className="text-4xl font-black text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K63</div>
                  <div className="text-xs text-[#86EFAC] mt-0.5">12.6% less · Split across 2 stores</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onNavigate('optimise')}
                    className="px-5 py-3 rounded-xl bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition-colors"
                  >
                    View Optimised Basket →
                  </button>
                  <button
                    onClick={() => onNavigate('location')}
                    className="px-5 py-2.5 rounded-xl border border-white/20 text-white/80 text-xs font-medium hover:bg-white/10 transition-colors text-center"
                  >
                    📍 Find Nearest Stores
                  </button>
                </div>
              </div>

              {/* Why? explainability row */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="text-[10px] text-[#64748B] uppercase tracking-widest mb-2">Why this plan?</div>
                <div className="flex flex-wrap gap-2">
                  {['Lowest total cost', 'Shoprite best on staples', 'Choppies cheapest oil', '2 stores = save 12.6%'].map(r => (
                    <span key={r} className="text-xs bg-white/10 text-[#CBD5E1] px-2.5 py-1 rounded-full">✓ {r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Quick Actions</div>
          {QUICK_ACTIONS.map(a => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border-2 text-left hover:shadow-sm transition-all group ${a.colorClass}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{a.label}</div>
                <div className="text-xs text-[#64748B] truncate">{a.desc}</div>
              </div>
              <span className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate('substitutions')}
            className="flex items-center gap-3.5 p-4 rounded-xl border-2 border-[#E2E8F0] bg-white text-left hover:shadow-sm hover:border-[#CBD5E1] transition-all group"
          >
            <span className="text-2xl">💡</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>Smart Budget</div>
              <div className="text-xs text-[#64748B]">Stay within K500</div>
            </div>
            <span className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
          </button>
        </div>
      </div>

      {/* Today's Top Deals */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Today's Best Deals 🔥</h2>
          <button onClick={() => onNavigate('deals')} className="text-sm font-medium text-[#0F2547] hover:underline">View all →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEALS.slice(0, 3).map(deal => (
            <button
              key={deal.id}
              onClick={() => onNavigate('deals')}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden text-left hover:shadow-md transition-all group"
            >
              <div className="h-36 overflow-hidden relative bg-[#F1F5F9]">
                <img
                  src={deal.image}
                  alt={deal.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-xs font-bold">
                  {deal.discount}% OFF
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-xs font-medium">
                  {deal.store}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px]">
                  {deal.expires}
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-[#1E293B] mb-1.5" style={{ fontFamily: 'Outfit' }}>{deal.productName}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{deal.now}</span>
                  <span className="text-sm text-[#94A3B8] line-through">K{deal.was}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#64748B]">Save</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">K{deal.was - deal.now}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Most Compared + Substitutions CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Compared */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Most Compared Today</h2>
            <button onClick={() => onNavigate('search')} className="text-sm font-medium text-[#0F2547] hover:underline">Search all →</button>
          </div>
          <div className="space-y-3">
            {PRODUCTS.slice(0, 4).map(product => {
              const bestPrice = Math.min(...product.prices.map(p => p.price));
              const worstPrice = Math.max(...product.prices.map(p => p.price));
              const saving = worstPrice - bestPrice;
              const bestStore = STORES.find(s => s.id === product.prices.find(p => p.price === bestPrice)?.storeId);
              return (
                <button
                  key={product.id}
                  onClick={() => onNavigate('compare')}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:shadow-sm hover:border-[#CBD5E1] transition-all text-left group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>
                      {product.quantity} {product.name}
                    </div>
                    <div className="text-xs text-[#94A3B8]">{product.brand}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#D97706]">{bestStore?.name}</span>
                      <span className="text-[#CBD5E1] text-xs">·</span>
                      <span className="text-xs font-bold text-[#0F2547]">K{bestPrice}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                    {saving > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">
                        Save K{saving}
                      </span>
                    )}
                    <span className="text-[10px] text-[#94A3B8]">vs. other stores</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Substitutions CTA */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onNavigate('substitutions')}
            className="bg-gradient-to-br from-[#0F2547] to-[#1A3A6B] rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all group flex-1"
          >
            <div className="text-3xl mb-3">🔄</div>
            <div className="font-black text-lg mb-2" style={{ fontFamily: 'Outfit' }}>
              Find Cheaper<br />Alternatives
            </div>
            <div className="text-sm text-[#94A3B8] mb-4 leading-relaxed">
              Discover products that do the same job for less — matched by category and size.
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97706] text-white text-sm font-bold group-hover:bg-[#B45309] transition-colors">
              Explore Alternatives →
            </div>
          </button>

          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5">
            <div className="text-sm font-bold text-[#166534] mb-2">💰 This week's savings</div>
            <div className="text-3xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K247</div>
            <div className="text-xs text-[#15803D] mt-0.5">saved by ZamPrice users in Lusaka</div>
          </div>
        </div>
      </div>

      {/* Admin shortcut — small tasteful banner */}
      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 flex items-center justify-center text-sm">⚙️</div>
          <div>
            <div className="text-xs font-semibold text-[#475569]">Administrator Access</div>
            <div className="text-xs text-[#94A3B8]">Manage products, prices, and promotions</div>
          </div>
        </div>
        <button onClick={() => onNavigate('admin')} className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-white transition-colors">
          Open Admin →
        </button>
      </div>
    </div>
  );
}
