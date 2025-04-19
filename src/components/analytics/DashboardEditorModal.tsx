// src/components/analytics/DashboardEditorModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, LineChart, BarChart, PieChart, Hash, Table, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLayout: any[]) => void;
  initialLayout?: any[];
  isEditing?: boolean;
}

const chartTypes = [
  { id: 'line', name: 'Line Chart', icon: LineChart },
  { id: 'bar', name: 'Bar Chart', icon: BarChart },
  { id: 'pie', name: 'Pie Chart', icon: PieChart },
  { id: 'number', name: 'Number Display', icon: Hash },
  { id: 'table', name: 'Data Table', icon: Table },
  { id: 'gauge', name: 'Gauge Chart', icon: Gauge },
];

const DashboardEditorModal: React.FC<DashboardEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialLayout = [],
  isEditing = false
}) => {
  const [dashboardName, setDashboardName] = useState('');
  const [selectedCharts, setSelectedCharts] = useState<any[]>(initialLayout);
  const [dashboardDesc, setDashboardDesc] = useState('');
  const [activeTab, setActiveTab] = useState<'charts' | 'settings'>('charts');

  const generateUniqueId = () => {
    return `chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const addChart = (chartType: string) => {
    const newChart = {
      i: generateUniqueId(),
      x: 0,
      y: 0,
      w: 6,
      h: 3,
      chartType,
      title: `New ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      isLive: false,
    };
    
    setSelectedCharts([...selectedCharts, newChart]);
  };

  const removeChart = (id: string) => {
    setSelectedCharts(selectedCharts.filter(chart => chart.i !== id));
  };

  const updateChartTitle = (id: string, title: string) => {
    setSelectedCharts(selectedCharts.map(chart => 
      chart.i === id ? { ...chart, title } : chart
    ));
  };

  const toggleLiveData = (id: string) => {
    setSelectedCharts(selectedCharts.map(chart => 
      chart.i === id ? { ...chart, isLive: !chart.isLive } : chart
    ));
  };

  const handleSave = () => {
    // Perform validation before saving
    if (!dashboardName.trim() && !isEditing) {
      alert('Please enter a dashboard name');
      return;
    }
    
    if (selectedCharts.length === 0) {
      alert('Please add at least one chart to your dashboard');
      return;
    }
    
    // Pass the new layout back to the parent component
    onSave({
      name: dashboardName,
      description: dashboardDesc,
      layout: selectedCharts
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-black border border-matrix-green/70 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-matrix-green/30 flex justify-between items-center">
          <h2 className="text-xl font-mono text-matrix-green">
            {isEditing ? 'Edit Dashboard' : 'Create New Dashboard'}
          </h2>
          <button 
            onClick={onClose}
            className="text-matrix-green/70 hover:text-matrix-green"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-matrix-green/30">
          <button
            className={`px-4 py-2 font-mono ${activeTab === 'charts' 
              ? 'text-matrix-green border-b-2 border-matrix-green' 
              : 'text-matrix-green/60 hover:text-matrix-green'}`}
            onClick={() => setActiveTab('charts')}
          >
            Charts
          </button>
          <button
            className={`px-4 py-2 font-mono ${activeTab === 'settings' 
              ? 'text-matrix-green border-b-2 border-matrix-green' 
              : 'text-matrix-green/60 hover:text-matrix-green'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'charts' ? (
              <motion.div
                key="charts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h3 className="text-lg text-matrix-green mb-2">Add Charts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {chartTypes.map(chart => (
                      <button
                        key={chart.id}
                        onClick={() => addChart(chart.id)}
                        className="p-3 border border-matrix-green/30 rounded bg-black/50 hover:bg-matrix-green/10 hover:border-matrix-green/60 flex items-center gap-2"
                      >
                        <chart.icon className="h-5 w-5 text-matrix-green" />
                        <span className="text-matrix-green">{chart.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg text-matrix-green mb-2">Selected Charts</h3>
                  {selectedCharts.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-matrix-green/30 rounded">
                      <p className="text-matrix-green/60">No charts added yet. Add charts from above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCharts.map(chart => (
                        <div 
                          key={chart.i} 
                          className="p-3 border border-matrix-green/30 rounded bg-black/50 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {/* Icon based on chart type */}
                            {chartTypes.find(c => c.id === chart.chartType)?.icon && 
                              React.createElement(
                                chartTypes.find(c => c.id === chart.chartType)?.icon as any, 
                                { className: "h-5 w-5 text-matrix-green" }
                              )
                            }
                            <input 
                              type="text"
                              value={chart.title}
                              onChange={(e) => updateChartTitle(chart.i, e.target.value)}
                              className="bg-transparent border-b border-matrix-green/30 focus:border-matrix-green focus:outline-none px-1 py-0.5 text-matrix-green flex-1"
                            />
                          </div>
                          
                          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                            <label className="flex items-center gap-2 text-sm">
                              <input 
                                type="checkbox" 
                                checked={chart.isLive}
                                onChange={() => toggleLiveData(chart.i)}
                                className="rounded border-matrix-green/50 bg-black/50 text-matrix-green focus:ring-matrix-green"
                              />
                              <span className="text-matrix-green/70">Live Data</span>
                            </label>
                            
                            <button
                              onClick={() => removeChart(chart.i)}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Remove chart"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-matrix-green mb-1">Dashboard Name</label>
                    <input
                      type="text"
                      value={dashboardName}
                      onChange={(e) => setDashboardName(e.target.value)}
                      placeholder="Enter dashboard name"
                      className="w-full p-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green focus:border-matrix-green focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-matrix-green mb-1">Description (Optional)</label>
                    <textarea
                      value={dashboardDesc}
                      onChange={(e) => setDashboardDesc(e.target.value)}
                      placeholder="Enter dashboard description"
                      rows={4}
                      className="w-full p-2 bg-black/50 border border-matrix-green/50 rounded text-matrix-green focus:border-matrix-green focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  
                  {/* Additional settings could go here - themes, refresh rates, etc. */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-matrix-green/30 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-matrix-green/50 text-matrix-green hover:bg-matrix-green/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-matrix-green text-black hover:bg-matrix-green/80"
          >
            {isEditing ? 'Update Dashboard' : 'Create Dashboard'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardEditorModal;