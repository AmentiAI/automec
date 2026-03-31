'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, CheckSquare, Zap, Key, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { href: '/shop', label: 'Overview', icon: BarChart3 },
  { href: '/shop/catalog', label: 'Parts catalog', icon: Package },
  { href: '/shop/fitment', label: 'Fitment rules', icon: CheckSquare },
  { href: '/shop/tune-requests', label: 'Tune requests', icon: Zap },
  { href: '/shop/licenses', label: 'Licenses', icon: Key },
  { href: '/shop/settings', label: 'Settings', icon: Settings },
]

interface Props {
  shopId: string
  shopName: string
}

export function ShopSidebar({ shopId, shopName }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0">
      <div className="mb-5 rounded-xl border border-border/60 bg-card px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-500">Shop</div>
        <div className="mt-0.5 font-bold">{shopName}</div>
      </div>
      <nav className="space-y-0.5">
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
              <item.icon className={`h-4 w-4 ${active ? 'text-amber-400' : ''}`} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
