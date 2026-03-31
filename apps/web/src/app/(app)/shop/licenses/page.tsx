import { requireUser } from '@/lib/auth'
import { db, tuneLicenseInventory, shops, organizations, organizationMembers } from '@automec/db'
import { eq } from 'drizzle-orm'
import { AddLicenseForm } from '@/components/shop/add-license-form'
import { format } from 'date-fns'
import { Key } from 'lucide-react'

export default async function LicensesPage() {
  const user = await requireUser()

  const [membership] = await db
    .select({ shop: shops })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .innerJoin(shops, eq(organizations.id, shops.orgId))
    .where(eq(organizationMembers.userId, user.id))
    .limit(1)

  if (!membership) return null

  const licenses = await db
    .select()
    .from(tuneLicenseInventory)
    .where(eq(tuneLicenseInventory.shopId, membership.shop.id))

  const available = licenses.filter((l) => !l.isAssigned)
  const assigned = licenses.filter((l) => l.isAssigned)

  return (
    <div>
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Shop</p>
        <h1 className="text-4xl font-extrabold tracking-tight">License inventory</h1>
        <div className="mt-2 flex gap-4 text-sm">
          <span className="text-emerald-400 font-semibold">{available.length} available</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{assigned.length} assigned</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Available</div>
          <div className="mt-1 text-4xl font-black text-emerald-400">{available.length}</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assigned</div>
          <div className="mt-1 text-4xl font-black">{assigned.length}</div>
        </div>
      </div>

      {/* Add license form */}
      <div className="mb-8 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">Add license</h2>
        <AddLicenseForm />
      </div>

      {licenses.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Platform</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">License key</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Added</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id} className="border-b border-border/40 last:border-0 transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-semibold">{license.platform.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {license.licenseKey.slice(0, 8)}{'•'.repeat(Math.max(0, license.licenseKey.length - 8))}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${license.isAssigned ? 'bg-zinc-500/20 text-zinc-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {license.isAssigned ? 'Assigned' : 'Available'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{format(license.createdAt, 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
