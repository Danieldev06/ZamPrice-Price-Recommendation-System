import { useState } from 'react';
import { PRODUCTS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  onSelectProduct?: (id: string) => void;
}

const SORT_OPTIONS = ['Lowest Price', 'Best Value', 'Biggest Saving', 'Most Popular'];
const CATEGORIES = ['All', 'Mealie Meal', 'Cooking Oil', 'Sugar', 'Rice', 'Bread', 'Eggs'];

export default function SearchPage({ onNavigate, onSelectProduct }: Props) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Lowest Price');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [basketItems, setBasketItems] = useState<string[]>([]);

  const filtered = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBasket = (id: string) => {
    setBasketItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Compare Prices</h1>
        <p className="text-[#64748B] text-sm">Find the best prices across all supermarkets</p>
      </div>

      {/* Search + Filter Row */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] bg-white"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">✕</button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters ? 'bg-[#0F2547] text-white border-[#0F2547]' : 'bg-white border-[#E2E8F0] text-[#475569]'}`}>
          ⚙ Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Supermarket</label>
              <div className="flex flex-wrap gap-2">
                {['All', ...STORES.map(s => s.name)].map(s => (
                  <button key={s} onClick={() => setSelectedStore(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStore === s ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Price Range</label>
              <div className="flex items-center gap-3">
                <input type="number" placeholder="Min K" className="flex-1 px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2547]" />
                <span className="text-[#94A3B8]">—</span>
                <input type="number" placeholder="Max K" className="flex-1 px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2547]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Availability</label>
              <div className="flex flex-col gap-2">
                {['In Stock Only', 'Include Limited', 'All'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
                    <input type="radio" name="avail" className="accent-[#0F2547]" defaultChecked={opt === 'In Stock Only'} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Sort + Results Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[#64748B]"><span className="font-semibold text-[#1E293B]">{filtered.length}</span> products found</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Sort:</span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setSortBy(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hidden md:block ${sortBy === opt ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}>
                {opt}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="md:hidden text-xs border border-[#E2E8F0] rounded-lg px-2 py-1.5 bg-white">
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => {
          const prices = product.prices.sort((a, b) => a.price - b.price);
          const best = prices[0];
          const worst = prices[prices.length - 1];
          const saving = worst.price - best.price;
          const bestStore = STORES.find(s => s.id === best.storeId);
          const inBasket = basketItems.includes(product.id);

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group">
              {/* Product Image */}
              <div className="h-44 overflow-hidden relative bg-[#F8FAFC]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {best.promotion && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-xs font-bold">
                    {best.promotion}
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <FreshnessTag freshness={best.freshness} updatedAgo={best.updatedAgo} />
                </div>
              </div>

              <div className="p-4">
                {/* Product Info */}
                <div className="mb-3">
                  <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{product.quantity} {product.name}</div>
                  <div className="text-xs text-[#64748B]">{product.brand} · {product.category}</div>
                </div>

                {/* Best Price */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit', fontVariantNumeric: 'tabular-nums' }}>
                      K{best.price}
                    </div>
                    <div className="text-xs text-[#64748B]">
                      <span className="font-semibold text-[#16A34A]">K{best.unitPrice.toFixed(0)}{best.unitLabel}</span>
                      {' · '}{bestStore?.name}
                    </div>
                  </div>
                  <StockBadge stock={best.stock} />
                </div>

                {/* Saving Badge */}
                {saving > 0 && (
                  <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl bg-[#DCFCE7]">
                    <span className="text-sm">💰</span>
                    <span className="text-xs font-semibold text-[#16A34A]">K{saving} cheaper than {STORES.find(s => s.id === worst.storeId)?.name}</span>
                  </div>
                )}

                {/* Price Mini List */}
                <div className="space-y-1.5 mb-4">
                  {prices.slice(0, 3).map((p, i) => {
                    const store = STORES.find(s => s.id === p.storeId);
                    return (
                      <div key={p.storeId} className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs ${i === 0 ? 'bg-[#DCFCE7]' : 'bg-[#F8FAFC]'}`}>
                        <span className={`font-medium ${i === 0 ? 'text-[#16A34A]' : 'text-[#64748B]'}`}>{store?.name}</span>
                        <span className={`font-bold ${i === 0 ? 'text-[#16A34A]' : 'text-[#1E293B]'}`}>K{p.price}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => { onSelectProduct?.(product.id); onNavigate('compare'); }}
                    className="flex-1 py-2.5 rounded-xl bg-[#0F2547] text-white text-xs font-semibold hover:bg-[#1A3A6B] transition-colors">
                    Compare →
                  </button>
                  <button onClick={() => toggleBasket(product.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${inBasket ? 'bg-[#16A34A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                    {inBasket ? '✓ Added' : '+ Basket'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>No results found</h3>
          <p className="text-[#64748B] text-sm max-w-md mx-auto">We couldn't find "{search}". Try searching using the product name or category.</p>
          <button onClick={() => setSearch('')} className="mt-4 px-6 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Clear search</button>
        </div>
      )}
    </div>
  );
}

function StockBadge({ stock }: { stock: string }) {
  const config = {
    in_stock: { label: 'In Stock', color: 'bg-[#DCFCE7] text-[#16A34A]', dot: 'bg-[#16A34A]' },
    limited: { label: 'Limited', color: 'bg-[#FEF3C7] text-[#D97706]', dot: 'bg-[#D97706]' },
    out_of_stock: { label: 'Out of Stock', color: 'bg-[#FEE2E2] text-[#DC2626]', dot: 'bg-[#DC2626]' },
  }[stock] ?? { label: stock, color: 'bg-[#F1F5F9] text-[#64748B]', dot: 'bg-[#94A3B8]' };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

function FreshnessTag({ freshness, updatedAgo }: { freshness: string; updatedAgo: string }) {
  const config = {
    fresh: { dot: 'bg-[#16A34A]', label: updatedAgo },
    recent: { dot: 'bg-[#D97706]', label: updatedAgo },
    stale: { dot: 'bg-[#DC2626]', label: updatedAgo },
  }[freshness] ?? { dot: 'bg-[#94A3B8]', label: updatedAgo };

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs">
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
