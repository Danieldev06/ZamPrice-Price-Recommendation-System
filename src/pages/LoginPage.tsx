import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Page = 'login' | 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function LoginPage({ onNavigate }: Props) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('demo@zamprice.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onNavigate('dashboard'); // Send to dashboard on success
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0F2547] flex items-center justify-center shadow-sm mx-auto mb-4">
            <span className="text-[#D97706] font-black text-xl" style={{ fontFamily: 'Outfit' }}>Z</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isRegister ? 'Join ZamPrice to start saving' : 'Sign in to access your baskets and alerts'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20"
                placeholder="e.g. Chanda Mutale"
              />
            </div>
          )}
          
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-sm font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0F2547] text-white font-bold text-sm hover:bg-[#1A3A6B] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-sm text-[#0F2547] font-semibold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
          <button onClick={() => onNavigate('landing')} className="text-xs text-[#64748B] hover:text-[#0F2547]">
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}