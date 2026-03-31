import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { db, shops, organizations, organizationMembers } from '@automec/db'
import { eq } from 'drizzle-orm'
import { ShopSidebar } from '@/components/shop/sidebar'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  // Find the shop for this user's org
  const [membership] = await db
    .select({ shop: shops, org: organizations })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) redirect('/onboarding/shop')

  return (
    <div className="flex gap-6">
      <ShopSidebar shopId={membership.shop.id} shopName={membership.shop.name} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
