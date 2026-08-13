// deno-lint-ignore-file no-explicit-any
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as welcome } from './welcome.tsx'
import { template as invoiceReady } from './invoice-ready.tsx'

export interface TemplateEntry {
  component: any
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-confirmation': contactConfirmation,
  welcome: welcome,
  'invoice-ready': invoiceReady,
}
