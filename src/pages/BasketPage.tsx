import { useState } from 'react';
import { PRODUCTS, STORES, BASKET_ITEMS } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function BasketPage({ onNavigate }: Props) {
  const [items, setItems] = useState(
    BASKET_ITEMS.map(b => {
      const product = PRODUCTS.find(p => p.id === b.productId)!;
      const best = [...product.prices].sort((a, z) => a.price - z.price)[0];
      return { ...b, product, selectedStore: best.storeId, qty: 1 };
    })
  );

  const getPrice = (item: typeof items[0]) => {
    return item.product.prices.find(p => p.storeId === item.selectedStore)?.price ?? item.product.prices[0].price;
  };

  const total = items.reduce((sum, item) => sum + getPrice(item) * item.qty, 0);
  const bestTotal = items.reduce((sum, item) => {
    const best = Math.min(...item.product.prices.map(p => p.price));
    return sum + best * item.qty;
  }, 0);
  const worstTotal = items.reduce((sum, item) => {
    const worst = Math.max(...item.product.prices.map(p => p.price));
    return sum + worst * item.qty;
  }, 0);
  const saving = worstTotal - bestTotal;

  const updateQty = (idx: number, delta: number) => {
    setItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>My Shopping Basket</h1>
          <p className="text-sm text-[#64748B]">{items.length} items · Compare and optimise your basket</p>
        </div>
        <button onClick={() => onNavigate('search')} className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          + Add Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, idx) => {
            const prices = [...item.product.prices].sort((a, b) => a.price - b.price);
            const best = prices[0];
            const currentPrice = getPrice(item);
            const currentStore = STORES.find(s => s.id === item.selectedStore);
            const isBest = item.selectedStore === best.storeId;

            return (
              <div key={item.productId} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>
                          {item.product.quantity} {item.product.name}
                        </div>
                        <div className="text-xs text-[#64748B]">{item.product.brand}</div>
                      </div>
                      <button onClick={() => removeItem(idx)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors text-lg leading-none">×</button>
                    </div>

                    {/* Store Selector */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {prices.map((p, i) => {
                        const store = STORES.find(s => s.id === p.storeId)!;
                        return (
                          <button key={p.storeId}
                            onClick={() => setItems(prev => prev.map((it, ix) => ix === idx ? { ...it, selectedStore: p.storeId } : it))}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${item.selectedStore === p.storeId ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                            {i === 0 && <span className="text-[#D97706]">★</span>}
                            {store.name}
                            <span className={`font-bold ${i === 0 ? 'text-[#4ADE80]' : ''}`}>K{p.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                  {/* Qty Controls */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(idx, -1)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors text-sm font-bold">−</button>
                    <span className="text-sm font-semibold w-4 text-center text-[#1E293B]">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors text-sm font-bold">+</button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{currentPrice * item.qty}</div>
                    {!isBest && (
                      <div className="text-xs text-[#D97706]">K{(currentPrice - best.price) * item.qty} more than best</div>
                    )}
                    {isBest && (
                      <div className="text-xs text-[#16A34A] font-medium">✓ Best price</div>
                    )}
                  </div>
                </div>

                {currentStore && (
                  <div className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1">
                    Buying from <span className="font-medium text-[#64748B]">{currentStore.name}</span>
                  </div>
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>Your basket is empty</h3>
              <p className="text-sm text-[#64748B] mb-4">Start comparing prices to add products</p>
              <button onClick={() => onNavigate('search')} className="px-6 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Browse Products</button>
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>Basket Summary</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal ({items.length} items)</span>
                <span className="font-semibold text-[#1E293B]">K{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Best possible total</span>
                <span className="font-semibold text-[#16A34A]">K{bestTotal}</span>
              </div>
              <div className="h-px bg-[#F1F5F9]" />
              <div className="flex justify-between">
                <span className="font-semibold text-[#1E293B]">Current total</span>
                <span className="text-xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{total}</span>
              </div>
            </div>

            {saving > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DCFCE7] mb-4">
                <span className="text-xl">💰</span>
                <div>
                  <div className="text-sm font-bold text-[#16A34A]">Potential K{saving} savings</div>
                  <div className="text-xs text-[#16A34A]/70">by optimising across stores</div>
                </div>
              </div>
            )}

            <button onClick={() => onNavigate('optimise')}
              className="w-full py-3.5 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors mb-2">
              🏆 Optimise My Basket
            </button>
            <button onClick={() => onNavigate('budget')}
              className="w-full py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              💡 Smart Budget Mode
            </button>
          </div>

          {/* Store Breakdown */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F2547] mb-3" style={{ fontFamily: 'Outfit' }}>Buy From</h3>
            {Array.from(new Set(items.map(i => i.selectedStore))).map(storeId => {
              const store = STORES.find(s => s.id === storeId)!;
              const storeItems = items.filter(i => i.selectedStore === storeId);
              const storeTotal = storeItems.reduce((sum, i) => sum + getPrice(i) * i.qty, 0);
              return (
                <div key={storeId} className="flex items-center justify-between py-2.5 border-b border-[#F1F5F9] last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-[#1E293B]">{store.name}</div>
                    <div className="text-xs text-[#64748B]">{storeItems.length} items</div>
                  </div>
                  <span className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{storeTotal}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button onClick={() => onNavigate('location')} className="flex-1 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors">
              📍 Find Stores
            </button>
            <button onClick={() => onNavigate('alerts')} className="flex-1 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors">
              🔔 Set Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
