'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp, Package, MapPin, Truck, Factory, Star, Phone, Mail, Globe, Loader2, CheckCircle2, RotateCw } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
<<<<<<< HEAD
=======
import { translateTriplet } from '@/lib/translations';
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

type Region = 'All' | 'North' | 'South' | 'East' | 'West' | 'Central';
type BuyerType = 'All' | 'Refinery' | 'Bulk Trader' | 'FMCG' | 'Export';

type MarketBuyer = {
   id: string;
   companyName: string;
   region: Exclude<Region, 'All'>;
   state: string;
   city: string;
   buyerType: Exclude<BuyerType, 'All'>;
   pricePerTonInr: number;
   trustIndex: number;
   rating: number;
   capacityTonsPerWeek: number;
   minimumOrderTons: number;
   preferredOilTypes: string[];
   qualityFocus: string;
   responseTimeHours: number;
   directContact: {
      enabled: boolean;
      minimumLargeQtyTons: number;
      phone: string;
      email: string;
      website: string;
   };
};

type QuotaResponse = {
   ticketId: string;
   status: string;
   message: string;
   processingProgress: number;
   etaToDispatchHours: number;
   assignedPartner: {
      name: string;
      partnerType: 'Agency' | 'NGO';
      distanceKm: number;
   };
   milestones: Array<{
      step: string;
      progress: number;
      etaHours: number;
   }>;
};

const REGIONS: Region[] = ['All', 'North', 'South', 'East', 'West', 'Central'];
const BUYER_TYPES: BuyerType[] = ['All', 'Refinery', 'Bulk Trader', 'FMCG', 'Export'];

export default function MarketPage() {
  const { language } = useLanguage();
<<<<<<< HEAD
  const tx = (en: string, hi: string, bn: string) => (language === 'hi' ? hi : language === 'bn' ? bn : en);
=======
  const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
  const [isMounted, setIsMounted] = useState(false);
   const [region, setRegion] = useState<Region>('All');
   const [buyerType, setBuyerType] = useState<BuyerType>('All');
   const [bestOnly, setBestOnly] = useState(true);
   const [quantityTons, setQuantityTons] = useState(80);
   const [buyers, setBuyers] = useState<MarketBuyer[]>([]);
   const [dataSource, setDataSource] = useState<'gemma' | 'fallback' | null>(null);
   const [loadingBuyers, setLoadingBuyers] = useState(false);
   const [bookingBuyerId, setBookingBuyerId] = useState<string | null>(null);
   const [selectedBuyer, setSelectedBuyer] = useState<MarketBuyer | null>(null);
   const [quotaStatus, setQuotaStatus] = useState<QuotaResponse | null>(null);
   const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

   const marketIndex = useMemo(() => {
      if (buyers.length === 0) {
         return 0;
      }
      return buyers.reduce((acc, buyer) => acc + buyer.trustIndex, 0) / buyers.length;
   }, [buyers]);

   useEffect(() => {
      const fetchBuyers = async () => {
         setLoadingBuyers(true);
         try {
            const response = await fetch('/api/market-buyers', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  region,
                  buyerType,
                  bestOnly,
                  quantityTons,
               }),
            });

            if (!response.ok) {
               throw new Error('Failed to fetch market buyers');
            }

            const data = (await response.json()) as {
               source: 'gemma' | 'fallback';
               buyers: MarketBuyer[];
            };

            setDataSource(data.source);
            setBuyers(data.buyers);
            setSelectedBuyer((prev) => {
               if (!data.buyers.length) {
                  return null;
               }
               if (!prev) {
                  return data.buyers[0];
               }
               return data.buyers.find((buyer) => buyer.id === prev.id) ?? data.buyers[0];
            });
         } catch {
            setBuyers([]);
         } finally {
            setLoadingBuyers(false);
         }
      };

      void fetchBuyers();
   }, [region, buyerType, bestOnly, quantityTons]);

   const handleBookQuota = async (buyer: MarketBuyer) => {
      setBookingBuyerId(buyer.id);

      try {
         let coords: { lat?: number; lon?: number } = {};
         if (typeof navigator !== 'undefined' && navigator.geolocation) {
            coords = await new Promise((resolve) => {
               navigator.geolocation.getCurrentPosition(
                  (position) => {
                     resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
                  },
                  () => resolve({}),
                  { timeout: 5000 }
               );
            });
         }

         const response = await fetch('/api/market-quota', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               companyId: buyer.id,
               companyName: buyer.companyName,
               quantityTons,
               pickupState: buyer.state,
               pickupLat: coords.lat,
               pickupLon: coords.lon,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to book quota');
         }

         const data = (await response.json()) as QuotaResponse;
         setQuotaStatus(data);
         setSelectedBuyer(buyer);
      } catch {
         setQuotaStatus(null);
      } finally {
         setBookingBuyerId(null);
      }
   };

   const directContactEnabled = Boolean(
      selectedBuyer &&
         quantityTons >= selectedBuyer.directContact.minimumLargeQtyTons &&
         selectedBuyer.directContact.enabled
   );

   const processingProgress = quotaStatus?.processingProgress ?? Math.min(90, 30 + Math.round(quantityTons / 2));

   const rankedBuyers = useMemo(() => {
      return [...buyers].sort((a, b) => {
         const scoreA = a.trustIndex * 0.65 + a.rating * 0.35;
         const scoreB = b.trustIndex * 0.65 + b.rating * 0.35;
         return scoreB - scoreA;
      });
   }, [buyers]);

   const rotatingTopBuyers = useMemo(() => {
      if (rankedBuyers.length <= 2) {
         return rankedBuyers;
      }

      const start = (rotationIndex * 2) % rankedBuyers.length;
      const first = rankedBuyers[start];
      const second = rankedBuyers[(start + 1) % rankedBuyers.length];
      return [first, second];
   }, [rankedBuyers, rotationIndex]);

   useEffect(() => {
      setRotationIndex(0);
   }, [region, buyerType, bestOnly, quantityTons, buyers.length]);

   useEffect(() => {
      if (rankedBuyers.length <= 2) {
         return;
      }

      const timer = setInterval(() => {
         setRotationIndex((prev) => prev + 1);
      }, 30000);

      return () => clearInterval(timer);
   }, [rankedBuyers.length]);

   useEffect(() => {
      if (!selectedBuyer && rotatingTopBuyers.length > 0) {
         setSelectedBuyer(rotatingTopBuyers[0]);
      }

      if (selectedBuyer && !buyers.find((buyer) => buyer.id === selectedBuyer.id) && rotatingTopBuyers.length > 0) {
         setSelectedBuyer(rotatingTopBuyers[0]);
      }
   }, [buyers, selectedBuyer, rotatingTopBuyers]);

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-4 overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary">PalmArbor</span> {tx('Market Desk', 'मार्केट डेस्क', 'মার্কেট ডেস্ক')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{tx('Single-screen live buyer rotation, quota routing, and direct enterprise contact.', 'एक स्क्रीन पर लाइव खरीदार रोटेशन, कोटा रूटिंग और सीधे कंपनी संपर्क।', 'এক স্ক্রিনে লাইভ ক্রেতা রোটেশন, কোটার রাউটিং ও সরাসরি কোম্পানি যোগাযোগ।')}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-sm">
              <p className="font-semibold text-muted-foreground">{tx('Market Index', 'मार्केट इंडेक्स', 'মার্কেট ইনডেক্স')}</p>
              <p className="text-sm font-bold text-foreground">{marketIndex.toFixed(1)} / 10</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-sm">
              <p className="font-semibold text-muted-foreground">{tx('Data Source', 'डेटा स्रोत', 'ডেটা সোর্স')}</p>
              <p className="text-sm font-bold text-foreground">{dataSource === 'gemma' ? 'Gemma 3B' : 'Fallback JSON'}</p>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12">
          <section className="col-span-1 flex h-full min-h-0 flex-col gap-4 lg:col-span-8">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{tx('Region', 'क्षेत्र', 'অঞ্চল')}</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {REGIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{tx('Buyer Type', 'खरीदार प्रकार', 'ক্রেতার ধরন')}</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {BUYER_TYPES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>{tx('Quantity', 'मात्रा', 'পরিমাণ')}</span>
                    <span>{quantityTons} t</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={5}
                    value={quantityTons}
                    onChange={(e) => setQuantityTons(Number(e.target.value))}
                    className="mt-2 w-full accent-primary"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={bestOnly}
                      onChange={(e) => setBestOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    {tx('Best buyers only', 'केवल सर्वश्रेष्ठ खरीदार', 'শুধু সেরা ক্রেতা')}
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-[#0f1712] p-4 text-white shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">{tx('Processing Bar', 'प्रोसेसिंग बार', 'প্রসেসিং বার')}</h2>
                <span className="text-sm font-bold">{processingProgress}%</span>
              </div>

              <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-lime-300"
                  initial={false}
                  animate={{ width: `${processingProgress}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px] text-emerald-100/80">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Truck className="mb-2 h-4 w-4 text-emerald-300" />
                  Farmers
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Package className="mb-2 h-4 w-4 text-emerald-300" />
                  Collection
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Factory className="mb-2 h-4 w-4 text-emerald-300" />
                  Processors
                </div>
              </div>

              {quotaStatus && (
                <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    {quotaStatus.message}
                  </div>
                  <p className="mt-2 text-emerald-100/80">
                    Ticket {quotaStatus.ticketId} · {quotaStatus.assignedPartner.partnerType}: {quotaStatus.assignedPartner.name} ({quotaStatus.assignedPartner.distanceKm} km)
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">{tx('Top 2 Buyers (Auto every 30s)', 'शीर्ष 2 खरीदार (हर 30 सेकंड में ऑटो)', 'শীর্ষ ২ ক্রেতা (প্রতি ৩০ সেকেন্ডে অটো)')}</h2>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <RotateCw className="h-3.5 w-3.5" />
                  {tx('Live Rotation', 'लाइव रोटेशन', 'লাইভ রোটেশন')}
                </span>
              </div>

              {loadingBuyers && (
                <div className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> {tx('Refreshing buyer graph...', 'खरीदार ग्राफ़ रीफ़्रेश हो रहा है...', 'ক্রেতা গ্রাফ রিফ্রেশ হচ্ছে...')}
                </div>
              )}

              {!loadingBuyers && rotatingTopBuyers.length === 0 && (
                <div className="rounded-xl border border-border p-3 text-sm text-muted-foreground">
                  No buyers matched your filters. Increase quantity or disable best-only mode.
                </div>
              )}

              <AnimatePresence mode="wait">
                {!loadingBuyers && rotatingTopBuyers.length > 0 && (
                  <motion.div
                    key={`rotation-${rotationIndex}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                    className="grid grid-cols-1 gap-3 md:grid-cols-2"
                  >
                    {rotatingTopBuyers.map((buyer) => (
                      <motion.article
                        key={buyer.id}
                        layout
                        className="rounded-2xl border border-border bg-secondary/30 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold leading-tight text-foreground">{buyer.companyName}</h3>
                          <span className="text-xs font-bold text-primary">INR {buyer.pricePerTonInr.toLocaleString('en-IN')}/t</span>
                        </div>

                        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {buyer.city}, {buyer.state} · {buyer.region}
                        </div>

                        <div className="mb-3 flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`h-3.5 w-3.5 ${idx < Math.round(buyer.rating) ? 'fill-current' : ''}`} />
                          ))}
                          <span className="ml-2 text-[11px] font-semibold text-foreground">Trust {buyer.trustIndex.toFixed(1)}</span>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
                          <span className="rounded-lg bg-background px-2 py-1">Min {buyer.minimumOrderTons} t</span>
                          <span className="rounded-lg bg-background px-2 py-1">Cap {buyer.capacityTonsPerWeek} t/wk</span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedBuyer(buyer);
                            void handleBookQuota(buyer);
                          }}
                          disabled={bookingBuyerId === buyer.id}
                          className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-60"
                        >
                          {bookingBuyerId === buyer.id ? 'Requesting...' : 'Book Quota'}
                        </button>
                      </motion.article>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <aside className="col-span-1 flex h-full min-h-0 flex-col gap-4 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">Quota Routing</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Booked quota is sent to company and nearest agency or NGO is auto-assigned for pickup and drop.
              </p>

              <div className="mt-4 rounded-xl bg-secondary/40 p-3 text-xs">
                <p>Quantity: {quantityTons} tons</p>
                <p>Buyer: {selectedBuyer?.companyName ?? 'Auto-select from top buyers'}</p>
                <p>Progress: {processingProgress}%</p>
              </div>

              <button
                onClick={() => {
                  if (selectedBuyer) {
                    void handleBookQuota(selectedBuyer);
                  }
                }}
                disabled={!isMounted || !selectedBuyer || bookingBuyerId !== null}
                className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {bookingBuyerId ? 'Sending Request...' : 'Book Quota Request'}
              </button>
            </div>

            {directContactEnabled && selectedBuyer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-blue-300/40 bg-blue-500/10 p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Direct Company Contact Bar</p>
                <h3 className="mt-2 text-sm font-bold text-foreground">Large Quantity Mode: {selectedBuyer.companyName}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enabled for {quantityTons} tons. Min threshold: {selectedBuyer.directContact.minimumLargeQtyTons} tons.
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <a className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-secondary" href={`tel:${selectedBuyer.directContact.phone}`}>
                    <Phone className="h-4 w-4" /> Call Company
                  </a>
                  <a className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-secondary" href={`mailto:${selectedBuyer.directContact.email}`}>
                    <Mail className="h-4 w-4" /> Email Desk
                  </a>
                  <a className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-secondary" href={selectedBuyer.directContact.website} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" /> Open Buyer Website
                  </a>
                </div>
              </motion.div>
            )}

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-foreground">Live Buyer Window</h3>
              <p className="text-xs text-muted-foreground">
                Only top 2 buyers are shown per window. Window rotates automatically every 30 seconds with animation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
