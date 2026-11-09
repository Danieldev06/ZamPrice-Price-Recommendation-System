import { useState, useEffect } from 'react';
import api from '../api/client';
import { Zap, Star, MapPin, CheckCircle2, Navigation } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const MODES = [
  { id: 'cheapest', icon: <Zap size={24} className="text-[#D97706]" />, label: 'Cheapest', desc: 'Lowest possible total price' },
  { id: 'value', icon: <Star size={24} className="text-[#0F2547]" />, label: 'Best Value', desc: 'Fewest stores possible' },
  { id: 'convenient', icon: <MapPin size={24} className="text-[#16A34A]" />, label: 'Most Convenient', desc: 'Single store trip' },
];

interface BackendStore {
  name: string;
  products: number;
  items: string[];
  total: number;
  color: string;
  savings: string;
}

interface BackendPlan {
  total: number;
  original: number;
  saving: number;
  stores_visited: number;
  stores: BackendStore[];
  rawLines: any[]; // <-- Added to store the raw backend data for saving
}

export default function OptimisePage({ onNavigate }: Props) {
  const [mode, setMode] = useState<'cheapest' | 'value' | 'convenient'>('cheapest');
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Record<string, BackendPlan> | null>(null);
  const [error, setError] = useState("");

  const STORE_COLORS: Record<string, string> = { 'Shoprite': '#E31837', 'Choppies': '#0066CC', 'Pick n Pay': '#008000' };

  useEffect(() => {
    async function fetchOptimisation() {
      const saved = localStorage.getItem('zamprice_basket');
      const items = saved ? JSON.parse(saved) : [{ product_id: 1, quantity: 1 }, { product_id: 5, quantity: 2 }];

      try {
        const res = await api.post('/basket/optimize', {
          items, mode: 'cheapest', convenience_weight: 10, convenience_cost_per_store: 50
        });

        const data = res.data;
        const processedPlans: Record<string, BackendPlan> = {};

        const mapPlan = (backendPlan: any, originalTotal: number): BackendPlan => {
          const storesMap: Record<string, BackendStore> = {};
          
          backendPlan.lines.forEach((line: any) => {
            if (!storesMap[line.supermarket]) {
              storesMap[line.supermarket] = {
                name: line.supermarket, products: 0, items: [], total: 0,
                color: STORE_COLORS[line.supermarket] || '#333', savings: 'Cheapest prices'
              };
            }
            storesMap[line.supermarket].products += 1;
            storesMap[line.supermarket].total += line.line_total;
            storesMap[line.supermarket].items.push(`${line.quantity} × ${line.product_name} — K${line.line_total.toFixed(2)}`);
          });

          const saving = originalTotal - backendPlan.total;
          return { 
            total: backendPlan.total, 
            original: originalTotal, 
            saving: saving, 
            stores_visited: backendPlan.store_count, 
            stores: Object.values(storesMap),
            rawLines: backendPlan.lines // <-- Keep the raw lines here!
          };
        };

        const baselineTotal = data.baseline_single_store ? data.baseline_single_store.total : data.plans[0].total;
        const cheapestPlan = data.plans.find((p: any) => p.mode === 'cheapest') || data.plans[0];
        const valuePlan = data.baseline_single_store || cheapestPlan; 
        const convPlan = data.plans.find((p: any) => p.mode === 'convenience') || data.plans[data.plans.length - 1];

        processedPlans['cheapest'] = mapPlan(cheapestPlan, baselineTotal);
        processedPlans['value'] = mapPlan(valuePlan, baselineTotal);
        processedPlans['convenient'] = mapPlan(convPlan, baselineTotal);

        setPlans(processedPlans);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to optimise basket");
      } finally {
        setLoading(false);
      }
    }
    fetchOptimisation();
  }, []);

  if (loading) return <div className="p-12 text-center text-[#64748B]">Running AI Optimisation...</div>;
  if (error) return <div className="p-12 text-center text-[#DC2626]">{error}</div>;
  if (!plans) return null;

  const plan = plans[mode];

  // --- NEW FUNCTION TO ACTUALLY SAVE THE PLAN ---
  const handleApplyPlan = () => {
    if (!plan || !plan.rawLines) return;
    
    // Map the raw lines to the format expected by localStorage
    const newBasket = plan.rawLines.map((line: any) => ({
      product_id: line.product_id,
      quantity: line.quantity
    }));

    // Save to localStorage
    localStorage.setItem('zamprice_basket', JSON.stringify(newBasket));
    
    setApplied(true);
    
    // Redirect to basket after 1.5 seconds
    setTimeout(() => {
      onNavigate('basket');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Optimise My Basket</h1>
        <p className="text-sm text-[#64748B]">Choose your optimisation strategy</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id as typeof mode)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${mode === m.id ? 'border-[#0F2547] bg-[#0F2547] text-white' : 'border-[#E2E8F0] bg-white hover:border-[#0F2547]/30'}`}>
            <div className="mb-2">{m.icon}</div>
            <div className={`font-bold text-sm ${mode === m.id ? 'text-white' : 'text-[#1E293B]'}`} style={{ fontFamily: 'Outfit' }}>{m.label}</div>
            <div className={`text-xs mt-0.5 ${mode === m.id ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      <div className={`rounded-2xl p-6 mb-6 ${plan.saving < 0 ? 'bg-[#FEF3C7]' : 'bg-[#0F2547]'}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <div className={`text-sm font-medium mb-1 ${plan.saving < 0 ? 'text-[#92400E]' : 'text-[#94A3B8]'}`}>
              {mode === 'cheapest' ? 'Optimised Shopping Plan — Cheapest' : mode === 'value' ? 'Optimised Plan — Best Value' : 'Convenience Plan — Single Store'}
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className={`text-xs ${plan.saving < 0 ? 'text-[#92400E]/60' : 'text-[#94A3B8]'}`}>Original basket</div>
                <div className={`text-2xl font-black line-through ${plan.saving < 0 ? 'text-[#92400E]/50' : 'text-[#94A3B8]'}`} style={{ fontFamily: 'Outfit' }}>K{plan.original.toFixed(2)}</div>
              </div>
              <div className="text-3xl text-[#94A3B8]">→</div>
              <div>
                <div className={`text-xs ${plan.saving < 0 ? 'text-[#92400E]/60' : 'text-[#94A3B8]'}`}>Optimised total</div>
                <div className={`text-3xl font-black ${plan.saving < 0 ? 'text-[#92400E]' : 'text-white'}`} style={{ fontFamily: 'Outfit' }}>K{plan.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className={`text-center px-6 py-4 rounded-2xl ${plan.saving < 0 ? 'bg-[#FEE2E2]' : 'bg-[#16A34A]/20 border border-[#16A34A]/30'}`}>
            <div className={`text-xs font-medium ${plan.saving < 0 ? 'text-[#DC2626]' : 'text-[#86EFAC]'}`}>
              {plan.saving >= 0 ? 'You save' : 'Extra cost'}
            </div>
            <div className={`text-4xl font-black ${plan.saving < 0 ? 'text-[#DC2626]' : 'text-[#4ADE80]'}`} style={{ fontFamily: 'Outfit' }}>
              {plan.saving >= 0 ? `K${plan.saving.toFixed(2)}` : `K${Math.abs(plan.saving).toFixed(2)}`}
            </div>
            <div className={`text-xs ${plan.saving < 0 ? 'text-[#DC2626]/70' : 'text-[#86EFAC]/70'}`}>
              {plan.saving >= 0 ? `${((plan.saving / plan.original) * 100).toFixed(1)}% less` : 'for convenience'}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>
          Recommended Shopping Plan
          <span className="ml-2 text-sm text-[#64748B] font-normal">· {plan.stores_visited} store{plan.stores_visited !== 1 ? 's' : ''} to visit</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.stores.map((store, index) => (
            <div key={`${store.name}-${index}`} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: store.color + '15', borderBottom: `3px solid ${store.color}` }}>
                <div>
                  <div className="font-black text-lg text-[#1E293B]" style={{ fontFamily: 'Outfit', color: store.color }}>{store.name}</div>
                  <div className="text-xs text-[#64748B]">{store.products} products · {store.savings}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ fontFamily: 'Outfit', color: store.color }}>K{store.total.toFixed(2)}</div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {store.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {/* Wired up the new handleApplyPlan function here */}
        <button onClick={handleApplyPlan}
          className={`flex-1 py-4 rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2 ${applied ? 'bg-[#16A34A] text-white' : 'bg-[#0F2547] text-white hover:bg-[#1A3A6B]'}`}>
          {applied ? <><CheckCircle2 size={20} /> Plan Applied! Redirecting...</> : 'Apply This Plan to My Basket'}
        </button>
        <button onClick={() => onNavigate('location')} className="px-6 py-4 rounded-2xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
          <Navigation size={18} /> Find Stores
        </button>
      </div>
    </div>
  );
}