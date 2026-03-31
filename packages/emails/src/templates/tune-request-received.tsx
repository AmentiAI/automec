import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface TuneRequestReceivedProps {
  customerName: string
  shopName: string
  vehicleDescription: string
  platform: string
  requestId: string
  appUrl: string
}

export function TuneRequestReceivedEmail({
  customerName,
  shopName,
  vehicleDescription,
  platform,
  requestId,
  appUrl,
}: TuneRequestReceivedProps) {
  return (
    <Html>
      <Head />
      <Preview>Your tune request has been received by {shopName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Tune request received</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Your tune request for your <strong>{vehicleDescription}</strong> on{' '}
            <strong>{platform}</strong> has been received by <strong>{shopName}</strong>.
          </Text>
          <Text style={text}>
            The shop will review your request and reach out shortly. You can track the status and
            communicate with the shop directly in your dashboard.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${appUrl}/tune-requests/${requestId}`}>
              View request
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
