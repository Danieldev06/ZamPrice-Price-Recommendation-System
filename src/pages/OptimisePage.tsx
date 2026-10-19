import { useState } from 'react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const MODES = [
  { id: 'cheapest', icon: '🥇', label: 'Cheapest', desc: 'Lowest possible total price', color: '#D97706' },
  { id: 'value', icon: '💰', label: 'Best Value', desc: 'Best price-to-quantity ratio', color: '#0F2547' },
  { id: 'convenient', icon: '🚗', label: 'Most Convenient', desc: 'Fewer stores to visit', color: '#16A34A' },
];

const PLAN = {
  cheapest: {
    stores: [
      { name: 'Shoprite', products: 4, items: ['5kg Mealie Meal — K185', '2kg Sugar — K48', '1kg Rice — K32', 'Eggs 18pcs — K35'], total: 300, color: '#E31837', savings: 'Best prices on staples' },
      { name: 'Choppies', products: 3, items: ['2L Cooking Oil — K70', '5L Cooking Oil — K159', 'Bread 700g — K18'], total: 247, color: '#0066CC', savings: 'Cheapest oil prices' },
    ],
    total: 438,
    original: 501,
    saving: 63,
    stores_visited: 2,
  },
  value: {
    stores: [
      { name: 'Shoprite', products: 5, items: ['5kg Mealie Meal — K185', '2kg Sugar — K48', '1kg Rice — K32', 'Eggs 18pcs — K35', 'Bread 700g — K18'], total: 318, color: '#E31837', savings: 'Largest pack sizes, best unit cost' },
      { name: 'Choppies', products: 2, items: ['5L Cooking Oil — K159', '2L Cooking Oil — K70'], total: 229, color: '#0066CC', savings: 'Best value cooking oil' },
    ],
    total: 447,
    original: 501,
    saving: 54,
    stores_visited: 2,
  },
  convenient: {
    stores: [
      { name: 'Shoprite', products: 7, items: ['5kg Mealie Meal — K185', '2L Cooking Oil — K75', '2kg Sugar — K48', '1kg Rice — K32', 'Bread — K18', 'Eggs — K35', '5L Oil — K165'], total: 558, color: '#E31837', savings: 'Everything in one trip' },
    ],
    total: 558,
    original: 501,
    saving: -57,
    stores_visited: 1,
  },
};

export default function OptimisePage({ onNavigate }: Props) {
  const [mode, setMode] = useState<'cheapest' | 'value' | 'convenient'>('cheapest');
  const [applied, setApplied] = useState(false);
  const plan = PLAN[mode];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => onNavigate('basket')} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F2547] transition-colors mb-3">← Back to Basket</button>
        <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Optimise My Basket</h1>
        <p className="text-sm text-[#64748B]">Choose your optimisation strategy</p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id as typeof mode)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${mode === m.id ? 'border-[#0F2547] bg-[#0F2547] text-white' : 'border-[#E2E8F0] bg-white hover:border-[#0F2547]/30'}`}>
            <div className="text-3xl mb-2">{m.icon}</div>
            <div className={`font-bold text-sm ${mode === m.id ? 'text-white' : 'text-[#1E293B]'}`} style={{ fontFamily: 'Outfit' }}>{m.label}</div>
            <div className={`text-xs mt-0.5 ${mode === m.id ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Savings Summary */}
      <div className={`rounded-2xl p-6 mb-6 ${mode === 'convenient' && plan.saving < 0 ? 'bg-[#FEF3C7]' : 'bg-[#0F2547]'}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <div className={`text-sm font-medium mb-1 ${mode === 'convenient' && plan.saving < 0 ? 'text-[#92400E]' : 'text-[#94A3B8]'}`}>
              {mode === 'cheapest' ? 'Optimised Shopping Plan — Cheapest' : mode === 'value' ? 'Optimised Plan — Best Value' : 'Convenience Plan — Single Store'}
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className={`text-xs ${mode === 'convenient' && plan.saving < 0 ? 'text-[#92400E]/60' : 'text-[#94A3B8]'}`}>Original basket</div>
                <div className={`text-2xl font-black line-through ${mode === 'convenient' && plan.saving < 0 ? 'text-[#92400E]/50' : 'text-[#94A3B8]'}`} style={{ fontFamily: 'Outfit' }}>K{plan.original}</div>
              </div>
              <div className="text-3xl text-[#94A3B8]">→</div>
              <div>
                <div className={`text-xs ${mode === 'convenient' && plan.saving < 0 ? 'text-[#92400E]/60' : 'text-[#94A3B8]'}`}>Optimised total</div>
                <div className={`text-3xl font-black ${mode === 'convenient' && plan.saving < 0 ? 'text-[#92400E]' : 'text-white'}`} style={{ fontFamily: 'Outfit' }}>K{plan.total}</div>
              </div>
            </div>
          </div>
          <div className={`text-center px-6 py-4 rounded-2xl ${mode === 'convenient' && plan.saving < 0 ? 'bg-[#FEE2E2]' : 'bg-[#16A34A]/20 border border-[#16A34A]/30'}`}>
            <div className={`text-xs font-medium ${mode === 'convenient' && plan.saving < 0 ? 'text-[#DC2626]' : 'text-[#86EFAC]'}`}>
              {plan.saving >= 0 ? 'You save' : 'Extra cost'}
            </div>
            <div className={`text-4xl font-black ${mode === 'convenient' && plan.saving < 0 ? 'text-[#DC2626]' : 'text-[#4ADE80]'}`} style={{ fontFamily: 'Outfit' }}>
              {plan.saving >= 0 ? `K${plan.saving}` : `K${Math.abs(plan.saving)}`}
            </div>
            <div className={`text-xs ${mode === 'convenient' && plan.saving < 0 ? 'text-[#DC2626]/70' : 'text-[#86EFAC]/70'}`}>
              {plan.saving >= 0 ? `${((plan.saving / plan.original) * 100).toFixed(1)}% less` : 'for convenience'}
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Plan */}
      <div className="mb-6">
        <h2 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>
          Recommended Shopping Plan
          <span className="ml-2 text-sm text-[#64748B] font-normal">· {plan.stores_visited} store{plan.stores_visited !== 1 ? 's' : ''} to visit</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.stores.map(store => (
            <div key={store.name} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: store.color + '15', borderBottom: `3px solid ${store.color}` }}>
                <div>
                  <div className="font-black text-lg text-[#1E293B]" style={{ fontFamily: 'Outfit', color: store.color }}>{store.name}</div>
                  <div className="text-xs text-[#64748B]">{store.products} products · {store.savings}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ fontFamily: 'Outfit', color: store.color }}>K{store.total}</div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {store.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#475569]">
                    <span className="text-[#16A34A]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tradeoff Note for convenience */}
      {mode !== 'convenient' && (
        <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 mb-6">
          <h3 className="font-bold text-[#0F2547] mb-2" style={{ fontFamily: 'Outfit' }}>🚗 Convenience Alternative</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#475569]">Shop everything at <span className="font-semibold">Shoprite</span></div>
              <div className="text-xs text-[#64748B] mt-0.5">1 store to visit · No extra travel needed</div>
            </div>
            <div className="text-right">
              <div className="font-black text-xl text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{PLAN.convenient.total}</div>
              <div className="text-xs text-[#D97706] font-medium">K{PLAN.convenient.total - plan.total} more</div>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-[#FEF3C7] text-xs text-[#92400E]">
            💡 <span className="font-medium">"Save K{Math.abs(plan.saving)} less, but avoid visiting {plan.stores_visited - 1} extra store{plan.stores_visited - 1 !== 1 ? 's' : ''}."</span>
          </div>
          <button onClick={() => setMode('convenient')} className="mt-3 text-xs text-[#0F2547] font-medium hover:underline">Switch to convenience plan →</button>
        </div>
      )}

      {/* Apply Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setApplied(true)}
          className={`flex-1 py-4 rounded-2xl font-bold text-base transition-colors ${applied ? 'bg-[#16A34A] text-white' : 'bg-[#0F2547] text-white hover:bg-[#1A3A6B]'}`}>
          {applied ? '✓ Plan Applied to Basket!' : 'Apply This Plan to My Basket'}
        </button>
        <button onClick={() => onNavigate('location')} className="px-6 py-4 rounded-2xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          📍 Find Stores
        </button>
      </div>

      {applied && (
        <div className="mt-4 p-4 bg-[#DCFCE7] rounded-2xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-bold text-[#16A34A]">Optimised plan applied!</div>
            <div className="text-sm text-[#16A34A]/80">Your basket has been updated with the {mode === 'cheapest' ? 'cheapest' : mode === 'value' ? 'best-value' : 'most convenient'} shopping plan.</div>
          </div>
        </div>
      )}
    </div>
  );
}
