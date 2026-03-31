import { requireUser } from '@/lib/auth'
import { db, shops, organizations, organizationMembers, parts, tuneRequests, lookupEvents } from '@automec/db'
import { eq, count, and, gte } from 'drizzle-orm'
import { Package, Zap, Eye, TrendingUp, ArrowRight } from 'lucide-react'
import { subDays } from 'date-fns'
import Link from 'next/link'

export default async function ShopDashboardPage() {
  const user = await requireUser()

  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) return null

  const shopId = membership.shop.id
  const thirtyDaysAgo = subDays(new Date(), 30)

  const [partsCount, pendingTuneCount, lookupCount] = await Promise.all([
    db.select({ count: count() }).from(parts).where(eq(parts.shopId, shopId)),
    db.select({ count: count() }).from(tuneRequests).where(and(eq(tuneRequests.shopId, shopId), eq(tuneRequests.status, 'pending'))),
    db.select({ count: count() }).from(lookupEvents).where(and(eq(lookupEvents.shopId, shopId), gte(lookupEvents.createdAt, thirtyDaysAgo))),
  ])

  const stats = [
    {
      label: 'Parts in catalog',
      value: partsCount[0]?.count ?? 0,
      icon: Package,
      href: '/shop/catalog',
      change: '+12 this month',
    },
    {
      label: 'Pending tune requests',
      value: pendingTuneCount[0]?.count ?? 0,
      icon: Zap,
      href: '/shop/tune-requests',
      change: 'Needs attention',
      accent: (pendingTuneCount[0]?.count ?? 0) > 0,
    },
    {
      label: 'Fitment lookups (30d)',
      value: lookupCount[0]?.count ?? 0,
      icon: Eye,
      href: null,
      change: 'Last 30 days',
    },
  ]

  return (
    <div>
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Dashboard</p>
        <h1 className="text-4xl font-extrabold tracking-tight">{membership.shop.name}</h1>
        <p className="mt-1 text-muted-foreground">Your shop overview</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border bg-card p-6 transition-all ${
              s.accent
                ? 'border-amber-500/40 shadow-[0_0_30px_-10px_hsl(38_92%_52%_/_0.25)]'
                : 'border-border/60'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.accent ? 'bg-amber-500/20' : 'bg-secondary'}`}>
                <s.icon className={`h-4 w-4 ${s.accent ? 'text-amber-500' : 'text-muted-foreground'}`} />
              </div>
            </div>
            <div className={`text-4xl font-black ${s.accent ? 'text-amber-400' : ''}`}>
              {s.value.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.change}</span>
              {s.href && (
                <Link href={s.href} className="flex items-center gap-1 text-xs text-amber-400 hover:underline">
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/shop/catalog/new', label: 'Add a part', icon: Package },
            { href: '/shop/tune-requests', label: 'View tune requests', icon: Zap },
            { href: '/shop/licenses', label: 'Manage licenses', icon: TrendingUp },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm font-medium transition-colors hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
              <ArrowRight className="ml-auto h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
