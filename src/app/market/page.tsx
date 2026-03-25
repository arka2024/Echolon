'use client';

import { Suspense, lazy } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { TrendingUp, Package, MapPin, Truck, Factory, ShieldCheck, ChevronRight, Settings2, SlidersHorizontal, Star } from 'lucide-react';

export default function MarketPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center space-x-2">
              <span className="text-primary">PalmArbor</span>
              <span className="text-muted-foreground font-light">/</span>
              <span>Market Linkage</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Real-time supply chain transparency and buyer logistics.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
             <div className="flex items-center space-x-3 bg-background px-4 py-2 rounded-xl shadow-sm border border-border">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <div>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">Market Index</p>
                   <p className="font-bold text-sm">+12.4%</p>
                </div>
             </div>
             <div className="flex items-center space-x-3 bg-background px-4 py-2 rounded-xl shadow-sm border border-border">
                <Package className="w-5 h-5 text-amber-700" />
                <div>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">Total Volume</p>
                   <p className="font-bold text-sm">1.2k Tons</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
            
            {/* Map View */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-[500px] rounded-3xl relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center shadow-xl"
            >
              {/* Overlay for darker map feel */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Map Floating Panel */}
              <div className="absolute top-6 left-6 z-10 bg-background/90 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg max-w-xs">
                 <div className="flex items-center space-x-2 mb-4">
                    <h3 className="font-bold text-primary">Live Infrastructure</h3>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase rounded-full tracking-wider">Active</span>
                 </div>
                 <ul className="space-y-3">
                    <li className="flex items-center text-sm font-medium">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 mr-3" />
                       Certified Collection Centers (8)
                    </li>
                    <li className="flex items-center text-sm font-medium">
                       <span className="w-2 h-2 rounded-full bg-blue-900 mr-3" />
                       Industrial Processing Units (3)
                    </li>
                    <li className="flex items-center text-sm font-medium">
                       <span className="w-2 h-2 rounded-full bg-amber-600 mr-3" />
                       Active Logistics Fleet (24)
                    </li>
                 </ul>
              </div>

              {/* Map Pins */}
              <div className="absolute top-1/2 left-1/3 bg-background p-2 rounded-lg shadow-xl cursor-pointer hover:scale-110 transition-transform">
                 <Factory className="w-5 h-5 text-foreground" />
              </div>
            </motion.div>

            {/* Supply Continuity Flow */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-[#1a1f1c] text-white p-8 rounded-3xl border border-white/5 shadow-lg w-full"
            >
               <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-8">Supply Continuity Flow</h3>
               
               <div className="flex flex-col md:flex-row items-center justify-between">
                  {/* Flow Steps */}
                  <div className="flex-1 flex items-center justify-between w-full relative pr-8">
                     
                     {/* Step 1 */}
                     <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                           <Truck className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Farmers</span>
                     </div>

                     {/* Connector */}
                     <div className="flex-1 h-[2px] mx-4 bg-white/10 relative">
                        <div className="absolute top-0 left-0 h-full w-full bg-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                     </div>

                     {/* Step 2 */}
                     <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                           <Package className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Collection</span>
                     </div>

                     {/* Connector */}
                     <div className="flex-1 h-[2px] mx-4 bg-white/10 relative">
                        <div className="absolute top-0 left-0 h-full w-[60%] bg-emerald-500/50" />
                     </div>

                     {/* Step 3 */}
                     <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                           <Factory className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Processors</span>
                     </div>

                  </div>

                  {/* Rating */}
                  <div className="mt-8 md:mt-0 md:ml-8 pl-8 md:border-l border-white/10 text-right min-w-[120px]">
                     <div className="text-4xl font-bold flex items-baseline justify-end">
                        98.4<span className="text-xl text-emerald-500 ml-1">%</span>
                     </div>
                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 max-w-[80px] ml-auto leading-tight">Efficiency Rating</p>
                  </div>
               </div>
            </motion.div>

          </div>

          {/* Sidebar Area */}
          <div className="col-span-1 lg:col-span-4 flex flex-col space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-xl font-bold">Regional Buyers</h2>
               <div className="flex space-x-2 text-muted-foreground">
                  <SlidersHorizontal className="w-5 h-5 cursor-pointer hover:text-foreground" />
                  <Settings2 className="w-5 h-5 cursor-pointer hover:text-foreground" />
               </div>
            </div>

            {/* Buyer Card 1 */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-background rounded-3xl p-6 border border-border shadow-md"
            >
               <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg max-w-[150px] leading-tight">AgriCorp Global Refineries</h3>
                  <div className="text-right">
                     <span className="text-primary font-bold text-lg">$482.50</span>
                     <span className="text-xs text-muted-foreground">/TON</span>
                  </div>
               </div>
               
               <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-6">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                     <p>12.4 km away •</p>
                     <p>West Kalimantan Sector</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex flex-col">
                     <div className="flex space-x-0.5 text-amber-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                     </div>
                     <span className="text-[10px] uppercase font-bold tracking-wider">Trust Index 9.4</span>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-wider hover:text-primary transition-colors">
                     View Terms
                  </button>
               </div>
            </motion.div>

            {/* Buyer Card 2 */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-background rounded-3xl p-6 border border-border shadow-md"
            >
               <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg leading-tight">Nusantara Oils Ltd.</h3>
                  <div className="text-right">
                     <span className="text-primary font-bold text-lg">$495.00</span>
                     <span className="text-xs text-muted-foreground">/TON</span>
                  </div>
               </div>
               
               <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                     <p>28.1 km away • Coastal</p>
                  </div>
               </div>
            </motion.div>

            {/* Logistics CTA */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               className="bg-[#153423] text-white rounded-3xl p-8 border border-emerald-900/50 shadow-xl"
            >
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6">Logistics Optimization</h4>
               <h2 className="text-2xl font-bold mb-4">Book Smart Fleet Transport</h2>
               <p className="text-sm text-emerald-100/70 leading-relaxed mb-8">Reduce carbon footprint by 22% using shared haulage routes with neighboring farms.</p>
               
               <button className="w-full bg-[#A2ECAE] hover:bg-[#8CD898] text-[#153423] font-bold py-3.5 rounded-xl text-sm transition-colors shadow-[0_4px_14px_rgba(162,236,174,0.3)]">
                  REQUEST QUOTE
               </button>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
