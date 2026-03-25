'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Leaf, BadgeDollarSign, Map, Users, Target, Settings } from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Advisory', href: '/advisory', icon: Leaf },
  { name: 'Income Prediction', href: '/finance', icon: BadgeDollarSign },
  { name: 'Market Linkage', href: '/market', icon: Map },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Sustainability', href: '/sustainability', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 lg:top-20 bottom-0 w-64 glass-panel border-r border-white/20 dark:border-white/10 hidden md:flex flex-col z-40">
      
      {/* User profile snippet */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
            {/* Using a placeholder character since we don't have an image */}
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">TerraForge Hub</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Enterprise Tier</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer action */}
      <div className="p-4">
        <button className="w-full py-3 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>Upgrade Plan</span>
        </button>
      </div>
    </aside>
  );
}
