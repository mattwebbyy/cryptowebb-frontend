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
import { getModifierSymbol } from '@/hooks/useKeyboardShortcuts';

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
      action: () => navigate('/analytics/live-crypto'),
      category: 'Navigation',
      keywords: ['live', 'crypto', 'real-time', 'feed', 'websocket'],
    },
    {
      id: 'nav-alerts',
      label: 'Go to Alerts',
      description: 'Manage your alerts',
      icon: <Bell className="w-4 h-4" />,
      action: () => navigate('/analytics/alerts'),
      category: 'Navigation',
      keywords: ['alerts', 'notifications', 'monitoring'],
    },
    {
      id: 'nav-cipher',
      label: 'Go to Cipher Matrix',
      description: 'Open the cipher matrix view',
      icon: <Eye className="w-4 h-4" />,
      action: () => navigate('/analytics/cipher-matrix'),
      category: 'Navigation',
      keywords: ['cipher', 'matrix', 'view'],
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Open settings page',
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate('/dashboard/settings'),
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50">
        <Card className="bg-black/95 border border-matrix-green/50 shadow-2xl shadow-matrix-green/20">
          {/* Header */}
          <div className="p-4 border-b border-matrix-green/30">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-matrix-green/60" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, navigate to pages..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-matrix-green placeholder-matrix-green/50 focus:outline-none text-lg"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-matrix-green/60 hover:text-matrix-green"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Commands */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-matrix-green/60">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h3 className="text-xs font-semibold text-matrix-green/60 uppercase tracking-wider px-3 py-2">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {commands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <button
                            key={command.id}
                            onClick={() => handleCommandClick(command)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-150 ${
                              isSelected
                                ? 'bg-matrix-green/20 border border-matrix-green/50'
                                : 'hover:bg-matrix-green/10 border border-transparent'
                            }`}
                          >
                            <div className="flex-shrink-0 text-matrix-green/70">
                              {command.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-matrix-green font-medium">
                                {command.label}
                              </div>
                              {command.description && (
                                <div className="text-xs text-matrix-green/60 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-matrix-green/40 flex-shrink-0" />
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
          <div className="p-3 border-t border-matrix-green/30 bg-black/50">
            <div className="flex items-center justify-between text-xs text-matrix-green/60">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-matrix-green/10 border border-matrix-green/30 rounded text-xs">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-matrix-green/10 border border-matrix-green/30 rounded text-xs">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-matrix-green/10 border border-matrix-green/30 rounded text-xs">Esc</kbd>
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