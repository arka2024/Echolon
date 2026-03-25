'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hectares: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Simulate account creation
      window.location.href = '/home';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden py-12">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div 
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight">TerraForge Systems</span>
            </Link>
            <div className="flex space-x-2">
              <div className={`w-10 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`} />
              <div className={`w-10 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">Create Arboretum</h2>
          <p className="text-sm text-muted-foreground mb-8">
            {step === 1 ? 'Setup your enterprise profile.' : 'Configure structural farm topology.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground" placeholder="john@enterprise.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Master Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground" placeholder="••••••••" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl border-2 border-primary bg-primary/10 cursor-pointer overflow-hidden relative group">
                     <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                     <h4 className="font-bold mb-1 text-sm">Grower</h4>
                     <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">Active cultivation and land management.</p>
                   </div>
                   <div className="p-4 rounded-xl border-2 border-white/5 hover:border-white/20 bg-secondary/30 transition-all cursor-pointer">
                     <h4 className="font-bold mb-1 text-sm">Buyer</h4>
                     <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">Bulk acquisition and processing.</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estate Size</label>
                  <select required value={formData.hectares} onChange={e => setFormData({...formData, hectares: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground">
                    <option value="" disabled>Select approximate size</option>
                    <option value="small">0 - 50 Hectares</option>
                    <option value="medium">50 - 500 Hectares</option>
                    <option value="large">500+ Hectares</option>
                  </select>
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-4 mt-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20"
            >
              <span>{step === 1 ? 'Configure Environment' : 'Initialize Dashboard'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
             <p className="text-sm text-muted-foreground">
               Already integrated?{' '}
               <Link href="/" className="font-bold text-foreground hover:text-primary transition-colors">
                 Login here
               </Link>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
