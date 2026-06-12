import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <Header />
      {/* pt-16 clears the fixed 4rem topbar; pages own their alignment */}
      <main className="relative z-10 w-full pt-16 flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};
