'use client';

import { Suspense, lazy } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, ChevronDown, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-12 pb-24">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
          <div className="flex flex-col">
            <div className="inline-flex max-w-fit items-center px-3 py-1 mb-6 rounded-full bg-[#A2ECAE]/30 border border-[#A2ECAE]/50">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#153423] dark:text-[#A2ECAE]">Network Insights</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Farmer Success<br/>
              <span className="text-[#8B6B4A]">Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Discover how precision agriculture is transforming landscapes and lives. From soil rejuvenation to record-breaking yields, these are the voices of the modern digital arboretum.
            </p>
          </div>

          <div className="flex flex-col justify-end h-full">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                 type="text" 
                 placeholder="Search by region or crop..." 
                 className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold">
               <button className="px-4 py-2 bg-[#153423] text-white rounded-full hover:bg-[#204a33] transition-colors">All Stories</button>
               <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">Yield Growth</button>
               <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">Sustainability</button>
               <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">Tech Adoption</button>
            </div>
          </div>
        </div>

        {/* Masonry Layout Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* Column 1 */}
          <div className="flex flex-col space-y-6">
            
            {/* Story 1 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-48 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop" alt="Happy Farmer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">Yield Growth</span>
                     <span>8 min read</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">Restoring the Heritage: How Marcus Tripled His Output</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">Using TerraForge sensor arrays, Marcus managed to identify critical micronutrient deficiencies that had been holding back his family estate for decades...</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>

            {/* Story 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-64 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop" alt="Vineyard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">Sustainability</span>
                     <span>12 min read</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">The 100% Water-Neutral Vineyard Project</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">In the heart of the arid valley, Elena's vineyard became the first in the region to achieve total water neutrality through predictive atmospheric monitoring...</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>

          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-6">
            
            {/* Quote Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-[#153423] p-10 rounded-3xl text-white relative overflow-hidden shadow-xl"
            >
               <div className="text-6xl text-emerald-500/20 font-serif absolute top-4 left-6">"</div>
               <p className="text-2xl italic font-serif leading-relaxed mb-8 relative z-10 text-emerald-50">
                  "Technology didn't replace my intuition as a farmer; it gave my intuition the data it needed to finally thrive."
               </p>
               <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/30 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=100&auto=format&fit=crop" alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                     <p className="text-[10px] text-emerald-300 uppercase tracking-widest">Jenkins Organic Farms</p>
                  </div>
               </div>
            </motion.div>

            {/* Story 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-48 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1585241936939-f9fbebc7de23?q=80&w=600&auto=format&fit=crop" alt="Greenhouse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">Tech Adoption</span>
                     <span>6 min read</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">From Urban Lot to High-Yield Vertical Core</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">See how a group of community activists in Seattle repurposed an old warehouse into a TerraForge-powered vertical farm serving 500 families...</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>

          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-6">
            
            {/* Story 4 (Tall) */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-[25rem] w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop" alt="Wheat field sunset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-[#8B6B4A]">Network Expansion</span>
                     <span>15 min read</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">The Global Seed Bridge: Connecting Two Hemispheres</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">How shared data between Brazilian and Australian grain growers created a new resilient seed strain that resists climate fluctuations...</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>

            {/* Join CTA */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="bg-background rounded-3xl p-8 shadow-sm border-l-[6px] border-[#A2ECAE] flex flex-col items-start"
            >
               <div className="w-12 h-12 rounded-xl bg-[#A2ECAE]/30 flex items-center justify-center text-[#153423] mb-5 font-bold">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-foreground mb-2">Join the Circle</h3>
               <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">Submit your own success story</p>
               <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Share your journey with the TerraForge community. Selected stories receive a premium <strong className="text-foreground">sustainability audit</strong> for their farm.
               </p>
               <button className="w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm tracking-wide rounded-xl transition-colors">
                  Apply to Feature
               </button>
            </motion.div>

          </div>

        </div>

        <div className="flex justify-center pt-8">
           <button className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center">
              Show More Stories
              <ChevronDown className="w-4 h-4 mt-2" />
           </button>
        </div>

      </div>

      {/* Background Graphic Lines (Abstract Connection lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
         <path d="M 0,30 L 40,50 L 100,10" stroke="currentColor" className="text-white/5 dark:text-white/2" strokeWidth="0.5" fill="none" />
         <path d="M 0,70 L 60,60 L 100,80" stroke="currentColor" className="text-white/5 dark:text-white/2" strokeWidth="0.5" fill="none" />
      </svg>
    </DashboardLayout>
  );
}
