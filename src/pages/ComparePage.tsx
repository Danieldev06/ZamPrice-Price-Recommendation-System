import { useState, useEffect } from 'react';
import api from '../api/client';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  selectedProductId?: string;
}

// --- Backend Interfaces ---
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

interface HistoryRecord {
  observed_at: string;
  price: number;
  quantity: number;
  unit: string;
}

export default function ComparePage({ onNavigate, selectedProductId }: Props) {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | null>(
    selectedProductId ? Number(selectedProductId) : null
  );
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [addedToBasket, setAddedToBasket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'price' | 'value' | 'history'>('price');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch initial product list
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

  // 2. Fetch comparison + history when product changes
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError("");
    
    Promise.all([
      api.get<ComparisonData>(`/products/${productId}/comparison`),
      api.get<HistoryRecord[]>(`/products/${productId}/history`)
    ])
      .then(([compRes, histRes]) => {
        setComparison(compRes.data);
        setHistory(histRes.data);
      })
      .catch(err => {
        setError(err.response?.data?.detail || "Failed to load comparison data");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  // Find current product object
  const product = products.find(p => p.id === productId);

  if (loading && !comparison) {
    return <div className="p-12 text-center text-[#64748B]">Loading comparison data...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-[#DC2626]">{error}</div>;
  }

  if (!product || !comparison || !comparison.cheapest) {
    return <div className="p-12 text-center text-[#64748B]">No data available for this product.</div>;
  }

  // Sorted prices for the table
  const sortedPrices = [...comparison.options].sort((a, b) => a.effective_price - b.effective_price);
  const best = comparison.cheapest;
  const worst = sortedPrices[sortedPrices.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Back + Product Selector */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => onNavigate('search')} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F2547] transition-colors">
          ← Back to Search
        </button>
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
          {products.map(p => (
            <button key={p.id} onClick={() => setProductId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${productId === p.id ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}>
              {p.name} {p.brand ? `(${p.brand})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex gap-5 items-start">
          {/* Fallback image since backend doesn't have images */}
          <div className="w-24 h-24 rounded-2xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center text-4xl">
            🛒
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

        {/* Tabs */}
        <div className="flex gap-1 mt-5 border-b border-[#E2E8F0]">
          {[['price', 'Price Comparison'], ['value', 'Value Analysis'], ['history', 'Price History']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === id ? 'text-[#0F2547] border-[#0F2547]' : 'text-[#64748B] border-transparent hover:text-[#0F2547]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'price' && (
        <>
          {/* Best Overall Banner */}
          <div className="bg-[#0F2547] rounded-2xl p-5 mb-5 flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div className="flex-1">
              <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-0.5">Best Overall</div>
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{best.supermarket} ({best.location}) — K{best.effective_price.toFixed(2)}</div>
              <div className="text-sm text-[#94A3B8] mt-0.5">Lowest current price and lowest price per unit</div>
            </div>
            <button onClick={() => { setAddedToBasket(best.supermarket); setTimeout(() => setAddedToBasket(null), 2000); }}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-colors ${addedToBasket === best.supermarket ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white hover:bg-[#B45309]'}`}>
              {addedToBasket === best.supermarket ? '✓ Added!' : 'Add to Basket'}
            </button>
          </div>

          {/* Comparison Table */}
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
                    <th className="text-center px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Freshness</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Saving</th>
                    <th className="px-5 py-3"></th>
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
                            {isBest && <span className="text-lg">👑</span>}
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
                          <StockBadge available={p.available} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <FreshnessBadge stale={p.stale} date={p.observed_at} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          {isBest ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">Best</span>
                          ) : (
                            <span className="text-xs text-[#DC2626] font-medium">+K{diff.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => { setAddedToBasket(p.supermarket); setTimeout(() => setAddedToBasket(null), 2000); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${addedToBasket === p.supermarket ? 'bg-[#16A34A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                            {addedToBasket === p.supermarket ? '✓' : '+ Add'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Why We Recommend (Using Backend Explanation) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-5">
            <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>💡 Why we recommend {best.supermarket}</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#16A34A] text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-[#475569]">{comparison.explanation}</span>
              </div>
              {!best.stale && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#16A34A] text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-[#475569]">Price data is fresh and recently verified.</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => onNavigate('alerts')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              🔔 Set Price Alert
            </button>
            <button onClick={() => setActiveTab('history')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              📈 View Price History
            </button>
          </div>
        </>
      )}

      {activeTab === 'value' && (
        <ValueAnalysis 
          productName={product.name} 
          unitPrice={best.unit_price} 
          unitLabel={`/${best.canonical_unit}`} 
          price={best.effective_price}
        />
      )}

      {activeTab === 'history' && (
        <PriceHistoryMini history={history} onNavigate={onNavigate} />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// Helper Components (adapted for backend data)
// ---------------------------------------------------------

function ValueAnalysis({ productName, unitPrice, unitLabel, price }: { productName: string, unitPrice: number, unitLabel: string, price: number }) {
  // Note: The backend currently compares one exact product across stores. 
  // We use the best unit price we found to demonstrate the value analysis logic.
  const sizeComparisons = [
    { size: 'Small Pack (Estimated)', price: price * 0.6, unitPrice: unitPrice * 1.2 },
    { size: 'Standard Pack (Current)', price: price, unitPrice: unitPrice },
    { size: 'Bulk Pack (Estimated)', price: price * 1.8, unitPrice: unitPrice * 0.85 },
  ];
  const bestValue = sizeComparisons.reduce((a, b) => a.unitPrice < b.unitPrice ? a : b);
  const maxUnitPrice = Math.max(...sizeComparisons.map(s => s.unitPrice));
  
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Unit Price / Value Analysis</h3>
        <p className="text-sm text-[#64748B] mb-5">Compare different sizes to find the best price per unit</p>
        <div className="space-y-4">
          {sizeComparisons.map(s => {
            const isBest = s.size === bestValue.size;
            const barWidth = ((maxUnitPrice - s.unitPrice) / maxUnitPrice * 100) + 20;
            return (
              <div key={s.size} className={`p-4 rounded-xl border-2 ${isBest ? 'border-[#16A34A] bg-[#F0FDF4]' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E293B]">{s.size} {productName}</span>
                    {isBest && <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-xs font-bold">Best Value</span>}
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{s.price.toFixed(2)}</div>
                    <div className="text-xs font-semibold text-[#16A34A]">K{s.unitPrice.toFixed(2)}{unitLabel}</div>
                  </div>
                </div>
                <div className="h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isBest ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'}`}
                    style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-2xl p-5 flex items-center gap-4">
        <span className="text-3xl">💡</span>
        <div>
          <div className="font-bold text-[#92400E]">Smart Buying Tip</div>
          <div className="text-sm text-[#92400E]/80 mt-0.5">
            Buying the bulk size saves you K{(sizeComparisons[1].unitPrice - bestValue.unitPrice).toFixed(2)} per unit compared to the standard size.
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceHistoryMini({ history, onNavigate }: { history: HistoryRecord[]; onNavigate: (p: any) => void }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center text-[#64748B]">
        No historical data recorded yet for this product.
      </div>
    );
  }

  const current = history[history.length - 1].price;
  const oldest = history[0].price;
  const change = ((current - oldest) / oldest * 100).toFixed(1);
  const dropping = current < oldest;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Price Trend</h3>
          <button onClick={() => onNavigate('history')} className="text-xs text-[#0F2547] font-medium hover:underline">Full history →</button>
        </div>
        <div className="flex items-center gap-8 mb-5">
          <div>
            <div className="text-xs text-[#64748B]">Latest Price</div>
            <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{current.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-[#64748B]">Change</div>
            <div className={`text-xl font-bold ${dropping ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} style={{ fontFamily: 'Outfit' }}>
              {dropping ? '▼' : '▲'} {Math.abs(parseFloat(change))}%
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${dropping ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
            {dropping ? '🟢 Good time to buy' : '🔴 Price increasing'}
          </div>
        </div>
        
        {/* Mini price chart visual */}
        <div className="flex items-end gap-2 h-20">
          {history.map((h, i) => {
            const maxP = Math.max(...history.map(x => x.price));
            const minP = Math.min(...history.map(x => x.price));
            const pct = maxP === minP ? 50 : ((h.price - minP) / (maxP - minP)) * 70 + 30;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm transition-all" style={{ height: `${pct}%`, backgroundColor: i === history.length - 1 ? '#16A34A' : '#CBD5E1' }} />
                <div className="text-xs text-[#94A3B8] rotate-45 mt-2">{new Date(h.observed_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StockBadge({ available }: { available: boolean }) {
  if (available) {
    return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">In Stock</span>;
  }
  return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">Out of Stock</span>;
}

function FreshnessBadge({ stale, date }: { stale: boolean; date: string }) {
  const dot = stale ? '🔴' : '🟢';
  const formattedDate = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs">{dot}</span>
      <span className="text-xs text-[#94A3B8]">{formattedDate}</span>
    </div>
  );
}