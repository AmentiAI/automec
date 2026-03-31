import { serve } from 'inngest/next'
import {
  inngest,
  sendWelcomeEmail,
  notifyTuneRequestReceived,
  notifyTuneStatusUpdate,
  sendTrialEndingAlerts,
} from '@/inngest'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendWelcomeEmail,
    notifyTuneRequestReceived,
    notifyTuneStatusUpdate,
    sendTrialEndingAlerts,
  ],
})
