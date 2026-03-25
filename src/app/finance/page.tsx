'use client';

import { Suspense, lazy, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Building, AlertCircle } from 'lucide-react';

const FinanceScene = lazy(() => import('@/components/3d/FinanceScene').then(mod => ({ default: mod.FinanceScene })));

export default function FinancePage() {
  const [hectares, setHectares] = useState(42.5);
  const [yieldTons, setYieldTons] = useState(1280);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Income Prediction & Finance</h1>
          <p className="text-muted-foreground mt-1">Simulate land yield vs projected market value.</p>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)] min-h-[600px]">
          
          {/* Left Panel: Calculator */}
          <div className="col-span-1 lg:col-span-5 h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-2xl h-full flex flex-col"
            >
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Projection Tool</h3>
              <h2 className="text-4xl font-bold tracking-tight mb-8">Financial Growth Calculator</h2>
              <p className="text-muted-foreground mb-8">Analyze the yield potential and economic viability of your arboretum expansion.</p>

              <div className="space-y-8 flex-grow">
                {/* Sliders */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Farm Size (Hectares)</label>
                    <span className="text-xl font-bold">{hectares} <span className="text-sm font-normal text-muted-foreground">ha</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="500" step="0.5" 
                    value={hectares} 
                    onChange={(e) => setHectares(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1 ha</span>
                    <span>500 ha</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Estimated Annual Yield</label>
                    <span className="text-xl font-bold">{yieldTons.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tons</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="100" max="5000" step="10" 
                    value={yieldTons} 
                    onChange={(e) => setYieldTons(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>100 tons</span>
                    <span>5,000 tons</span>
                  </div>
                </div>

                {/* Info Blocks */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">Base Cost</label>
                    <div className="text-2xl font-bold">$124.50</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">Projected Sale</label>
                    <div className="text-2xl font-bold text-primary">$606.50</div>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20">
                <TrendingUp className="w-5 h-5" />
                <span>Recalculate Model</span>
              </button>
            </motion.div>
          </div>

          {/* Right Panel: Visualization & KPIs */}
          <div className="col-span-1 lg:col-span-7 flex flex-col space-y-6 h-full">
            
            {/* Top KPIs Row */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl relative overflow-hidden"
              >
                <Building className="absolute -right-4 -top-4 w-24 h-24 text-primary/5" />
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Return on Investment</h4>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold">18.4%</span>
                  <span className="text-sm font-semibold text-primary mb-1">Year 3</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-[80%]">Exceeding industry benchmark of 14.2% for organic palm development.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 rounded-2xl relative overflow-hidden"
              >
                <DollarSign className="absolute -right-4 -top-4 w-24 h-24 text-primary/5" />
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Net Profit Margin</h4>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold">$2.4M</span>
                  <span className="text-sm font-semibold text-muted-foreground mb-1">/ Annum</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-[80%]">Projected stabilized revenue starting Q4 2026 with full harvest automation.</p>
              </motion.div>
            </div>

            {/* 3D Visualizer Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-grow glass-panel rounded-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center z-10 bg-background/50 backdrop-blur">
                <h3 className="font-bold text-lg">10-Year Growth Projection</h3>
                <div className="flex space-x-2">
                  <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground">Revenue</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-xs font-semibold text-foreground">Sustainability</span>
                </div>
              </div>

              <div className="flex-grow w-full relative">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center abstract-loading bg-secondary/20">
                    <TrendingUp className="w-8 h-8 animate-pulse text-primary/50" />
                  </div>
                }>
                  <FinanceScene hectares={hectares} yieldTons={yieldTons} />
                </Suspense>

                {/* Floating Metric Card inside canvas area */}
                <div className="absolute bottom-8 left-8 p-4 bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl max-w-xs pointer-events-none shadow-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(76,175,80,1)]" />
                    <span className="font-semibold text-sm">Optimal Growth Path</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">Calculated using our proprietary Digital Arboretum engine and local soil metrics.</p>
                  <p className="text-lg font-bold">+$842,000 <span className="text-[10px] font-bold tracking-widest uppercase text-primary ml-1">Delta</span></p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
