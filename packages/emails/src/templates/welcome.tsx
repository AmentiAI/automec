import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  name: string
  appUrl: string
}

export function WelcomeEmail({ name, appUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Automec — your garage, your build.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Automec, {name}!</Heading>
          <Text style={text}>
            You're now set up to track your build, check fitment on parts, and connect with shops and
            tuners who know your platform.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${appUrl}/garage`}>
              Go to your garage
            </Button>
          </Section>
          <Text style={text}>
            Here's what you can do right now:
          </Text>
          <Text style={list}>
            • Add your vehicle and start your build tracker<br />
            • Check fitment on any part before you buy<br />
            • See which mods need a tune<br />
            • Request a tune from a verified shop
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Automec — Built for builders.{' '}
            <Link href={appUrl} style={link}>
              automec.io
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system, sans-serif' }
const container = { backgroundColor: '#fff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }
const h1 = { color: '#1a1a1a', fontSize: '24px', fontWeight: '700', padding: '0 48px' }
const text = { color: '#444', fontSize: '16px', lineHeight: '26px', padding: '0 48px' }
const list = { color: '#444', fontSize: '15px', lineHeight: '28px', padding: '0 48px' }
const btnContainer = { textAlign: 'center' as const, padding: '24px 48px' }
const button = { backgroundColor: '#000', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 24px' }
const hr = { borderColor: '#e6ebf1', margin: '20px 48px' }
const footer = { color: '#8898aa', fontSize: '12px', padding: '0 48px' }
const link = { color: '#556cd6' }
