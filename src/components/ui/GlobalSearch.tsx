// src/components/ui/GlobalSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

  // Color classes based on theme - always use teal in light mode
  const getColorClasses = () => {
    if (theme.mode === 'light') {
      return {
        primary: 'text-teal-600',
        primaryBorder: 'border-teal-600',
        primaryHover: 'hover:border-teal-600/50',
        primaryBg: 'bg-teal-600/10',
        text: 'text-teal-600',
        textSecondary: 'text-teal-600/70',
        placeholder: 'placeholder-teal-600/50',
        surface: 'bg-white/95',
        border: 'border-teal-600/30',
        modalBorder: 'border-teal-600/50'
      };
    } else {
      return {
        primary: 'text-matrix-green',
        primaryBorder: 'border-matrix-green',
        primaryHover: 'hover:border-matrix-green/50',
        primaryBg: 'bg-matrix-green/10',
        text: 'text-matrix-green',
        textSecondary: 'text-matrix-green/70',
        placeholder: 'placeholder-matrix-green/50',
        surface: 'bg-black/95',
        border: 'border-matrix-green/30',
        modalBorder: 'border-matrix-green/50'
      };
    }
  };

  const colorClasses = getColorClasses();

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
          className={`w-full flex items-center gap-2 px-3 py-2 ${theme.mode === 'light' ? 'bg-white/80' : 'bg-black/20'} border ${colorClasses.border} rounded-lg ${colorClasses.textSecondary} ${colorClasses.text} ${colorClasses.primaryHover} transition-all duration-200 text-left backdrop-blur-sm`}
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
            <div className={`absolute top-0 left-0 w-80 z-50 ${colorClasses.surface} border ${colorClasses.modalBorder} rounded-lg shadow-2xl ${theme.mode === 'light' ? 'shadow-teal-600/20' : 'shadow-matrix-green/20'} backdrop-blur-md`}>
              <form onSubmit={handleSubmit} className="relative">
                <div className={`flex items-center gap-3 p-3 border-b ${colorClasses.border}`}>
                  <Search className={`w-4 h-4 ${colorClasses.primary} flex-shrink-0`} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages and features..."
                    className={`flex-1 bg-transparent ${colorClasses.text} ${colorClasses.placeholder} border-none outline-none`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={onOpenCommandPalette}
                    className={`text-xs ${colorClasses.textSecondary} ${colorClasses.text} px-2 py-1 border ${colorClasses.border} rounded flex-shrink-0 transition-colors`}
                    title="Open advanced search"
                  >
                    Cmd+K
                  </button>
                </div>

                {/* Quick Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="p-2">
                    <div className={`text-xs ${colorClasses.textSecondary} mb-2 px-2`}>Quick Results</div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.path}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.path)}
                        className={`w-full flex items-center gap-3 p-2 text-left rounded ${colorClasses.primaryBg} transition-colors`}
                      >
                        <Search className={`w-4 h-4 ${colorClasses.primary}`} />
                        <span className={colorClasses.textSecondary}>{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query.trim() && filteredSuggestions.length === 0 && (
                  <div className="p-4 text-center">
                    <p className={`${colorClasses.textSecondary} text-sm mb-2`}>No quick results found</p>
                    <button
                      type="button"
                      onClick={onOpenCommandPalette}
                      className={`${colorClasses.primary} text-sm hover:underline`}
                    >
                      Try advanced search (Cmd+K)
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className={`p-2 border-t ${colorClasses.border} ${theme.mode === 'light' ? 'bg-teal-600/5' : 'bg-matrix-green/5'}`}>
                  <div className={`flex items-center justify-between text-xs ${colorClasses.textSecondary}`}>
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