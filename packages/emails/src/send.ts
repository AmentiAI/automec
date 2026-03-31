import { Resend } from 'resend'
import { render } from '@react-email/components'

const resend = new Resend(process.env['RESEND_API_KEY'])

const FROM = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@automec.io'

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  const html = await render(react)
  return resend.emails.send({ from: FROM, to, subject, html })
}
