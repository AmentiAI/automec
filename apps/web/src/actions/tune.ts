'use server'

import { requireUser } from '@/lib/auth'
import { db, tuneRequests, tuneRequestMessages, tuneFiles, garageVehicles, garages, tuneLicenseInventory } from '@automec/db'
import { eq } from 'drizzle-orm'
import {
  createTuneRequestSchema,
  sendTuneMessageSchema,
  updateTuneRequestStatusSchema,
  uploadTuneFileSchema,
  type CreateTuneRequestInput,
  type SendTuneMessageInput,
} from '@automec/core/validators'
import { revalidatePath } from 'next/cache'

export async function createTuneRequestAction(input: CreateTuneRequestInput): Promise<string> {
  const user = await requireUser()
  const data = createTuneRequestSchema.parse(input)

  // Verify vehicle ownership
  const [vehicle] = await db
    .select({ garageId: garageVehicles.garageId })
    .from(garageVehicles)
    .where(eq(garageVehicles.id, data.garageVehicleId))
    .limit(1)
  if (!vehicle) throw new Error('Vehicle not found')

  const [garage] = await db
    .select()
    .from(garages)
    .where(eq(garages.id, vehicle.garageId))
    .limit(1)
  if (!garage || garage.userId !== user.id) throw new Error('Forbidden')

  const [request] = await db
    .insert(tuneRequests)
    .values({
      garageVehicleId: data.garageVehicleId,
      customerId: user.id,
      shopId: data.shopId,
      platform: data.platform,
      description: data.description,
      powerGoalHp: data.powerGoalHp,
      budget: data.budget?.toString(),
    })
    .returning()

  if (!request) throw new Error('Failed to create request')

  revalidatePath('/tune-requests')
  return request.id
}

export async function sendTuneMessageAction(input: SendTuneMessageInput) {
  const user = await requireUser()
  const data = sendTuneMessageSchema.parse(input)

  // Verify access
  const [request] = await db
    .select()
    .from(tuneRequests)
    .where(eq(tuneRequests.id, data.tuneRequestId))
    .limit(1)

  if (!request) throw new Error('Request not found')
  if (request.customerId !== user.id && request.tunerId !== user.id) {
    throw new Error('Forbidden')
  }

  await db.insert(tuneRequestMessages).values({
    tuneRequestId: data.tuneRequestId,
    senderId: user.id,
    content: data.content,
    fileUrls: data.fileUrls,
  })

  revalidatePath(`/tune-requests/${data.tuneRequestId}`)
}

export async function updateTuneStatusAction(tuneRequestId: string, status: string) {
  const user = await requireUser()

  const [request] = await db
    .select()
    .from(tuneRequests)
    .where(eq(tuneRequests.id, tuneRequestId))
    .limit(1)

  if (!request) throw new Error('Not found')
  if (request.tunerId !== user.id && request.customerId !== user.id) throw new Error('Forbidden')

  await db
    .update(tuneRequests)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(tuneRequests.id, tuneRequestId))

  revalidatePath(`/tune-requests/${tuneRequestId}`)
  revalidatePath('/tune-requests')
  revalidatePath('/shop/tune-requests')
}

export async function assignLicenseAction(tuneRequestId: string, licenseId: string) {
  const user = await requireUser()

  await db
    .update(tuneLicenseInventory)
    .set({
      isAssigned: true,
      assignedToRequestId: tuneRequestId,
      assignedAt: new Date(),
    })
    .where(eq(tuneLicenseInventory.id, licenseId))

  revalidatePath(`/tune-requests/${tuneRequestId}`)
  revalidatePath('/shop/licenses')
}
