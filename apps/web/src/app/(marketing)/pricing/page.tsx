import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@automec/ui'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { PLANS } from '@automec/types'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple pricing for builders, shops, and tuners. Free to start.',
}

export default function PricingPage() {
  const enthusiastPlans = [PLANS.enthusiast_free, PLANS.enthusiast_pro]
  const shopPlans = [PLANS.shop_starter, PLANS.shop_growth, PLANS.shop_pro]

  return (
    <div className="relative overflow-hidden py-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(38_92%_52%_/_0.12),transparent)]" />

      <div className="container relative mx-auto px-6">
        <div className="mb-20 text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">Pricing</div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight lg:text-6xl">
            Simple, honest pricing
          </h1>
          <p className="mx-auto max-w-md text-xl text-muted-foreground">
            Free for enthusiasts. Professional tools for shops.
          </p>
        </div>

        {/* Enthusiast plans */}
        <div className="mb-24">
          <div className="mb-10 text-center">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Enthusiasts & Builders
            </div>
            <h2 className="text-2xl font-bold">Built your way</h2>
          </div>
          <div className="mx-auto grid max-w-2xl gap-5 md:grid-cols-2">
            {enthusiastPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} highlight={plan.id === 'enthusiast_pro'} />
            ))}
          </div>
        </div>

        {/* Shop plans */}
        <div>
          <div className="mb-10 text-center">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Shops & Tuners
            </div>
            <h2 className="text-2xl font-bold">Grow your business</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {shopPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} highlight={plan.id === 'shop_growth'} />
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground">
            Questions?{' '}
            <Link href="mailto:hello@automec.io" className="text-amber-400 underline-offset-4 hover:underline">
              Talk to us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  plan,
  highlight,
}: {
  plan: (typeof PLANS)[keyof typeof PLANS]
  highlight: boolean
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
        highlight
          ? 'border-amber-500/50 bg-card shadow-[0_0_60px_-20px_hsl(38_92%_52%_/_0.3)]'
          : 'border-border/60 bg-card hover:border-border'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-black">
            Most popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-8">
        {plan.priceMonthly === 0 ? (
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black">Free</span>
          </div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black">${plan.priceMonthly}</span>
            <span className="mb-1.5 text-base text-muted-foreground">/mo</span>
          </div>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      <Button
        className={`w-full font-semibold ${
          highlight
            ? 'bg-amber-500 text-black hover:bg-amber-400'
            : 'border-border/60 bg-secondary hover:bg-secondary/80'
        }`}
        variant={highlight ? 'default' : 'outline'}
        asChild
      >
        <Link href="/sign-up">
          {plan.priceMonthly === 0 ? 'Get started free' : 'Start free trial'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
