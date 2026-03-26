'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Leaf } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const hasSidebarLayout = [
    '/dashboard',
    '/advisory',
    '/finance',
    '/market',
    '/community',
    '/sustainability',
    '/settings',
  ].some((route) => pathname.startsWith(route));

  // Hide Footer on the intro/login and signup pages
  if (pathname === '/' || pathname === '/signup' || pathname.startsWith('/buyer')) {
    return null;
  }

  return (
    <footer className={`mt-auto border-t border-border/80 bg-background/95 py-3 ${hasSidebarLayout ? 'md:ml-64' : ''}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/home" className="font-semibold text-foreground">TerraForge Systems</Link>
            <span className="hidden md:inline">|</span>
            <span>Bhubaneswar, Odisha</span>
            <span className="hidden md:inline">|</span>
            <span>+91 674 400 5050</span>
          </div>

          <div className="flex items-center gap-4 uppercase tracking-wider">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Trust</Link>
            <Link href="#" className="hover:text-foreground">Report</Link>
          </div>

          <div className="flex items-center gap-2 md:justify-end">
            <Globe className="h-3.5 w-3.5" />
            <Leaf className="h-3.5 w-3.5" />
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
