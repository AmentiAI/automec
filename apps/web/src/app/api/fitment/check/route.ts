import { NextResponse, type NextRequest } from 'next/server'
import { checkFitment } from '@automec/core/fitment'
import { auth } from '@clerk/nextjs/server'
import { db, lookupEvents } from '@automec/db'
import { getOrCreateUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { partId, vehicleConfigId, installedPartIds } = body

  if (!partId || !vehicleConfigId) {
    return NextResponse.json({ error: 'partId and vehicleConfigId required' }, { status: 400 })
  }

  const result = await checkFitment({ partId, vehicleConfigId, installedPartIds })

  // Track the lookup
  const { userId: clerkId } = await auth()
  if (clerkId) {
    const user = await getOrCreateUser()
    await db.insert(lookupEvents).values({
      userId: user?.id,
      partId,
      vehicleConfigId,
      result: result.status,
    }).catch(() => {}) // non-critical
  }

  return NextResponse.json(result)
}
