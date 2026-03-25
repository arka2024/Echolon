'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Tractor } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';

type UserRole = 'farmer' | 'buyer' | '';

export default function SignupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hectares: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!role) {
        return;
      }

      if (role === 'buyer') {
        router.push('/buyer/register');
        return;
      }

      setStep(step + 1);
    } else {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden py-12">
      <div className="absolute right-4 top-4 z-20">
        <LanguageSwitcher compact />
      </div>

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

          <h2 className="text-3xl font-bold mb-2">{t('signup.createArboretum')}</h2>
          <p className="text-sm text-muted-foreground mb-8">
            {step === 1
              ? t('signup.selectRole')
              : t('signup.completeProfile')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('signup.selectRoleLabel')}</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      role === 'farmer'
                        ? 'border-primary bg-primary/10'
                        : 'border-white/5 bg-secondary/30 hover:border-white/20'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Tractor className="h-5 w-5 text-primary" />
                      {role === 'farmer' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <h4 className="text-sm font-bold">{t('signup.farmer')}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{t('signup.farmerDesc')}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      role === 'buyer'
                        ? 'border-primary bg-primary/10'
                        : 'border-white/5 bg-secondary/30 hover:border-white/20'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Building2 className="h-5 w-5 text-primary" />
                      {role === 'buyer' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <h4 className="text-sm font-bold">{t('signup.buyerCompany')}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{t('signup.buyerDesc')}</p>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('signup.fullName')}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('signup.workEmail')}</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@enterprise.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('signup.masterPassword')}</label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('signup.estateSize')}</label>
                  <select required value={formData.hectares} onChange={e => setFormData({...formData, hectares: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground">
                    <option value="" disabled>{t('signup.selectApproxSize')}</option>
                    <option value="small">{t('signup.small')}</option>
                    <option value="medium">{t('signup.medium')}</option>
                    <option value="large">{t('signup.large')}</option>
                  </select>
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={step === 1 && !role}
              className="w-full py-4 mt-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/20"
            >
              <span>{step === 1 ? t('signup.continue') : t('signup.initializeDashboard')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
             <p className="text-sm text-muted-foreground">
               {t('signup.alreadyIntegrated')}{' '}
               <Link href="/" className="font-bold text-foreground hover:text-primary transition-colors">
                 {t('signup.loginHere')}
               </Link>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
