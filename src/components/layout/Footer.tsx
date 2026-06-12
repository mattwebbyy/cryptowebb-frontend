// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Docs', to: '/docs' },
  { label: 'Contact', to: '/contact' },
];

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="w-2 h-2 rounded-sm bg-primary" aria-hidden="true" />
          <span>&copy; {new Date().getFullYear()} CryptoWebb. All rights reserved.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-text-secondary hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
