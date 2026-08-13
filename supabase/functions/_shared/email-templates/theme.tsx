/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

// Instagram-style email system: white canvas, centered wordmark, generous
// whitespace, hairline dividers, one bold pill CTA, tiny muted footer.
export const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Figtree", Helvetica, Arial, sans-serif'

export const brand = '#BE9B32'

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: font,
  margin: '0',
  padding: '0',
}

export const container = {
  width: '100%',
  maxWidth: '460px',
  margin: '0 auto',
  padding: '40px 24px 48px',
}

export const wordmark = {
  fontSize: '13px',
  fontWeight: 700 as const,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#171717',
  textAlign: 'center' as const,
  margin: '0 0 32px',
  textDecoration: 'none',
}

export const h1 = {
  fontSize: '24px',
  lineHeight: '1.25',
  fontWeight: 700 as const,
  letterSpacing: '-0.02em',
  color: '#171717',
  textAlign: 'center' as const,
  margin: '0 0 14px',
}

export const text = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#737373',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

export const buttonWrap = { textAlign: 'center' as const, margin: '0 0 28px' }

export const button = {
  display: 'inline-block',
  backgroundColor: brand,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600 as const,
  borderRadius: '9999px',
  padding: '14px 34px',
  textDecoration: 'none',
}

export const code = {
  display: 'block',
  fontSize: '30px',
  fontWeight: 700 as const,
  letterSpacing: '0.28em',
  color: '#171717',
  textAlign: 'center' as const,
  backgroundColor: '#fafafa',
  border: '1px solid #ededed',
  borderRadius: '16px',
  padding: '20px 12px',
  margin: '0 0 28px',
}

export const hr = {
  border: 'none',
  borderTop: '1px solid #ededed',
  margin: '36px 0 20px',
}

export const footer = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#a3a3a3',
  textAlign: 'center' as const,
  margin: '0 0 6px',
}

export const link = { color: '#737373', textDecoration: 'underline' }

interface ShellProps {
  siteName: string
  siteUrl?: string
  preview: string
  children: React.ReactNode
  footerNote?: string
}

export const EmailShell = ({
  siteName,
  siteUrl,
  preview,
  children,
  footerNote,
}: ShellProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {siteUrl ? (
          <Link href={siteUrl} style={wordmark}>
            {siteName}
          </Link>
        ) : (
          <Text style={wordmark}>{siteName}</Text>
        )}
        <Section>{children}</Section>
        <Hr style={hr} />
        {footerNote ? <Text style={footer}>{footerNote}</Text> : null}
        <Text style={footer}>{siteName}</Text>
      </Container>
    </Body>
  </Html>
)
