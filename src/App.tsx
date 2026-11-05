import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import all your pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import ComparePage from './pages/ComparePage';
import BasketPage from './pages/BasketPage';
import OptimisePage from './pages/OptimisePage';
import PriceHistoryPage from './pages/PriceHistoryPage';
import AlertsPage from './pages/AlertsPage';
import DealsPage from './pages/DealsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import BudgetPage from './pages/BudgetPage';
import LocationPage from './pages/LocationPage';
import SubstitutionsPage from './pages/SubstitutionsPage';
import SupermarketsPage from './pages/SupermarketsPage'; // if you have this

type Page = 'login' | 'landing' | 'dashboard' | 'search' | 'compare' | 'basket' | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets' | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<Page>('landing');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#0F2547] font-bold">Loading ZamPrice...</div>;

  // If not logged in and trying to access an internal page, force Login
  const protectedPages: Page[] = ['dashboard', 'search', 'compare', 'basket', 'optimise', 'history', 'alerts', 'deals', 'profile', 'admin', 'budget', 'location', 'substitutions', 'supermarkets'];
  
  if (!user && protectedPages.includes(activePage)) {
    return <LoginPage onNavigate={setActivePage} />;
  }

  // If logged in and on login page, go to dashboard
  if (user && activePage === 'login') {
    setActivePage('dashboard');
    return null;
  }

  // Render the correct page based on state
  return (
    <>
      {activePage === 'landing' && <LandingPage onNavigate={setActivePage} />}
      {activePage === 'login' && <LoginPage onNavigate={setActivePage} />}
      {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} onSelectProduct={setSelectedProductId} />}
      {activePage === 'search' && <SearchPage onNavigate={setActivePage} onSelectProduct={setSelectedProductId} />}
      {activePage === 'compare' && <ComparePage onNavigate={setActivePage} selectedProductId={selectedProductId?.toString()} />}
      {activePage === 'basket' && <BasketPage onNavigate={setActivePage} />}
      {activePage === 'optimise' && <OptimisePage onNavigate={setActivePage} />}
      {activePage === 'history' && <PriceHistoryPage onNavigate={setActivePage} />}
      {activePage === 'alerts' && <AlertsPage onNavigate={setActivePage} />}
      {activePage === 'deals' && <DealsPage onNavigate={setActivePage} />}
      {activePage === 'profile' && <ProfilePage onNavigate={setActivePage} />}
      {activePage === 'admin' && <AdminPage onNavigate={setActivePage} />}
      {activePage === 'budget' && <BudgetPage onNavigate={setActivePage} />}
      {activePage === 'location' && <LocationPage onNavigate={setActivePage} />}
      {activePage === 'substitutions' && <SubstitutionsPage onNavigate={setActivePage} />}
      {activePage === 'supermarkets' && <SupermarketsPage onNavigate={setActivePage} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}