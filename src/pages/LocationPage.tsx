import { useState } from 'react';
import { STORE_LOCATIONS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const AREAS = ['All Areas', 'Kabulonga', 'Manda Hill', 'Cairo Road', 'Arcades', 'Woodlands', 'Mass Media', 'Chilenje'];

export default function LocationPage({ onNavigate }: Props) {
  const [locMode, setLocMode] = useState<'gps' | 'city' | null>(null);
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [city] = useState('Lusaka');

  const locations = STORE_LOCATIONS.filter(l =>
    selectedArea === 'All Areas' || l.branch === selectedArea
  ).sort((a, b) => a.distance - b.distance);

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
            <div className="text-3xl mb-3">📍</div>
            <div className="font-bold text-[#1E293B] mb-1" style={{ fontFamily: 'Outfit' }}>Use My Location</div>
            <div className="text-sm text-[#64748B]">Find stores closest to where you are now</div>
          </button>
          <button onClick={() => setLocMode('city')}
            className="p-6 rounded-2xl border-2 border-[#E2E8F0] bg-white hover:border-[#0F2547] transition-all group text-left">
            <div className="text-3xl mb-3">🏙️</div>
            <div className="font-bold text-[#1E293B] mb-1" style={{ fontFamily: 'Outfit' }}>Select City & Area</div>
            <div className="text-sm text-[#64748B]">Choose your city or neighbourhood</div>
          </button>
        </div>
      ) : (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <div className="font-semibold text-[#0F2547]">
              {locMode === 'gps' ? 'Using your current location' : `${city}, Zambia`}
            </div>
            <div className="text-xs text-[#64748B]">Showing stores within 15km</div>
          </div>
          <button onClick={() => setLocMode(null)} className="text-xs text-[#64748B] hover:text-[#0F2547] font-medium">Change</button>
        </div>
      )}

      {locMode && (
        <>
          {/* Area Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {AREAS.map(a => (
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
                <div className="text-4xl mb-2">🗺️</div>
                <div className="font-semibold text-[#0F2547]">Interactive Map</div>
                <div className="text-sm text-[#64748B]">Showing {locations.length} stores near Lusaka</div>
              </div>
            </div>
            {/* Pin markers */}
            {locations.slice(0, 3).map((loc, i) => (
              <div key={i} className="absolute" style={{ left: `${25 + i * 25}%`, top: `${30 + i * 15}%` }}>
                <div className="w-8 h-8 rounded-full bg-[#0F2547] border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
              </div>
            ))}
          </div>

          {/* Store List */}
          <div className="space-y-3">
            {locations.map((loc, i) => {
              const store = STORES.find(s => s.id === loc.storeId)!;
              const availPct = Math.round((loc.available / loc.total) * 100);
              return (
                <div key={`${loc.storeId}-${loc.branch}`} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F2547] flex items-center justify-center text-white font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{store.name} {loc.branch}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                            <span>📍 {loc.distance} km away</span>
                            <span>⏱ {loc.travelTime} drive</span>
                            <span>🕐 {loc.hours}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{loc.basketPrice}</div>
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
                          className="px-4 py-2 rounded-xl bg-[#0F2547] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors flex-shrink-0">
                          View Store →
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
