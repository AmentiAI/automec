import { inngest } from '../client'
import { sendEmail, WelcomeEmail } from '@automec/emails'
import React from 'react'

export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email', name: 'Send welcome email' },
  { event: 'user/created' },
  async ({ event }) => {
    const { email, name, appUrl } = event.data as { email: string; name: string; appUrl: string }

    await sendEmail({
      to: email,
      subject: 'Welcome to Automec',
      react: React.createElement(WelcomeEmail, { name: name || 'there', appUrl }),
    })

    return { sent: true }
  },
)
