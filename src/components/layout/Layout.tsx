import { ReactNode } from 'react';
import { Header } from './Header'; // adjust the import path as necessary

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen w-full py-16">
      <Header />
      <div className="content relative z-10 w-full max-w-full p-4 sm:p-6 md:p-8 text-center flex-grow flex flex-col justify-center items-center opacity-0 fade-in pt-24">
        {children}
      </div>
    </div>
  );
};
