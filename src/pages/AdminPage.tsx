import { useState, useEffect } from 'react';
import api from '../api/client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  base_unit: string;
}

interface DataQuality {
  total_price_records: number;
  stale_records: number;
  products: number;
  branches: number;
}

const ADMIN_NAV = ['Dashboard', 'Products', 'Prices'];
// Note: Supermarkets, Categories, Promotions, Users are not fully implemented in the backend yet.

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
  { store: 'Shoprite', avgPrice: 428 },
  { store: 'Choppies', avgPrice: 415 },
  { store: 'Pick n Pay', avgPrice: 452 },
];

export default function AdminPage({ onNavigate }: Props) {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddPrice, setShowAddPrice] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [quality, setQuality] = useState<DataQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: '', base_unit: 'item' });
  const [newPrice, setNewPrice] = useState({ product_id: '', branch_id: '1', quantity: '1', unit: 'item', price: '' });

  // Fetch Admin Data
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [prodRes, qualRes] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<DataQuality>('/admin/data-quality')
      ]);
      setProducts(prodRes.data);
      setQuality(qualRes.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setErrorMsg('Access Denied: You must be logged in as an Administrator to view this page.');
      } else {
        setErrorMsg('Failed to load admin data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async () => {
    if (!newProduct.name) return;
    try {
      await api.post('/admin/products', {
        name: newProduct.name,
        brand: newProduct.brand || null,
        category: newProduct.category || null,
        base_unit: newProduct.base_unit
      });
      setShowAddProduct(false);
      setNewProduct({ name: '', brand: '', category: '', base_unit: 'item' });
      loadData();
    } catch (err) {
      alert("Failed to create product. Check console.");
    }
  };

  const handleAddPrice = async () => {
    if (!newPrice.product_id || !newPrice.price) return;
    try {
      await api.post('/admin/prices', {
        product_id: Number(newPrice.product_id),
        branch_id: Number(newPrice.branch_id),
        quantity: Number(newPrice.quantity),
        unit: newPrice.unit,
        price: Number(newPrice.price),
        available: true,
        source: 'Admin UI'
      });
      setShowAddPrice(false);
      setNewPrice({ product_id: '', branch_id: '1', quantity: '1', unit: 'item', price: '' });
      loadData();
      alert("Price added successfully!");
    } catch (err) {
      alert("Failed to add price.");
    }
  };

  if (loading) return <div className="p-12 text-center text-[#64748B]">Loading Admin Data...</div>;

  if (errorMsg) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-[#0F2547] mb-2">Admin Access Only</h2>
          <p className="text-[#64748B] mb-6">{errorMsg}</p>
          <button onClick={() => onNavigate('dashboard')} className="px-6 py-2.5 rounded-xl bg-[#0F2547] text-white font-semibold">
            Return Home
          </button>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-[#64748B]">ZamPrice data management</p>
            </div>
            <div className="flex gap-2">
              {activeSection === 'Products' && (
                <button onClick={() => setShowAddProduct(true)} className="px-4 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
                  + Add Product
                </button>
              )}
              {activeSection === 'Prices' && (
                <button onClick={() => setShowAddPrice(true)} className="px-4 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
                  + Add Price Record
                </button>
              )}
            </div>
          </div>

          {activeSection === 'Dashboard' && quality && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Products', value: quality.products.toString(), change: 'Live DB', color: '#0F2547', bg: '#EFF6FF', icon: '📦' },
                  { label: 'Branches Tracked', value: quality.branches.toString(), change: 'Across stores', color: '#16A34A', bg: '#F0FDF4', icon: '🏪' },
                  { label: 'Price Records', value: quality.total_price_records.toString(), change: 'Observations', color: '#D97706', bg: '#FEF3C7', icon: '💹' },
                  { label: 'Stale Records', value: quality.stale_records.toString(), change: 'Needs update', color: quality.stale_records > 0 ? '#DC2626' : '#16A34A', bg: '#FEF2F2', icon: '⚠️' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ backgroundColor: kpi.bg }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{kpi.icon}</span>
                      <span className="text-xs font-medium text-[#64748B]">{kpi.change}</span>
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
                  <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Mealie Meal Price Trends (Mock)</h3>
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
                  <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Average Basket by Store (Mock)</h3>
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
            </>
          )}

          {activeSection === 'Products' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Product Catalogue</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {['ID', 'Product', 'Brand', 'Category', 'Unit'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-[#94A3B8]">#{p.id}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1E293B]">{p.name}</td>
                      <td className="px-5 py-3.5 text-sm text-[#64748B]">{p.brand || '-'}</td>
                      <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-md bg-[#EFF6FF] text-[#0F2547] text-xs font-medium">{p.category || 'General'}</span></td>
                      <td className="px-5 py-3.5 text-sm text-[#64748B] uppercase">{p.base_unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'Prices' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
              <div className="text-5xl mb-4">💹</div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>Price Management</h3>
              <p className="text-[#64748B] text-sm mb-6">You have {quality?.total_price_records} price records in the database.</p>
              <button onClick={() => setShowAddPrice(true)} className="px-6 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">
                Add New Price Observation
              </button>
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
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Product Name</label>
                <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Mealie Meal 10kg" className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Brand</label>
                <input value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} placeholder="e.g. Rollers Choice" className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Category</label>
                <input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="e.g. Mealie Meal" className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Base Unit</label>
                <select value={newProduct.base_unit} onChange={e => setNewProduct({...newProduct, base_unit: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-white">
                  <option value="item">Item (pieces, packs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="L">Litres (L)</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddProduct(false)} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569]">Cancel</button>
              <button onClick={handleCreateProduct} className="flex-1 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors">Save Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Price Modal */}
      {showAddPrice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Add Price Record</h3>
              <button onClick={() => setShowAddPrice(false)} className="text-[#94A3B8] hover:text-[#64748B] text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Select Product</label>
                <select value={newPrice.product_id} onChange={e => setNewPrice({...newPrice, product_id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-white">
                  <option value="">Choose a product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Select Branch</label>
                <select value={newPrice.branch_id} onChange={e => setNewPrice({...newPrice, branch_id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-white">
                  <option value="1">Shoprite - Manda Hill</option>
                  <option value="2">Shoprite - Cairo Road</option>
                  <option value="3">Choppies - Kabwata</option>
                  <option value="4">Choppies - Woodlands</option>
                  <option value="5">Pick n Pay - Makeni</option>
                  <option value="6">Pick n Pay - Arcades</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Quantity</label>
                  <input type="number" value={newPrice.quantity} onChange={e => setNewPrice({...newPrice, quantity: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Unit</label>
                  <select value={newPrice.unit} onChange={e => setNewPrice({...newPrice, unit: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-white">
                    <option value="item">Item</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Price (ZMW)</label>
                <input type="number" value={newPrice.price} onChange={e => setNewPrice({...newPrice, price: e.target.value})} placeholder="e.g. 185.50" className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddPrice(false)} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569]">Cancel</button>
              <button onClick={handleAddPrice} className="flex-1 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors">Save Price</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}