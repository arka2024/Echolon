'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, ClipboardCheck, FileWarning, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';

export default function BuyerRegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    apmcLicense: '',
    primaryCommodity: '',
    monthlyVolume: '',
    urgentRequirement: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/buyer/dashboard');
  };

  return (
    <div className="-mt-16 lg:-mt-20 min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto mb-4 flex w-full max-w-5xl justify-end">
        <LanguageSwitcher compact className="border-white/20 bg-slate-900 text-slate-100" />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 sm:p-8"
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">{t('buyer.onboarding')}</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{t('buyer.registerCompany')}</h1>
              <p className="mt-2 text-sm text-slate-300">{t('buyer.registerDesc')}</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/15 p-3">
              <Building2 className="h-8 w-8 text-emerald-300" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('buyer.companyName')} value={formData.companyName} onChange={(v) => setFormData((p) => ({ ...p, companyName: v }))} required />
            <Field label={t('buyer.contactPerson')} value={formData.contactPerson} onChange={(v) => setFormData((p) => ({ ...p, contactPerson: v }))} required />
            <Field label={t('buyer.officialEmail')} type="email" value={formData.email} onChange={(v) => setFormData((p) => ({ ...p, email: v }))} required />
<<<<<<< HEAD
            <Field label={t('buyer.phoneNumber')} value={formData.phone} onChange={(v) => setFormData((p) => ({ ...p, phone: v }))} required />
=======
            <Field label={t('buyer.phoneNumber')} value={formData.phone} onChange={(v) => setFormData((p) => ({ ...p, phone: v }))} placeholder="+91 98765 43210" required />
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
            <Field label={t('buyer.gstin')} value={formData.gstin} onChange={(v) => setFormData((p) => ({ ...p, gstin: v }))} required />
            <Field label={t('buyer.apmc')} value={formData.apmcLicense} onChange={(v) => setFormData((p) => ({ ...p, apmcLicense: v }))} required />
            <Field label={t('buyer.primaryCommodity')} value={formData.primaryCommodity} onChange={(v) => setFormData((p) => ({ ...p, primaryCommodity: v }))} required />
            <Field label={t('buyer.monthlyProcurement')} value={formData.monthlyVolume} onChange={(v) => setFormData((p) => ({ ...p, monthlyVolume: v }))} required />

            <label className="sm:col-span-2 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{t('buyer.urgentRequirement')}</span>
              <textarea
                required
                rows={4}
                value={formData.urgentRequirement}
                onChange={(e) => setFormData((p) => ({ ...p, urgentRequirement: e.target.value }))}
                placeholder={t('buyer.urgentPlaceholder')}
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <div className="sm:col-span-2 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-3">
              <InfoChip icon={<ShieldCheck className="h-4 w-4" />} title={t('buyer.compliance')} subtitle={t('buyer.complianceDesc')} />
              <InfoChip icon={<ClipboardCheck className="h-4 w-4" />} title={t('buyer.verification')} subtitle={t('buyer.verificationDesc')} />
              <InfoChip icon={<FileWarning className="h-4 w-4" />} title={t('buyer.priority')} subtitle={t('buyer.priorityDesc')} />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 mt-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              {t('buyer.completeRegistration')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
<<<<<<< HEAD
=======
  placeholder,
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
<<<<<<< HEAD
=======
  placeholder?: string;
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
<<<<<<< HEAD
=======
        placeholder={placeholder}
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
        className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
      />
    </label>
  );
}

function InfoChip({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">
        {icon}
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="text-xs text-slate-300">{subtitle}</p>
    </div>
  );
}
