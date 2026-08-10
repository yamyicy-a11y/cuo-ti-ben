'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: '首页', icon: Home },
  { href: '/mistakes-list', label: '错题本', icon: BookOpen },
  { href: '/profile', label: '个人中心', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'scale-110')} strokeWidth={active ? 2.4 : 2} />
              <span className={cn(active && 'font-medium')}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
