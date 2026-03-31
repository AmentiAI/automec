import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@automec/ui'
import { CheckCircle, Upload, Users, BarChart3, Zap, Package, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Shops & Tuners',
  description:
    'Manage your parts catalog, receive tune requests, and grow your shop with the Automec professional platform.',
}

export default function ForShopsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,hsl(38_92%_52%_/_0.12),transparent)]" />

        <div className="container relative mx-auto px-6 py-32 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            For shops & tuners
          </div>
          <h1 className="mx-auto mb-6 max-w-4xl text-6xl font-extrabold leading-[1.08] tracking-tight lg:text-7xl">
            Run a tighter shop.
            <br />
            <span className="text-gradient-amber">Grow faster.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Upload your catalog, manage fitment rules, receive tune requests, and deliver a professional customer experience — without building your own software.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-12 bg-amber-500 px-8 text-base font-semibold text-black hover:bg-amber-400"
            >
              <Link href="/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 border-border/60">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">Features</div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Everything a professional shop needs
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Built for tuners, performance shops, and parts retailers who want a competitive edge.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shopFeatures.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-amber-500/40 hover:shadow-[0_0_40px_-10px_hsl(38_92%_52%_/_0.2)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                  <f.icon className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / checklist */}
      <section className="border-y border-border/50 bg-secondary/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight lg:text-4xl">
              What you get on day one
            </h2>
            <div className="grid gap-4 text-left sm:grid-cols-2">
              {dayOneFeatures.map((f) => (
                <div key={f} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(38_92%_52%_/_0.1),transparent)]" />
        <div className="container relative mx-auto px-6 text-center">
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight">Ready to get started?</h2>
          <p className="mx-auto mb-10 max-w-md text-xl text-muted-foreground">
            14-day free trial. Cancel anytime.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="h-12 bg-amber-500 px-8 font-semibold text-black hover:bg-amber-400">
              <Link href="/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-border/60 px-8">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const shopFeatures = [
  {
    icon: Upload,
    title: 'Parts catalog management',
    description: 'Upload your catalog via CSV or add parts one by one. Manage SKUs, pricing, images, and attributes.',
  },
  {
    icon: CheckCircle,
    title: 'Fitment rules engine',
    description: 'Define which parts fit which vehicles. Set conditions, dependencies, conflicts, and tune requirements.',
  },
  {
    icon: Zap,
    title: 'Tune request workflow',
    description: 'Receive requests, communicate with customers, upload tune files, and assign license codes — all tracked.',
  },
  {
    icon: Package,
    title: 'Code & license inventory',
    description: 'Manage HP Tuners, EcuTek, Cobb, and other platform inventory. Assign codes to completed requests.',
  },
  {
    icon: Users,
    title: 'Customer garage access',
    description: "See your customers' builds, installed parts, and tune history so you can give better advice.",
  },
  {
    icon: BarChart3,
    title: 'Analytics & conversions',
    description: 'Track fitment lookups, part views, quote requests, and conversion rates for your catalog.',
  },
]

const dayOneFeatures = [
  'Parts catalog with fitment rules',
  'Tune request inbox and messaging',
  'License code inventory management',
  'Customer garage visibility',
  'Fitment widget for your website',
  'Analytics dashboard',
  'CSV catalog import',
  'Multi-staff access',
]
