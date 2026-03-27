'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';

export default function IntroLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [phone, setPhone] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [keySent, setKeySent] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [governmentAlerts, setGovernmentAlerts] = useState(true);
  const [debugKey, setDebugKey] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSendKey = async () => {
    setIsSending(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setDebugKey(null);

    try {
      const response = await fetch('/api/sms/send-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        keySent?: boolean;
        debugKey?: string;
        source?: 'twilio' | 'textbelt' | 'mock';
        providerError?: string;
      };

      if (!response.ok || !data.keySent) {
        setErrorMessage(data.error ?? 'Could not send private key. Please try again.');
        return;
      }

      setKeySent(true);
      setDebugKey(data.debugKey ?? null);
      if (data.source === 'mock') {
        setStatusMessage('SMS provider unavailable. Dev fallback key generated below.');
      } else {
        setStatusMessage('Private key sent by SMS. Enter it below to continue.');
      }

      if (data.providerError) {
        setErrorMessage(`SMS provider issue: ${data.providerError}`);
      }
    } catch {
      setErrorMessage('Network issue while sending key. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const subscribeAlerts = async (normalizedPhone: string) => {
    const categories = [] as string[];
    if (weatherAlerts) categories.push('weather');
    if (governmentAlerts) categories.push('government');

    await fetch('/api/sms/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: normalizedPhone,
        enabled: alertsEnabled && categories.length > 0,
        categories,
      }),
    });
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/sms/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, key: privateKey }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        phoneNumber?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.phoneNumber) {
        setErrorMessage(data.error ?? 'Private key verification failed.');
        return;
      }

      await subscribeAlerts(data.phoneNumber);
      router.push('/home');
    } catch {
      setErrorMessage('Network issue while verifying key. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-transition when video completes
  useEffect(() => {
    setIsHydrated(true);

    const v = videoRef.current;
    if (v) {
      const handleEnded = () => setIsVideoPlaying(false);
      v.addEventListener('ended', handleEnded);
      return () => v.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#000] overflow-hidden flex items-center justify-center">
      <div className="absolute right-4 top-4 z-[60]">
        <LanguageSwitcher compact className="border-white/20 bg-black/40 text-white backdrop-blur-md" />
      </div>
      
      {/* 
        Intro Video Layer 
        Using a high-quality free agriculture/farming video from an open CDN for the demo
      */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            >
              {/* Fallback to a valid Pexels/Coverr MP4 link representing farming */}
              <source src="https://assets.mixkit.co/videos/preview/mixkit-tractor-harvesting-in-a-crop-field-4261-large.mp4" type="video/mp4" />
            </video>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="z-10 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white mb-4">TerraForge Systems</h1>
              <p className="text-xl text-white/80 font-light tracking-wide max-w-lg">The future of sustainable palm agriculture.</p>
            </motion.div>

            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute bottom-12 right-12 z-10 px-6 py-2 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md bg-black/20"
            >
              {t('login.skipIntro')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Screen Layer */}
      <motion.div 
        className="w-full h-full relative z-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoPlaying ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Abstract background for login */}
        <div className="absolute inset-0 bg-background overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative z-10 w-full max-w-md px-6">
          <motion.div 
             className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl"
             initial={{ y: 20 }}
             animate={{ y: isVideoPlaying ? 20 : 0 }}
             transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Leaf className="w-6 h-6 text-primary" />
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">{t('login.welcomeBack')}</h2>
            <p className="text-sm text-center text-muted-foreground mb-8">{t('login.enterCredentials')}</p>

            <form className="space-y-5" onSubmit={handleVerify}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('login.farmAccess')}</label>
                <div className="flex gap-2">
                  <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="+91 98765 43210" 
                />
                  <button
                    type="button"
                    onClick={handleSendKey}
                    disabled={!isHydrated || isSending || !phone.trim()}
                    className="px-4 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Sending...' : keySent ? 'Resend' : 'Send Key'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('login.secureKey')}</label>
                   <Link href="#" className="text-xs font-medium text-primary hover:text-primary/80">{t('login.forgot')}</Link>
                </div>
                <input 
                  type="text" 
                  required
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                  placeholder="Enter 6-digit private key" 
                />
              </div>

              <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SMS Adverse Alerts</label>
                <div className="flex items-center gap-2 text-sm">
                  <input
                    id="alertsEnabled"
                    type="checkbox"
                    checked={alertsEnabled}
                    onChange={(e) => setAlertsEnabled(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="alertsEnabled">Enable alert messages</label>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={weatherAlerts}
                      onChange={(e) => setWeatherAlerts(e.target.checked)}
                      disabled={!alertsEnabled}
                      className="h-4 w-4"
                    />
                    Weather
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={governmentAlerts}
                      onChange={(e) => setGovernmentAlerts(e.target.checked)}
                      disabled={!alertsEnabled}
                      className="h-4 w-4"
                    />
                    Government
                  </label>
                </div>
              </div>

              {statusMessage && <p className="text-xs text-emerald-600">{statusMessage}</p>}
              {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
              {debugKey && (
                <p className="text-xs text-amber-600">
                  Dev key preview: {debugKey}
                </p>
              )}

              <button 
                type="submit"
                disabled={isVerifying || !keySent}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isVerifying ? 'Verifying...' : t('login.authenticate')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-sm text-muted-foreground">
                 {t('login.newTo')}{' '}
                 <Link href="/signup" className="font-bold text-foreground hover:text-primary transition-colors">
                   {t('login.initiateSetup')}
                 </Link>
               </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
