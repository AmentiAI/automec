import Link from 'next/link'
import { Button } from '@automec/ui'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
            <span className="text-xs font-black text-black">A</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight">Automec</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: '/pricing', label: 'Pricing' },
            { href: '/for-shops', label: 'For Shops' },
            { href: '/for-tuners', label: 'For Tuners' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SignedIn>
            <Button variant="ghost" size="sm" asChild className="text-sm">
              <Link href="/garage">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-amber-500 text-black hover:bg-amber-400 font-semibold text-sm"
            >
              <Link href="/sign-up">Get started</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
