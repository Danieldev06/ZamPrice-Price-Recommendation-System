import { useState, useEffect } from 'react';
import api from '../api/client';
import { ShoppingBasket, Zap, Wallet, Crown, TrendingDown, Trash2 } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

interface Product {
  id: number;
  name: string;
  brand: string | null;
}

interface PriceOption {
  supermarket: string;
  effective_price: number;
  unit_price: number;
  canonical_unit: string;
}

interface BasketItem {
  product: Product;
  qty: number;
  selectedStore: string;
  prices: PriceOption[];
}

export default function BasketPage({ onNavigate }: Props) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBasket() {
      try {
        const prodRes = await api.get<Product[]>('/products');
        const topProducts = prodRes.data.slice(0, 3);

        const loadedItems: BasketItem[] = [];
        for (const p of topProducts) {
          const compRes = await api.get(`/products/${p.id}/comparison`);
          if (compRes.data.options && compRes.data.options.length > 0) {
            const sortedPrices = [...compRes.data.options].sort((a, b) => a.effective_price - b.effective_price);
            loadedItems.push({
              product: p,
              qty: 1,
              selectedStore: sortedPrices[0].supermarket,
              prices: sortedPrices,
            });
          }
        }
        setItems(loadedItems);
      } catch (err) {
        console.error("Failed to load basket data", err);
      } finally {
        setLoading(false);
      }
    }
    loadBasket();
  }, []);

  const getPrice = (item: BasketItem) => {
    return item.prices.find(p => p.supermarket === item.selectedStore)?.effective_price ?? item.prices[0].effective_price;
  };

  const total = items.reduce((sum, item) => sum + getPrice(item) * item.qty, 0);
  const bestTotal = items.reduce((sum, item) => {
    const best = Math.min(...item.prices.map(p => p.effective_price));
    return sum + best * item.qty;
  }, 0);
  const worstTotal = items.reduce((sum, item) => {
    const worst = Math.max(...item.prices.map(p => p.effective_price));
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

  const handleOptimise = () => {
    const basketData = items.map(i => ({ product_id: i.product.id, quantity: i.qty }));
    localStorage.setItem('zamprice_basket', JSON.stringify(basketData));
    onNavigate('optimise');
  };

  if (loading) return <div className="p-12 text-center text-[#64748B]">Loading basket...</div>;

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
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, idx) => {
            const currentPrice = getPrice(item);
            const best = Math.min(...item.prices.map(p => p.effective_price));
            const isBest = currentPrice === best;

            return (
              <div key={item.product.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                    <ShoppingBasket className="text-[#CBD5E1]" size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>
                          {item.product.name}
                        </div>
                        <div className="text-xs text-[#64748B]">{item.product.brand || 'Generic'}</div>
                      </div>
                      <button onClick={() => removeItem(idx)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.prices.map((p, i) => (
                        <button key={p.supermarket}
                          onClick={() => setItems(prev => prev.map((it, ix) => ix === idx ? { ...it, selectedStore: p.supermarket } : it))}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${item.selectedStore === p.supermarket ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                          {i === 0 && <Crown size={12} className="text-[#D97706]" />}
                          {p.supermarket}
                          <span className={`font-bold ${i === 0 ? 'text-[#4ADE80]' : ''}`}>K{p.effective_price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(idx, -1)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors text-sm font-bold">−</button>
                    <span className="text-sm font-semibold w-4 text-center text-[#1E293B]">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors text-sm font-bold">+</button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{(currentPrice * item.qty).toFixed(2)}</div>
                    {!isBest && (
                      <div className="text-xs text-[#D97706]">K{((currentPrice - best) * item.qty).toFixed(2)} more than best</div>
                    )}
                    {isBest && (
                      <div className="text-xs text-[#16A34A] font-medium flex items-center justify-end gap-1">
                         <Crown size={12} /> Best price
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]">
              <div className="flex justify-center mb-4">
                <ShoppingBasket className="text-[#CBD5E1]" size={64} />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>Your basket is empty</h3>
              <p className="text-sm text-[#64748B] mb-4">Start comparing prices to add products</p>
              <button onClick={() => onNavigate('search')} className="px-6 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Browse Products</button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F2547] mb-4" style={{ fontFamily: 'Outfit' }}>Basket Summary</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal ({items.length} items)</span>
                <span className="font-semibold text-[#1E293B]">K{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Best possible total</span>
                <span className="font-semibold text-[#16A34A]">K{bestTotal.toFixed(2)}</span>
              </div>
              <div className="h-px bg-[#F1F5F9]" />
              <div className="flex justify-between">
                <span className="font-semibold text-[#1E293B]">Current total</span>
                <span className="text-xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{total.toFixed(2)}</span>
              </div>
            </div>

            {saving > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DCFCE7] mb-4">
                <TrendingDown size={20} className="text-[#16A34A]" />
                <div>
                  <div className="text-sm font-bold text-[#16A34A]">Potential K{saving.toFixed(2)} savings</div>
                  <div className="text-xs text-[#16A34A]/70">by optimising across stores</div>
                </div>
              </div>
            )}

            <button onClick={handleOptimise} className="w-full py-3.5 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors mb-2 flex items-center justify-center gap-2">
              <Zap size={18} /> Optimise My Basket
            </button>
            <button onClick={() => onNavigate('budget')} className="w-full py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2">
              <Wallet size={18} /> Smart Budget Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}