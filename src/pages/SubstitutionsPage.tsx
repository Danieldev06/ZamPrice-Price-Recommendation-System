import { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, ShoppingBasket, TrendingDown, Award, ArrowRight, RefreshCw, Info, Check } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

// --- Backend Interfaces ---
interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
}

interface Alternative {
  product_id: number;
  product_name: string;
  best_unit_price: number;
  saving_per_unit: number;
  canonical_unit: string;
  store: string;
}

interface ProductEntry {
  id: number;
  name: string;
  brand: string;
  category: string;
  currentPrice: number;
  store: string;
  quantity: number;
  unitLabel: string;
  substitutes: Alternative[];
}

export default function SubstitutionsPage({ onNavigate }: Props) {
  const [productList, setProductList] = useState<ProductEntry[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [addedToBasket, setAddedToBasket] = useState<number | null>(null);

  // 1. Fetch initial product list with their current best prices
  useEffect(() => {
    async function loadInitialData() {
      try {
        const prodRes = await api.get<Product[]>('/products');
        
        const enriched = await Promise.all(prodRes.data.map(async (p) => {
          const compRes = await api.get(`/products/${p.id}/comparison`);
          const cheapest = compRes.data.cheapest;
          if (!cheapest) return null;

          return {
            id: p.id,
            name: p.name,
            brand: p.brand || 'Generic',
            category: p.category || 'General',
            currentPrice: cheapest.effective_price,
            store: cheapest.supermarket,
            quantity: cheapest.quantity,
            unitLabel: cheapest.canonical_unit,
            substitutes: [] // Loaded later
          } as ProductEntry;
        }));

        const validProducts = enriched.filter((p): p is ProductEntry => p !== null);
        setProductList(validProducts);
        if (validProducts.length > 0) {
          setSelectedProductId(validProducts[0].id);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // 2. Fetch alternatives when a product is selected
  useEffect(() => {
    if (!selectedProductId) return;
    
    async function loadAlternatives() {
      setLoadingAlternatives(true);
      try {
        const res = await api.get(`/products/${selectedProductId}/alternatives`);
        const alts = res.data.alternatives || [];
        
        // Update the specific product in our list with its alternatives
        setProductList(prev => prev.map(p => 
          p.id === selectedProductId ? { ...p, substitutes: alts } : p
        ));
      } catch (err) {
        console.error("Failed to load alternatives", err);
      } finally {
        setLoadingAlternatives(false);
      }
    }
    loadAlternatives();
  }, [selectedProductId]);

  const handleAdd = (id: number) => {
    setAddedToBasket(id);
    setTimeout(() => setAddedToBasket(null), 2000);
  };

  if (loading) return <div className="p-12 text-center text-[#64748B]">Loading alternatives...</div>;

  const selectedProduct = productList.find(p => p.id === selectedProductId);
  const maxSaving = selectedProduct && selectedProduct.substitutes.length > 0
    ? Math.max(...selectedProduct.substitutes.map(s => s.saving_per_unit), 0)
    : 0;

  const filteredProducts = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={24} className="text-[#0F2547]" />
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
            Find Cheaper Alternatives
          </h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-xl">
          Discover products that fulfil the same need at a lower unit price. Substitutes are matched strictly by category and type.
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">✕</button>
          )}
        </div>
        <button onClick={() => onNavigate('basket')} className="px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          From Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product Sidebar */}
        <div className="lg:col-span-1">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Your Products</div>
          <div className="space-y-2">
            {filteredProducts.map(p => {
              // Find max saving in this product's substitutes (if loaded)
              const localMax = p.substitutes.length > 0 ? Math.max(...p.substitutes.map(s => s.saving_per_unit)) : 0;
              
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedProductId === p.id ? 'border-[#0F2547] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#0F2547]/30'}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                    <ShoppingBasket size={20} className="text-[#94A3B8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold truncate ${selectedProductId === p.id ? 'text-[#0F2547]' : 'text-[#1E293B]'}`}>{p.name}</div>
                    <div className="text-xs text-[#94A3B8]">{p.store} · K{p.currentPrice.toFixed(2)}</div>
                  </div>
                  {localMax > 0 && (
                    <span className="text-xs font-bold text-[#16A34A] flex-shrink-0">
                      Save K{localMax.toFixed(2)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedProduct ? (
            <>
              {/* Current Product Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-5">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                    <ShoppingBasket size={48} className="text-[#CBD5E1]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-0.5">{selectedProduct.category}</div>
                    <h2 className="text-xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>{selectedProduct.name}</h2>
                    <div className="text-sm text-[#64748B]">{selectedProduct.brand}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div>
                        <div className="text-xs text-[#94A3B8]">Current lowest price</div>
                        <div className="text-2xl font-black text-[#DC2626]" style={{ fontFamily: 'Outfit' }}>K{selectedProduct.currentPrice.toFixed(2)}</div>
                        <div className="text-xs text-[#64748B]">at {selectedProduct.store}</div>
                      </div>
                      {maxSaving > 0 && (
                        <div className="ml-4 px-4 py-2.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0]">
                          <div className="text-xs text-[#16A34A] font-medium">Best alternative saves</div>
                          <div className="text-xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{maxSaving.toFixed(2)}/{selectedProduct.unitLabel}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Substitutes */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
                  {loadingAlternatives ? 'Searching...' : `${selectedProduct.substitutes.length} Alternative${selectedProduct.substitutes.length !== 1 ? 's' : ''} Found`}
                </h3>
                <div className="text-xs text-[#94A3B8] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0] flex items-center gap-1.5">
                  <Info size={14} /> Matched strictly by category
                </div>
              </div>

              {loadingAlternatives ? (
                <div className="py-8 text-center text-[#94A3B8]">Finding cheaper options...</div>
              ) : selectedProduct.substitutes.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-2xl border border-[#E2E8F0]">
                  <Search size={48} className="text-[#CBD5E1] mx-auto mb-3" />
                  <div className="text-[#1E293B] font-semibold mb-1">No cheaper alternatives found</div>
                  <div className="text-sm text-[#64748B]">This product is already the most cost-effective option in its category.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProduct.substitutes.map((sub) => {
                    const isBestSaving = sub.saving_per_unit === maxSaving && sub.saving_per_unit > 0;
                    const added = addedToBasket === sub.product_id;

                    return (
                      <div
                        key={sub.product_id}
                        className={`bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-sm ${isBestSaving ? 'border-[#16A34A]/40' : 'border-[#E2E8F0]'}`}
                      >
                        {isBestSaving && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] mb-3">
                            <Award size={16} />
                            Best Alternative
                          </div>
                        )}

                        <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                          <div className="w-16 h-16 rounded-xl bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                            <ShoppingBasket size={32} className="text-[#CBD5E1]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap mb-1">
                              <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{sub.product_name}</div>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 bg-[#DBEAFE] text-[#0F2547]">
                                Very Similar
                              </span>
                            </div>
                            <div className="text-sm text-[#64748B] mb-2">at {sub.store}</div>

                            <div className="flex flex-wrap gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">Same category</span>
                              <span className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">Better unit price</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3 flex-shrink-0 min-w-[120px]">
                            <div className="text-right">
                              <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
                                K{sub.best_unit_price.toFixed(2)}
                                <span className="text-sm text-[#64748B]">/{sub.canonical_unit}</span>
                              </div>
                              {sub.saving_per_unit > 0 && (
                                <div className="text-sm font-bold text-[#16A34A] flex items-center justify-end gap-1">
                                  <TrendingDown size={14} /> K{sub.saving_per_unit.toFixed(2)}/{sub.canonical_unit}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                              <button
                                onClick={() => handleAdd(sub.product_id)}
                                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${added ? 'bg-[#16A34A] text-white' : 'bg-[#0F2547] text-white hover:bg-[#1A3A6B]'}`}
                              >
                                {added ? <><Check size={14} /> Added!</> : '+ Add to Basket'}
                              </button>
                              <button
                                onClick={() => onNavigate('compare')}
                                className="w-full py-2 rounded-xl text-xs font-semibold text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-1"
                              >
                                Compare <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-start gap-3">
                <Info size={18} className="text-[#94A3B8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Alternatives are matched by product category and type. ZamPrice does not claim cheaper alternatives are superior in quality. Always check product labels before purchasing.
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#64748B]">Select a product to see alternatives.</div>
          )}
        </div>
      </div>
    </div>
  );
}