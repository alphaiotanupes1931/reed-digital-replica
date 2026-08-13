/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from './theme.tsx'

interface MagicLinkEmailProps {
  siteName: string
  siteUrl?: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <EmailShell
    siteName={siteName}
    siteUrl={siteUrl}
    preview={`Your sign-in link for ${siteName}`}
    footerNote="This link expires shortly and can only be used once."
  >
    <Heading style={h1}>Sign in</Heading>
    <Text style={text}>Tap below to sign in to {siteName}.</Text>
    <div style={buttonWrap}>
      <Button style={button} href={confirmationUrl}>
        Sign in
      </Button>
    </div>
  </EmailShell>
)

export default MagicLinkEmail
