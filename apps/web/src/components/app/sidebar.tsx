'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Wrench, Zap, BarChart3, Settings, ShoppingBag, CreditCard } from 'lucide-react'

const navItems = [
  { href: '/garage', label: 'Garage', icon: Car },
  { href: '/parts', label: 'Parts', icon: ShoppingBag },
  { href: '/tune-requests', label: 'Tune Requests', icon: Zap },
  { href: '/shop', label: 'Shop Dashboard', icon: Wrench },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/50 lg:flex lg:flex-col">
      <nav className="flex-1 space-y-0.5 p-3 pt-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon
                className={`h-4 w-4 shrink-0 ${active ? 'text-amber-400' : ''}`}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
