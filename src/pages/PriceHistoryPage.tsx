import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRODUCTS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const STORE_COLORS: Record<string, string> = {
  shoprite: '#E31837',
  choppies: '#0066CC',
  picknpay: '#009F44',
  spar: '#D97706',
};

export default function PriceHistoryPage({ onNavigate }: Props) {
  const [productId, setProductId] = useState('p1');
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const product = PRODUCTS.find(p => p.id === productId) ?? PRODUCTS[0];
  const history = product.priceHistory;
  const currentShoprite = history[history.length - 1].shoprite;
  const avgShoprite = Math.round(history.reduce((s, h) => s + h.shoprite, 0) / history.length);
  const oldestShoprite = history[0].shoprite;
  const changeAmt = currentShoprite - oldestShoprite;
  const changePct = ((changeAmt / oldestShoprite) * 100).toFixed(1);
  const dropping = changeAmt < 0;
  const lowestEver = Math.min(...history.map(h => h.shoprite));
  const highestEver = Math.max(...history.map(h => h.shoprite));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Price History</h1>
          <p className="text-sm text-[#64748B]">Track price trends and spot the best time to buy</p>
        </div>
      </div>

      {/* Product Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {PRODUCTS.map(p => (
          <button key={p.id} onClick={() => setProductId(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${productId === p.id ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
            {p.quantity} {p.name}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Price', value: `K${currentShoprite}`, sub: 'Shoprite today', color: '#0F2547' },
          { label: '30-Day Average', value: `K${avgShoprite}`, sub: 'Across Shoprite', color: '#64748B' },
          { label: 'Price Change', value: `${dropping ? '▼' : '▲'} ${Math.abs(parseFloat(changePct))}%`, sub: `${dropping ? 'Dropped' : 'Increased'} over 30 days`, color: dropping ? '#16A34A' : '#DC2626' },
          { label: 'Status', value: dropping ? 'Good to buy' : 'Wait for drop', sub: dropping ? 'Below 30-day avg' : 'Above average', color: dropping ? '#16A34A' : '#D97706' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="text-xs text-[#64748B] mb-1 font-medium">{stat.label}</div>
            <div className="text-xl font-black" style={{ fontFamily: 'Outfit', color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[#94A3B8] mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>{product.quantity} {product.name} — Price Trends</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Price (K) across all tracked supermarkets</p>
          </div>
          <div className="flex gap-1">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'}`}>
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} domain={['auto', 'auto']} tickFormatter={v => `K${v}`} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              formatter={(value: any, name: any) => [`K${value}`, (name as string).charAt(0).toUpperCase() + (name as string).slice(1)]}
              labelStyle={{ fontWeight: 600, color: '#0F2547', marginBottom: 4 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} formatter={v => v.charAt(0).toUpperCase() + v.slice(1)} />
            <Line type="monotone" dataKey="shoprite" name="shoprite" stroke={STORE_COLORS.shoprite} strokeWidth={2.5} dot={{ r: 4, fill: STORE_COLORS.shoprite }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="choppies" name="choppies" stroke={STORE_COLORS.choppies} strokeWidth={2.5} dot={{ r: 4, fill: STORE_COLORS.choppies }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="picknpay" name="picknpay" stroke={STORE_COLORS.picknpay} strokeWidth={2.5} dot={{ r: 4, fill: STORE_COLORS.picknpay }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Price Range */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>30-Day Price Range</h3>
          <div className="space-y-3">
            {[
              { label: 'Lowest Price (30 days)', value: `K${lowestEver}`, color: '#16A34A', bg: '#DCFCE7', icon: '↓' },
              { label: 'Highest Price (30 days)', value: `K${highestEver}`, color: '#DC2626', bg: '#FEE2E2', icon: '↑' },
              { label: '30-Day Average', value: `K${avgShoprite}`, color: '#0F2547', bg: '#EFF6FF', icon: '≈' },
              { label: 'Current Price', value: `K${currentShoprite}`, color: '#D97706', bg: '#FEF3C7', icon: '•' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: r.bg }}>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold w-5 text-center" style={{ color: r.color }}>{r.icon}</span>
                  <span className="text-sm text-[#475569]">{r.label}</span>
                </div>
                <span className="font-bold" style={{ fontFamily: 'Outfit', color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] flex items-center gap-2.5">
            <span className="text-lg">📅</span>
            <span className="text-xs text-[#64748B]">Last price update: <span className="font-semibold text-[#1E293B]">2 September 2024 · 10:30 AM</span></span>
          </div>
        </div>

        {/* Recommendation Panel */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>AI Price Intelligence</h3>
          <div className={`p-4 rounded-xl mb-4 ${dropping ? 'bg-[#DCFCE7]' : 'bg-[#FEF3C7]'}`}>
            <div className={`font-bold text-lg mb-1 ${dropping ? 'text-[#16A34A]' : 'text-[#D97706]'}`} style={{ fontFamily: 'Outfit' }}>
              {dropping ? '🟢 Good time to buy!' : '🟡 Consider waiting'}
            </div>
            <div className={`text-sm ${dropping ? 'text-[#16A34A]/80' : 'text-[#D97706]/80'}`}>
              {dropping
                ? `Price has dropped ${Math.abs(parseFloat(changePct))}% over 30 days and is currently below the average. Stock up now.`
                : `Price is above the 30-day average. Historical patterns suggest it may drop soon.`
              }
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[#EFF6FF] flex items-center justify-center text-xs">📈</span>
              <span className="text-[#475569]">Seasonal trend: <span className="font-medium text-[#1E293B]">Prices typically rise in Sep–Oct</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[#F0FDF4] flex items-center justify-center text-xs">🏪</span>
              <span className="text-[#475569]">Best consistent store: <span className="font-semibold text-[#16A34A]">Shoprite</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center text-xs">⚡</span>
              <span className="text-[#475569]">Price volatility: <span className="font-medium text-[#1E293B]">Low — stable product</span></span>
            </div>
          </div>

          <button onClick={() => onNavigate('alerts')} className="mt-4 w-full py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
            🔔 Set Price Alert
          </button>
        </div>
      </div>
    </div>
  );
}
