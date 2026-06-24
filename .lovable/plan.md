## Tax Feature — Build Plan

Scope confirmed: ship the full tax module now in the current JetBrains Mono / Old Gold styling. The Framer-style redesign happens as a follow-up after this lands and works.

### What the client sees — `/home-office/taxes`

A single page with five sections, all editable inline:

1. **Income** — rows for business income (date, source, amount, notes). A "Pull from invoices" button auto-imports every paid invoice as a row (deduped by invoice id).
2. **W-2 Income** — rows for each W-2 (employer, gross wages, federal withheld, state withheld, year).
3. **Expenses & Write-offs** — rows with category (Equipment, Software, Office, Meals, Travel, Other), description, amount, date, optional receipt note.
4. **Mileage & Gas** — rows with date, purpose, miles, gas $ spent, vehicle.
5. **Reminders** — already exists; keep + surface on calendar.

Top of page:
- YTD totals strip: Business Income · W-2 Income · Total Expenses · Mileage (mi) · Estimated deductible
- **Notify Accountant** button → sends email to the accountant on file saying "Your client [name] has updated their tax info — review here" with a link to the accountant tax portal.
- Last-notified timestamp shown next to the button.

### Calendar view

Tab on the same page. Month grid showing:
- Tax reminder due dates (gold dot)
- Invoice due dates (outline dot)
- Invoice paid dates (filled dot) with amount
- Click a day → side panel lists everything on that date.

### Accountant side — `/accountant/:token/taxes`

New dedicated read-only portal using the existing accountant invite token system. Shows the same five sections + YTD totals + calendar, plus a CSV export per section. No edit access.

### Email

New edge function `notify-accountant-tax` — sends through existing Lovable Emails infra (new template `accountant-tax-update.tsx`). Recipient = `accountant_settings.accountant_email`. Idempotency key = `tax-notify-<user_id>-<timestamp-bucket>` so spam-clicking doesn't double-send within a minute.

### Database (migration)

New tables, all RLS-scoped to `owner_user_id = auth.uid()` with full grants:
- `tax_income_entries` (date, source, amount, notes, invoice_id nullable for dedup)
- `tax_w2_entries` (employer, year, gross_wages, federal_withheld, state_withheld)
- `tax_expenses` (date, category, description, amount, receipt_note)
- `tax_mileage_entries` (date, purpose, miles, gas_amount, vehicle)
- Add `last_accountant_notified_at` column to `profiles`.
- Reuse existing `tax_reminders` table as-is.

Accountant token policy: extend `accountant-view` edge function to also return these tables when called with a valid token.

### Pages / files touched

- New: `src/pages/Taxes.tsx`, `src/pages/AccountantTaxes.tsx`
- New components: `TaxSpreadsheet.tsx`, `TaxCalendar.tsx`, `TaxTotalsBar.tsx`, `NotifyAccountantButton.tsx`
- New edge function: `supabase/functions/notify-accountant-tax/index.ts`
- New email template: `supabase/functions/_shared/transactional-email-templates/accountant-tax-update.tsx` + registry update
- Edit: `App.tsx` routes, `HomeOffice.tsx` nav tile, `accountant-view/index.ts` to expose tax data, existing `AdminTaxes.tsx` stays for reminders-only quick add
- Migration as described above

### Out of scope for this build

- Framer-style redesign of landing / dashboard / auth (separate follow-up — I'll generate 3 design directions then)
- Receipt file uploads (text notes only for v1)
- Multi-year reporting (v1 = current calendar year)

### Order of work

1. Migration (you approve)
2. Edge function + email template + deploy
3. Client `/home-office/taxes` page with all 5 sections + totals + notify button
4. Calendar tab pulling invoices + reminders
5. Accountant `/accountant/:token/taxes` read-only portal
6. Quick smoke test via Playwright

Sound good? Approve and I'll start with the migration.