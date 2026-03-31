import { auth, currentUser } from '@clerk/nextjs/server'
import { db, users } from '@automec/db'
import { eq } from 'drizzle-orm'

export async function getOrCreateUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1)

  if (existing[0]) return existing[0]

  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email) return null

  const rows = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
      avatarUrl: clerkUser.imageUrl || null,
    })
    .returning()

  return rows[0] ?? null
}

export async function requireUser() {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}
