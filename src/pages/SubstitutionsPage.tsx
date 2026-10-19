import { useState } from 'react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

interface Substitute {
  name: string;
  brand: string;
  store: string;
  price: number;
  size: string;
  similarity: 'Identical' | 'Very Similar' | 'Similar' | 'Alternative';
  inStock: boolean;
  image: string;
  tags: string[];
  saving: number;
}

interface ProductEntry {
  id: string;
  name: string;
  brand: string;
  size: string;
  currentPrice: number;
  store: string;
  image: string;
  category: string;
  substitutes: Substitute[];
}

const PRODUCTS: ProductEntry[] = [
  {
    id: 'p1',
    name: 'Royco Chicken Cubes',
    brand: 'Royco',
    size: '10 cubes',
    currentPrice: 35,
    store: 'Shoprite',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop&auto=format',
    category: 'Spices & Seasoning',
    substitutes: [
      {
        name: 'Knorr Chicken Cubes',
        brand: 'Knorr',
        store: 'Pick n Pay',
        price: 29,
        size: '10 cubes',
        similarity: 'Identical',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=300&h=300&fit=crop&auto=format',
        tags: ['Same size', 'Same category', 'Different brand'],
        saving: 6,
      },
      {
        name: 'Maggi Chicken Cubes',
        brand: 'Maggi',
        store: 'Choppies',
        price: 27,
        size: '10 cubes',
        similarity: 'Very Similar',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&h=300&fit=crop&auto=format',
        tags: ['Same size', 'Same category', 'Budget option'],
        saving: 8,
      },
      {
        name: 'ZamChick Chicken Seasoning',
        brand: 'ZamChick',
        store: 'Choppies',
        price: 25,
        size: '50g',
        similarity: 'Alternative',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=300&h=300&fit=crop&auto=format',
        tags: ['Local brand', 'Powder format', 'Best saving'],
        saving: 10,
      },
    ],
  },
  {
    id: 'p2',
    name: 'Freshmark Cooking Oil 2L',
    brand: 'Freshmark',
    size: '2L',
    currentPrice: 75,
    store: 'Shoprite',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
    category: 'Cooking Oil',
    substitutes: [
      {
        name: 'Sun Cooking Oil',
        brand: 'Sun',
        store: 'Choppies',
        price: 68,
        size: '2L',
        similarity: 'Identical',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
        tags: ['Same size', 'Same type', 'Better price'],
        saving: 7,
      },
      {
        name: 'Freshmark Cooking Oil 5L',
        brand: 'Freshmark',
        store: 'Shoprite',
        price: 165,
        size: '5L',
        similarity: 'Very Similar',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
        tags: ['Bigger size', 'Same brand', 'K33/L — better value'],
        saving: -90,
      },
    ],
  },
  {
    id: 'p3',
    name: "Roller's Choice Mealie Meal 5kg",
    brand: "Roller's Choice",
    size: '5kg',
    currentPrice: 185,
    store: 'Pick n Pay',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop&auto=format',
    category: 'Mealie Meal',
    substitutes: [
      {
        name: "Roller's Choice Mealie Meal 5kg",
        brand: "Roller's Choice",
        store: 'Shoprite',
        price: 185,
        size: '5kg',
        similarity: 'Identical',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop&auto=format',
        tags: ['Same product', 'Different store', 'Same price'],
        saving: 0,
      },
      {
        name: 'National Milling Mealie Meal 5kg',
        brand: 'National Milling',
        store: 'Choppies',
        price: 178,
        size: '5kg',
        similarity: 'Very Similar',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop&auto=format',
        tags: ['Same size', 'Local brand', 'Cheaper'],
        saving: 7,
      },
    ],
  },
  {
    id: 'p4',
    name: 'Zambia Sugar 2kg',
    brand: 'Zambia Sugar',
    size: '2kg',
    currentPrice: 52,
    store: 'Choppies',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format',
    category: 'Sugar',
    substitutes: [
      {
        name: 'Zambia Sugar 2kg',
        brand: 'Zambia Sugar',
        store: 'Shoprite',
        price: 48,
        size: '2kg',
        similarity: 'Identical',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format',
        tags: ['Same product', 'Cheaper store'],
        saving: 4,
      },
    ],
  },
];

const SIMILARITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'Identical': { color: '#16A34A', bg: '#DCFCE7', label: 'Exact Match' },
  'Very Similar': { color: '#0F2547', bg: '#DBEAFE', label: 'Very Similar' },
  'Similar': { color: '#D97706', bg: '#FEF3C7', label: 'Similar' },
  'Alternative': { color: '#EA580C', bg: '#FFEDD5', label: 'Alternative' },
};

export default function SubstitutionsPage({ onNavigate }: Props) {
  const [selectedProductId, setSelectedProductId] = useState('p1');
  const [search, setSearch] = useState('');
  const [addedToBasket, setAddedToBasket] = useState<string | null>(null);

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId)!;
  const maxSaving = Math.max(...selectedProduct.substitutes.filter(s => s.saving > 0).map(s => s.saving), 0);

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (name: string) => {
    setAddedToBasket(name);
    setTimeout(() => setAddedToBasket(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔄</span>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
            Find Cheaper Alternatives
          </h1>
        </div>
        <p className="text-[#64748B] text-sm max-w-xl">
          Discover products that fulfil the same need at a lower price. Substitutes are matched by category, size and product type — not quality claims.
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your basket items, e.g. Royco, Cooking Oil…"
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
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedProductId === p.id ? 'border-[#0F2547] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#0F2547]/30'}`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${selectedProductId === p.id ? 'text-[#0F2547]' : 'text-[#1E293B]'}`}>{p.name}</div>
                  <div className="text-xs text-[#94A3B8]">{p.store} · K{p.currentPrice}</div>
                </div>
                {p.substitutes.some(s => s.saving > 0) && (
                  <span className="text-xs font-bold text-[#16A34A] flex-shrink-0">
                    Save K{Math.max(...p.substitutes.filter(s => s.saving > 0).map(s => s.saving))}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 bg-white rounded-2xl border border-[#E2E8F0]">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-xs text-[#64748B]">No products found</div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Current Product Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-0.5">{selectedProduct.category}</div>
                <h2 className="text-xl font-black text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>{selectedProduct.name}</h2>
                <div className="text-sm text-[#64748B]">{selectedProduct.brand} · {selectedProduct.size}</div>
                <div className="flex items-center gap-3 mt-2">
                  <div>
                    <div className="text-xs text-[#94A3B8]">Current price</div>
                    <div className="text-2xl font-black text-[#DC2626]" style={{ fontFamily: 'Outfit' }}>K{selectedProduct.currentPrice}</div>
                    <div className="text-xs text-[#64748B]">at {selectedProduct.store}</div>
                  </div>
                  {maxSaving > 0 && (
                    <div className="ml-4 px-4 py-2.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0]">
                      <div className="text-xs text-[#16A34A] font-medium">Best alternative saves</div>
                      <div className="text-xl font-black text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{maxSaving}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Substitutes */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
              {selectedProduct.substitutes.length} Alternative{selectedProduct.substitutes.length !== 1 ? 's' : ''} Found
            </h3>
            <div className="text-xs text-[#94A3B8] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              ℹ Matched by category · size · type — not quality
            </div>
          </div>

          <div className="space-y-4">
            {selectedProduct.substitutes.map((sub, idx) => {
              const simConfig = SIMILARITY_CONFIG[sub.similarity];
              const isBestSaving = sub.saving === maxSaving && sub.saving > 0;
              const added = addedToBasket === sub.name;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-sm ${isBestSaving ? 'border-[#16A34A]/40' : 'border-[#E2E8F0]'}`}
                >
                  {isBestSaving && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] mb-3">
                      <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[9px]">★</span>
                      Best Alternative
                    </div>
                  )}

                  <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap mb-1">
                        <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{sub.name}</div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                          style={{ color: simConfig.color, backgroundColor: simConfig.bg }}
                        >
                          {simConfig.label}
                        </span>
                      </div>
                      <div className="text-sm text-[#64748B] mb-2">{sub.brand} · {sub.size} · at {sub.store}</div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {sub.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price + Actions */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0 min-w-[120px]">
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{sub.price}</div>
                        {sub.saving > 0 && (
                          <div className="text-sm font-bold text-[#16A34A]">−K{sub.saving} cheaper</div>
                        )}
                        {sub.saving === 0 && (
                          <div className="text-xs text-[#94A3B8]">Same price</div>
                        )}
                        {sub.saving < 0 && (
                          <div className="text-xs text-[#D97706]">
                            +K{Math.abs(sub.saving)} · {sub.tags.find(t => t.includes('/')) ?? 'larger size'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        <button
                          onClick={() => handleAdd(sub.name)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${added ? 'bg-[#16A34A] text-white' : 'bg-[#0F2547] text-white hover:bg-[#1A3A6B]'}`}
                        >
                          {added ? '✓ Added!' : '+ Add to Basket'}
                        </button>
                        <button
                          onClick={() => onNavigate('compare')}
                          className="w-full py-2 rounded-xl text-xs font-semibold text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                        >
                          Compare →
                        </button>
                      </div>

                      {/* Stock */}
                      <div className={`flex items-center gap-1 text-xs font-medium ${sub.inStock ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.inStock ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`} />
                        {sub.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>

                  {/* Savings context */}
                  {sub.saving > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-[#94A3B8]">Current price</div>
                        <div className="font-bold text-[#DC2626]" style={{ fontFamily: 'Outfit' }}>K{selectedProduct.currentPrice}</div>
                      </div>
                      <div className="flex items-center justify-center text-[#94A3B8]">→</div>
                      <div>
                        <div className="text-xs text-[#94A3B8]">Alternative price</div>
                        <div className="font-bold text-[#16A34A]" style={{ fontFamily: 'Outfit' }}>K{sub.price}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-start gap-3">
            <span className="text-lg mt-0.5 flex-shrink-0">ℹ️</span>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Alternatives are matched by product category, size, and type. ZamPrice does not claim cheaper alternatives are superior in quality. Always check product labels before purchasing. Prices shown are sample demo data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
