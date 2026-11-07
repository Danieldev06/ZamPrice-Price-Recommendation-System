import { useState, useEffect } from 'react';
import api from '../api/client';
import { MapPin, Building2, Map, Car, Clock, ArrowRight } from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

interface BranchLocation {
  storeName: string;
  branchName: string;
  basketPrice: number;
  available: number;
  total: number;
  distance: number;
  travelTime: string;
  hours: string;
}

export default function LocationPage({ onNavigate }: Props) {
  const [locMode, setLocMode] = useState<'gps' | 'city' | null>(null);
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [locations, setLocations] = useState<BranchLocation[]>([]);
  const [areas, setAreas] = useState<string[]>(['All Areas']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const prodRes = await api.get('/products');
        
        // Map to hold aggregated branch data
        const branchMap: Record<string, {
          storeName: string;
          branchName: string;
          totalPrice: number;
          itemCount: number;
        }> = {};

        // Aggregate data from all products
        for (const p of prodRes.data) {
          const compRes = await api.get(`/products/${p.id}/comparison`);
          const options = compRes.data.options || [];

          options.forEach((opt: any) => {
            const key = `${opt.supermarket}-${opt.location}`;
            if (!branchMap[key]) {
              branchMap[key] = {
                storeName: opt.supermarket,
                branchName: opt.location,
                totalPrice: 0,
                itemCount: 0
              };
            }
            branchMap[key].totalPrice += opt.effective_price;
            branchMap[key].itemCount += 1;
          });
        }

        // Convert to array and add synthesized distance/time
        const formattedLocations: BranchLocation[] = Object.values(branchMap).map(b => ({
          storeName: b.storeName,
          branchName: b.branchName,
          basketPrice: b.totalPrice,
          available: b.itemCount,
          total: prodRes.data.length,
          distance: Number((Math.random() * 8 + 0.5).toFixed(1)), // Mock distance 0.5km - 8.5km
          travelTime: `${Math.floor(Math.random() * 20 + 5)} mins`, // Mock time 5 - 25 mins
          hours: '08:00 - 21:00' // Mock hours
        }));

        // Sort by distance
        formattedLocations.sort((a, b) => a.distance - b.distance);
        setLocations(formattedLocations);

        // Extract unique branch names for the Area filter
        const uniqueBranches = Array.from(new Set(formattedLocations.map(l => l.branchName)));
        setAreas(['All Areas', ...uniqueBranches]);

      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setLoading(false);
      }
    }
    loadLocations();
  }, []);

  const filteredLocations = locations.filter(l =>
    selectedArea === 'All Areas' || l.branchName === selectedArea
  );

  if (loading) return <div className="p-12 text-center text-[#64748B]">Locating stores...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Where Are You Shopping?</h1>
        <p className="text-sm text-[#64748B]">Find the nearest supermarkets with the best prices</p>
      </div>

      {/* Location Mode */}
      {!locMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button onClick={() => setLocMode('gps')}
            className="p-6 rounded-2xl border-2 border-[#E2E8F0] bg-white hover:border-[#0F2547] transition-all group text-left">
            <div className="mb-3"><MapPin size={32} className="text-[#0F2547]" /></div>
            <div className="font-bold text-[#1E293B] mb-1" style={{ fontFamily: 'Outfit' }}>Use My Location</div>
            <div className="text-sm text-[#64748B]">Find stores closest to where you are now</div>
          </button>
          <button onClick={() => setLocMode('city')}
            className="p-6 rounded-2xl border-2 border-[#E2E8F0] bg-white hover:border-[#0F2547] transition-all group text-left">
            <div className="mb-3"><Building2 size={32} className="text-[#0F2547]" /></div>
            <div className="font-bold text-[#1E293B] mb-1" style={{ fontFamily: 'Outfit' }}>Select City & Area</div>
            <div className="text-sm text-[#64748B]">Choose your city or neighbourhood</div>
          </button>
        </div>
      ) : (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 mb-6 flex items-center gap-3">
          <MapPin size={24} className="text-[#0F2547]" />
          <div className="flex-1">
            <div className="font-semibold text-[#0F2547]">
              {locMode === 'gps' ? 'Using your current location' : `Lusaka, Zambia`}
            </div>
            <div className="text-xs text-[#64748B]">Showing {filteredLocations.length} stores nearby</div>
          </div>
          <button onClick={() => setLocMode(null)} className="text-xs text-[#64748B] hover:text-[#0F2547] font-medium">Change</button>
        </div>
      )}

      {locMode && (
        <>
          {/* Area Filter (Dynamically populated from backend branches) */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {areas.map(a => (
              <button key={a} onClick={() => setSelectedArea(a)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${selectedArea === a ? 'bg-[#0F2547] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
                {a}
              </button>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="bg-[#F1F5F9] rounded-2xl h-48 mb-5 flex items-center justify-center relative overflow-hidden border border-[#E2E8F0]">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&h=300&fit=crop&auto=format"
              alt="Map of Lusaka"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map size={48} className="text-[#0F2547] mx-auto mb-2 opacity-50" />
                <div className="font-semibold text-[#0F2547]">Interactive Map</div>
                <div className="text-sm text-[#64748B]">Showing {filteredLocations.length} stores</div>
              </div>
            </div>
            {/* Pin markers */}
            {filteredLocations.slice(0, 3).map((loc, i) => (
              <div key={i} className="absolute" style={{ left: `${25 + i * 25}%`, top: `${30 + i * 15}%` }}>
                <div className="w-8 h-8 rounded-full bg-[#0F2547] border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
              </div>
            ))}
          </div>

          {/* Store List */}
          <div className="space-y-3">
            {filteredLocations.map((loc, i) => {
              const availPct = Math.round((loc.available / loc.total) * 100);
              return (
                <div key={`${loc.storeName}-${loc.branchName}`} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F2547] flex items-center justify-center text-white font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{loc.storeName} {loc.branchName}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {loc.distance} km away</span>
                            <span className="flex items-center gap-1"><Car size={14} /> {loc.travelTime} drive</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {loc.hours}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{loc.basketPrice.toFixed(2)}</div>
                          <div className="text-xs text-[#64748B]">basket price</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-[#64748B] mb-1">
                            <span>Items available</span>
                            <span className={`font-semibold ${availPct >= 90 ? 'text-[#16A34A]' : availPct >= 70 ? 'text-[#D97706]' : 'text-[#DC2626]'}`}>
                              {loc.available}/{loc.total}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${availPct}%`, backgroundColor: availPct >= 90 ? '#16A34A' : availPct >= 70 ? '#D97706' : '#DC2626' }} />
                          </div>
                        </div>
                        <button onClick={() => onNavigate('optimise')}
                          className="px-4 py-2 rounded-xl bg-[#0F2547] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors flex-shrink-0 flex items-center gap-1">
                          View Store <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}