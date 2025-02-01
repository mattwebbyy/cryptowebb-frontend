// src/components/layout/Footer.tsx
export const Footer = () => {
    return (
      <footer className="w-full py-6 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-matrix-green/70">
          <p>&copy; {new Date().getFullYear()} Cryptowebb Portfolio. All rights reserved.</p>
        </div>
      </footer>
    );
  };