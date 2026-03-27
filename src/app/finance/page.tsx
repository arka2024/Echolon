'use client';

import { Suspense, lazy, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Building, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
<<<<<<< HEAD

const FinanceScene = lazy(() => import('@/components/3d/FinanceScene').then(mod => ({ default: mod.FinanceScene })));

export default function FinancePage() {
  const { language } = useLanguage();
  const tx = (en: string, hi: string, bn: string) => (language === 'hi' ? hi : language === 'bn' ? bn : en);
  const [hectares, setHectares] = useState(42.5);
  const [yieldTons, setYieldTons] = useState(1280);
=======
import { translateTriplet } from '@/lib/translations';

const FinanceScene = lazy(() => import('@/components/3d/FinanceScene').then(mod => ({ default: mod.FinanceScene })));

type FinanceModel = {
  baseCost: number;
  projectedSale: number;
  roi: number;
  netProfit: number;
  delta: number;
};

type ProjectionMode = 'self' | 'overall';

type ProjectionLimits = {
  minHa: number;
  maxHa: number;
  stepHa: number;
  minYield: number;
  maxYield: number;
  stepYield: number;
};

const PROJECTION_LIMITS: Record<ProjectionMode, ProjectionLimits> = {
  self: {
    minHa: 0.5,
    maxHa: 12,
    stepHa: 0.1,
    minYield: 5,
    maxYield: 180,
    stepYield: 1,
  },
  overall: {
    minHa: 1,
    maxHa: 500,
    stepHa: 0.5,
    minYield: 100,
    maxYield: 5000,
    stepYield: 10,
  },
};

function calculateFinanceModel(hectares: number, yieldTons: number, mode: ProjectionMode): FinanceModel {
  const limits = PROJECTION_LIMITS[mode];
  const normalizedHectares = Math.max(limits.minHa, Math.min(limits.maxHa, hectares));
  const normalizedYield = Math.max(limits.minYield, Math.min(limits.maxYield, yieldTons));

  const coefficients =
    mode === 'self'
      ? {
          basePerHa: 12500,
          basePerTon: 1900,
          salePerTon: 3200,
          qualityWeightArea: 0.03,
          qualityWeightYield: 0.05,
          qualityCap: 0.08,
          deltaFactor: 0.14,
        }
      : {
          basePerHa: 19800,
          basePerTon: 4450,
          salePerTon: 8350,
          qualityWeightArea: 0.09,
          qualityWeightYield: 0.14,
          qualityCap: 0.24,
          deltaFactor: 0.35,
        };

  const baseCost = Math.round(normalizedHectares * coefficients.basePerHa + normalizedYield * coefficients.basePerTon);
  const qualityFactor =
    1 +
    Math.min(
      coefficients.qualityCap,
      (normalizedHectares / limits.maxHa) * coefficients.qualityWeightArea +
        (normalizedYield / limits.maxYield) * coefficients.qualityWeightYield
    );
  const projectedSale = Math.round(normalizedYield * coefficients.salePerTon * qualityFactor);
  const netProfit = projectedSale - baseCost;
  const roi = baseCost > 0 ? (netProfit / baseCost) * 100 : 0;
  const delta = Math.round(netProfit * coefficients.deltaFactor);

  return {
    baseCost,
    projectedSale,
    roi,
    netProfit,
    delta,
  };
}

export default function FinancePage() {
  const { language } = useLanguage();
  const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
  const [hectares, setHectares] = useState(4.8);
  const [yieldTons, setYieldTons] = useState(55);
  const [projectionMode, setProjectionMode] = useState<ProjectionMode>('self');
  const [model, setModel] = useState<FinanceModel>(() => calculateFinanceModel(4.8, 55, 'self'));
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastRecalculatedAt, setLastRecalculatedAt] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );

  const recalculateModel = () => {
    setIsRecalculating(true);
    const nextModel = calculateFinanceModel(hectares, yieldTons, projectionMode);
    setModel(nextModel);
    setLastRecalculatedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => setIsRecalculating(false), 250);
  };

  const switchProjectionMode = (nextMode: ProjectionMode) => {
    const nextLimits = PROJECTION_LIMITS[nextMode];
    const nextHectares = Math.max(nextLimits.minHa, Math.min(nextLimits.maxHa, hectares));
    const nextYield = Math.max(nextLimits.minYield, Math.min(nextLimits.maxYield, yieldTons));

    setProjectionMode(nextMode);
    setHectares(nextHectares);
    setYieldTons(nextYield);
    setModel(calculateFinanceModel(nextHectares, nextYield, nextMode));
    setLastRecalculatedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const formatCrore = (value: number) => {
    const inCrore = value / 10000000;
    return `₹${inCrore.toFixed(2)} Cr`;
  };

  const activeLimits = PROJECTION_LIMITS[projectionMode];
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{tx('Income Prediction & Finance', 'आय पूर्वानुमान और वित्त', 'আয় পূর্বাভাস ও অর্থায়ন')}</h1>
          <p className="text-muted-foreground mt-1">{tx('Simulate land yield vs projected market value.', 'भूमि उपज बनाम अनुमानित बाज़ार मूल्य का सिमुलेशन करें।', 'জমির ফলন বনাম সম্ভাব্য বাজারমূল্য সিমুলেট করুন।')}</p>
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
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">{tx('Projection Tool', 'प्रोजेक्शन टूल', 'প্রজেকশন টুল')}</h3>
              <h2 className="text-4xl font-bold tracking-tight mb-8">{tx('Financial Growth Calculator', 'वित्तीय विकास कैलकुलेटर', 'আর্থিক বৃদ্ধির ক্যালকুলেটর')}</h2>
              <p className="text-muted-foreground mb-8">{tx('Analyze the yield potential and economic viability of your arboretum expansion.', 'अपनी कृषि विस्तार की उपज क्षमता और आर्थिक व्यवहार्यता का विश्लेषण करें।', 'আপনার কৃষি সম্প্রসারণের ফলন সম্ভাবনা ও অর্থনৈতিক সক্ষমতা বিশ্লেষণ করুন।')}</p>

<<<<<<< HEAD
=======
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{tx('Calculation Mode', 'गणना मोड', 'গণনা মোড')}</p>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/70 p-1">
                  <button
                    type="button"
                    onClick={() => switchProjectionMode('self')}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      projectionMode === 'self' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-background/60'
                    }`}
                  >
                    {tx('Farmer Self Plan', 'किसान स्व-योजना', 'কৃষক স্ব-পরিকল্পনা')}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchProjectionMode('overall')}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      projectionMode === 'overall' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-background/60'
                    }`}
                  >
                    {tx('Overall Growth', 'समग्र विकास', 'সামগ্রিক বৃদ্ধি')}
                  </button>
                </div>
              </div>

>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
              <div className="space-y-8 flex-grow">
                {/* Sliders */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Farm Size (Hectares)</label>
                    <span className="text-xl font-bold">{hectares} <span className="text-sm font-normal text-muted-foreground">ha</span></span>
                  </div>
                  <input 
                    type="range" 
<<<<<<< HEAD
                    min="1" max="500" step="0.5" 
=======
                    min={activeLimits.minHa}
                    max={activeLimits.maxHa}
                    step={activeLimits.stepHa}
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                    value={hectares} 
                    onChange={(e) => setHectares(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
<<<<<<< HEAD
                    <span>1 ha</span>
                    <span>500 ha</span>
=======
                    <span>{activeLimits.minHa} ha</span>
                    <span>{activeLimits.maxHa} ha</span>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Estimated Annual Yield</label>
                    <span className="text-xl font-bold">{yieldTons.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tons</span></span>
                  </div>
                  <input 
                    type="range" 
<<<<<<< HEAD
                    min="100" max="5000" step="10" 
=======
                    min={activeLimits.minYield}
                    max={activeLimits.maxYield}
                    step={activeLimits.stepYield}
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                    value={yieldTons} 
                    onChange={(e) => setYieldTons(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
<<<<<<< HEAD
                    <span>100 tons</span>
                    <span>5,000 tons</span>
=======
                    <span>{activeLimits.minYield.toLocaleString()} tons</span>
                    <span>{activeLimits.maxYield.toLocaleString()} tons</span>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                  </div>
                </div>

                {/* Info Blocks */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">Base Cost</label>
<<<<<<< HEAD
                    <div className="text-2xl font-bold">$124.50</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">Projected Sale</label>
                    <div className="text-2xl font-bold text-primary">$606.50</div>
=======
                    <div className="text-2xl font-bold">{formatInr(model.baseCost)}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">Projected Sale</label>
                    <div className="text-2xl font-bold text-primary">{formatInr(model.projectedSale)}</div>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <button className="w-full py-4 mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20">
                <TrendingUp className="w-5 h-5" />
                <span>{tx('Recalculate Model', 'मॉडल पुनर्गणना करें', 'মডেল পুনর্গণনা করুন')}</span>
              </button>
=======
              <button
                onClick={recalculateModel}
                disabled={isRecalculating}
                className="w-full py-4 mt-8 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20"
              >
                <TrendingUp className="w-5 h-5" />
                <span>{isRecalculating ? tx('Recalculating...', 'पुनर्गणना हो रही है...', 'পুনরায় গণনা হচ্ছে...') : tx('Recalculate Model', 'मॉडल पुनर्गणना करें', 'মডেল পুনর্গণনা করুন')}</span>
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">Last recalculated: {lastRecalculatedAt} IST</p>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
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
<<<<<<< HEAD
                  <span className="text-4xl font-bold">18.4%</span>
                  <span className="text-sm font-semibold text-primary mb-1">Year 3</span>
=======
                  <span className="text-4xl font-bold">{model.roi.toFixed(1)}%</span>
                  <span className="text-sm font-semibold text-primary mb-1">
                    {projectionMode === 'self'
                      ? tx('Farm Plan', 'फार्म योजना', 'ফার্ম পরিকল্পনা')
                      : tx('Year 3', 'वर्ष 3', 'বছর ৩')}
                  </span>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
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
<<<<<<< HEAD
                  <span className="text-4xl font-bold">$2.4M</span>
                  <span className="text-sm font-semibold text-muted-foreground mb-1">/ Annum</span>
=======
                  <span className="text-4xl font-bold">{formatCrore(model.netProfit)}</span>
                  <span className="text-sm font-semibold text-muted-foreground mb-1">
                    {projectionMode === 'self' ? tx('/ Season', '/ सीज़न', '/ মৌসুম') : tx('/ Annum', '/ वार्षिक', '/ বার্ষিক')}
                  </span>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
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
<<<<<<< HEAD
                  <p className="text-lg font-bold">+$842,000 <span className="text-[10px] font-bold tracking-widest uppercase text-primary ml-1">Delta</span></p>
=======
                  <p className="text-lg font-bold">+{formatInr(model.delta)} <span className="text-[10px] font-bold tracking-widest uppercase text-primary ml-1">Delta</span></p>
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
