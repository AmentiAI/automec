import { inngest } from '../client'
import { sendEmail, BillingAlertEmail } from '@automec/emails'
import { db, subscriptions, users } from '@automec/db'
import { eq, and, lte, gte } from 'drizzle-orm'
import { addDays } from 'date-fns'
import React from 'react'

export const sendTrialEndingAlerts = inngest.createFunction(
  { id: 'send-trial-ending-alerts', name: 'Send trial ending alerts' },
  { cron: '0 9 * * *' }, // daily at 9am
  async () => {
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://automec.io'
    const in3Days = addDays(new Date(), 3)
    const in4Days = addDays(new Date(), 4)

    const trialingSubs = await db
      .select({ sub: subscriptions })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'trialing'),
          lte(subscriptions.trialEnd!, in3Days),
          gte(subscriptions.trialEnd!, new Date()),
        ),
      )

    for (const { sub } of trialingSubs) {
      if (sub.entityType !== 'user') continue
      const [user] = await db.select().from(users).where(eq(users.id, sub.entityId)).limit(1)
      if (!user || !sub.trialEnd) continue

      const daysRemaining = Math.ceil((sub.trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      await sendEmail({
        to: user.email,
        subject: `Your Automec trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
        react: React.createElement(BillingAlertEmail, {
          name: user.name ?? 'there',
          alertType: 'trial_ending',
          daysRemaining,
          appUrl,
        }),
      })
    }

    return { processed: trialingSubs.length }
  },
)
