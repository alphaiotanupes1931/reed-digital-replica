/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from './theme.tsx'

interface EmailChangeEmailProps {
  siteName: string
  siteUrl?: string
  oldEmail: string
  email?: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  siteUrl,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <EmailShell
    siteName={siteName}
    siteUrl={siteUrl}
    preview={`Confirm your new email for ${siteName}`}
    footerNote="If you didn't request this change, secure your account right away."
  >
    <Heading style={h1}>Confirm your new email</Heading>
    <Text style={text}>
      You asked to change your email from {oldEmail} to {newEmail}.
    </Text>
    <div style={buttonWrap}>
      <Button style={button} href={confirmationUrl}>
        Confirm change
      </Button>
    </div>
  </EmailShell>
)

export default EmailChangeEmail
