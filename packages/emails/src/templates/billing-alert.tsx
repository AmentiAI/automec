import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface BillingAlertEmailProps {
  name: string
  alertType: 'trial_ending' | 'payment_failed' | 'subscription_canceled'
  daysRemaining?: number
  appUrl: string
}

const alertConfig = {
  trial_ending: {
    subject: 'Your trial is ending soon',
    body: (days: number) =>
      `Your free trial ends in ${days} day${days === 1 ? '' : 's'}. Upgrade to keep access to all your data, tune requests, and advanced fitment features.`,
    cta: 'Upgrade now',
    path: '/billing',
  },
  payment_failed: {
    subject: 'Payment failed — action required',
    body: () =>
      'We were unable to process your last payment. Please update your payment method to keep your account active.',
    cta: 'Update payment',
    path: '/billing',
  },
  subscription_canceled: {
    subject: 'Your subscription has been canceled',
    body: () =>
      'Your Automec subscription has been canceled. You can reactivate at any time to regain full access.',
    cta: 'Reactivate',
    path: '/billing',
  },
}

export function BillingAlertEmail({ name, alertType, daysRemaining = 0, appUrl }: BillingAlertEmailProps) {
  const config = alertConfig[alertType]
  const bodyText = alertType === 'trial_ending' ? config.body(daysRemaining) : config.body(0)

  return (
    <Html>
      <Head />
      <Preview>{config.subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{config.subject}</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>{bodyText}</Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${appUrl}${config.path}`}>
              {config.cta}
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Automec — automec.io</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system, sans-serif' }
const container = { backgroundColor: '#fff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }
const h1 = { color: '#1a1a1a', fontSize: '24px', fontWeight: '700', padding: '0 48px' }
const text = { color: '#444', fontSize: '16px', lineHeight: '26px', padding: '0 48px' }
const btnContainer = { textAlign: 'center' as const, padding: '24px 48px' }
const button = { backgroundColor: '#000', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 24px' }
const hr = { borderColor: '#e6ebf1', margin: '20px 48px' }
const footer = { color: '#8898aa', fontSize: '12px', padding: '0 48px' }
