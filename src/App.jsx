import React from 'react';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage.jsx';
import { AdminPaymentsPage } from './features/admin/AdminPaymentsPage.jsx';
import { AboutPage } from './features/legal/AboutPage.jsx';
import { DeleteAccount } from './features/legal/DeleteAccount.jsx';
import { PrivacyPolicy } from './features/legal/PrivacyPolicy.jsx';
import { RefundPolicy } from './features/legal/RefundPolicy.jsx';
import { SupportPage } from './features/legal/SupportPage.jsx';
import { HomePage } from './features/marketing/HomePage.jsx';
import { apiBaseUrl } from './lib/site.js';

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const path = window.location.pathname;

  React.useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('hashchange', closeMenu);
    return () => window.removeEventListener('hashchange', closeMenu);
  }, []);

  // Count a page view for the owner dashboard. Fire-and-forget: failures are
  // silent and never affect the visitor. Admin pages are excluded so the
  // owner's own visits don't inflate the numbers.
  React.useEffect(() => {
    if (path === '/admin' || path === '/admin-payments') return;
    try {
      fetch(`${apiBaseUrl}/api/site/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_view',
          path,
          referrer: document.referrer || '',
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLegalPage =
    path === '/privacy-policy' ||
    path === '/delete-account' ||
    path === '/support' ||
    path === '/refund-policy';
  const isAdminPage = path === '/admin-payments';
  const isAdminDashboard = path === '/admin';
  const isAboutPage = path === '/about';

  return (
    <div className="site-shell">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {path === '/privacy-policy' && <PrivacyPolicy />}
        {path === '/delete-account' && <DeleteAccount />}
        {path === '/refund-policy' && <RefundPolicy />}
        {path === '/support' && <SupportPage />}
        {isAboutPage && <AboutPage />}
        {isAdminPage && <AdminPaymentsPage />}
        {isAdminDashboard && <AdminDashboardPage />}
        {!isLegalPage && !isAdminPage && !isAdminDashboard && !isAboutPage && <HomePage />}
      </main>
      <Footer />
    </div>
  );
}
