'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
   ArrowUpRight,
   BellRing,
   BookOpen,
   Building2,
   CheckCircle2,
   ChevronRight,
   ExternalLink,
   MessageCircle,
   Search,
   ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
<<<<<<< HEAD
=======
import { translateTriplet } from '@/lib/translations';
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

const schemes = [
   {
      title: 'National Mission on Edible Oils - Oil Palm (NMEO-OP)',
      focus: 'Oil palm expansion and productivity support',
      region: 'North-East + Andaman + selected mainland states',
      link: 'https://www.nmeo.dac.gov.in/',
      summary:
         'Ongoing support for planting material, maintenance, and processing infrastructure to reduce edible-oil import dependence.',
   },
   {
      title: 'PM-KISAN for small and marginal farmers',
      focus: 'Direct income support for input readiness',
      region: 'Pan India',
      link: 'https://pmkisan.gov.in/',
      summary:
         'Income support continues to help farmers manage seasonal expenses and timely input purchase for oilseed crops.',
   },
   {
      title: 'e-NAM market linkage support',
      focus: 'Digital mandi discoverability and price visibility',
      region: 'APMC integrated states',
      link: 'https://www.enam.gov.in/',
      summary:
         'Strengthens buyer discovery, digital bidding, and transparent pricing for oilseed and edible-oil value chains.',
   },
];

const stories = [
   {
      title: 'Assam FPO improved palm fresh fruit bunch routing',
      category: 'Supply Chain',
      readTime: '5 min',
      snippet:
         'Cluster-level routing and collection mapping reduced turnaround time and improved processing efficiency in current season.',
   },
   {
      title: 'Odisha women SHG built a local edible-oil awareness drive',
      category: 'Community',
      readTime: '4 min',
      snippet:
         'WhatsApp-first local updates improved procurement coordination and reduced post-harvest slippage across nearby blocks.',
   },
   {
      title: 'Andhra cluster adopted weather-linked irrigation reminders',
      category: 'Advisory',
      readTime: '6 min',
      snippet:
         'Weather-guided advisories improved irrigation timing and lowered input wastage during high-heat intervals.',
   },
];

export default function CommunityPage() {
   const { language } = useLanguage();
<<<<<<< HEAD
   const tx = (en: string, hi: string, bn: string) => (language === 'hi' ? hi : language === 'bn' ? bn : en);
=======
   const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
   const whatsappCommunityLink =
      process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ||
      'https://chat.whatsapp.com/';
   const whatsappDirectLink =
      process.env.NEXT_PUBLIC_WHATSAPP_DIRECT_LINK ||
      'https://wa.me/919999999999?text=Hello%20Team%2C%20I%20want%20live%20updates%20on%20edible%20oil%20government%20schemes.';

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
          <div className="flex flex-col">
            <div className="inline-flex max-w-fit items-center px-3 py-1 mb-6 rounded-full bg-[#A2ECAE]/30 border border-[#A2ECAE]/50">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#153423] dark:text-[#A2ECAE]">Network Insights</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                     {tx('Edible Oil Schemes', 'खाद्य तेल योजनाएं', 'ভোজ্য তেল প্রকল্প')}<br/>
                     <span className="text-[#8B6B4A]">{tx('and Stories', 'और कहानियां', 'ও গল্প')}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                     {tx('Keep the same classic community view with fresh policy data, live story updates, and WhatsApp-based rural coordination.', 'ताज़ा नीति डेटा, लाइव स्टोरी अपडेट और व्हाट्सऐप समन्वय के साथ वही क्लासिक कम्युनिटी दृश्य।', 'নতুন নীতি তথ্য, লাইভ স্টোরি আপডেট ও হোয়াটসঅ্যাপ সমন্বয়সহ একই ক্লাসিক কমিউনিটি ভিউ।')}
            </p>
          </div>

          <div className="flex flex-col justify-end h-full">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                 type="text"
                 placeholder={tx('Search schemes by region or crop...', 'क्षेत्र या फसल से योजनाएं खोजें...', 'অঞ্চল বা ফসল অনুযায়ী প্রকল্প খুঁজুন...')}
                 className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold">
                      <button className="px-4 py-2 bg-[#153423] text-white rounded-full hover:bg-[#204a33] transition-colors">{tx('All Updates', 'सभी अपडेट', 'সব আপডেট')}</button>
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">{tx('Schemes', 'योजनाएं', 'প্রকল্প')}</button>
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">{tx('Stories', 'कहानियां', 'গল্প')}</button>
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors">{tx('WhatsApp Alerts', 'व्हाट्सऐप अलर्ट', 'হোয়াটসঅ্যাপ অ্যালার্ট')}</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <div className="flex flex-col space-y-6">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-48 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop" alt="Oilseed farm" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">{schemes[0].focus}</span>
                     <span>Current</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">{schemes[0].title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{schemes[0].summary}</p>
                  <a href={schemes[0].link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Visit Scheme <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-64 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop" alt="Farmer story" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">{stories[0].category}</span>
                     <span>{stories[0].readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">{stories[0].title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{stories[0].snippet}</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>
          </div>

          <div className="flex flex-col space-y-6">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-[#153423] p-10 rounded-3xl text-white relative overflow-hidden shadow-xl"
            >
               <div className="text-6xl text-emerald-500/20 font-serif absolute top-4 left-6">"</div>
               <p className="text-2xl italic font-serif leading-relaxed mb-8 relative z-10 text-emerald-50">
                  "Community coordination and policy awareness are now the fastest way to reduce procurement delays in edible-oil chains."
               </p>
               <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/30 overflow-hidden flex items-center justify-center">
                     <ShieldCheck className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white">Policy and Market Desk</p>
                     <p className="text-[10px] text-emerald-300 uppercase tracking-widest">India Edible Oil Network</p>
                  </div>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-48 w-full overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop" alt="Community action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-primary">{stories[1].category}</span>
                     <span>{stories[1].readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">{stories[1].title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{stories[1].snippet}</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Read Story <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>
            </motion.div>
          </div>

          <div className="flex flex-col space-y-6">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border group"
            >
               <div className="h-[23rem] w-full overflow-hidden relative">
                 <img
<<<<<<< HEAD
                    src="https://images.news18.com/ibnlive/uploads/2024/03/pm-modi-file-pic-2024-03-6f3185efd757d57b4f95c37949a489e8.jpg"
=======
                    src="/images/community-modi.jpg"
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
                    alt="Prime Minister Narendra Modi at a government event"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/80">Policy Spotlight</p>
                    <p className="mt-2 text-xl font-semibold">National edible-oil self-reliance agenda</p>
                 </div>
               </div>
               <div className="p-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                     <span className="text-[#8B6B4A]">Current Schemes</span>
                     <span>{schemes[2].region}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug mb-4 text-foreground">{schemes[2].title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{schemes[2].summary}</p>
                  <a href={schemes[2].link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                     Open Official Link <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="bg-[#0f3f2f] text-white rounded-3xl p-7 border border-emerald-900/50 shadow-xl"
            >
               <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  <BellRing className="h-3.5 w-3.5" />
                  WhatsApp Realtime Updates
               </div>
               <h4 className="mt-4 text-xl font-bold">Join live community alerts</h4>
               <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
                  Get current scheme deadlines, district-level updates, and procurement alerts directly on WhatsApp.
               </p>
               <div className="mt-5 grid gap-2">
                  <a href={whatsappCommunityLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-white/90">
                     <MessageCircle className="h-4 w-4" />
                     Join WhatsApp Community
                  </a>
                  <a href={whatsappDirectLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                     Direct WhatsApp Contact
                     <ArrowUpRight className="h-4 w-4" />
                  </a>
               </div>
            </motion.div>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">Latest Community Stories</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Latest 3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.map((story) => (
              <article key={story.title} className="group rounded-2xl border border-border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {story.category}
                  <span className="rounded-full bg-secondary px-2 py-0.5">{story.readTime}</span>
                </div>
                <h4 className="text-base font-semibold text-foreground">{story.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{story.snippet}</p>
                <button className="mt-3 text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center">
                  Read Story <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80">
            <CheckCircle2 className="h-4 w-4" />
            More stories coming weekly
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
