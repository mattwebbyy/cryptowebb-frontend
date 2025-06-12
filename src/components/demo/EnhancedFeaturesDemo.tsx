// src/components/demo/EnhancedFeaturesDemo.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { EnhancedSEO } from '@/components/EnhancedSEO';
import { 
  MatrixTerminalLoader,
  GlitchSpinner,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  ProgressiveLoader,
  FloatingActionLoader
} from '@/components/ui/EnhancedLoaders';
import {
  GlitchButton,
  GlitchText,
  ScanningLine,
  MatrixCodeBlock,
  ParticleSystem,
  TerminalWindow
} from '@/components/ui/GlitchEffects';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';

export const EnhancedFeaturesDemo: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const progressSteps = [
    { label: 'Initializing quantum processors', progress: 100 },
    { label: 'Establishing secure connections', progress: 75 },
    { label: 'Loading matrix protocols', progress: 45 },
    { label: 'Synchronizing data streams', progress: 20 }
  ];

  const triggerGlitch = () => {
    setGlitchTrigger(true);
    setTimeout(() => setGlitchTrigger(false), 500);
  };

  const advanceProgress = () => {
    setProgressStep((prev) => (prev + 1) % progressSteps.length);
  };

  return (
    <>
      <EnhancedSEO
        title="Enhanced Features Demo | CryptoWebb"
        description="Demonstration of CryptoWebb's enhanced UI features including matrix animations, glitch effects, advanced loading states, and improved SEO."
        keywords={['demo', 'features', 'matrix effects', 'UI components', 'animations']}
      />

      <div className="min-h-screen pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-mono text-teal-600 dark:text-matrix-green mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlitchText trigger={glitchTrigger} intensity="medium">
                ENHANCED FEATURES DEMO
              </GlitchText>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Experience the new matrix-themed UI components, enhanced animations, and improved user experience.
            </motion.p>
          </div>

          {/* Enhanced Alerts */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Enhanced Alerts with Dark Mode
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert with proper dark mode support.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  This is an error alert that adapts to your theme preference.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Glitch Effects */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Matrix Glitch Effects
            </h2>
            <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green relative overflow-hidden">
              <ParticleSystem particleCount={30} />
              <div className="relative z-10">
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <GlitchButton 
                    variant="primary" 
                    onClick={triggerGlitch}
                    glitchIntensity="high"
                  >
                    Trigger Glitch
                  </GlitchButton>
                  
                  <GlitchButton 
                    variant="secondary"
                    glitchIntensity="medium"
                  >
                    Secondary Button
                  </GlitchButton>
                  
                  <GlitchButton 
                    variant="ghost"
                    glitchIntensity="low"
                  >
                    Ghost Button
                  </GlitchButton>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Glitch text effects: 
                  </p>
                  <GlitchText 
                    trigger={glitchTrigger} 
                    intensity="high"
                    className="text-xl font-mono text-teal-600 dark:text-matrix-green"
                  >
                    SYSTEM_ONLINE_[CONNECTED]
                  </GlitchText>
                </div>

                <div className="relative h-32 mb-6">
                  <MatrixCodeBlock density={0.3} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/90 dark:bg-black/90 px-4 py-2 rounded font-mono text-teal-600 dark:text-matrix-green">
                      Matrix Code Background
                    </span>
                  </div>
                </div>

                <TerminalWindow title="demo_terminal.exe" className="mb-6">
                  <div className="space-y-2">
                    <p>$ system_status --check</p>
                    <p className="text-green-400">✓ All systems operational</p>
                    <p>$ initialize_matrix --enhanced</p>
                    <p className="text-blue-400">Loading enhanced features...</p>
                  </div>
                </TerminalWindow>
              </div>
            </Card>
          </section>

          {/* Enhanced Loading States */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Enhanced Loading States
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Loaders */}
              <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
                <h3 className="text-lg font-semibold mb-4 text-teal-600 dark:text-matrix-green">Matrix Loaders</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Terminal Loader:</span>
                    <GlitchButton 
                      size="sm" 
                      onClick={() => setShowLoader(!showLoader)}
                    >
                      {showLoader ? 'Hide' : 'Show'}
                    </GlitchButton>
                  </div>

                  {showLoader && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
                      <MatrixTerminalLoader size="sm" />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-sm">Glitch Spinner:</span>
                    <GlitchSpinner size={32} />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm">Action Loader:</span>
                    <FloatingActionLoader text="Processing" size="sm" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Progressive Loader:</span>
                      <GlitchButton size="sm" onClick={advanceProgress}>
                        Next Step
                      </GlitchButton>
                    </div>
                    <ProgressiveLoader 
                      steps={progressSteps}
                      currentStep={progressStep}
                    />
                  </div>
                </div>
              </Card>

              {/* Skeleton Loaders */}
              <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-600 dark:text-matrix-green">Skeleton Loaders</h3>
                  <GlitchButton 
                    size="sm" 
                    onClick={() => setShowSkeletons(!showSkeletons)}
                  >
                    {showSkeletons ? 'Hide' : 'Show'}
                  </GlitchButton>
                </div>

                {showSkeletons ? (
                  <div className="space-y-4">
                    <SkeletonCard lines={2} imageHeight="h-24" />
                    <SkeletonTable rows={3} columns={3} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-teal-600 to-teal-800 dark:from-matrix-green dark:to-green-300 rounded flex items-center justify-center text-white dark:text-black font-mono">
                      Sample Content Card
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">Data 1</div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">Data 2</div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">Data 3</div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>

          {/* Chart Skeleton */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Chart Loading State
            </h2>
            <SkeletonChart height="h-64" showLegend={true} />
          </section>

          {/* Scanning Effects */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Scanning Line Effects
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {['System Status', 'Data Stream', 'Network Monitor'].map((title, index) => (
                <Card key={title} className="p-4 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green relative overflow-hidden">
                  <ScanningLine speed={2 + index} />
                  <div className="relative z-10">
                    <h3 className="font-mono text-teal-600 dark:text-matrix-green mb-2">{title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>Status: Online</div>
                      <div>Connection: Secure</div>
                      <div>Latency: {10 + index}ms</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Performance Metrics */}
          <section>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-matrix-green mb-4 font-mono">
              Enhanced Features Summary
            </h2>
            <Card className="p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-matrix-green" />
                  <h3 className="font-semibold text-teal-600 dark:text-matrix-green">Enhanced SEO</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive meta tags, structured data, and performance optimizations
                  </p>
                </div>
                
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-matrix-green" />
                  <h3 className="font-semibold text-teal-600 dark:text-matrix-green">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete dark mode support with smooth transitions
                  </p>
                </div>
                
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-matrix-green" />
                  <h3 className="font-semibold text-teal-600 dark:text-matrix-green">Matrix Effects</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced glitch effects and matrix-themed animations
                  </p>
                </div>
                
                <div className="text-center">
                  <Info className="w-8 h-8 mx-auto mb-2 text-teal-600 dark:text-matrix-green" />
                  <h3 className="font-semibold text-teal-600 dark:text-matrix-green">Loading States</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Skeleton screens and matrix-themed loading indicators
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </motion.div>
      </div>
    </>
  );
};

export default EnhancedFeaturesDemo;