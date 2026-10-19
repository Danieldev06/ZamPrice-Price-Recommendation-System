import { useState } from 'react';
import { DEALS } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const FILTERS = ['All', 'Mealie Meal', 'Cooking Oil', 'Rice', 'Bread', 'Eggs', 'Milk'];

export default function DealsPage({ onNavigate }: Props) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'discount' | 'saving'>('discount');

  const filtered = DEALS
    .filter(d => filter === 'All' || d.category === filter)
    .sort((a, b) => sortBy === 'discount' ? b.discount - a.discount : (b.was - b.now) - (a.was - a.now));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
          Today's Best Deals 🔥
        </h1>
        <p className="text-sm text-[#64748B]">Live promotions and price drops across all supermarkets</p>
      </div>

      {/* Top Savings Banner */}
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
          <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Outfit' }}>{DEALS[0].productName}</div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-black text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K{DEALS[0].now}</span>
            <span className="text-xl text-[#94A3B8] line-through">K{DEALS[0].was}</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-sm font-bold">{DEALS[0].discount}% OFF</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#94A3B8]">At <span className="text-white font-medium">{DEALS[0].store}</span> · {DEALS[0].expires}</span>
            <button className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-sm font-bold hover:bg-[#B45309] transition-colors">View Deal</button>
          </div>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filtered.map(deal => (
          <div key={deal.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group cursor-pointer">
            <div className="h-44 overflow-hidden relative bg-[#F1F5F9]">
              <img src={deal.image} alt={deal.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-sm font-black">
                {deal.discount}% OFF
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                {deal.store}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs">
                {deal.expires}
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>{deal.productName}</div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{deal.now}</span>
                <span className="text-base text-[#94A3B8] line-through">K{deal.was}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#DCFCE7]">
                  <span className="text-xs font-bold text-[#16A34A]">💰 Save K{deal.was - deal.now}</span>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#0F2547] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors">
                  View Deal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biggest Savings Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Biggest Savings Today</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {['Product', 'Store', 'Original', 'Now', 'You Save', 'Discount'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...DEALS].sort((a, b) => (b.was - b.now) - (a.was - a.now)).map((deal, i) => (
                <tr key={deal.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1E293B]">{deal.productName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#64748B]">{deal.store}</td>
                  <td className="px-5 py-3.5 text-sm text-[#94A3B8] line-through">K{deal.was}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-[#16A34A]">K{deal.now}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">K{deal.was - deal.now}</span>
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
    </div>
  );
}
