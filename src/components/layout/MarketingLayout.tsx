// src/components/layout/MarketingLayout.tsx — top navbar + footer shell for
// marketing/content pages. Product surfaces render inside AppShell instead.
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MarketingLayout = () => (
  <div className="relative min-h-screen w-full flex flex-col">
    <Header />
    {/* pt-16 clears the fixed 4rem topbar; pages own their alignment */}
    <main className="relative z-10 w-full pt-16 flex-1 flex flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MarketingLayout;
