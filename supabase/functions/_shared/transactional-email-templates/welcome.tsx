/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { EmailShell, button, buttonWrap, h1, text } from '../email-templates/theme.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  ctaUrl?: string
}

const Email = ({ name, ctaUrl = 'https://reeddigitalgroup.com/home-office' }: Props) => (
  <EmailShell
    siteName="Reed Digital Group"
    siteUrl="https://reeddigitalgroup.com"
    preview="Welcome to Reed Digital Group"
    footerNote="Questions? Just reply to this email."
  >
    <Heading style={h1}>{name ? `Welcome, ${name}` : 'Welcome'}</Heading>
    <Text style={text}>
      Your account is ready. Jump in whenever you're ready to get started.
    </Text>
    <div style={buttonWrap}>
      <Button style={button} href={ctaUrl}>
        Open your workspace
      </Button>
    </div>
  </EmailShell>
)

export const template = {
  component: Email,
  subject: 'Welcome to Reed Digital Group',
  displayName: 'Welcome',
  previewData: { name: 'Jordan' },
} satisfies TemplateEntry
