import { useState, useEffect } from 'react';
import api from '../api/client';
import { ShoppingBasket, Award, Crown, Lightbulb, Bell, TrendingUp } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  selectedProductId?: string;
}

interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  base_unit: string;
}

interface PriceOption {
  branch_id: number;
  supermarket: string;
  location: string;
  price: number;
  promotional_price: number | null;
  effective_price: number;
  quantity: number;
  unit: string;
  unit_price: number;
  canonical_unit: string;
  available: boolean;
  observed_at: string;
  stale: boolean;
  saving_vs_best: number;
  is_best_total: boolean;
  is_best_unit: boolean;
}

interface ComparisonData {
  product_id: number;
  product_name: string;
  options: PriceOption[];
  cheapest: PriceOption | null;
  best_value: PriceOption | null;
  explanation: string;
}

export default function ComparePage({ onNavigate, selectedProductId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | null>(
    selectedProductId ? Number(selectedProductId) : null
  );
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [addedToBasket, setAddedToBasket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'price' | 'history'>('price');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => {
        setProducts(res.data);
        if (!productId && res.data.length > 0) {
          setProductId(res.data[0].id);
        }
      })
      .catch(() => setError("Failed to load products"));
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError("");
    
    api.get<ComparisonData>(`/products/${productId}/comparison`)
      .then((compRes) => {
        setComparison(compRes.data);
      })
      .catch(err => {
        setError(err.response?.data?.detail || "Failed to load comparison data");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const product = products.find(p => p.id === productId);

  if (loading && !comparison) return <div className="p-12 text-center text-[#64748B]">Loading comparison data...</div>;
  if (error) return <div className="p-12 text-center text-[#DC2626]">{error}</div>;
  if (!product || !comparison || !comparison.cheapest) return <div className="p-12 text-center text-[#64748B]">No data available for this product.</div>;

  const sortedPrices = [...comparison.options].sort((a, b) => a.effective_price - b.effective_price);
  const best = comparison.cheapest;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
          {products.map(p => (
            <button key={p.id} onClick={() => setProductId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${productId === p.id ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex gap-5 items-start">
          <div className="w-24 h-24 rounded-2xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
            <ShoppingBasket size={48} className="text-[#CBD5E1]" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#64748B] font-medium uppercase tracking-wide mb-1">{product.category || 'General'}</div>
            <h1 className="text-2xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>
              {product.name}
            </h1>
            <div className="text-sm text-[#64748B]">Brand: <span className="font-medium text-[#1E293B]">{product.brand || 'Generic'}</span></div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{best.effective_price.toFixed(2)}</span>
              <div>
                <div className="text-xs text-[#64748B]">Best price at <span className="font-semibold text-[#0F2547]">{best.supermarket}</span></div>
                <div className="text-xs text-[#16A34A] font-medium">K{best.unit_price.toFixed(2)}/{best.canonical_unit}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'price' && (
        <>
          <div className="bg-[#0F2547] rounded-2xl p-5 mb-5 flex items-center gap-4">
            <Award size={32} className="text-[#D97706]" />
            <div className="flex-1">
              <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-0.5">Best Overall</div>
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{best.supermarket} ({best.location}) — K{best.effective_price.toFixed(2)}</div>
              <div className="text-sm text-[#94A3B8] mt-0.5">Lowest current price and lowest price per unit</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Price Comparison Across Stores</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Supermarket</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Price</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Unit Price</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Stock</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Saving</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrices.map((p, i) => {
                    const isBest = i === 0;
                    const diff = p.effective_price - best.effective_price;
                    return (
                      <tr key={p.branch_id} className={`border-t border-[#F1F5F9] ${isBest ? 'bg-[#F0FDF4]' : 'hover:bg-[#F8FAFC]'}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {isBest && <Crown size={20} className="text-[#D97706]" />}
                            <div>
                              <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{p.supermarket}</div>
                              <div className="text-xs text-[#64748B]">{p.location}</div>
                              {p.promotional_price && <div className="text-xs text-[#D97706] font-medium mt-1">Promo Price!</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-lg font-black ${isBest ? 'text-[#16A34A]' : 'text-[#1E293B]'}`} style={{ fontFamily: 'Outfit' }}>
                            K{p.effective_price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-medium text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            K{p.unit_price.toFixed(2)}/{p.canonical_unit}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${p.available ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                            {p.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {isBest ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">Best</span>
                          ) : (
                            <span className="text-xs text-[#DC2626] font-medium">+K{diff.toFixed(2)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-[#D97706]" size={20} />
              <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Why we recommend {best.supermarket}</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#16A34A] text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-[#475569]">{comparison.explanation}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onNavigate('alerts')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2">
              <Bell size={18} /> Set Price Alert
            </button>
            <button onClick={() => onNavigate('history')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2">
              <TrendingUp size={18} /> View Price History
            </button>
          </div>
        </>
      )}
    </div>
  );
}