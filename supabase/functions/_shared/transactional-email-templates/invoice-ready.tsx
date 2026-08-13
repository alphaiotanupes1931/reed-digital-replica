/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from '../email-templates/theme.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  clientName?: string
  amount?: string
  invoiceUrl?: string
}

const Email = ({ clientName, amount, invoiceUrl }: Props) => (
  <EmailShell
    siteName="Reed Digital Group"
    siteUrl="https://reeddigitalgroup.com"
    preview="Your invoice is ready"
    footerNote="Need a different payment method? Just reply to this email."
  >
    <Heading style={h1}>Your invoice is ready</Heading>
    <Text style={text}>
      {clientName ? `Hi ${clientName}, ` : ''}your invoice
      {amount ? ` for ${amount}` : ''} is ready to view and pay.
    </Text>
    {invoiceUrl ? (
      <div style={buttonWrap}>
        <Button style={button} href={invoiceUrl}>
          View invoice
        </Button>
      </div>
    ) : null}
  </EmailShell>
)

export const template = {
  component: Email,
  subject: 'Reed Digital Group - Your invoice is ready',
  displayName: 'Invoice ready',
  previewData: { clientName: 'Jordan', amount: '$1,250.00', invoiceUrl: 'https://reeddigitalgroup.com/pay' },
} satisfies TemplateEntry
