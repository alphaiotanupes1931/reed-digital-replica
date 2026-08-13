/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, h1, text } from '../email-templates/theme.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  message?: string
}

const Email = ({ name, message }: Props) => (
  <EmailShell
    siteName="Reed Digital Group"
    siteUrl="https://reeddigitalgroup.com"
    preview="We got your message"
    footerNote="We usually reply within one business day."
  >
    <Heading style={h1}>{name ? `Thanks, ${name}` : 'Thanks for reaching out'}</Heading>
    <Text style={text}>
      We got your message and we'll be in touch shortly.
    </Text>
    {message ? <Text style={text}>"{message}"</Text> : null}
  </EmailShell>
)

export const template = {
  component: Email,
  subject: 'Reed Digital Group - We got your message',
  displayName: 'Contact confirmation',
  previewData: { name: 'Jordan', message: 'I need a new website for my restaurant.' },
} satisfies TemplateEntry
