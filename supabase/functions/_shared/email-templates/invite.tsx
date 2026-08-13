/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from './theme.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <EmailShell
    siteName={siteName}
    siteUrl={siteUrl}
    preview={`You've been invited to join ${siteName}`}
    footerNote="Weren't expecting this? You can safely ignore this email."
  >
    <Heading style={h1}>You're invited</Heading>
    <Text style={text}>
      Accept your invitation to join {siteName} and set up your account.
    </Text>
    <div style={buttonWrap}>
      <Button style={button} href={confirmationUrl}>
        Accept invitation
      </Button>
    </div>
  </EmailShell>
)

export default InviteEmail
