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
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0F2547] flex items-center justify-center p-4 overflow-hidden">
      
      {/* Background Imagery (Matched from Landing Page) */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1400&h=800&fit=crop&auto=format"
          alt="Zambian market"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2547] via-[#0F2547]/90 to-[#0F2547]/60" />
      </div>

      {/* Decorative radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#D97706]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#16A34A]/8 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative bg-white rounded-3xl border border-[#E2E8F0] w-full max-w-md p-8 shadow-2xl z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0F2547] flex items-center justify-center shadow-sm mx-auto mb-4">
            <span className="text-[#D97706] font-black text-2xl" style={{ fontFamily: 'Outfit' }}>Z</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F2547]" style={{ fontFamily: 'Outfit' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isRegister ? 'Join ZamPrice to start saving' : 'Sign in to access your baskets and alerts'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] transition-all"
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
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] transition-all"
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
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2547]/20 focus:border-[#0F2547] transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition-colors disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-sm text-[#0F2547] font-semibold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Back to Landing */}
        <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
          <button 
            onClick={() => onNavigate('landing')} 
            className="text-xs text-[#64748B] hover:text-[#0F2547] font-medium transition-colors"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}