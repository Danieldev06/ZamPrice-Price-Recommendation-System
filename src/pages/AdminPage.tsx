import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const ADMIN_NAV = ['Dashboard', 'Products', 'Supermarkets', 'Prices', 'Categories', 'Promotions', 'Users', 'Data Quality'];

const PRICE_TREND_DATA = [
  { date: '29 Aug', shoprite: 198, choppies: 202, picknpay: 208 },
  { date: '30 Aug', shoprite: 195, choppies: 200, picknpay: 206 },
  { date: '31 Aug', shoprite: 192, choppies: 198, picknpay: 205 },
  { date: '01 Sep', shoprite: 190, choppies: 196, picknpay: 205 },
  { date: '02 Sep', shoprite: 188, choppies: 194, picknpay: 204 },
  { date: '03 Sep', shoprite: 186, choppies: 193, picknpay: 205 },
  { date: '04 Sep', shoprite: 185, choppies: 192, picknpay: 205 },
];

const STORE_COMPARISON = [
  { store: 'Shoprite', avgPrice: 428, products: 934, updates: 142 },
  { store: 'Choppies', avgPrice: 415, products: 876, updates: 98 },
  { store: 'Pick n Pay', avgPrice: 452, products: 812, updates: 76 },
  { store: 'Spar', avgPrice: 461, products: 654, updates: 54 },
  { store: 'Game', avgPrice: 478, products: 520, updates: 31 },
];

const TOP_SEARCHES = [
  { product: '5kg Mealie Meal', searches: 1842, trend: '+12%' },
  { product: '2L Cooking Oil', searches: 1523, trend: '+8%' },
  { product: '2kg Sugar', searches: 1201, trend: '+3%' },
  { product: 'Bread 700g', searches: 987, trend: '-2%' },
  { product: 'Eggs 18pcs', searches: 876, trend: '+15%' },
  { product: 'Long Grain Rice 1kg', searches: 754, trend: '+6%' },
];

const RECENT_PRODUCTS = [
  { name: '5kg Mealie Meal', brand: "Roller's Choice", category: 'Mealie Meal', stores: 4, lastUpdate: '2 hours ago', freshness: 'fresh' },
  { name: '2L Cooking Oil', brand: 'Freshmark', category: 'Cooking Oil', stores: 3, lastUpdate: '1 hour ago', freshness: 'fresh' },
  { name: '2kg Sugar', brand: 'Zambia Sugar', category: 'Sugar', stores: 3, lastUpdate: '3 hours ago', freshness: 'fresh' },
  { name: 'Bread 700g', brand: 'Shoprite Bakery', category: 'Bread', stores: 3, lastUpdate: 'Yesterday', freshness: 'recent' },
  { name: 'Eggs 18pcs', brand: 'Zamchick', category: 'Eggs', stores: 3, lastUpdate: '7 days ago', freshness: 'stale' },
];

export default function AdminPage({ onNavigate }: Props) {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-[#081730] flex-shrink-0 flex flex-col hidden md:flex">
        <div className="px-5 py-5 border-b border-[#0F2547]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-black text-xs">Z</div>
            <div>
              <div className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit' }}>ZamPrice</div>
              <div className="text-[#64748B] text-xs">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV.map(item => (
            <button key={item} onClick={() => setActiveSection(item)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === item ? 'bg-[#0F2547] text-white' : 'text-[#64748B] hover:text-white hover:bg-[#0F2547]/50'}`}>
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#0F2547]">
          <button onClick={() => onNavigate('dashboard')} className="w-full text-left px-3 py-2 text-xs text-[#64748B] hover:text-white transition-colors">
            ← Back to App
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Admin {activeSection}</h1>
              <p className="text-sm text-[#64748B]">ZamPrice data management · 4 Sep 2024</p>
            </div>
            <div className="flex gap-2">
              {activeSection === 'Products' && (
                <button onClick={() => setShowAddProduct(true)} className="px-4 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
                  + Add Product
                </button>
              )}
              <button className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                Export Data
              </button>
            </div>
          </div>

          {activeSection === 'Dashboard' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Products', value: '1,042', change: '+24 today', color: '#0F2547', bg: '#EFF6FF', icon: '📦' },
                  { label: 'Supermarkets', value: '5', change: 'All active', color: '#16A34A', bg: '#F0FDF4', icon: '🏪' },
                  { label: 'Prices Collected', value: '4,218', change: '+401 today', color: '#D97706', bg: '#FEF3C7', icon: '💹' },
                  { label: 'Active Promotions', value: '57', change: '+12 this week', color: '#DC2626', bg: '#FEF2F2', icon: '🔥' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ backgroundColor: kpi.bg }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{kpi.icon}</span>
                      <span className="text-xs font-medium text-[#16A34A]">{kpi.change}</span>
                    </div>
                    <div className="text-2xl font-black" style={{ fontFamily: 'Outfit', color: kpi.color }}>{kpi.value}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* Price Trends */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                  <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Mealie Meal Price Trends</h3>
                  <p className="text-xs text-[#64748B] mb-4">7-day average price by store (K)</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={PRICE_TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['auto', 'auto']} tickFormatter={v => `K${v}`} />
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`K${v}`]} />
                      <Line type="monotone" dataKey="shoprite" stroke="#E31837" strokeWidth={2} dot={false} name="Shoprite" />
                      <Line type="monotone" dataKey="choppies" stroke="#0066CC" strokeWidth={2} dot={false} name="Choppies" />
                      <Line type="monotone" dataKey="picknpay" stroke="#009F44" strokeWidth={2} dot={false} name="Pick n Pay" />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Store Comparison */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                  <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Average Basket by Store (K)</h3>
                  <p className="text-xs text-[#64748B] mb-4">Current average basket price comparison</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={STORE_COMPARISON} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => `K${v}`} />
                      <YAxis type="category" dataKey="store" tick={{ fontSize: 10, fill: '#64748B' }} width={70} />
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`K${v}`, 'Avg Basket']} />
                      <Bar dataKey="avgPrice" fill="#0F2547" radius={[0, 6, 6, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Top Searches */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#E2E8F0]">
                    <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Most Searched Products</h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F8FAFC]">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase">#</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase">Product</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase">Searches</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_SEARCHES.map((p, i) => (
                        <tr key={p.product} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-5 py-3 text-sm text-[#94A3B8]">{i + 1}</td>
                          <td className="px-5 py-3 text-sm font-medium text-[#1E293B]">{p.product}</td>
                          <td className="px-5 py-3 text-sm text-right font-bold text-[#0F2547]">{p.searches.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right">
                            <span className={`text-xs font-bold ${p.trend.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{p.trend}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Data Quality */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#E2E8F0]">
                    <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Data Freshness Overview</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { store: 'Shoprite', last: '2 hours ago', freshness: 'fresh', pct: 97 },
                      { store: 'Choppies', last: '1 hour ago', freshness: 'fresh', pct: 99 },
                      { store: 'Pick n Pay', last: '4 hours ago', freshness: 'fresh', pct: 94 },
                      { store: 'Spar', last: 'Yesterday', freshness: 'recent', pct: 78 },
                      { store: 'Game', last: '3 days ago', freshness: 'stale', pct: 52 },
                    ].map(s => {
                      const color = s.freshness === 'fresh' ? '#16A34A' : s.freshness === 'recent' ? '#D97706' : '#DC2626';
                      const dot = s.freshness === 'fresh' ? '🟢' : s.freshness === 'recent' ? '🟡' : '🔴';
                      return (
                        <div key={s.store}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <span>{dot}</span>
                              <span className="font-medium text-[#1E293B]">{s.store}</span>
                              <span className="text-xs text-[#94A3B8]">· {s.last}</span>
                            </div>
                            <span className="text-xs font-bold" style={{ color }}>{s.pct}% fresh</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'Products' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Product Catalogue</h3>
                <div className="flex items-center gap-2">
                  <input placeholder="Search products..." className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none text-sm" />
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {['Product', 'Brand', 'Category', 'Stores', 'Last Update', 'Freshness', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PRODUCTS.map(p => {
                    const dot = p.freshness === 'fresh' ? '🟢' : p.freshness === 'recent' ? '🟡' : '🔴';
                    return (
                      <tr key={p.name} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3.5 text-sm font-medium text-[#1E293B]">{p.name}</td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B]">{p.brand}</td>
                        <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-md bg-[#EFF6FF] text-[#0F2547] text-xs font-medium">{p.category}</span></td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B]">{p.stores}</td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B]">{p.lastUpdate}</td>
                        <td className="px-5 py-3.5 text-sm">{dot} <span className={p.freshness === 'fresh' ? 'text-[#16A34A]' : p.freshness === 'recent' ? 'text-[#D97706]' : 'text-[#DC2626]'}>{p.freshness === 'fresh' ? 'Fresh' : p.freshness === 'recent' ? 'Recent' : 'Stale'}</span></td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#0F2547] text-xs font-medium hover:bg-[#DBEAFE] transition-colors">Edit</button>
                            <button className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#D97706] text-xs font-medium hover:bg-[#FDE68A] transition-colors">Update</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'Prices' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>Upload Price Data</h3>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-10 text-center hover:border-[#0F2547]/30 transition-colors cursor-pointer">
                  <div className="text-4xl mb-3">📁</div>
                  <div className="font-semibold text-[#1E293B] mb-1">Drop your price CSV here</div>
                  <div className="text-sm text-[#64748B] mb-4">Supports CSV, Excel, and JSON formats</div>
                  <button className="px-6 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Browse Files</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>Recent Price Updates</h3>
                <div className="space-y-3">
                  {[
                    { store: 'Shoprite', product: '5kg Mealie Meal', old: 190, new: 185, time: '2 hours ago' },
                    { store: 'Choppies', product: '5L Cooking Oil', old: 165, new: 159, time: '3 hours ago' },
                    { store: 'Pick n Pay', product: 'Bread 700g', old: 18, new: 20, time: '4 hours ago' },
                    { store: 'Spar', product: 'Milk 1L', old: 28, new: 30, time: 'Yesterday' },
                  ].map((u, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC]">
                      <div className="text-xl">{u.new < u.old ? '📉' : '📈'}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#1E293B]">{u.product} · {u.store}</div>
                        <div className="text-xs text-[#64748B]">{u.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#94A3B8] line-through">K{u.old}</span>
                        <span className={`text-sm font-bold ${u.new < u.old ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>K{u.new}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${u.new < u.old ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                          {u.new < u.old ? '▼' : '▲'} K{Math.abs(u.new - u.old)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {!['Dashboard', 'Products', 'Prices'].includes(activeSection) && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>{activeSection} Management</h3>
              <p className="text-[#64748B] text-sm">This section is available in the full system. Showing dashboard overview instead.</p>
              <button onClick={() => setActiveSection('Dashboard')} className="mt-4 px-6 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Back to Dashboard</button>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Add New Product</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-[#94A3B8] hover:text-[#64748B] text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[['Product Name', 'e.g. Mealie Meal'], ['Brand', 'e.g. Rollers Choice'], ['Quantity / Size', 'e.g. 5kg'], ['Category', 'e.g. Mealie Meal'], ['Barcode', 'e.g. 6009183140059']].map(([label, placeholder]) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">{label}</label>
                  <input placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddProduct(false)} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569]">Cancel</button>
              <button onClick={() => setShowAddProduct(false)} className="flex-1 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
