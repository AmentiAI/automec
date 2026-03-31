import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { AppNav } from '@/components/app/nav'
import { AppSidebar } from '@/components/app/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
