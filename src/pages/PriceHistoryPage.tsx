import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/client';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

// --- Backend Interfaces ---
interface Product {
  id: number;
  name: string;
  brand: string | null;
}

interface HistoryRecord {
  observed_at: string;
  branch_id: number;
  price: number;
}

const STORE_COLORS: Record<string, string> = {
  'shoprite': '#E31837',
  'choppies': '#0066CC',
  'pick n pay': '#009F44',
  'spar': '#D97706',
  'default': '#0F2547'
};

export default function PriceHistoryPage({ onNavigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [branchMap, setBranchMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Products
  useEffect(() => {
    api.get<Product[]>('/products').then(res => {
      setProducts(res.data);
      if (res.data.length > 0) setProductId(res.data[0].id);
    });
  }, []);

  // 2. Fetch History + Branch Mapping when product changes
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    
    Promise.all([
      api.get<HistoryRecord[]>(`/products/${productId}/history`),
      api.get(`/products/${productId}/comparison`)
    ]).then(([histRes, compRes]) => {
      setHistory(histRes.data);
      
      // Build a map of branch_id -> supermarket name
      const bMap: Record<number, string> = {};
      if (compRes.data.options) {
        compRes.data.options.forEach((opt: any) => {
          // Normalize to lowercase for color matching
          bMap[opt.branch_id] = opt.supermarket;
        });
      }
      setBranchMap(bMap);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  // 3. Process data for Recharts
  const processedData = useMemo(() => {
    if (!history.length) return [];

    // Filter by period
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = history.filter(h => new Date(h.observed_at) >= cutoff);

    // Group by date
    const map: Record<string, any> = {};
    filtered.forEach(h => {
      const dateStr = new Date(h.observed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const storeName = branchMap[h.branch_id] || 'Unknown';
      
      if (!map[dateStr]) map[dateStr] = { date: dateStr, rawDate: new Date(h.observed_at) };
      
      // If multiple branches of same supermarket exist on same day, take the lowest price
      if (!map[dateStr][storeName] || h.price < map[dateStr][storeName]) {
        map[dateStr][storeName] = h.price;
      }
    });

    return Object.values(map).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  }, [history, period, branchMap]);

  // 4. Calculate Stats dynamically
  const stats = useMemo(() => {
    if (!processedData.length) return null;
    
    // Get all prices from the filtered data
    const allPrices: number[] = [];
    processedData.forEach(d => {
      Object.keys(d).forEach(k => {
        if (k !== 'date' && k !== 'rawDate') allPrices.push(d[k]);
      });
    });

    if (!allPrices.length) return null;

    const current = allPrices[allPrices.length - 1];
    const oldest = allPrices[0];
    const lowest = Math.min(...allPrices);
    const highest = Math.max(...allPrices);
    const avg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    
    const changeAmt = current - oldest;
    const changePct = oldest !== 0 ? ((changeAmt / oldest) * 100).toFixed(1) : '0.0';
    const dropping = changeAmt < 0;

    return { current, oldest, lowest, highest, avg, changePct, dropping };
  }, [processedData]);

  // Find all unique supermarket names present in the chart
  const storeKeys = Array.from(new Set(processedData.flatMap(d => Object.keys(d).filter(k => k !== 'date' && k !== 'rawDate'))));

  if (loading && !history.length) return <div className="p-12 text-center text-[#64748B]">Loading history data...</div>;

  const currentProduct = products.find(p => p.id === productId);

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
        {products.map(p => (
          <button key={p.id} onClick={() => setProductId(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${productId === p.id ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {!stats || processedData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
          Not enough historical data yet to generate a chart for this product.
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Current Price', value: `K${stats.current.toFixed(2)}`, sub: 'Latest observation', color: '#0F2547' },
              { label: 'Average', value: `K${stats.avg.toFixed(2)}`, sub: `Over ${period}`, color: '#64748B' },
              { label: 'Price Change', value: `${stats.dropping ? '▼' : '▲'} ${Math.abs(parseFloat(stats.changePct))}%`, sub: `${stats.dropping ? 'Dropped' : 'Increased'}`, color: stats.dropping ? '#16A34A' : '#DC2626' },
              { label: 'Status', value: stats.dropping ? 'Good to buy' : 'Wait for drop', sub: stats.dropping ? 'Below average' : 'Above average', color: stats.dropping ? '#16A34A' : '#D97706' },
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
                <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>{currentProduct?.name} — Price Trends</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Price (K) across tracked supermarkets</p>
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
              <LineChart data={processedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} domain={['auto', 'auto']} tickFormatter={v => `K${v}`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: any, name: any) => [`K${value.toFixed(2)}`, name]}
                  labelStyle={{ fontWeight: 600, color: '#0F2547', marginBottom: 4 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                
                {/* Dynamically render lines for each supermarket found in the data */}
                {storeKeys.map((storeName) => {
                  const colorKey = storeName.toLowerCase();
                  return (
                    <Line 
                      key={storeName}
                      type="monotone" 
                      dataKey={storeName} 
                      stroke={STORE_COLORS[colorKey] || STORE_COLORS.default} 
                      strokeWidth={2.5} 
                      dot={{ r: 4, fill: STORE_COLORS[colorKey] || STORE_COLORS.default }} 
                      activeDot={{ r: 6 }} 
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price Range */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>{period} Price Range</h3>
              <div className="space-y-3">
                {[
                  { label: `Lowest Price (${period})`, value: `K${stats.lowest.toFixed(2)}`, color: '#16A34A', bg: '#DCFCE7', icon: '↓' },
                  { label: `Highest Price (${period})`, value: `K${stats.highest.toFixed(2)}`, color: '#DC2626', bg: '#FEE2E2', icon: '↑' },
                  { label: `Average Price (${period})`, value: `K${stats.avg.toFixed(2)}`, color: '#0F2547', bg: '#EFF6FF', icon: '≈' },
                  { label: 'Current Price', value: `K${stats.current.toFixed(2)}`, color: '#D97706', bg: '#FEF3C7', icon: '•' },
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
            </div>

            {/* Recommendation Panel */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>AI Price Intelligence</h3>
              <div className={`p-4 rounded-xl mb-4 ${stats.dropping ? 'bg-[#DCFCE7]' : 'bg-[#FEF3C7]'}`}>
                <div className={`font-bold text-lg mb-1 ${stats.dropping ? 'text-[#16A34A]' : 'text-[#D97706]'}`} style={{ fontFamily: 'Outfit' }}>
                  {stats.dropping ? '🟢 Good time to buy!' : '🟡 Consider waiting'}
                </div>
                <div className={`text-sm ${stats.dropping ? 'text-[#16A34A]/80' : 'text-[#D97706]/80'}`}>
                  {stats.dropping
                    ? `Price has dropped ${Math.abs(parseFloat(stats.changePct))}% recently and is trending down. Stock up now.`
                    : `Price is above the recent low. Historical patterns suggest it may drop soon.`
                  }
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#EFF6FF] flex items-center justify-center text-xs">📈</span>
                  <span className="text-[#475569]">Data points: <span className="font-medium text-[#1E293B]">{history.length} observations</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center text-xs">⚡</span>
                  <span className="text-[#475569]">Price volatility: <span className="font-medium text-[#1E293B]">{stats.highest - stats.lowest > (stats.avg * 0.1) ? 'High' : 'Low — stable product'}</span></span>
                </div>
              </div>

              <button onClick={() => onNavigate('alerts')} className="mt-4 w-full py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
                🔔 Set Price Alert
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}