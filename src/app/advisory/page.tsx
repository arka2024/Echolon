'use client';

import { Suspense, lazy, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Sun, Droplet, Sprout, TriangleAlert, CloudRain, Snowflake, Leaf } from 'lucide-react';

const AdvisoryScene = lazy(() => import('@/components/3d/AdvisoryScene').then(mod => ({ default: mod.AdvisoryScene })));

export default function AdvisoryPage() {
  const [cropStage, setCropStage] = useState('vegetative');
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Advisory Dashboard</h1>
            <p className="text-muted-foreground mt-1">Precision insights for your harvest cycle.</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              Healthy Soil
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              High Yield Potential
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Panel: Inputs & Metrics */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            
            {/* Input Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-primary" />
                <span>Land Parameters</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Soil Type</label>
                  <select className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all">
                    <option>Loamy Clay (Optimal)</option>
                    <option>Sandy Loam</option>
                    <option>Peat Soil</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</label>
                    <input type="text" defaultValue="Napa Valley, CA" className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm text-foreground" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Crop Stage</label>
                    <select 
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value)}
                      className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    >
                      <option value="seedling">Seedling</option>
                      <option value="vegetative">Mid-Vegetative</option>
                      <option value="flowering">Flowering</option>
                      <option value="harvest">Pre-Harvest</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weather Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">7-Day Forecast</h3>
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              
              <div className="flex justify-between items-center text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground font-semibold mb-2">MON</span>
                  <CloudRain className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-sm font-bold">72°</span>
                </div>
                <div className="flex flex-col items-center bg-primary/10 rounded-xl px-4 py-2 ring-1 ring-primary/20">
                  <span className="text-xs text-primary font-bold mb-2">TUE</span>
                  <Sun className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-sm font-bold text-primary">84°</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground font-semibold mb-2">WED</span>
                  <CloudRain className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-bold">78°</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground font-semibold mb-2">THU</span>
                  <Snowflake className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-bold">68°</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-destructive/10 flex items-start space-x-3">
                <TriangleAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-destructive/90 font-medium italic">High humidity alert for Wednesday evening</p>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Visualization & Actions */}
          <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
            
            {/* 3D Visualizer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow w-full h-[400px] lg:h-[450px] relative rounded-3xl overflow-hidden glass-panel border border-white/5"
            >
              {/* Overlay texts */}
              <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <h2 className="text-2xl font-bold drop-shadow-md">V4 Stage Model</h2>
                <p className="text-sm text-foreground/80 font-medium">Interactive 3D Lifecycle Projection</p>
              </div>

              <div className="absolute top-6 right-6 z-10 flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center cursor-pointer hover:bg-background/80 transition-colors">
                  <span className="text-xs font-bold leading-none select-none">3D</span>
                </div>
              </div>

              {/* Suspense Wrapper for 3D logic */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 absolute inset-0">
                  <div className="animate-pulse flex flex-col items-center text-primary/50">
                    <Sprout className="w-10 h-10 mb-4 animate-bounce" />
                    <span>Rendering Organics...</span>
                  </div>
                </div>
              }>
                <AdvisoryScene cropStage={cropStage} />
              </Suspense>

              {/* Progress Bar Overlay */}
              <div className="absolute bottom-6 right-6 z-10 w-48 bg-background/60 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Growth Progress</span>
                  <span className="text-xs font-bold text-primary">64%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full shadow-[0_0_10px_rgba(76,175,80,0.5)]" />
                </div>
              </div>
            </motion.div>

            {/* Recommendations Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Optimal Irrigation</h4>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3">Scheduled: Day 4</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Based on current moisture levels (22%), we recommend a deep soak on Thursday morning before peak temperatures.</p>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-semibold transition-colors">Dismiss</button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-5 rounded-2xl border-l-[3px] border-amber-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Fertilizer Alert</h4>
                  <p className="text-xs text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-3">Action Required</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Nitrogen levels are trending low for the current flowering stage. Apply Grade-A mix within the next 48 hours.</p>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 text-sm font-semibold transition-colors">Order Supplies</button>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
