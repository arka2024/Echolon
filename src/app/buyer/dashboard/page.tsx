'use client';

import Link from 'next/link';
import { ArrowUpRight, Building2, ClipboardList, PackageCheck, Truck } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
<<<<<<< HEAD
=======
import { translateTriplet } from '@/lib/translations';
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

const quickStats = [
  { title: 'Active Orders', value: '18', icon: <ClipboardList className="h-5 w-5" /> },
  { title: 'Orders Received Today', value: '6', icon: <PackageCheck className="h-5 w-5" /> },
  { title: 'In Transit', value: '9', icon: <Truck className="h-5 w-5" /> },
];

export default function BuyerDashboardPage() {
  const { language } = useLanguage();
<<<<<<< HEAD
  const tx = (en: string, hi: string, bn: string) => (language === 'hi' ? hi : language === 'bn' ? bn : en);
=======
  const tx = (en: string, hi: string, bn: string) => translateTriplet(language, en, hi, bn);
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300">{tx('Buyer Dashboard', 'खरीदार डैशबोर्ड', 'ক্রেতা ড্যাশবোর্ড')}</p>
            <h1 className="mt-1 text-2xl font-bold">Apex Agro Procurement Pvt. Ltd.</h1>
            <p className="mt-2 text-sm text-slate-300">{tx('Manage company orders and monitor incoming farmer supply updates.', 'कंपनी ऑर्डर प्रबंधित करें और किसान आपूर्ति अपडेट देखें।', 'কোম্পানির অর্ডার পরিচালনা করুন এবং কৃষকের সরবরাহ আপডেট দেখুন।')}</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/15 p-3">
            <Building2 className="h-8 w-8 text-emerald-300" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quickStats.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
            <div className="mb-3 inline-flex rounded-full bg-white/10 p-2 text-emerald-200">{item.icon}</div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-slate-300">{item.title}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-5">
          <h2 className="text-lg font-semibold text-amber-100">{tx('Urgent Requirement', 'तत्काल आवश्यकता', 'জরুরি প্রয়োজন')}</h2>
          <p className="mt-2 text-sm text-amber-50/90">
            500 tons raw produce required in 10 days for processing cycle. Quality target: moisture below 14%.
          </p>
          <p className="mt-2 text-sm text-amber-50/90">Preferred pickup: Odisha, Jharkhand and West Bengal clusters.</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold">{tx('Latest Updates', 'ताज़ा अपडेट', 'সর্বশেষ আপডেট')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Order #PO-8712 matched with 3 farmer groups.</li>
            <li>Quality verification completed for 2 consignments.</li>
            <li>Dispatch slot assigned for tomorrow 09:00 AM.</li>
          </ul>
          <Link href="/buyer/orders" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            {tx('View orders and updates', 'ऑर्डर और अपडेट देखें', 'অর্ডার ও আপডেট দেখুন')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </article>
      </section>
    </div>
  );
}
