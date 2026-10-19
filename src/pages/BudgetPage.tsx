import { useState } from 'react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const SUGGESTIONS = [
  { from: "5kg Mealie Meal (Shoprite)", fromPrice: 185, to: "5kg Mealie Meal (Choppies)", toPrice: 175, save: 10, category: 'Same product, different store' },
  { from: "2L Cooking Oil (Shoprite)", fromPrice: 75, to: "2L Cooking Oil (Choppies)", toPrice: 70, save: 5, category: 'Better deal available' },
  { from: "Free Range Eggs 18pcs (Shoprite)", fromPrice: 35, to: "Eggs 18pcs (Choppies)", toPrice: 30, save: 5, category: 'Alternative brand' },
  { from: "Royco Cubes (Shoprite)", fromPrice: 35, to: "Knorr Cubes (Pick n Pay)", toPrice: 29, save: 6, category: 'Similar product' },
  { from: "Long Grain Rice 1kg (Shoprite)", fromPrice: 32, to: "Local Rice 1kg (Choppies)", toPrice: 24, save: 8, category: 'Budget alternative' },
];

export default function BudgetPage({ onNavigate }: Props) {
  const [budget, setBudget] = useState(500);
  const [inputBudget, setInputBudget] = useState('500');
  const originalTotal = 573;
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);

  const totalSaved = appliedSuggestions.reduce((s, i) => s + SUGGESTIONS[i].save, 0);
  const currentTotal = originalTotal - totalSaved;
  const overBudget = currentTotal - budget;
  const withinBudget = currentTotal <= budget;

  const toggleSuggestion = (idx: number) => {
    setAppliedSuggestions(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const applyAll = () => setAppliedSuggestions(SUGGESTIONS.map((_, i) => i));

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Smart Budget</h1>
          <p className="text-sm text-[#64748B]">Optimise your basket to fit your budget</p>
        </div>
        <button onClick={() => onNavigate('basket')} className="text-sm text-[#64748B] hover:text-[#0F2547] transition-colors">← Back to Basket</button>
      </div>

      {/* Budget Input */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <h2 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>Set Your Budget</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#64748B]">K</span>
            <input
              type="number"
              value={inputBudget}
              onChange={e => setInputBudget(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#E2E8F0] text-xl font-black text-[#0F2547] focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20"
              style={{ fontFamily: 'Outfit' }}
            />
          </div>
          <button onClick={() => setBudget(Number(inputBudget))}
            className="px-6 py-3.5 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors">
            Set Budget
          </button>
        </div>
        <div className="flex gap-2">
          {[300, 400, 500, 600, 750].map(b => (
            <button key={b} onClick={() => { setBudget(b); setInputBudget(String(b)); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${budget === b ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
              K{b}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Status */}
      <div className={`rounded-2xl p-6 mb-6 ${withinBudget ? 'bg-[#F0FDF4] border border-[#BBF7D0]' : 'bg-[#FEF2F2] border border-[#FECACA]'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className={`text-sm font-medium mb-1 ${withinBudget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
              {withinBudget ? '🟢 Within budget!' : '🔴 Over budget'}
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-[#64748B]">Current Total</div>
                <div className={`text-3xl font-black ${withinBudget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} style={{ fontFamily: 'Outfit' }}>K{currentTotal}</div>
              </div>
              <div className="text-2xl text-[#94A3B8]">/</div>
              <div>
                <div className="text-xs text-[#64748B]">Your Budget</div>
                <div className="text-3xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{budget}</div>
              </div>
            </div>
          </div>
          <div className={`text-center px-6 py-4 rounded-2xl ${withinBudget ? 'bg-[#DCFCE7]' : 'bg-[#FEE2E2]'}`}>
            <div className={`text-xs font-medium ${withinBudget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
              {withinBudget ? 'Under budget by' : 'Over budget by'}
            </div>
            <div className={`text-4xl font-black ${withinBudget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} style={{ fontFamily: 'Outfit' }}>
              K{withinBudget ? budget - currentTotal : overBudget}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-3 rounded-full bg-white/60 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentTotal / budget) * 100)}%`,
                backgroundColor: withinBudget ? '#16A34A' : '#DC2626'
              }} />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-[#64748B]">K0</span>
            <span className={`font-medium ${withinBudget ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>K{currentTotal}</span>
            <span className="text-[#64748B]">K{budget}</span>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {!withinBudget && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Smart Suggestions</h2>
            <button onClick={applyAll} className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition-colors">
              Apply All Suggestions
            </button>
          </div>
          <div className="space-y-3">
            {SUGGESTIONS.map((s, idx) => {
              const applied = appliedSuggestions.includes(idx);
              return (
                <div key={idx} className={`bg-white rounded-2xl border-2 p-5 transition-all ${applied ? 'border-[#16A34A]/40 bg-[#F0FDF4]' : 'border-[#E2E8F0]'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${applied ? 'bg-[#DCFCE7]' : 'bg-[#F8FAFC]'}`}>
                      {applied ? '✅' : '💡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#94A3B8] font-medium mb-1">{s.category}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm ${applied ? 'text-[#94A3B8] line-through' : 'text-[#475569]'}`}>{s.from}</span>
                        <span className="text-[#94A3B8] text-sm">→</span>
                        <span className="text-sm font-semibold text-[#1E293B]">{s.to}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-sm line-through ${applied ? 'text-[#DC2626]/50' : 'text-[#DC2626]'}`}>K{s.fromPrice}</span>
                        <span className="text-sm font-bold text-[#16A34A]">K{s.toPrice}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">Save K{s.save}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleSuggestion(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 ${applied ? 'bg-[#16A34A] text-white' : 'bg-[#0F2547] text-white hover:bg-[#1A3A6B]'}`}>
                      {applied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {withinBudget && (
        <div className="bg-[#DCFCE7] rounded-2xl p-6 text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-xl font-black text-[#16A34A] mb-2" style={{ fontFamily: 'Outfit' }}>
            Within Your K{budget} Budget!
          </h3>
          <p className="text-sm text-[#16A34A]/80">Your basket total is K{currentTotal} — K{budget - currentTotal} under your budget.</p>
          {totalSaved > 0 && (
            <p className="text-sm text-[#16A34A] font-medium mt-1">You've saved K{totalSaved} by applying smart suggestions.</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => onNavigate('basket')} className="flex-1 py-3.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          ← Back to Basket
        </button>
        <button onClick={() => onNavigate('optimise')} className="flex-1 py-3.5 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors">
          Full Optimisation →
        </button>
      </div>
    </div>
  );
}
