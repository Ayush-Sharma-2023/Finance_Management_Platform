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
  { name: 'Tax Calculator', href: '/tax', icon: Calculator },
  { name: 'Investments', href: '/investments', icon: LineChart },
  { name: 'Mutual Funds', href: '/mutual-funds', icon: PiggyBank },
  { name: 'Budget', href: '/budget', icon: PiggyBank },
  { name: 'AI Advisor', href: '/advisor', icon: MessageSquare },
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
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">FinanceAI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'hidden items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:flex',
                    pathname === item.href && 'text-foreground'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {user && (
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          )}
        </div>
      </div>
    </header>
  );
}
