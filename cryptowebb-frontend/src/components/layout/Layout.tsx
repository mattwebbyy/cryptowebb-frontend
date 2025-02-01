import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      <div className="content relative z-10 p-8 text-center flex-grow flex flex-col justify-center items-center  opacity-0 fade-in">
        {children}
      </div>
    </div>
  );
};