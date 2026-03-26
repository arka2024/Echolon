'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Leaf, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { translateTriplet } from '@/lib/translations';

const features = [
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    title: 'Precision Advisory',
    description: 'Data-driven insights specific to your estate\'s topology and crop stage.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: 'Predictable Finance',
    description: 'Unlock growth capital and insurance products backed by yield forecasts.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Reliable Market',
    description: 'Navigate global trade cycles with transparency and fair pricing.',
  },
];

const metrics = [
  { value: '15,000+', label: 'Empowered Farmers' },
  { value: '98%', label: 'Yield Accuracy' },
  { value: '₹24 Cr+', label: 'Farmer Income Generated' },
  { value: '4.9/5', label: 'Average Trust Rating' },
];

export default function Home() {
  const { language } = useLanguage();
  const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);

  return (
    <div className="relative w-full overflow-hidden bg-background">
      
      {/* Hero Section */}
      <section className="relative h-[92vh] flex items-center max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center h-full z-10 space-y-8 pr-4 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6 ring-1 ring-inset ring-primary/20">
                {tx('Digital Arboretum v2.0', 'डिजिटल आर्बोरेटम v2.0', 'ডিজিটাল আর্বোরেটাম v2.0')}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                {tx('Empowering Your Future in ', 'आपके भविष्य को सशक्त बनाते हुए ', 'আপনার ভবিষ্যৎকে শক্তিশালী করে ')}
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">{tx('Oil Palm', 'ऑयल पाम', 'অয়েল পাম')}</span>
                {tx(' Cultivation.', ' खेती।', ' চাষ।')}
              </h1>
            </motion.div>

            <motion.p
              className="text-lg lg:text-xl text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {tx('We combine precision agronomy with intelligent financial tools to transform traditional palm oil farming into a high-yield, sustainable digital enterprise.', 'हम सटीक कृषि और स्मार्ट वित्तीय टूल्स को जोड़कर पारंपरिक पाम खेती को उच्च-उपज, टिकाऊ डिजिटल उद्यम में बदलते हैं।', 'আমরা প্রিসিশন এগ্রোনমি ও স্মার্ট ফাইন্যান্স টুল একত্র করে ঐতিহ্যবাহী পাম চাষকে উচ্চফলনশীল, টেকসই ডিজিটাল উদ্যোগে রূপান্তর করি।')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/advisory" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white transition-all bg-primary rounded-xl hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                {tx('Get Started', 'शुरू करें', 'শুরু করুন')}
              </Link>
              <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold group transition-all rounded-xl hover:bg-secondary text-foreground">
                {tx('Explore Platform', 'प्लेटफ़ॉर्म देखें', 'প্ল্যাটফর্ম দেখুন')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: realistic image panel */}
          <div className="hidden lg:block relative h-full w-full">
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10">
              <img
                src="/images/home-hero.jpg"
                alt="Germinating seeds and young crops in field"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80 font-semibold">
                  {tx('Field Reality', 'खेत की वास्तविकता', 'মাঠের বাস্তবতা')}
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {tx('Healthy germination decides season success', 'स्वस्थ अंकुरण ही सीज़न की सफलता तय करता है', 'সুস্থ অঙ্কুরোদ্গমই মৌসুমের সাফল্য নির্ধারণ করে')}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Metrics Section */}
      <section className="border-y border-white/5 bg-secondary/30 backdrop-blur-sm py-12 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-start border-l-2 border-primary/20 pl-6"
              >
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2">
                  {metric.value}
                </h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10 bg-background/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{tx('The Platform', 'प्लेटफ़ॉर्म', 'প্ল্যাটফর্ম')}</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{tx('Seed to Prosperity', 'बीज से समृद्धि तक', 'বীজ থেকে সমৃদ্ধি')}</h3>
            <p className="text-lg text-muted-foreground">{tx('Comprehensive tools designed to eliminate guesswork, reduce risk, and maximize per-hectare profitability.', 'ऐसे व्यापक टूल्स जो अनुमान कम करें, जोखिम घटाएं और प्रति हेक्टेयर लाभ बढ़ाएं।', 'এমন সমন্বিত টুল যা অনুমান কমায়, ঝুঁকি কমায় এবং প্রতি হেক্টরে লাভ বাড়ায়।')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group p-8 rounded-3xl glass-panel relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-emerald-400/50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                
                <div className="mt-8 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                  Explore Module <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      
    </div>
  );
}
