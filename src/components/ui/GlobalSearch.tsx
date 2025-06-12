// src/components/ui/GlobalSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
interface GlobalSearchProps {
  onOpenCommandPalette: () => void;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  onOpenCommandPalette, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Using Tailwind's dark: modifier instead of custom theme logic

  // Quick search suggestions
  const quickSuggestions = [
    { label: 'Analytics Dashboard', path: '/analytics', keywords: ['analytics', 'dashboard', 'charts'] },
    { label: 'Live Crypto Feed', path: '/analytics/live-crypto', keywords: ['live', 'crypto', 'real-time', 'feed'] },
    { label: 'Data Sources', path: '/analytics/datasources', keywords: ['data', 'sources', 'connections'] },
    { label: 'Alerts', path: '/analytics/alerts', keywords: ['alerts', 'notifications', 'monitoring'] },
    { label: 'Cipher Matrix', path: '/analytics/cipher-matrix', keywords: ['cipher', 'matrix', 'view'] },
    { label: 'Dashboard', path: '/dashboard', keywords: ['dashboard', 'profile', 'settings'] },
    { label: 'Blog', path: '/blog', keywords: ['blog', 'posts', 'articles'] },
    { label: 'About', path: '/about', keywords: ['about', 'info', 'company'] },
    { label: 'Contact', path: '/contact', keywords: ['contact', 'support', 'help'] },
    { label: 'Pricing', path: '/pricing', keywords: ['pricing', 'plans', 'subscription'] },
  ];

  const filteredSuggestions = query.trim() 
    ? quickSuggestions.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredSuggestions.length > 0) {
      navigate(filteredSuggestions[0].path);
      handleClose();
    } else {
      // Open command palette for more advanced search
      onOpenCommandPalette();
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleSuggestionClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative w-64">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-black/20 border border-teal-600/30 dark:border-matrix-green/30 rounded-lg text-teal-600/70 dark:text-matrix-green/70 text-teal-600 dark:text-matrix-green hover:border-teal-600/50 dark:hover:border-matrix-green/50 transition-all duration-200 text-left backdrop-blur-sm"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm flex-1 truncate">Search...</span>
          <div className="flex items-center gap-1 text-xs opacity-60 flex-shrink-0">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        {/* Overlay when open */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            {/* Search Modal */}
            <div className="absolute top-0 left-0 w-80 z-50 bg-white/95 dark:bg-black/95 border border-teal-600/50 dark:border-matrix-green/50 rounded-lg shadow-2xl shadow-teal-600/20 dark:shadow-matrix-green/20 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-3 p-3 border-b border-teal-600/30 dark:border-matrix-green/30">
                  <Search className="w-4 h-4 text-teal-600 dark:text-matrix-green flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages and features..."
                    className="flex-1 bg-transparent text-teal-600 dark:text-matrix-green placeholder-teal-600/50 dark:placeholder-matrix-green/50 border-none outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={onOpenCommandPalette}
                    className="text-xs text-teal-600/70 dark:text-matrix-green/70 text-teal-600 dark:text-matrix-green px-2 py-1 border border-teal-600/30 dark:border-matrix-green/30 rounded flex-shrink-0 transition-colors"
                    title="Open advanced search"
                  >
                    Cmd+K
                  </button>
                </div>

                {/* Quick Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs text-teal-600/70 dark:text-matrix-green/70 mb-2 px-2">Quick Results</div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.path}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.path)}
                        className="w-full flex items-center gap-3 p-2 text-left rounded bg-teal-600/10 dark:bg-matrix-green/10 transition-colors"
                      >
                        <Search className="w-4 h-4 text-teal-600 dark:text-matrix-green" />
                        <span className="text-teal-600/70 dark:text-matrix-green/70">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query.trim() && filteredSuggestions.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-teal-600/70 dark:text-matrix-green/70 text-sm mb-2">No quick results found</p>
                    <button
                      type="button"
                      onClick={onOpenCommandPalette}
                      className="text-teal-600 dark:text-matrix-green text-sm hover:underline"
                    >
                      Try advanced search (Cmd+K)
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="p-2 border-t border-teal-600/30 dark:border-matrix-green/30 bg-teal-600/5 dark:bg-matrix-green/5">
                  <div className="flex items-center justify-between text-xs text-teal-600/70 dark:text-matrix-green/70">
                    <span>Press Enter to navigate</span>
                    <span>ESC to close</span>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;