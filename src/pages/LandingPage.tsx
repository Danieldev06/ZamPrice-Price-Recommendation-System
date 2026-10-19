import { useState } from 'react';
import { CATEGORIES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const STATS = [
  { value: '4+', label: 'Supermarkets', icon: '🏪' },
  { value: '1,000+', label: 'Products tracked', icon: '📦' },
  { value: 'Live', label: 'Price updates', icon: '⚡' },
  { value: 'AI', label: 'Smart savings', icon: '🧠' },
];

const HOW_STEPS = [
  { n: '01', icon: '🔍', title: 'Search Products', desc: 'Type any product and see it across all stores instantly' },
  { n: '02', icon: '📊', title: 'Compare Prices', desc: 'Side-by-side prices, unit costs, and stock status' },
  { n: '03', icon: '🛒', title: 'Build Your Basket', desc: 'Add items from any store into one smart basket' },
  { n: '04', icon: '🏆', title: 'Get Your Plan', desc: 'AI calculates the cheapest and most convenient route' },
  { n: '05', icon: '💰', title: 'Save Money', desc: 'Shop smarter and keep more kwacha in your pocket' },
];

const STORE_BRANDS = [
  { name: 'Shoprite', accent: '#E31837', bg: '#FEF2F2', products: '934+' },
  { name: 'Choppies', accent: '#0066CC', bg: '#EFF6FF', products: '876+' },
  { name: 'Pick n Pay', accent: '#009F44', bg: '#F0FDF4', products: '812+' },
  { name: 'Spar', accent: '#007A33', bg: '#F0FDF4', products: '654+' },
];

const TESTIMONIALS = [
  { name: 'Mutale C.', area: 'Kabulonga, Lusaka', text: 'I saved K120 on my monthly groceries just by splitting between Shoprite and Choppies. ZamPrice told me exactly what to buy where.', savings: 'K120 saved' },
  { name: 'Grace N.', area: 'Woodlands, Lusaka', text: 'The price alerts are amazing. I got notified when cooking oil dropped and bought three bottles. Never going back to guessing prices.', savings: 'K45 saved' },
  { name: 'Joseph M.', area: 'Chelstone, Lusaka', text: 'As a student on a tight budget, ZamPrice helps me stretch every kwacha. The budget mode is exactly what I needed.', savings: 'K89 saved' },
];

export default function LandingPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ───── Header ───── */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0F2547] flex items-center justify-center shadow-sm">
            <span className="text-[#D97706] font-black text-lg" style={{ fontFamily: 'Outfit' }}>Z</span>
          </div>
          <span className="text-[#0F2547] font-black text-xl" style={{ fontFamily: 'Outfit' }}>ZamPrice</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-sm text-[#64748B] hover:text-[#0F2547] transition-colors font-medium">How it works</a>
          <a href="#stores" className="text-sm text-[#64748B] hover:text-[#0F2547] transition-colors font-medium">Supermarkets</a>
          <a href="#why" className="text-sm text-[#64748B] hover:text-[#0F2547] transition-colors font-medium">Why ZamPrice</a>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors shadow-sm"
          >
            Sign In
          </button>
        </nav>

        <button
          onClick={() => onNavigate('dashboard')}
          className="md:hidden px-4 py-2 rounded-xl bg-[#0F2547] text-white text-sm font-bold"
        >
          Sign In
        </button>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative bg-[#0F2547] overflow-hidden">
        {/* Background imagery */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1400&h=800&fit=crop&auto=format"
            alt="Zambian market"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2547] via-[#0F2547]/90 to-[#0F2547]/60" />
        </div>

        {/* Decorative radial glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#D97706]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#16A34A]/8 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D97706]/20 border border-[#D97706]/30 mb-7 text-[#FDE68A] text-xs font-semibold">
              🇿🇲 Zambia's #1 Price Comparison App
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.08] mb-5" style={{ fontFamily: 'Outfit' }}>
              Shop Smarter.<br />
              <span className="text-[#D97706]">Save More.</span>
            </h1>
            <p className="text-lg text-[#94A3B8] mb-8 leading-relaxed max-w-lg">
              Compare supermarket prices across Zambia and discover where your entire shopping basket costs less — at Shoprite, Choppies, Pick n Pay and more.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-7 max-w-xl">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] text-lg">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search mealie meal, cooking oil, sugar…"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-[#1E293B] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm transition-colors shadow-lg whitespace-nowrap"
              >
                Compare
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-3.5 rounded-xl bg-white text-[#0F2547] font-bold text-sm hover:bg-[#F1F5F9] transition-colors shadow-md"
              >
                🚀 Start Shopping
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="px-8 py-3.5 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                📊 Compare Prices
              </button>
            </div>
          </div>

          {/* Right — floating product cards */}
          <div className="hidden md:flex flex-col gap-3 max-w-sm ml-auto">
            {[
              { product: '5kg Mealie Meal', store: 'Shoprite', price: 185, was: 205, saving: 20, best: true },
              { product: '5L Cooking Oil', store: 'Choppies', price: 159, was: 185, saving: 26, best: true },
              { product: '2kg White Sugar', store: 'Shoprite', price: 48, was: 52, saving: 4, best: false },
            ].map(c => (
              <div
                key={c.product}
                className={`bg-white/10 backdrop-blur-sm border rounded-2xl p-4 flex items-center gap-4 transition-all ${c.best ? 'border-[#16A34A]/40' : 'border-white/10'}`}
              >
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>{c.product}</div>
                  <div className="text-[#94A3B8] text-xs">{c.store}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-black" style={{ fontFamily: 'Outfit' }}>K{c.price}</div>
                  <div className="text-[#94A3B8] text-xs line-through">K{c.was}</div>
                </div>
                {c.best && (
                  <div className="px-2 py-1 rounded-lg bg-[#16A34A] text-white text-xs font-bold flex-shrink-0">
                    Best ✓
                  </div>
                )}
              </div>
            ))}
            <div className="text-center text-xs text-[#64748B] mt-1">Sample prices · Updated daily</div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-[#081730]/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className="text-xl font-black text-[#D97706]" style={{ fontFamily: 'Outfit' }}>{s.value}</div>
                  <div className="text-xs text-[#64748B]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Popular Categories ───── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Popular Categories</h2>
            <p className="text-sm text-[#64748B] mt-0.5">Browse by category to find the best prices fast</p>
          </div>
          <button onClick={() => onNavigate('search')} className="text-sm text-[#0F2547] font-semibold hover:underline">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('search')}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:shadow-sm transition-all group border border-transparent hover:border-[#BFDBFE]"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[10px] text-[#475569] font-medium text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ───── How it Works ───── */}
      <section id="how" className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-[#EFF6FF] text-[#0F2547] text-xs font-bold uppercase tracking-widest mb-3">How It Works</div>
            <h2 className="text-4xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Five steps to smarter shopping</h2>
            <p className="text-[#64748B] mt-3 max-w-lg mx-auto">ZamPrice does the hard work so you can shop confidently and save more every week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                {i < 4 && (
                  <div className="hidden md:block absolute right-0 top-7 w-1/2 border-t-2 border-dashed border-[#CBD5E1] z-0" />
                )}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0F2547] flex items-center justify-center text-2xl mb-3 shadow-lg">
                  {s.icon}
                </div>
                <div className="text-xs font-black text-[#D97706] mb-1 tracking-widest">{s.n}</div>
                <div className="font-bold text-[#0F2547] mb-1 text-sm" style={{ fontFamily: 'Outfit' }}>{s.title}</div>
                <div className="text-xs text-[#64748B] leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-4 rounded-2xl bg-[#0F2547] text-white font-bold text-base hover:bg-[#1A3A6B] transition-colors shadow-md"
            >
              Start Comparing Free →
            </button>
          </div>
        </div>
      </section>

      {/* ───── Supermarkets ───── */}
      <section id="stores" className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] text-xs font-bold uppercase tracking-widest mb-3">Supported Stores</div>
          <h2 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>All your favourite supermarkets</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STORE_BRANDS.map(store => (
            <button
              key={store.name}
              onClick={() => onNavigate('supermarkets')}
              className="p-6 rounded-2xl text-left border border-[#E2E8F0] hover:shadow-md transition-all group"
              style={{ backgroundColor: store.bg }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-sm group-hover:scale-105 transition-transform"
                style={{ backgroundColor: store.accent }}
              >
                {store.name[0]}
              </div>
              <div className="font-black text-[#1E293B] text-lg mb-0.5" style={{ fontFamily: 'Outfit' }}>{store.name}</div>
              <div className="text-xs font-semibold mt-1" style={{ color: store.accent }}>{store.products} products</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">📍 Lusaka & nationwide</div>
            </button>
          ))}
        </div>
      </section>

      {/* ───── Why ZamPrice (features) ───── */}
      <section id="why" className="bg-[#0F2547] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D97706]/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#16A34A]/8 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#D97706] text-xs font-bold uppercase tracking-widest mb-3">Why ZamPrice</div>
            <h2 className="text-4xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Everything you need to shop smarter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '📊', title: 'Cross-Store Comparison', desc: 'Compare prices for any product across Shoprite, Choppies, Pick n Pay, Spar and more — all in one place.' },
              { icon: '⚖️', title: 'Unit-Price Analysis', desc: 'Find true value with price-per-kg, per-litre analysis. The cheapest pack isn\'t always the best deal.' },
              { icon: '🏆', title: 'Basket Optimisation', desc: 'AI calculates the cheapest way to buy your whole shopping list, splitting intelligently across stores.' },
              { icon: '📉', title: 'Price History & Alerts', desc: 'Track prices over 30 days, spot trends, and get notified the moment a price hits your target.' },
              { icon: '🔄', title: 'Cheaper Alternatives', desc: 'Discover substitute products that fulfil the same need for less — matched by category, size and type.' },
              { icon: '💡', title: 'Explainable AI', desc: 'Every recommendation comes with a plain-language "Why?" so you always understand the reasoning.' },
            ].map(f => (
              <div key={f.title} className="bg-white/8 border border-white/10 rounded-2xl p-6 hover:bg-white/12 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>{f.title}</div>
                <div className="text-sm text-[#94A3B8] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold uppercase tracking-widest mb-3">Shopper Stories</div>
          <h2 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Saving money across Lusaka</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-sm transition-all">
              <div className="flex items-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#D97706] text-sm">★</span>)}
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1E293B]">{t.name}</div>
                  <div className="text-xs text-[#94A3B8]">{t.area}</div>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-[#DCFCE7] text-[#16A34A] text-xs font-black">{t.savings}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-[#D97706] py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Outfit' }}>
            Ready to start saving?
          </h2>
          <p className="text-[#FEF3C7] mb-8 text-lg">Join thousands of Zambian shoppers saving money every week.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-4 rounded-2xl bg-white text-[#D97706] font-black text-lg hover:bg-[#FEF9C3] transition-colors shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="px-10 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Prices
            </button>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="bg-[#081730] py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#D97706] flex items-center justify-center text-white font-black">Z</div>
                <span className="text-white font-black text-lg" style={{ fontFamily: 'Outfit' }}>ZamPrice</span>
              </div>
              <p className="text-[#475569] text-xs max-w-xs leading-relaxed">Shop Smarter. Save More. Zambia's smart supermarket price comparison platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <div className="text-[#64748B] font-semibold mb-3 text-xs uppercase tracking-wide">Features</div>
                {['Price Comparison', 'Basket Optimisation', 'Price Alerts', 'Price History', 'Alternatives'].map(l => (
                  <button key={l} onClick={() => onNavigate('dashboard')} className="block text-[#475569] hover:text-white transition-colors mb-1.5 text-left">{l}</button>
                ))}
              </div>
              <div>
                <div className="text-[#64748B] font-semibold mb-3 text-xs uppercase tracking-wide">Stores</div>
                {STORE_BRANDS.map(s => (
                  <button key={s.name} onClick={() => onNavigate('supermarkets')} className="block text-[#475569] hover:text-white transition-colors mb-1.5 text-left">{s.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[#0F2547] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[#475569] text-xs">© 2024 ZamPrice · Prices shown are sample/demo data. Always verify at store.</p>
            <p className="text-[#475569] text-xs">Built for Zambia 🇿🇲</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
