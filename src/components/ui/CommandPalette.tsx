// src/components/ui/CommandPalette.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BarChart3, 
  Settings, 
  Home, 
  Database, 
  Bell, 
  Eye,
  ArrowRight,
  Command,
  X,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDataMetricsList } from '@/features/dataMetrics/api/useDataMetrics';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: metrics } = useDataMetricsList();

  // Define static commands
  const staticCommands: Command[] = [
    {
      id: 'nav-home',
      label: 'Go to Home',
      description: 'Navigate to the home page',
      icon: <Home className="w-4 h-4" />,
      action: () => navigate('/'),
      category: 'Navigation',
      keywords: ['home', 'main', 'dashboard'],
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics',
      description: 'Open the analytics dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate('/analytics'),
      category: 'Navigation',
      keywords: ['analytics', 'charts', 'data'],
    },
    {
      id: 'nav-datasources',
      label: 'Go to Data Sources',
      description: 'Manage data sources',
      icon: <Database className="w-4 h-4" />,
      action: () => navigate('/analytics/datasources'),
      category: 'Navigation',
      keywords: ['data', 'sources', 'connections'],
    },
    {
      id: 'nav-live-crypto',
      label: 'Go to Live Crypto',
      description: 'Real-time crypto data feed',
      icon: <Zap className="w-4 h-4" />,
      action: () => navigate('/live-crypto'),
      category: 'Navigation',
      keywords: ['live', 'crypto', 'real-time', 'feed', 'websocket'],
    },
    {
      id: 'nav-alerts',
      label: 'Go to Alerts',
      description: 'Manage your alerts',
      icon: <Bell className="w-4 h-4" />,
      action: () => navigate('/alerts'),
      category: 'Navigation',
      keywords: ['alerts', 'notifications', 'monitoring'],
    },
    {
      id: 'nav-launches',
      label: 'Go to Token Launches',
      description: 'Live feed of new token launches',
      icon: <Eye className="w-4 h-4" />,
      action: () => navigate('/launches'),
      category: 'Navigation',
      keywords: ['launches', 'new', 'tokens', 'pairs'],
    },
    {
      id: 'nav-whales',
      label: 'Go to Whale Feed',
      description: 'Large transfers with exchange labels',
      icon: <Zap className="w-4 h-4" />,
      action: () => navigate('/whales'),
      category: 'Navigation',
      keywords: ['whales', 'transfers', 'cex'],
    },
    {
      id: 'nav-flows',
      label: 'Go to Exchange Flows',
      description: 'Deposits vs withdrawals per exchange',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate('/flows'),
      category: 'Navigation',
      keywords: ['flows', 'exchange', 'deposits', 'withdrawals'],
    },
    {
      id: 'nav-smart-money',
      label: 'Go to Smart Money',
      description: 'Top trader leaderboard',
      icon: <Database className="w-4 h-4" />,
      action: () => navigate('/smart-money'),
      category: 'Navigation',
      keywords: ['smart', 'money', 'traders', 'leaderboard'],
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Open settings page',
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate('/settings/api'),
      category: 'Navigation',
      keywords: ['settings', 'preferences', 'config'],
    },
  ];

  // Generate metric commands
  const metricCommands: Command[] = useMemo(() => {
    if (!metrics) return [];
    
    return metrics.map(metric => ({
      id: `metric-${metric.MetricID}`,
      label: `View ${metric.MetricName}`,
      description: `${metric.Description} (${metric.Blockchain})`,
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate(`/analytics/metrics/${metric.MetricID}`),
      category: 'Metrics',
      keywords: [
        metric.MetricName.toLowerCase(),
        metric.Blockchain.toLowerCase(),
        metric.Category?.toLowerCase() || '',
        'metric',
        'chart',
        'data',
      ],
    }));
  }, [metrics, navigate]);

  // Combine all commands
  const allCommands = useMemo(() => {
    return [...staticCommands, ...metricCommands];
  }, [metricCommands]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return allCommands.slice(0, 8); // Show first 8 commands when no query
    }

    const lowerQuery = query.toLowerCase();
    return allCommands
      .filter(command => {
        const searchText = [
          command.label.toLowerCase(),
          command.description?.toLowerCase() || '',
          ...(command.keywords || []),
        ].join(' ');
        
        return searchText.includes(lowerQuery);
      })
      .slice(0, 10); // Limit to 10 results
  }, [query, allCommands]);

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const handleCommandClick = (command: Command) => {
    command.action();
    onClose();
  };

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-[40rem] max-w-[calc(100vw-2rem)] z-50"
      >
        <Card className="bg-surface border border-border shadow-2xl overflow-hidden" hover={false}>
          {/* Header */}
          <div className="px-4 py-1 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, navigate to pages..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-text placeholder:text-text-secondary/60 focus:outline-none text-base"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-palette-list"
                  aria-activedescendant={
                    filteredCommands[selectedIndex]
                      ? `command-option-${filteredCommands[selectedIndex].id}`
                      : undefined
                  }
                  aria-autocomplete="list"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-text-secondary hover:text-text"
                aria-label="Close command palette"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Commands */}
          <div
            id="command-palette-list"
            role="listbox"
            aria-label="Commands"
            className="max-h-96 overflow-y-auto"
          >
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h3 className="text-[11px] font-medium text-text-secondary/70 uppercase tracking-wider px-3 py-2">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {commands.map((command) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <button
                            key={command.id}
                            id={`command-option-${command.id}`}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleCommandClick(command)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 ${
                              isSelected ? 'bg-primary/10' : 'hover:bg-surface-2'
                            }`}
                          >
                            <div className={`flex-shrink-0 ${isSelected ? "text-primary" : "text-text-secondary"}`}>
                              {command.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-text font-medium">
                                {command.label}
                              </div>
                              {command.description && (
                                <div className="text-xs text-text-secondary truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary" : "text-text-secondary/40"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-surface-2/50">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd>↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd>↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd>esc</kbd>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>Command Palette</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CommandPalette;