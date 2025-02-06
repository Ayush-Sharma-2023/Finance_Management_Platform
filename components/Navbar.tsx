'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Calculator, LineChart, MessageSquare, PiggyBank } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Home', href: '/', icon: BarChart3 },
  { name: 'Tax Calculator', href: '/taxations', icon: Calculator },
  { name: 'Investments', href: '/investments', icon: LineChart },
  { name: 'Mutual Funds', href: '/mutualfunds', icon: PiggyBank },
  { name: 'Budget', href: '/budget', icon: PiggyBank },
  { name: 'AI Advisor', href: '/temp', icon: MessageSquare },
];

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center"> {/* Increased height */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-7 w-7 text-blue-600" /> {/* Increased logo size */}
            <span className="hidden font-bold text-lg sm:inline-block text-blue-600">FinanceAI</span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'hidden sm:flex items-center px-4 py-2 rounded-lg text-white bg-blue-500 transition-all duration-300 transform hover:bg-blue-700 hover:scale-110',
                    pathname === item.href && 'bg-blue-700'
                  )}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {user && (
            <Button variant="outline" onClick={handleSignOut} className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
