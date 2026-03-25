'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Leaf } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide Footer on the intro/login and signup pages
  if (pathname === '/' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="border-t border-border bg-background py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 flex flex-col items-start text-sm">
            <Link href="/home" className="flex items-center space-x-2 font-bold text-lg tracking-tight mb-4 group cursor-pointer">
              <span>TerraForge Systems</span>
            </Link>
            <p className="text-muted-foreground mb-6">Digital Arboretum</p>
            <div className="flex space-x-4">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <Leaf className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="md:col-span-1 space-y-4 text-sm font-medium">
             <Link href="/advisory" className="block text-muted-foreground hover:text-foreground">Advisory</Link>
             <Link href="/finance" className="block text-muted-foreground hover:text-foreground">Finance</Link>
             <Link href="/market" className="block text-muted-foreground hover:text-foreground">Market</Link>
          </div>

          <div className="md:col-span-1 space-y-4 text-sm font-medium">
             <Link href="/community" className="block text-muted-foreground hover:text-foreground">Community</Link>
             <Link href="/sustainability" className="block text-muted-foreground hover:text-foreground">Sustainability</Link>
             <Link href="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
          </div>

          <div className="md:col-span-1 text-sm text-right flex flex-col md:items-end">
             <div className="mb-4">
               <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Helpline</span>
               <p className="font-semibold">+1-800-PALM</p>
             </div>
             <div>
               <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">HQ</span>
               <p className="font-semibold">San Francisco, CA</p>
             </div>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-medium w-full text-center md:text-left gap-4">
          <p>© 2024 TERRAFORGE SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 uppercase tracking-wider">
            <Link href="#" className="hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5">Trust Center</Link>
            <Link href="#" className="hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5">Sustainability Report</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
