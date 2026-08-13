/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from './theme.tsx'

interface RecoveryEmailProps {
  siteName: string
  siteUrl?: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <EmailShell
    siteName={siteName}
    siteUrl={siteUrl}
    preview={`Reset your ${siteName} password`}
    footerNote="Didn't ask for this? Ignore this email — your password stays the same."
  >
    <Heading style={h1}>Reset your password</Heading>
    <Text style={text}>
      Tap below to choose a new password for your account.
    </Text>
    <div style={buttonWrap}>
      <Button style={button} href={confirmationUrl}>
        Reset password
      </Button>
    </div>
  </EmailShell>
)

export default RecoveryEmail
