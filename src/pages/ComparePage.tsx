import { useState } from 'react';
import { PRODUCTS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
  selectedProductId?: string;
}

export default function ComparePage({ onNavigate, selectedProductId }: Props) {
  const [productId, setProductId] = useState(selectedProductId || 'p1');
  const [addedToBasket, setAddedToBasket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'price' | 'value' | 'history'>('price');

  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
  const best = sortedPrices[0];
  const bestStore = STORES.find(s => s.id === best.storeId)!;
  const worst = sortedPrices[sortedPrices.length - 1];
  const saving = worst.price - best.price;

  // Size comparisons for value analysis
  const sizeComparisons = [
    { size: '1kg', price: product.id === 'p1' ? 45 : 28, unitPrice: product.id === 'p1' ? 45 : 28 },
    { size: '2kg', price: product.id === 'p1' ? 80 : 52, unitPrice: product.id === 'p1' ? 40 : 26 },
    { size: product.quantity, price: best.price, unitPrice: best.unitPrice },
  ];
  const bestValue = sizeComparisons.reduce((a, b) => a.unitPrice < b.unitPrice ? a : b);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Back + Product Selector */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => onNavigate('search')} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F2547] transition-colors">
          ← Back to Search
        </button>
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
          {PRODUCTS.map(p => (
            <button key={p.id} onClick={() => setProductId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${productId === p.id ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}>
              {p.quantity} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex gap-5 items-start">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#64748B] font-medium uppercase tracking-wide mb-1">{product.category}</div>
            <h1 className="text-2xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>
              {product.quantity} {product.name}
            </h1>
            <div className="text-sm text-[#64748B]">Brand: <span className="font-medium text-[#1E293B]">{product.brand}</span></div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{best.price}</span>
              <div>
                <div className="text-xs text-[#64748B]">Best price at <span className="font-semibold text-[#0F2547]">{bestStore.name}</span></div>
                <div className="text-xs text-[#16A34A] font-medium">K{best.unitPrice.toFixed(1)}{best.unitLabel}</div>
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
              <div className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{bestStore.name} — K{best.price}</div>
              <div className="text-sm text-[#94A3B8] mt-0.5">Lowest current price and lowest price per unit</div>
            </div>
            <button onClick={() => { setAddedToBasket(best.storeId); setTimeout(() => setAddedToBasket(null), 2000); }}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-colors ${addedToBasket === best.storeId ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white hover:bg-[#B45309]'}`}>
              {addedToBasket === best.storeId ? '✓ Added!' : 'Add to Basket'}
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
                    const store = STORES.find(s => s.id === p.storeId)!;
                    const diff = p.price - best.price;
                    const isBest = i === 0;
                    return (
                      <tr key={p.storeId} className={`border-t border-[#F1F5F9] ${isBest ? 'bg-[#F0FDF4]' : 'hover:bg-[#F8FAFC]'}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {isBest && <span className="text-lg">🏆</span>}
                            <div>
                              <div className="font-semibold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{store.name}</div>
                              {p.promotion && <div className="text-xs text-[#D97706] font-medium">{p.promotion}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-lg font-black ${isBest ? 'text-[#16A34A]' : 'text-[#1E293B]'}`} style={{ fontFamily: 'Outfit' }}>
                            K{p.price}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-medium text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>K{p.unitPrice.toFixed(1)}{p.unitLabel}</span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <StockBadge stock={p.stock} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <FreshnessBadge freshness={p.freshness} updatedAgo={p.updatedAgo} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          {isBest ? (
                            <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">Best</span>
                          ) : (
                            <span className="text-xs text-[#DC2626] font-medium">+K{diff}</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => { setAddedToBasket(p.storeId); setTimeout(() => setAddedToBasket(null), 2000); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${addedToBasket === p.storeId ? 'bg-[#16A34A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                            {addedToBasket === p.storeId ? '✓' : '+ Add'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Why We Recommend */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-5">
            <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>🏆 Why we recommend {bestStore.name}</h3>
            <div className="space-y-2.5">
              {[
                `Lowest current price at K${best.price}`,
                `Lowest price per unit at K${best.unitPrice.toFixed(1)}${best.unitLabel}`,
                `Product currently ${best.stock === 'in_stock' ? 'fully in stock' : 'in limited stock'}`,
                saving > 0 ? `K${saving} cheaper than ${STORES.find(s => s.id === worst.storeId)?.name}` : null,
                `Price data updated ${best.updatedAgo}`,
                `Price is currently below the 30-day average`,
              ].filter(Boolean).map((reason, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#16A34A] text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-[#475569]">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => onNavigate('alerts')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              🔔 Set Price Alert
            </button>
            <button onClick={() => onNavigate('history')} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              📊 View Price History
            </button>
          </div>
        </>
      )}

      {activeTab === 'value' && (
        <ValueAnalysis product={product} sizeComparisons={sizeComparisons} bestValue={bestValue} />
      )}

      {activeTab === 'history' && (
        <PriceHistoryMini product={product} onNavigate={onNavigate} />
      )}
    </div>
  );
}

function ValueAnalysis({ product, sizeComparisons, bestValue }: { product: typeof PRODUCTS[0]; sizeComparisons: { size: string; price: number; unitPrice: number }[]; bestValue: { size: string; price: number; unitPrice: number } }) {
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
                    <span className="font-bold text-sm text-[#1E293B]">{s.size} {product.name}</span>
                    {isBest && <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-xs font-bold">Best Value</span>}
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{s.price}</div>
                    <div className="text-xs font-semibold text-[#16A34A]">K{s.unitPrice.toFixed(1)}/kg</div>
                  </div>
                </div>
                <div className="h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isBest ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'}`}
                    style={{ width: `${barWidth}%` }} />
                </div>
                <div className="text-xs text-[#64748B] mt-1.5">
                  {isBest ? '✓ Cheapest per kg — best value' : `K${(s.unitPrice - bestValue.unitPrice).toFixed(1)}/kg more expensive than ${bestValue.size}`}
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
            Buying the {bestValue.size} size saves you K{(sizeComparisons[0].unitPrice - bestValue.unitPrice).toFixed(1)} per kg compared to the smallest size. Over a month, that could be K30+ in savings.
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceHistoryMini({ product, onNavigate }: { product: typeof PRODUCTS[0]; onNavigate: (p: any) => void }) {
  const history = product.priceHistory;
  const current = history[history.length - 1].shoprite;
  const oldest = history[0].shoprite;
  const change = ((current - oldest) / oldest * 100).toFixed(1);
  const dropping = current < oldest;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>30-Day Price Trend</h3>
          <button onClick={() => onNavigate('history')} className="text-xs text-[#0F2547] font-medium hover:underline">Full history →</button>
        </div>
        <div className="flex items-center gap-8 mb-5">
          <div>
            <div className="text-xs text-[#64748B]">Current (Shoprite)</div>
            <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{current}</div>
          </div>
          <div>
            <div className="text-xs text-[#64748B]">30-Day Change</div>
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
            const maxP = Math.max(...history.map(x => x.shoprite));
            const minP = Math.min(...history.map(x => x.shoprite));
            const pct = ((h.shoprite - minP) / (maxP - minP)) * 70 + 30;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm transition-all" style={{ height: `${pct}%`, backgroundColor: i === history.length - 1 ? '#16A34A' : '#CBD5E1' }} />
                <div className="text-xs text-[#94A3B8]">{h.date.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: string }) {
  const config = {
    in_stock: { label: 'In Stock', color: 'bg-[#DCFCE7] text-[#16A34A]' },
    limited: { label: 'Limited', color: 'bg-[#FEF3C7] text-[#D97706]' },
    out_of_stock: { label: 'Out of Stock', color: 'bg-[#FEE2E2] text-[#DC2626]' },
  }[stock] ?? { label: stock, color: 'bg-[#F1F5F9] text-[#64748B]' };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${config.color}`}>{config.label}</span>;
}

function FreshnessBadge({ freshness, updatedAgo }: { freshness: string; updatedAgo: string }) {
  const dot = { fresh: '🟢', recent: '🟡', stale: '🔴' }[freshness] ?? '⚪';
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs">{dot}</span>
      <span className="text-xs text-[#94A3B8]">{updatedAgo}</span>
    </div>
  );
}
