'use client';

import { Suspense, lazy, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { TreePine, Tractor, ArrowRight, Droplets, Mountain, Banknote, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { translateTriplet } from '@/lib/translations';

const SustainabilityScene = lazy(() => import('@/components/3d/SustainabilityScene').then(mod => ({ default: mod.SustainabilityScene })));

export default function SustainabilityPage() {
   const { language } = useLanguage();
   const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-0 h-full min-h-[calc(100vh-5rem)] -mx-6 -mt-6">
        
        {/* Fullscreen Hero Split View */}
        <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden flex flex-col items-center justify-center text-white">
          
          {/* Background Images / 3D Scene Wrapper */}
          <div className="absolute inset-0 z-0 flex">
             <div className="w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center brightness-[0.6] opacity-90 transition-opacity" style={{ opacity: 1 - sliderPos/100 }} />
             <div className="w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1589115161406-89c0b1156fe5?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center brightness-[0.7] transition-opacity" style={{ opacity: sliderPos/100 }} />
          </div>

          <div className="absolute inset-0 z-0">
             <Suspense fallback={<div />}>
                <SustainabilityScene sliderPos={sliderPos} />
             </Suspense>
          </div>

          {/* Left Side Content Overlay */}
          <div className="absolute inset-y-0 left-0 w-1/2 p-12 pr-6 flex flex-col justify-center z-10 transition-opacity" style={{ opacity: (1 - (sliderPos / 100)) * 1.5 }}>
             <div className="max-w-md ml-auto">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 text-emerald-300">{tx('Natural Ecosystem', 'प्राकृतिक पारिस्थितिकी', 'প্রাকৃতিক ইকোসিস্টেম')}</span>
                <h2 className="text-5xl font-bold tracking-tight mb-12 drop-shadow-lg leading-[1.1]">Primary<br/>Rainforest</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 group hover:bg-black/40 transition-colors">
                      <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                         <Droplets className="w-4 h-4" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">{tx('Sequestration', 'कार्बन संग्रहण', 'কার্বন সিকোয়েস্ট্রেশন')}</span>
                      </div>
                      <div className="flex items-baseline space-x-1 mb-2">
                         <span className="text-4xl font-bold">450</span>
                         <span className="text-sm">tC/ha</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">High-density carbon storage across multiple forest layers.</p>
                   </div>
                   
                   <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 group hover:bg-black/40 transition-colors">
                      <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                         <TreePine className="w-4 h-4" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">{tx('Biodiversity', 'जैव विविधता', 'জীববৈচিত্র্য')}</span>
                      </div>
                      <div className="flex items-baseline space-x-1 mb-2">
                         <span className="text-4xl font-bold">98.4</span>
                         <span className="text-sm">index</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">Supporting over 1,200 unique species per square kilometer.</p>
                   </div>
                </div>

                <button className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">
                   <span>{tx('View Species Matrix', 'प्रजाति मैट्रिक्स देखें', 'প্রজাতি ম্যাট্রিক্স দেখুন')}</span>
                   <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Right Side Content Overlay */}
          <div className="absolute inset-y-0 right-0 w-1/2 p-12 pl-6 flex flex-col justify-center z-10 transition-opacity" style={{ opacity: (sliderPos / 100) * 1.5 }}>
             <div className="max-w-md mr-auto">
                <span className="inline-block px-3 py-1 bg-[#8B6B4A]/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 text-[#e0b991]">{tx('Digital Arboretum', 'डिजिटल आर्बोरेटम', 'ডিজিটাল আর্বোরেটাম')}</span>
                <h2 className="text-5xl font-bold tracking-tight mb-12 drop-shadow-lg leading-[1.1]">TerraForge<br/>Managed</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="bg-[#153423]/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 group hover:bg-[#153423]/60 transition-colors">
                      <div className="flex items-center space-x-2 text-[#A2ECAE] mb-2">
                         <TrendingUp className="w-4 h-4" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">{tx('Annual Yield', 'वार्षिक उपज', 'বার্ষিক ফলন')}</span>
                      </div>
                      <div className="flex items-baseline space-x-1 mb-2">
                         <span className="text-4xl font-bold">6.4</span>
                         <span className="text-sm">t/ha</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">Industry-leading productivity with precision fertigation.</p>
                   </div>
                   
                   <div className="bg-[#153423]/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 group hover:bg-[#153423]/60 transition-colors">
                      <div className="flex items-center space-x-2 text-[#A2ECAE] mb-2">
                         <Banknote className="w-4 h-4" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">{tx('Social Impact', 'सामाजिक प्रभाव', 'সামাজিক প্রভাব')}</span>
                      </div>
                      <div className="flex items-baseline space-x-1 mb-2">
                         <span className="text-4xl font-bold">+42%</span>
                         <span className="text-sm">Income</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">Community uplift through fair trade and educational grants.</p>
                   </div>
                </div>

                <button className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:text-[#A2ECAE] transition-colors">
                   <span>{tx('Export Impact Report', 'प्रभाव रिपोर्ट निर्यात करें', 'ইমপ্যাক্ট রিপোর্ট এক্সপোর্ট করুন')}</span>
                   <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Central Glass Control Panel */}
          <div className="z-20 w-fit bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl mx-6">
             <div className="flex items-center justify-between w-full min-w-[300px] sm:min-w-[400px] mb-8">
                <div className="flex flex-col items-center text-center space-y-2 opacity-80" style={{ opacity: sliderPos < 50 ? 1 : 0.5 }}>
                   <TreePine className="w-8 h-8 text-emerald-400 drop-shadow-sm" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Natural State</span>
                </div>
                
                <div className="text-center px-4">
                   <p className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1">{tx('Sustainability Comparison', 'स्थिरता तुलना', 'টেকসইতা তুলনা')}</p>
                   <p className="text-xs text-white/90">{tx('3D Interactive Simulation Active', '3D इंटरैक्टिव सिमुलेशन सक्रिय', '3D ইন্টারঅ্যাকটিভ সিমুলেশন সক্রিয়')}</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 opacity-80" style={{ opacity: sliderPos > 50 ? 1 : 0.5 }}>
                   <Tractor className="w-8 h-8 text-amber-500 drop-shadow-sm" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Managed Hub</span>
                </div>
             </div>
             
             <div className="w-full relative px-2">
               <input 
                  type="range" 
                  min="0" max="100" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-lg appearance-none cursor-ew-resize accent-white" 
                />
                
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mt-4">
                   <span className="text-emerald-300">{tx('Preservation Focus', 'संरक्षण फोकस', 'সংরক্ষণ ফোকাস')}</span>
                   <span className="text-amber-300">{tx('Economic Focus', 'आर्थिक फोकस', 'অর্থনৈতিক ফোকাস')}</span>
                </div>
             </div>
          </div>
          
        </div>

        {/* Informational Lower Section */}
        <div className="bg-secondary/30 w-full py-24 flex-grow z-10">
           <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold mb-4">{tx('The Equilibrium Paradox', 'संतुलन का विरोधाभास', 'সমতার প্যারাডক্স')}</h2>
                 <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {tx('Balancing planetary boundaries with human necessity requires precise, real-time data orchestration. TerraForge Systems maps the thin line between conservation and production.', 'मानव आवश्यकता और पर्यावरणीय सीमाओं के संतुलन के लिए सटीक रीयल-टाइम डेटा आवश्यक है। TerraForge संरक्षण और उत्पादन के बीच की रेखा को मैप करता है।', 'মানব প্রয়োজন ও পরিবেশগত সীমার ভারসাম্যে নির্ভুল রিয়েল-টাইম ডেটা জরুরি। TerraForge সংরক্ষণ ও উৎপাদনের মাঝের সূক্ষ্ম রেখাটি ম্যাপ করে।')}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 
                 {/* Card 1 */}
                 <div className="bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="flex w-full justify-between items-center mb-6 text-[#153423] dark:text-[#A2ECAE]">
                       <Droplets className="w-6 h-6" />
                       <span className="text-[10px] font-bold tracking-widest uppercase">Hydrology</span>
                    </div>
                    <h3 className="text-xl font-bold mb-8">Water Retainment</h3>
                    
                    <div className="w-full space-y-4 text-xs font-bold font-mono">
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>Forest</span>
                             <span>88% Efficiency</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-700 w-[88%]" />
                          </div>
                       </div>
                       
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>TerraForge</span>
                             <span>74% Efficiency</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-[#8B6B4A] w-[74%]" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="flex w-full justify-between items-center mb-6 text-[#153423] dark:text-[#A2ECAE]">
                       <Mountain className="w-6 h-6" />
                       <span className="text-[10px] font-bold tracking-widest uppercase text-[#8B6B4A]">Soil Health</span>
                    </div>
                    <h3 className="text-xl font-bold mb-8">Nutrient Density</h3>
                    
                    <div className="w-full space-y-4 text-xs font-bold font-mono">
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>Forest</span>
                             <span>92% Organic</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-700 w-[92%]" />
                          </div>
                       </div>
                       
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>TerraForge</span>
                             <span>85% Organic</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-[#8B6B4A] w-[85%]" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-background rounded-3xl p-8 shadow-sm border border-border flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="flex w-full justify-between items-center mb-6 text-[#153423] dark:text-[#A2ECAE]">
                       <Banknote className="w-6 h-6" />
                       <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700">Economic</span>
                    </div>
                    <h3 className="text-xl font-bold mb-8">Per Hectare Value</h3>
                    
                    <div className="w-full space-y-4 text-xs font-bold font-mono">
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>Forest</span>
                             <span>₹1.2 Lakh (Carbon)</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-700 w-[15%]" />
                          </div>
                       </div>
                       
                       <div>
                          <div className="flex justify-between mb-1 uppercase text-muted-foreground">
                             <span>TerraForge</span>
                             <span>₹14.8 Lakh (Mixed)</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-amber-600 w-[95%]" />
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
