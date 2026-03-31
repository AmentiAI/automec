import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { Button } from '@automec/ui'

export function AppNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/garage" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
            <span className="text-[10px] font-black text-black">A</span>
          </div>
          <span className="text-sm font-bold tracking-tight">Automec</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
