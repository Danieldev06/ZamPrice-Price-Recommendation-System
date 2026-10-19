import { useState } from 'react';

type Page = 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

const PREFS = [
  { id: 'lowest_price', label: 'Lowest price', icon: '💰' },
  { id: 'best_value', label: 'Best value per unit', icon: '⚖️' },
  { id: 'closest_store', label: 'Closest supermarket', icon: '📍' },
  { id: 'fewer_stores', label: 'Fewer stores to visit', icon: '🚗' },
  { id: 'preferred_brands', label: 'Preferred brands', icon: '🏷️' },
  { id: 'discounts', label: 'Discounts & promotions', icon: '🎯' },
  { id: 'availability', label: 'Product availability', icon: '📦' },
];

const STORES = ['Shoprite', 'Choppies', 'Pick n Pay', 'Spar', 'Game'];

const SAVED_LISTS = [
  { name: 'Weekly Groceries', items: 12, updated: '2 Sep 2024' },
  { name: 'Monthly Staples', items: 8, updated: '28 Aug 2024' },
  { name: "Kids' Snacks", items: 5, updated: '25 Aug 2024' },
];

export default function ProfilePage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'lists' | 'settings' | 'account'>('preferences');
  const [selectedPrefs, setSelectedPrefs] = useState(['lowest_price', 'best_value', 'discounts']);
  const [selectedStores, setSelectedStores] = useState(['Shoprite', 'Choppies']);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const togglePref = (id: string) => setSelectedPrefs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleStore = (s: string) => setSelectedStores(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="bg-[#0F2547] rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#D97706] flex items-center justify-center text-white text-2xl font-black flex-shrink-0" style={{ fontFamily: 'Outfit' }}>
          CM
        </div>
        <div className="flex-1">
          <div className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Chanda Mutale</div>
          <div className="text-sm text-[#94A3B8]">chanda.mutale@gmail.com</div>
          <div className="text-xs text-[#64748B] mt-1">📍 Kabulonga, Lusaka · Member since January 2024</div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-[#94A3B8] mb-1">Total saved with ZamPrice</div>
          <div className="text-3xl font-black text-[#4ADE80]" style={{ fontFamily: 'Outfit' }}>K1,247</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E2E8F0] mb-6 overflow-x-auto">
        {[
          ['preferences', 'My Preferences'],
          ['lists', 'Saved Lists'],
          ['settings', 'Notifications'],
          ['account', 'Account'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === id ? 'text-[#0F2547] border-[#0F2547]' : 'text-[#64748B] border-transparent hover:text-[#0F2547]'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* What matters most */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>What matters most to you?</h3>
            <p className="text-sm text-[#64748B] mb-5">Your preferences guide our recommendations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREFS.map(pref => {
                const selected = selectedPrefs.includes(pref.id);
                return (
                  <button key={pref.id} onClick={() => togglePref(pref.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-[#0F2547] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#0F2547]/30'}`}>
                    <span className="text-xl">{pref.icon}</span>
                    <span className="text-sm font-medium text-[#1E293B]">{pref.label}</span>
                    <span className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'bg-[#0F2547] border-[#0F2547]' : 'border-[#CBD5E1]'}`}>
                      {selected && <span className="text-white text-xs">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Stores */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h3 className="font-bold text-[#0F2547] mb-1" style={{ fontFamily: 'Outfit' }}>Preferred Supermarkets</h3>
            <p className="text-sm text-[#64748B] mb-4">We'll prioritise these stores in recommendations</p>
            <div className="flex flex-wrap gap-3">
              {STORES.map(s => {
                const selected = selectedStores.includes(s);
                return (
                  <button key={s} onClick={() => toggleStore(s)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${selected ? 'border-[#0F2547] bg-[#0F2547] text-white' : 'border-[#E2E8F0] text-[#475569] hover:border-[#0F2547]'}`}>
                    {selected && <span className="text-xs">✓</span>}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="w-full py-3.5 rounded-2xl bg-[#0F2547] text-white font-bold hover:bg-[#1A3A6B] transition-colors">
            Save Preferences
          </button>
        </div>
      )}

      {activeTab === 'lists' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-[#64748B]">Your saved shopping lists</p>
            <button onClick={() => onNavigate('basket')} className="px-4 py-2 rounded-xl bg-[#0F2547] text-white text-sm font-semibold hover:bg-[#1A3A6B] transition-colors">
              + New List
            </button>
          </div>
          {SAVED_LISTS.map(list => (
            <div key={list.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-2xl flex-shrink-0">🛒</div>
              <div className="flex-1">
                <div className="font-bold text-[#1E293B]" style={{ fontFamily: 'Outfit' }}>{list.name}</div>
                <div className="text-xs text-[#64748B]">{list.items} items · Updated {list.updated}</div>
              </div>
              <button onClick={() => onNavigate('basket')} className="px-3 py-2 rounded-xl bg-[#F1F5F9] text-[#475569] text-xs font-semibold hover:bg-[#E2E8F0] transition-colors">
                Open →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h3 className="font-bold text-[#0F2547] mb-5" style={{ fontFamily: 'Outfit' }}>Notification Preferences</h3>
          <div className="space-y-5">
            {[
              { label: 'Push Notifications', desc: 'Instant alerts on your device', state: notifPush, set: setNotifPush },
              { label: 'Email Notifications', desc: 'Weekly summary and price alerts', state: notifEmail, set: setNotifEmail },
              { label: 'SMS Notifications', desc: 'Critical price drops only', state: notifSMS, set: setNotifSMS },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                <div>
                  <div className="font-medium text-sm text-[#1E293B]">{n.label}</div>
                  <div className="text-xs text-[#64748B]">{n.desc}</div>
                </div>
                <button onClick={() => n.set(!n.state)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${n.state ? 'bg-[#16A34A]' : 'bg-[#CBD5E1]'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${n.state ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-sm text-[#1E293B] mb-3">Notify me about</h4>
            <div className="space-y-2">
              {['Price drops on my watchlist', 'Price alerts reached', 'New deals and promotions', 'Back-in-stock products', 'Weekly savings summary'].map(item => (
                <label key={item} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0F2547]" />
                  <span className="text-sm text-[#475569]">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h3 className="font-bold text-[#0F2547] mb-5" style={{ fontFamily: 'Outfit' }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', value: 'Chanda' },
                { label: 'Last Name', value: 'Mutale' },
                { label: 'Email', value: 'chanda.mutale@gmail.com' },
                { label: 'Phone', value: '+260 97 123 4567' },
                { label: 'City', value: 'Lusaka' },
                { label: 'Area', value: 'Kabulonga' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input defaultValue={f.value} className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20" />
                </div>
              ))}
            </div>
            <button className="mt-5 px-6 py-3 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors">
              Save Changes
            </button>
          </div>
          <button onClick={() => onNavigate('landing')} className="w-full py-3.5 rounded-2xl border border-[#FEE2E2] text-[#DC2626] text-sm font-semibold hover:bg-[#FEF2F2] transition-colors">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
