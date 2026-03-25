'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function IntroLoginPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-transition when video completes
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      const handleEnded = () => setIsVideoPlaying(false);
      v.addEventListener('ended', handleEnded);
      return () => v.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#000] overflow-hidden flex items-center justify-center">
      
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
              Skip Intro
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
            
            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-center text-muted-foreground mb-8">Enter your credentials to access your Digital Arboretum.</p>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/home'; }}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Farm Access ID / Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                  placeholder="name@farm.com" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secure Portal Key</label>
                   <Link href="#" className="text-xs font-medium text-primary hover:text-primary/80">Forgot?</Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20 mt-4"
              >
                <span>Authenticate Profile</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-sm text-muted-foreground">
                 New to TerraForge?{' '}
                 <Link href="/signup" className="font-bold text-foreground hover:text-primary transition-colors">
                   Initiate Farm Setup
                 </Link>
               </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
