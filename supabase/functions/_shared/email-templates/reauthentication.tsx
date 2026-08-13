/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, code, h1, text } from './theme.tsx'

interface ReauthenticationEmailProps {
  siteName?: string
  token: string
}

export const ReauthenticationEmail = ({
  siteName = 'Reed Digital Group',
  token,
}: ReauthenticationEmailProps) => (
  <EmailShell
    siteName={siteName}
    preview="Your verification code"
    footerNote="This code expires shortly. If you didn't request it, ignore this email."
  >
    <Heading style={h1}>Verification code</Heading>
    <Text style={text}>Enter this code to confirm it's you.</Text>
    <Text style={code}>{token}</Text>
  </EmailShell>
)

export default ReauthenticationEmail
