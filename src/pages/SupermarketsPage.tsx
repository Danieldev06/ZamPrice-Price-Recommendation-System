import { STORES, STORE_LOCATIONS } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

const STORE_IMAGES: Record<string, string> = {
  shoprite: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=220&fit=crop&auto=format',
  choppies: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=220&fit=crop&auto=format',
  picknpay: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=220&fit=crop&auto=format',
  spar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=220&fit=crop&auto=format',
  game: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=220&fit=crop&auto=format',
};

const PRICE_LEVEL: Record<string, string> = {
  shoprite: '$$',
  choppies: '$',
  picknpay: '$$$',
  spar: '$$$',
  game: '$$$$',
};

interface Props {
  onNavigate: (page: Page) => void;
}

export default function SupermarketsPage({ onNavigate }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Supermarket Directory</h1>
        <p className="text-sm text-[#64748B]">Browse supermarkets and compare basket prices</p>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {STORES.map(store => (
          <div key={store.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group">
            <div className="h-44 overflow-hidden relative bg-[#F1F5F9]">
              <img src={STORE_IMAGES[store.id]} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-white font-black text-xl" style={{ fontFamily: 'Outfit' }}>{store.name}</div>
                  <div className="text-white/70 text-xs">📍 Lusaka, Zambia</div>
                </div>
                <div className="text-right">
                  <div className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                    {PRICE_LEVEL[store.id]} Price Level
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-[#F8FAFC]">
                  <div className="font-black text-lg text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{store.avgBasket}</div>
                  <div className="text-xs text-[#94A3B8]">Avg Basket</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#F8FAFC]">
                  <div className="font-black text-lg text-[#D97706]" style={{ fontFamily: 'Outfit' }}>{store.deals}</div>
                  <div className="text-xs text-[#94A3B8]">Live Deals</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#F8FAFC]">
                  <div className="font-black text-lg text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>{store.products}</div>
                  <div className="text-xs text-[#94A3B8]">Products</div>
                </div>
              </div>

              {/* Branches */}
              <div className="space-y-2 mb-4">
                {STORE_LOCATIONS.filter(l => l.storeId === store.id).map(loc => (
                  <div key={loc.branch} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <div>
                        <div className="text-xs font-semibold text-[#1E293B]">{store.name} {loc.branch}</div>
                        <div className="text-xs text-[#94A3B8]">{loc.distance} km · {loc.travelTime}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0F2547]">K{loc.basketPrice}</div>
                      <div className="text-xs text-[#94A3B8]">{loc.available}/{loc.total} items</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => onNavigate('optimise')}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F2547] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors">
                  Compare My Basket
                </button>
                <button onClick={() => onNavigate('search')} className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-[#475569] text-xs font-semibold hover:bg-[#E2E8F0] transition-colors">
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Location Map Teaser */}
      <div className="bg-[#0F2547] rounded-2xl p-6 flex items-center gap-5">
        <div className="text-5xl">📍</div>
        <div className="flex-1">
          <h3 className="font-black text-xl text-white mb-1" style={{ fontFamily: 'Outfit' }}>Find Stores Near You</h3>
          <p className="text-sm text-[#94A3B8]">See which supermarkets are closest and have your full shopping list available.</p>
        </div>
        <button onClick={() => onNavigate('location')} className="px-6 py-3 rounded-xl bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition-colors whitespace-nowrap">
          Find Nearby →
        </button>
      </div>
    </div>
  );
}
