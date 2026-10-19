import { useState } from 'react';
import { PRICE_ALERTS, PRODUCTS, STORES } from '../data/sampleData';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function AlertsPage({ onNavigate }: Props) {
  const [alerts, setAlerts] = useState(PRICE_ALERTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({ product: '', targetPrice: '', store: 'Any', notif: 'Push' });
  const [deleted, setDeleted] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(a => !deleted.includes(a.id));

  const handleDelete = (id: string) => setDeleted(prev => [...prev, id]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>My Price Alerts</h1>
          <p className="text-sm text-[#64748B]">Get notified when prices reach your target</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
          + Create Alert
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Alerts', value: visibleAlerts.filter(a => a.status === 'waiting').length, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Targets Reached', value: visibleAlerts.filter(a => a.status === 'reached').length, color: '#16A34A', bg: '#DCFCE7' },
          { label: 'Total Alerts', value: visibleAlerts.length, color: '#0F2547', bg: '#EFF6FF' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl border border-[#E2E8F0]" style={{ backgroundColor: s.bg }}>
            <div className="text-2xl font-black" style={{ fontFamily: 'Outfit', color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4 mb-8">
        {visibleAlerts.map(alert => {
          const progress = Math.min(100, Math.max(0, ((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100 + 50));
          const reached = alert.status === 'reached';
          return (
            <div key={alert.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${reached ? 'border-[#16A34A]/30' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${reached ? 'bg-[#DCFCE7]' : 'bg-[#FEF3C7]'}`}>
                  {reached ? '✅' : '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{alert.productName}</div>
                      <div className="text-xs text-[#64748B] mt-0.5">{alert.preferredStore} · {alert.notif} notifications</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${reached ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                        {reached ? '🟢 Target reached' : '🟡 Waiting'}
                      </div>
                      <button onClick={() => handleDelete(alert.id)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors text-lg">×</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-[#F8FAFC]">
                      <div className="text-xs text-[#94A3B8] mb-0.5">Current Price</div>
                      <div className="text-xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>K{alert.currentPrice}</div>
                    </div>
                    <div className={`p-3 rounded-xl ${reached ? 'bg-[#DCFCE7]' : 'bg-[#FEF3C7]'}`}>
                      <div className="text-xs text-[#94A3B8] mb-0.5">Target Price</div>
                      <div className={`text-xl font-black ${reached ? 'text-[#16A34A]' : 'text-[#D97706]'}`} style={{ fontFamily: 'Outfit' }}>K{alert.targetPrice}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                      <span>Target K{alert.targetPrice}</span>
                      <span>Current K{alert.currentPrice}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: reached ? '#16A34A' : '#D97706' }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-[#64748B]">
                      {reached
                        ? `✓ Price dropped K${alert.currentPrice - alert.targetPrice} below your target!`
                        : `K${alert.currentPrice - alert.targetPrice} away from your target price`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visibleAlerts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-lg font-bold text-[#1E293B] mb-2" style={{ fontFamily: 'Outfit' }}>No price alerts yet</h3>
            <p className="text-sm text-[#64748B] mb-4">Create alerts to be notified when prices drop</p>
            <button onClick={() => setShowCreate(true)} className="px-6 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-semibold">Create Your First Alert</button>
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>Create Price Alert</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#94A3B8] hover:text-[#64748B] text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Product</label>
                <select
                  value={newAlert.product}
                  onChange={e => setNewAlert(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20">
                  <option value="">Select a product…</option>
                  {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.quantity} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Target Price (K)</label>
                <input
                  type="number"
                  value={newAlert.targetPrice}
                  onChange={e => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Preferred Supermarket</label>
                <div className="flex flex-wrap gap-2">
                  {['Any', ...STORES.map(s => s.name)].map(s => (
                    <button key={s} onClick={() => setNewAlert(prev => ({ ...prev, store: s }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${newAlert.store === s ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Notify me via</label>
                <div className="flex gap-2">
                  {['Push', 'Email', 'Push + Email'].map(n => (
                    <button key={n} onClick={() => setNewAlert(prev => ({ ...prev, notif: n }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${newAlert.notif === n ? 'bg-[#0F2547] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">Cancel</button>
              <button
                onClick={() => {
                  if (newAlert.product && newAlert.targetPrice) {
                    const p = PRODUCTS.find(x => x.id === newAlert.product)!;
                    const best = Math.min(...p.prices.map(x => x.price));
                    setAlerts(prev => [...prev, {
                      id: `a${Date.now()}`,
                      productName: `${p.quantity} ${p.name}`,
                      currentPrice: best,
                      targetPrice: Number(newAlert.targetPrice),
                      preferredStore: newAlert.store,
                      status: best <= Number(newAlert.targetPrice) ? 'reached' : 'waiting',
                      notif: newAlert.notif,
                    }]);
                    setShowCreate(false);
                    setNewAlert({ product: '', targetPrice: '', store: 'Any', notif: 'Push' });
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-[#0F2547] text-white text-sm font-bold hover:bg-[#1A3A6B] transition-colors">
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
