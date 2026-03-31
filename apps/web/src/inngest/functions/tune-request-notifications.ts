import { inngest } from '../client'
import { sendEmail, TuneRequestReceivedEmail, TuneStatusUpdateEmail } from '@automec/emails'
import { db, tuneRequests, users, garageVehicles, makes, models, shops } from '@automec/db'
import { eq } from 'drizzle-orm'
import React from 'react'

export const notifyTuneRequestReceived = inngest.createFunction(
  { id: 'notify-tune-request-received', name: 'Notify: tune request received' },
  { event: 'tune/request.created' },
  async ({ event }) => {
    const { tuneRequestId } = event.data as { tuneRequestId: string }
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://automec.io'

    const [result] = await db
      .select({
        request: tuneRequests,
        customer: users,
        vehicle: garageVehicles,
        make: makes,
        model: models,
      })
      .from(tuneRequests)
      .innerJoin(users, eq(tuneRequests.customerId, users.id))
      .leftJoin(garageVehicles, eq(tuneRequests.garageVehicleId, garageVehicles.id))
      .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
      .leftJoin(models, eq(garageVehicles.modelId, models.id))
      .where(eq(tuneRequests.id, tuneRequestId))
      .limit(1)

    if (!result) return { skipped: true }

    const vehicleDescription = result.vehicle
      ? `${result.vehicle.year} ${result.make?.name ?? ''} ${result.model?.name ?? ''}`
      : 'Unknown vehicle'

    let shopName = 'a shop'
    if (result.request.shopId) {
      const [shopRow] = await db.select().from(shops).where(eq(shops.id, result.request.shopId)).limit(1)
      if (shopRow) shopName = shopRow.name
    }

    await sendEmail({
      to: result.customer.email,
      subject: `Tune request received — ${vehicleDescription}`,
      react: React.createElement(TuneRequestReceivedEmail, {
        customerName: result.customer.name ?? 'there',
        shopName,
        vehicleDescription,
        platform: result.request.platform.replace('_', ' ').toUpperCase(),
        requestId: tuneRequestId,
        appUrl,
      }),
    })

    return { sent: true }
  },
)

export const notifyTuneStatusUpdate = inngest.createFunction(
  { id: 'notify-tune-status-update', name: 'Notify: tune status updated' },
  { event: 'tune/request.status_updated' },
  async ({ event }) => {
    const { tuneRequestId, status } = event.data as { tuneRequestId: string; status: string }
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://automec.io'

    const [result] = await db
      .select({ request: tuneRequests, customer: users, vehicle: garageVehicles, make: makes, model: models })
      .from(tuneRequests)
      .innerJoin(users, eq(tuneRequests.customerId, users.id))
      .leftJoin(garageVehicles, eq(tuneRequests.garageVehicleId, garageVehicles.id))
      .leftJoin(makes, eq(garageVehicles.makeId, makes.id))
      .leftJoin(models, eq(garageVehicles.modelId, models.id))
      .where(eq(tuneRequests.id, tuneRequestId))
      .limit(1)

    if (!result) return { skipped: true }

    const vehicleDescription = result.vehicle
      ? `${result.vehicle.year} ${result.make?.name ?? ''} ${result.model?.name ?? ''}`
      : 'Unknown vehicle'

    await sendEmail({
      to: result.customer.email,
      subject: `Tune update — ${status.replace('_', ' ')}`,
      react: React.createElement(TuneStatusUpdateEmail, {
        customerName: result.customer.name ?? 'there',
        status,
        vehicleDescription,
        requestId: tuneRequestId,
        appUrl,
      }),
    })

    return { sent: true }
  },
)
