/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from './theme.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <EmailShell
    siteName={siteName}
    siteUrl={siteUrl}
    preview={`Confirm ${recipient} to finish setting up your account`}
    footerNote="If you didn't create an account, you can safely ignore this email."
  >
    <Heading style={h1}>Confirm your email</Heading>
    <Text style={text}>
      Tap the button below to confirm {recipient} and get started.
    </Text>
    <div style={buttonWrap}>
      <Button style={button} href={confirmationUrl}>
        Confirm email
      </Button>
    </div>
  </EmailShell>
)

export default SignupEmail
