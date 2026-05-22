/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for {siteName}. Click
          the button below to choose a new password.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset Password
        </Button>
        <Text style={footer}>
          If you didn't request a password reset, you can safely ignore this
          email. Your password will not be changed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = {
  fontSize: '20px',
  fontWeight: 600 as const,
  letterSpacing: '-0.01em',
  color: '#000000',
  margin: '0 0 18px',
}
const text = {
  fontSize: '13px',
  color: '#3f3f46',
  lineHeight: '1.6',
  margin: '0 0 22px',
}
const button = {
  backgroundColor: '#000000',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 600 as const,
  borderRadius: '6px',
  padding: '12px 22px',
  textDecoration: 'none',
  borderBottom: '2px solid #d99c1f',
}
const footer = { fontSize: '11px', color: '#999999', margin: '30px 0 0', lineHeight: '1.6' }
