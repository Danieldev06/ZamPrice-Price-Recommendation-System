import { useState, useEffect } from 'react';
import api from '../api/client';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  onSelectProduct?: (id: number) => void;
}

interface Product {
  id: number;
  name: string;
  brand: string | null;
}

interface Plan {
  total: number;
  original: number;
  saving: number;
  stores: string[];
}

export default function Dashboard({ onNavigate, onSelectProduct }: Props) {
  const [searchVal, setSearchVal] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [aiPlan, setAiPlan] = useState<Plan | null>(null);

  // Fetch products and run the AI optimizer for the dashboard widget
  useEffect(() => {
    async function loadDashboard() {
      try {
        const prodRes = await api.get<Product[]>('/products');
        setProducts(prodRes.data.slice(0, 4));

        // Get basket from localStorage or use default
        const saved = localStorage.getItem('zamprice_basket');
        const items = saved ? JSON.parse(saved) : [{ product_id: 1, quantity: 1 }, { product_id: 5, quantity: 2 }];

        if (items.length > 0) {
          const optRes = await api.post('/basket/optimize', {
            items, mode: 'cheapest', convenience_weight: 0, convenience_cost_per_store: 0
          });

          const data = optRes.data;
          const cheapest = data.plans.find((p: any) => p.mode === 'cheapest') || data.plans[0];
          const baseline = data.baseline_single_store ? data.baseline_single_store.total : cheapest.total;

          setAiPlan({
            total: cheapest.total,
            original: baseline,
            saving: baseline - cheapest.total,
            stores: cheapest.stores
          });
        }
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    }
    loadDashboard();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8 space-y-8">
      {/* Welcome row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-[#94A3B8] font-medium mb-1">Today · Lusaka, Zambia</div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F2547] leading-tight" style={{ fontFamily: 'Outfit' }}>
            Welcome back, <span className="text-[#D97706]">Chanda</span> 👋
          </h1>
          <p className="text-[#64748B] mt-1">What are you shopping for today?</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onNavigate('budget')} className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            💰 Budget Mode
          </button>
          <button onClick={() => onNavigate('basket')} className="px-4 py-2.5 rounded-xl bg-[#D97706] text-white text-sm font-bold hover:bg-[#B45309] transition-colors">
            ⚡ Optimise Basket
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

      {/* AI Recommendation Card (Live Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#0F2547] rounded-2xl p-6 text-white relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#D97706]/10 -translate-y-20 translate-x-20 pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-xl">✨</div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-widest">AI Smart Recommendation</div>
                    <div className="font-bold text-base leading-tight" style={{ fontFamily: 'Outfit' }}>Optimised Shopping Plan</div>
                  </div>
                </div>
                <span className="text-xs text-[#4ADE80] bg-[#16A34A]/20 border border-[#16A34A]/30 px-2.5 py-1 rounded-full font-medium">Live</span>
              </div>

              {aiPlan ? (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-[10px] text-[#64748B] mb-1 uppercase tracking-wide">Stores to visit</div>
                      <div className="font-black text-sm leading-tight" style={{ fontFamily: 'Outfit' }}>
                        {aiPlan.stores.join(' + ')}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-[10px] text-[#64748B] mb-1 uppercase tracking-wide">Original Total</div>
                      <div className="font-bold text-2xl text-[#94A3B8] line-through" style={{ fontFamily: 'Outfit' }}>K{aiPlan.original.toFixed(2)}</div>
                    </div>
                    <div className="bg-[#16A34A]/20 border border-[#16A34A]/40 rounded-xl p-4">
                      <div className="text-[10px] text-[#86EFAC] mb-1 uppercase tracking-wide">Optimised Total</div>
                      <div className="font-black text-2xl text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K{aiPlan.total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-1">You save</div>
                      <div className="text-4xl font-black text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K{aiPlan.saving.toFixed(2)}</div>
                      <div className="text-xs text-[#86EFAC] mt-0.5">{((aiPlan.saving / aiPlan.original) * 100).toFixed(1)}% less · Split across {aiPlan.stores.length} stores</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => onNavigate('basket')} className="px-5 py-3 rounded-xl bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition-colors">
                        View Optimised Basket →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-[#94A3B8]">
                  Add items to your basket to see AI optimisations.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Quick Actions</div>
          <button onClick={() => onNavigate('search')} className="flex items-center gap-3.5 p-4 rounded-xl border-2 border-[#BFDBFE] bg-[#EFF6FF] hover:shadow-sm transition-all group">
            <span className="text-2xl">🔍</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1E293B]">Compare Prices</div>
              <div className="text-xs text-[#64748B] truncate">All products live</div>
            </div>
          </button>
          <button onClick={() => onNavigate('history')} className="flex items-center gap-3.5 p-4 rounded-xl border-2 border-[#BBF7D0] bg-[#F0FDF4] hover:shadow-sm transition-all group">
            <span className="text-2xl">📈</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1E293B]">Price History</div>
              <div className="text-xs text-[#64748B] truncate">See recent trends</div>
            </div>
          </button>
          <button onClick={() => onNavigate('alerts')} className="flex items-center gap-3.5 p-4 rounded-xl border-2 border-[#FDE68A] bg-[#FEF9C3] hover:shadow-sm transition-all group">
            <span className="text-2xl">🔔</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#1E293B]">Price Alerts</div>
              <div className="text-xs text-[#64748B] truncate">Manage notifications</div>
            </div>
          </button>
        </div>
      </div>

      {/* Most Compared Today (Live Data) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Most Compared</h2>
          <button onClick={() => onNavigate('search')} className="text-sm font-medium text-[#0F2547] hover:underline">Search all →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => { onSelectProduct?.(product.id); onNavigate('compare'); }}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:shadow-sm hover:border-[#CBD5E1] transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center text-2xl">
                🛒
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>
                  {product.name}
                </div>
                <div className="text-xs text-[#94A3B8]">{product.brand || 'Generic'}</div>
              </div>
              <div className="text-[#0F2547] text-sm font-bold group-hover:translate-x-1 transition-transform">
                Compare →
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}