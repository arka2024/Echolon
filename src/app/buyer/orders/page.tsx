'use client';

import { useLanguage } from '@/components/LanguageProvider';

const receivedOrders = [
  {
    id: 'PO-8712',
    commodity: 'Fresh Produce',
    quantity: '220 tons',
    status: 'Matched',
    eta: 'Arriving in 2 days',
  },
  {
    id: 'PO-8713',
    commodity: 'Premium Grade',
    quantity: '180 tons',
    status: 'Quality Check',
    eta: 'Inspection in progress',
  },
  {
    id: 'PO-8714',
    commodity: 'Bulk Industrial Lot',
    quantity: '140 tons',
    status: 'In Transit',
    eta: 'Expected tomorrow',
  },
];

const incomingUpdates = [
  'Farmer cluster Kendrapara uploaded lot readiness documents.',
  'Transporter assigned for Route CKT-03 at 08:30 AM tomorrow.',
  'Quality lab reported acceptable moisture values for PO-8712.',
  'Procurement team requested revised unloading slot for PO-8714.',
];

export default function BuyerOrdersPage() {
  const { language } = useLanguage();
  const tx = (en: string, hi: string, bn: string) => (language === 'hi' ? hi : language === 'bn' ? bn : en);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-widest text-emerald-300">{tx('Buyer Portal', 'खरीदार पोर्टल', 'ক্রেতা পোর্টাল')}</p>
        <h1 className="mt-1 text-2xl font-bold">{tx('Orders Received and Incoming Updates', 'प्राप्त ऑर्डर और आने वाले अपडेट', 'প্রাপ্ত অর্ডার ও আগত আপডেট')}</h1>
        <p className="mt-2 text-sm text-slate-300">{tx('Track all procurement orders and real-time operational updates in one place.', 'सभी प्रोक्योरमेंट ऑर्डर और रीयल-टाइम अपडेट एक जगह ट्रैक करें।', 'সব প্রোকিউরমেন্ট অর্ডার ও রিয়েল-টাইম আপডেট এক জায়গায় দেখুন।')}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold">{tx('Orders Received', 'प्राप्त ऑर्डर', 'প্রাপ্ত অর্ডার')}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Order ID</th>
                <th className="py-2">Commodity</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Status</th>
                <th className="py-2">ETA</th>
              </tr>
            </thead>
            <tbody>
              {receivedOrders.map((order) => (
                <tr key={order.id} className="border-t border-white/10 text-slate-200">
                  <td className="py-3 font-medium">{order.id}</td>
                  <td className="py-3">{order.commodity}</td>
                  <td className="py-3">{order.quantity}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">{order.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold">{tx('Incoming Updates', 'आने वाले अपडेट', 'আগত আপডেট')}</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {incomingUpdates.map((update) => (
            <li key={update} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              {update}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
