import { useState, useEffect } from 'react';
import api from '../api/client';
import { Flame, Search, ShoppingBasket, TrendingDown } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

interface Deal {
  id: number;
  productName: string;
  category: string;
  store: string;
  was: number;
  now: number;
  discount: number;
}

export default function DealsPage({ onNavigate }: Props) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'discount' | 'saving'>('discount');
  const [loading, setLoading] = useState(true);

  // Fetch real data and synthesize deals
  useEffect(() => {
    async function loadDeals() {
      try {
        const prodRes = await api.get('/products');
        const dynamicDeals: Deal[] = [];

        // Loop through products to find the biggest price spreads
        for (const p of prodRes.data) {
          const compRes = await api.get(`/products/${p.id}/comparison`);
          const options = compRes.data.options || [];
          
          if (options.length > 1) {
            const sorted = [...options].sort((a, b) => a.effective_price - b.effective_price);
            const best = sorted[0];
            const worst = sorted[sorted.length - 1];
            const saving = worst.effective_price - best.effective_price;

            // If there's a difference of more than K1, it's a deal!
            if (saving > 1) {
              const discount = Math.round((saving / worst.effective_price) * 100);
              dynamicDeals.push({
                id: p.id,
                productName: p.name,
                category: p.category || 'General',
                store: best.supermarket,
                was: worst.effective_price,
                now: best.effective_price,
                discount: discount > 0 ? discount : 1
              });
            }
          }
        }

        // Sort so the best deals are first
        dynamicDeals.sort((a, b) => b.discount - a.discount);
        setDeals(dynamicDeals);
      } catch (err) {
        console.error("Failed to load deals", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  // Generate filter categories dynamically from the deals
  const categories = ['All', ...Array.from(new Set(deals.map(d => d.category)))];

  const filtered = deals
    .filter(d => filter === 'All' || d.category === filter)
    .sort((a, b) => sortBy === 'discount' ? b.discount - a.discount : (b.was - b.now) - (a.was - a.now));

  const featuredDeal = deals[0];

  if (loading) return <div className="p-12 text-center text-[#64748B]">Scanning for the best deals...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547] flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
          Today's Best Deals <Flame className="text-[#DC2626]" size={24} />
        </h1>
        <p className="text-sm text-[#64748B]">Live promotions and price drops across all supermarkets</p>
      </div>

      {/* Top Savings Banner (Featured Deal) */}
      {featuredDeal && (
        <div className="bg-[#0F2547] rounded-2xl p-5 mb-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-48 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=200&fit=crop&auto=format"
              alt="Deals"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0F2547]" />
          </div>
          <div className="relative">
            <div className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-2">Featured Deal</div>
            <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Outfit' }}>{featuredDeal.productName}</div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-black text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K{featuredDeal.now.toFixed(2)}</span>
              <span className="text-xl text-[#94A3B8] line-through">K{featuredDeal.was.toFixed(2)}</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-sm font-bold">{featuredDeal.discount}% OFF</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#94A3B8]">At <span className="text-white font-medium">{featuredDeal.store}</span> · Live Price</span>
              <button onClick={() => onNavigate('compare')} className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-sm font-bold hover:bg-[#B45309] transition-colors">View Deal</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${filter === f ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSortBy('discount')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${sortBy === 'discount' ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569]'}`}>
            % Discount
          </button>
          <button onClick={() => setSortBy('saving')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${sortBy === 'saving' ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569]'}`}>
            K Saved
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0] mb-8">
          <Search size={64} className="text-[#CBD5E1] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>No deals found</h3>
          <p className="text-[#64748B] text-sm">Try changing your category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filtered.map(deal => (
            <div key={deal.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group cursor-pointer">
              <div className="h-44 overflow-hidden relative bg-[#F1F5F9] flex items-center justify-center">
                <ShoppingBasket size={64} className="text-[#CBD5E1]" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-sm font-black">
                  {deal.discount}% OFF
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  {deal.store}
                </div>
              </div>
              <div className="p-4">
                <div className="font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>{deal.productName}</div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{deal.now.toFixed(2)}</span>
                  <span className="text-base text-[#94A3B8] line-through">K{deal.was.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#DCFCE7]">
                    <TrendingDown size={16} className="text-[#16A34A]" />
                    <span className="text-xs font-bold text-[#16A34A]">Save K{(deal.was - deal.now).toFixed(2)}</span>
                  </div>
                  <button onClick={() => onNavigate('compare')} className="px-4 py-2 rounded-xl bg-[#0F2547] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Biggest Savings Table */}
      {deals.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Biggest Savings Today</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {['Product', 'Best Store', 'High Price', 'Best Price', 'You Save', 'Discount'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...deals].sort((a, b) => (b.was - b.now) - (a.was - a.now)).map((deal) => (
                  <tr key={deal.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1E293B]">{deal.productName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#64748B]">{deal.store}</td>
                    <td className="px-5 py-3.5 text-sm text-[#94A3B8] line-through">K{deal.was.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-[#16A34A]">K{deal.now.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">K{(deal.was - deal.now).toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-xs font-bold">{deal.discount}% OFF</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}