import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@automec/ui'
import { CheckCircle, Zap, Wrench, BarChart3, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Automec — Fitment, Builds & Tuning for Modified Cars',
  description:
    'The all-in-one platform for car builders. Check fitment instantly, track your build, and connect with shops and tuners who know your platform.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(38_92%_52%_/_0.15),transparent)]" />

        <div className="container relative mx-auto px-6 py-32 text-center">
          {/* Pill badge */}
          <Link
            href="/changelog"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            Now with AI fitment explanations
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <h1 className="mx-auto mb-6 max-w-4xl text-6xl font-extrabold leading-[1.08] tracking-tight lg:text-8xl">
            Build smarter.{' '}
            <span className="text-gradient-amber">Fit right.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground lg:text-2xl">
            Check part fitment instantly, track your build, and connect with shops and tuners who know your platform — all in one place.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="h-12 bg-amber-500 px-8 text-base font-semibold text-black hover:bg-amber-400"
            >
              <Link href="/sign-up">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 text-base font-medium border-border/60 hover:bg-secondary"
            >
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Free forever for enthusiasts. No credit card required.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4 text-center">
            {[
              { value: '50k+', label: 'Builds tracked' },
              { value: '200+', label: 'Partner shops' },
              { value: '2M+', label: 'Fitment checks' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 px-4 py-5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
              Platform
            </div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Everything your build needs
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              One platform that covers the full journey from stock to built.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_40px_-10px_hsl(38_92%_52%_/_0.2)] ${
                  i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
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

      {/* For builders / For shops */}
      <section className="border-y border-border/50 bg-secondary/30 py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* For builders */}
            <div className="rounded-2xl border border-border/60 bg-card p-10">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                For builders
              </div>
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
                Your garage,<br />your build.
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                Add your vehicle, log every mod, check fitment before you buy, and track your build timeline from stock to built.
              </p>
              <ul className="mb-8 space-y-3">
                {builderFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                <Link href="/sign-up">Start your garage free</Link>
              </Button>
            </div>

            {/* For shops */}
            <div className="rounded-2xl border border-amber-500/30 bg-card p-10 shadow-[0_0_60px_-20px_hsl(38_92%_52%_/_0.25)]">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                For shops & tuners
              </div>
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
                Your shop,<br />supercharged.
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                Upload your catalog, manage fitment rules, receive tune requests, and deliver a professional experience your customers will remember.
              </p>
              <ul className="mb-8 space-y-3">
                {shopFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                <Link href="/for-shops">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-40">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(38_92%_52%_/_0.12),transparent)]" />
        <div className="container relative mx-auto px-6 text-center">
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight lg:text-7xl">
            Ready to build<br />
            <span className="text-gradient-amber">smarter?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-xl text-muted-foreground">
            Free for enthusiasts. Professional plans for shops.
          </p>
          <Button
            size="lg"
            asChild
            className="h-14 bg-amber-500 px-10 text-lg font-bold text-black hover:bg-amber-400"
          >
            <Link href="/sign-up">
              Get started free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: CheckCircle,
    title: 'Fitment checker',
    description:
      'Know if a part fits your exact vehicle config before you order. Direct, conditional, or does not fit — with plain English explanations powered by AI.',
  },
  {
    icon: Wrench,
    title: 'Build tracker',
    description:
      'Log every mod, track installs, record dyno pulls, and share your build publicly or keep it private.',
  },
  {
    icon: Zap,
    title: 'Tune workflow',
    description:
      'Request a tune from verified shops. Track revisions, receive files, and get license codes — all in one thread.',
  },
  {
    icon: BarChart3,
    title: 'Shop dashboard',
    description:
      'Manage your parts catalog, fitment rules, customer requests, and tune inventory from a single dashboard.',
  },
]

const builderFeatures = [
  'Check fitment on any part before you buy',
  'Track every mod with dates and costs',
  'Log dyno pulls and compare power runs',
  'Request a tune from verified shops',
  'Share your public build page',
  'AI-powered fitment explanations',
]

const shopFeatures = [
  'Upload your parts catalog with fitment rules',
  'Receive and manage tune requests',
  'Manage code and license inventory',
  'View customer garages and build history',
  'Embed the fitment widget on your site',
  'Analytics on lookups and conversions',
]
