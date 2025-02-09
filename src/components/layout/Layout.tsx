import { ReactNode } from 'react';
import { Header } from './Header'; // adjust the import path as necessary

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="content relative z-10 p-8 text-center flex-grow flex flex-col justify-center items-center opacity-0 fade-in pt-20">
        {children}
      </div>
    </div>
  );
};
