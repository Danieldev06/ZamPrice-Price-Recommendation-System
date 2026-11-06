import { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, ShoppingBasket, TrendingDown } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  onSelectProduct?: (id: number) => void;
}

interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
}

interface PriceOption {
  supermarket: string;
  effective_price: number;
  unit_price: number;
  canonical_unit: string;
  promotional_price: number | null;
  observed_at: string;
  available: boolean;
}

interface DisplayProduct extends Product {
  prices: PriceOption[];
  bestPrice: number;
  bestStore: string;
  unitPrice: number;
  unitLabel: string;
  saving: number;
  worstPrice: number;
  worstStore: string;
}

export default function SearchPage({ onNavigate, onSelectProduct }: Props) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Lowest Price');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [basketItems, setBasketItems] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await api.get<Product[]>('/products');
        
        const detailedProducts = await Promise.all(
          prodRes.data.map(async (p) => {
            const compRes = await api.get(`/products/${p.id}/comparison`);
            const options = compRes.data.options || [];
            
            if (options.length === 0) return null;

            const sorted = [...options].sort((a, b) => a.effective_price - b.effective_price);
            const best = sorted[0];
            const worst = sorted[sorted.length - 1];

            return {
              ...p,
              prices: sorted,
              bestPrice: best.effective_price,
              bestStore: best.supermarket,
              unitPrice: best.unit_price,
              unitLabel: `/${best.canonical_unit}`,
              worstPrice: worst.effective_price,
              worstStore: worst.supermarket,
              saving: worst.effective_price - best.effective_price,
            } as DisplayProduct;
          })
        );

        setProducts(detailedProducts.filter((p): p is DisplayProduct => p !== null));
      } catch (err) {
        console.error("Failed to load search data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleBasket = (id: number) => {
    setBasketItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];
  const sortOptions = ['Lowest Price', 'Best Value', 'Biggest Saving'];

  const filtered = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'Lowest Price') return a.bestPrice - b.bestPrice;
      if (sortBy === 'Best Value') return a.unitPrice - b.unitPrice;
      if (sortBy === 'Biggest Saving') return b.saving - a.saving;
      return 0;
    });

  if (loading) return <div className="p-12 text-center text-[#64748B]">Loading products...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Compare Prices</h1>
        <p className="text-[#64748B] text-sm">Find the best prices across all supermarkets</p>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[#64748B]"><span className="font-semibold text-[#1E293B]">{filtered.length}</span> products found</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Sort:</span>
          <div className="flex gap-1">
            {sortOptions.map(opt => (
              <button key={opt} onClick={() => setSortBy(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hidden md:block ${sortBy === opt ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => {
          const best = product.prices[0];
          const inBasket = basketItems.includes(product.id);

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group">
              <div className="h-44 overflow-hidden relative bg-[#F8FAFC] flex items-center justify-center">
                <ShoppingBasket className="text-[#CBD5E1]" size={64} strokeWidth={1} />
                {best.promotional_price && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-xs font-bold">
                    Promo
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{product.name}</div>
                  <div className="text-xs text-[#64748B]">{product.brand || 'Generic'} · {product.category || 'General'}</div>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit', fontVariantNumeric: 'tabular-nums' }}>
                      K{product.bestPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-[#64748B]">
                      <span className="font-semibold text-[#16A34A]">K{product.unitPrice.toFixed(2)}{product.unitLabel}</span>
                      {' · '}{product.bestStore}
                    </div>
                  </div>
                </div>

                {product.saving > 0 && (
                  <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl bg-[#DCFCE7]">
                    <TrendingDown className="text-[#16A34A]" size={16} />
                    <span className="text-xs font-semibold text-[#16A34A]">K{product.saving.toFixed(2)} cheaper than {product.worstStore}</span>
                  </div>
                )}

                <div className="space-y-1.5 mb-4">
                  {product.prices.slice(0, 3).map((p, i) => (
                    <div key={p.supermarket} className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs ${i === 0 ? 'bg-[#DCFCE7]' : 'bg-[#F8FAFC]'}`}>
                      <span className={`font-medium ${i === 0 ? 'text-[#16A34A]' : 'text-[#64748B]'}`}>{p.supermarket}</span>
                      <span className={`font-bold ${i === 0 ? 'text-[#16A34A]' : 'text-[#1E293B]'}`}>K{p.effective_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

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
    </div>
  );
}