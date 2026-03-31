import { requireUser } from '@/lib/auth'
import { db, subscriptions, invoicesCache } from '@automec/db'
import { eq, desc } from 'drizzle-orm'
import { Button } from '@automec/ui'
import Link from 'next/link'
import { PLANS } from '@automec/types'
import { format } from 'date-fns'
import { formatAmount } from '@/lib/stripe'
import { createCheckoutAction, createPortalAction } from '@/actions/billing'
import { CreditCard, ArrowRight, CheckCircle, FileText, ExternalLink } from 'lucide-react'

export default async function BillingPage() {
  const user = await requireUser()

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.entityId, user.id))
    .limit(1)

  const invoicesList = await db
    .select()
    .from(invoicesCache)
    .where(eq(invoicesCache.entityId, user.id))
    .orderBy(desc(invoicesCache.createdAt))
    .limit(12)

  const currentPlan = subscription ? PLANS[subscription.planId] : PLANS.enthusiast_free

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Account</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Billing</h1>
      </div>

      {/* Current plan */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="font-semibold">Current plan</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold">{currentPlan.name}</div>
              {subscription ? (
                <div className="mt-1 text-sm text-muted-foreground">
                  {subscription.status === 'trialing'
                    ? `Trial ends ${format(subscription.trialEnd!, 'MMM d, yyyy')}`
                    : `Renews ${format(subscription.currentPeriodEnd, 'MMM d, yyyy')}`}
                </div>
              ) : (
                <div className="mt-1 text-sm text-muted-foreground">Free plan — no billing</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${subscription?.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                {subscription?.status ?? 'free'}
              </span>
              {subscription ? (
                <form action={createPortalAction}>
                  <Button type="submit" variant="outline" size="sm" className="border-border/60">
                    <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                    Manage billing
                  </Button>
                </form>
              ) : (
                <Button size="sm" asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                  <Link href="/pricing">
                    Upgrade
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade options */}
      {!subscription && (
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-bold">Upgrade your plan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <UpgradeCard planId="enthusiast_pro" />
            <UpgradeCard planId="shop_starter" />
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoicesList.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold">Invoices</h2>
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {invoicesList.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/40 last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-4">{format(inv.createdAt, 'MMM d, yyyy')}</td>
                    <td className="px-5 py-4 font-mono font-semibold">{formatAmount(inv.amountPaid)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          Download
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function UpgradeCard({ planId }: { planId: keyof typeof PLANS }) {
  const plan = PLANS[planId]
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-amber-500/40">
      <div className="mb-1 text-lg font-bold">{plan.name}</div>
      <div className="mb-4 text-3xl font-black">
        ${plan.priceMonthly}
        <span className="text-base font-normal text-muted-foreground">/mo</span>
      </div>
      <ul className="mb-5 space-y-2">
        {plan.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>
      <form action={createCheckoutAction.bind(null, planId)}>
        <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-400 font-semibold">
          Start free trial
        </Button>
      </form>
    </div>
  )
}
