'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Menu, X, ChevronDown, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';

const navItems = [
  { key: 'nav.advisory', href: '/advisory' },
  { key: 'nav.finance', href: '/finance' },
  { key: 'nav.market', href: '/market' },
  { key: 'nav.community', href: '/community' },
  { key: 'nav.sustainability', href: '/sustainability' },
  { key: 'nav.contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // Hide Navbar on the intro/login and signup pages
  if (pathname === '/' || pathname === '/signup' || pathname.startsWith('/buyer')) {
    return null;
  }

  return (
<<<<<<< HEAD
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/20 dark:border-white/10 transition-all duration-300">
=======
    <nav className="fixed inset-x-0 top-0 z-50 glass-panel border-b border-white/20 dark:border-white/10 transition-all duration-300">
>>>>>>> 723cd574cea17f27ddc7f730aa69a1b7c17cf1c5
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl tracking-tight text-foreground">
              TerraForge<span className="text-primary ml-1">Systems</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t(item.key)}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher compact />
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass border-b border-border"
        >
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            <div className="px-3 py-1">
              <LanguageSwitcher compact className="w-full justify-between" />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
