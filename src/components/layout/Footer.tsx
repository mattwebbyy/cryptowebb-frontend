// src/components/layout/Footer.tsx — column footer; carries the secondary
// navigation (company/content pages) so the topbar stays minimal.
import { Link } from 'react-router-dom';

const columns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Token launches', to: '/launches' },
      { label: 'Whale tracking', to: '/whales' },
      { label: 'Exchange flows', to: '/flows' },
      { label: 'Smart money', to: '/smart-money' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'API docs', to: '/docs' },
      { label: 'System status', to: '/status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          <div className="md:max-w-xs">
            <div className="flex items-center gap-2 text-text font-semibold tracking-tight">
              <span className="w-2 h-2 rounded-[3px] bg-primary" aria-hidden="true" />
              CryptoWebb
            </div>
            <p className="mt-3 text-[13px] text-text-secondary leading-relaxed">
              Real-time onchain intelligence — token launches, whale movements and exchange
              flows, indexed from the chain by our own infrastructure.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-text-secondary/70 mb-3">
                  {col.heading}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[13px] text-text-secondary hover:text-text transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-[13px] text-text-secondary">
          &copy; {new Date().getFullYear()} CryptoWebb. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
