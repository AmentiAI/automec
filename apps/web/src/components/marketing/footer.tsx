import Link from 'next/link'

const footerLinks = {
  Product: [
    { href: '/pricing', label: 'Pricing' },
    { href: '/for-shops', label: 'For shops' },
    { href: '/for-tuners', label: 'For tuners' },
    { href: '/changelog', label: 'Changelog' },
  ],
  Explore: [
    { href: '/vehicles', label: 'Vehicle database' },
    { href: '/parts', label: 'Parts catalog' },
    { href: '/builds', label: 'Community builds' },
  ],
  Company: [
    { href: '/blog', label: 'Blog' },
    { href: 'mailto:hello@automec.io', label: 'Contact' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
                <span className="text-xs font-black text-black">A</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight">Automec</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The all-in-one platform for car builders, shops, and tuners.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Automec. All rights reserved.</span>
          <span className="text-xs">Built for builders.</span>
        </div>
      </div>
    </footer>
  )
}
