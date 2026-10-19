import { useState } from 'react';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import ComparePage from './pages/ComparePage';
import BasketPage from './pages/BasketPage';
import OptimisePage from './pages/OptimisePage';
import PriceHistoryPage from './pages/PriceHistoryPage';
import AlertsPage from './pages/AlertsPage';
import DealsPage from './pages/DealsPage';
import SupermarketsPage from './pages/SupermarketsPage';
import LocationPage from './pages/LocationPage';
import BudgetPage from './pages/BudgetPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SubstitutionsPage from './pages/SubstitutionsPage';

export type Page =
  | 'landing' | 'dashboard' | 'search' | 'compare' | 'basket'
  | 'optimise' | 'history' | 'alerts' | 'deals' | 'supermarkets'
  | 'profile' | 'admin' | 'budget' | 'location' | 'substitutions';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NavBar currentPage={page} onNavigate={navigate} />
      <main>
        {page === 'landing'        && <LandingPage onNavigate={navigate} />}
        {page === 'dashboard'      && <Dashboard onNavigate={navigate} />}
        {page === 'search'         && <SearchPage onNavigate={navigate} onSelectProduct={setSelectedProductId} />}
        {page === 'compare'        && <ComparePage onNavigate={navigate} selectedProductId={selectedProductId} />}
        {page === 'basket'         && <BasketPage onNavigate={navigate} />}
        {page === 'optimise'       && <OptimisePage onNavigate={navigate} />}
        {page === 'history'        && <PriceHistoryPage onNavigate={navigate} />}
        {page === 'alerts'         && <AlertsPage onNavigate={navigate} />}
        {page === 'deals'          && <DealsPage onNavigate={navigate} />}
        {page === 'supermarkets'   && <SupermarketsPage onNavigate={navigate} />}
        {page === 'location'       && <LocationPage onNavigate={navigate} />}
        {page === 'budget'         && <BudgetPage onNavigate={navigate} />}
        {page === 'profile'        && <ProfilePage onNavigate={navigate} />}
        {page === 'admin'          && <AdminPage onNavigate={navigate} />}
        {page === 'substitutions'  && <SubstitutionsPage onNavigate={navigate} />}
      </main>
    </div>
  );
}
