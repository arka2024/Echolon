import Link from 'next/link';
import { Building2, ClipboardList, LayoutDashboard } from 'lucide-react';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-16 lg:-mt-20 min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-slate-900/70 p-6 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2">
              <Building2 className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Buyer Portal</p>
              <h2 className="font-semibold">Company Console</h2>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <Link href="/buyer/dashboard" className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/buyer/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/10">
              <ClipboardList className="h-4 w-4" />
              Orders and Updates
            </Link>
          </nav>

          <div className="mt-8 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs text-emerald-100">
            <p className="font-semibold">Urgent Compliance</p>
            <p className="mt-1 text-emerald-100/90">Keep GST, FSSAI and APMC details updated for uninterrupted procurement.</p>
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
