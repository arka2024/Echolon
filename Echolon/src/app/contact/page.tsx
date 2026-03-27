'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { translateTriplet } from '@/lib/translations';

export default function ContactPage() {
  const { language } = useLanguage();
  const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background w-full py-12 lg:py-24 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{tx('Get in Touch', 'संपर्क करें', 'যোগাযোগ করুন')}</h1>
          <p className="text-lg text-muted-foreground">{tx('Whether you need help setting up your digital arboretum or want to discuss enterprise pricing, our agronomy experts are here to help.', 'चाहे आपको अपना डिजिटल आर्बोरेटम सेटअप करना हो या एंटरप्राइज प्राइसिंग पर चर्चा करनी हो, हमारी एग्रोनॉमी टीम आपकी मदद के लिए तैयार है।', 'আপনার ডিজিটাল আর্বোরেটাম সেটআপ বা এন্টারপ্রাইজ প্রাইসিং নিয়ে আলোচনা করতে চাইলে, আমাদের এগ্রোনমি বিশেষজ্ঞরা সাহায্য করতে প্রস্তুত।')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-6">{tx('Send us a message', 'हमें संदेश भेजें', 'আমাদের একটি বার্তা পাঠান')}</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="Arjun" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="Patnaik" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="john@farm.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Farm Size (Hectares)</label>
                <select className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground">
                  <option>Under 10 ha</option>
                  <option>10 - 50 ha</option>
                  <option>50 - 200 ha</option>
                  <option>200+ ha</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none" placeholder="Tell us about your needs..." />
              </div>

              <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all">
                <span>{tx('Submit Inquiry', 'पूछताछ भेजें', 'অনুসন্ধান পাঠান')}</span>
                <ArrowRight className="w-4 h-4 mt-0.5" />
              </button>
            </form>
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div className="glass-panel p-8 rounded-3xl border-l-4 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2">{tx('Live Chat Support', 'लाइव चैट सहायता', 'লাইভ চ্যাট সাপোর্ট')}</h4>
              <p className="text-muted-foreground mb-6">{tx('Our agronomy team is online and ready to assist you with real-time data analysis.', 'हमारी एग्रोनॉमी टीम ऑनलाइन है और रीयल-टाइम डेटा विश्लेषण में सहायता के लिए तैयार है।', 'আমাদের এগ্রোনমি টিম অনলাইনে আছে এবং রিয়েল-টাইম ডেটা বিশ্লেষণে সহায়তা করতে প্রস্তুত।')}</p>
              <button className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold transition-all w-fit">
                {tx('Start Chat (Avg wait: 2m)', 'चैट शुरू करें (औसत प्रतीक्षा: 2 मिनट)', 'চ্যাট শুরু করুন (গড় অপেক্ষা: ২ মিনিট)')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <Phone className="w-6 h-6 text-primary mb-4" />
                <h5 className="font-bold mb-1">Helpline</h5>
                <p className="text-sm text-muted-foreground">+91 674 400 5050</p>
                <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am - 6pm IST</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <Mail className="w-6 h-6 text-primary mb-4" />
                <h5 className="font-bold mb-1">Email</h5>
                <p className="text-sm text-muted-foreground">hello@palmarbor.io</p>
                <p className="text-xs text-muted-foreground mt-1">Response within 24h</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col md:col-span-2">
                <MapPin className="w-6 h-6 text-primary mb-4" />
                <h5 className="font-bold mb-1">India HQ</h5>
                <p className="text-sm text-muted-foreground">Plot 24, Infocity Avenue, Patia<br/>Bhubaneswar, Odisha 751024</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
