## Scope

Ship everything in one pass across DB, edge functions, and UI.

---

## 1. Invoice delete bug (fix first)

`InvoiceAdmin.tsx` deletes the row but RLS / soft-delete column is likely re-fetching it. I'll inspect — if it's a hard-delete that re-appears, it's a fetch ordering bug; if soft-delete, switch to a real `DELETE`. Verify via Playwright that a deleted invoice stays gone after reload.

---

## 2. Year header on Taxes page

Under the "Taxes" title add `{new Date().getFullYear()}` as a large display label. Updates automatically each year.

---

## 3. Tax season reminder (federal)

2026 federal individual return: **April 15, 2027**. One week prior trigger = **April 8, 2027**.

- New table `system_notifications` (user-scoped, type, title, body, read_at, cta_url, dismissible).
- Edge function `tax-season-reminder` (cron daily) inserts a notification for every owner one week before April 15 each year — formula `make_date(extract(year from now())::int, 4, 8)`.
- Surface a bell badge in `HomeOffice.tsx` header + a banner on `/home-office/taxes` for unread tax-season notifications.

---

## 4. Stripe income pull (per-user key)

- Add `stripe_income_key` (text, nullable) + `stripe_income_connected_at` to `profiles`. Stored server-side; never exposed to client (`SELECT` policy excludes the column via a view).
- Persistent banner on `/home-office/taxes` until user makes a choice: "Do you use Stripe to collect business income?" → **Yes** opens a modal to paste secret key + setup steps; **No** sets `stripe_income_choice = 'manual'` on profile and dismisses banner permanently. Zelle/CashApp note shown either way: "Those payments must be entered manually."
- New edge function `stripe-income-pull`: reads the user's `stripe_income_key`, fetches `charges` since last sync (or year start), upserts into `tax_income_entries` deduped by `stripe_charge_id` (new column). Runs:
  - on Taxes page mount
  - via existing invoice auto-pull pattern
- Remove the manual "Pull from invoices" button entirely — auto-pull runs on mount silently (already exists, just hide the button).

---

## 5. Accountant accounts (new role + dashboard)

**Onboarding split:** First step of `HomeOfficeOnboarding.tsx` asks "I am a…" → **Business owner** | **Accountant**. Stored on `profiles.account_type`.

**Schema:**
- `profiles.account_type` enum (`owner` | `accountant`), default `owner`.
- `profiles.accountant_id` text (8-char, generated for accountants only, reuses `gen_business_id` style).
- New table `accountant_clients` (accountant_user_id, client_user_id, status `pending|active|removed`, requested_at, accepted_at). RLS so both sides can read their own row.
- Notifications table from §3 reused for "New client wants to connect" + "Notify accountant" actions.

**Owner flow:**
- "Set Accountant" button on Taxes (and Profile). Modal asks for **Accountant ID** (replaces name/email entry). Submits → creates `accountant_clients` row + notification to accountant.
- Existing "Notify accountant" button now just inserts a notification on the accountant's side (no email).

**Accountant flow:**
- After login, if `account_type='accountant'`, redirect to `/home-office/accountant` (new dashboard) instead of owner home.
- Dashboard shows: their Accountant ID (copyable), pending client requests (Accept/Decline), active clients list. Clicking a client opens the existing read-only `AccountantView`-style screen but scoped via `accountant_clients`.
- In-app bell for notifications.

---

## 6. Files to touch

**DB migration**
- `profiles`: add `account_type`, `accountant_id`, `stripe_income_key`, `stripe_income_connected_at`, `stripe_income_choice`.
- new `accountant_clients`, `system_notifications`.
- `tax_income_entries`: add `stripe_charge_id` (unique per owner).
- Trigger to auto-gen `accountant_id` when `account_type='accountant'`.
- Enable `pg_cron`/`pg_net` for tax-season cron.

**Edge functions**
- `stripe-income-pull` (new)
- `tax-season-reminder` (new, cron'd)
- `accountant-connect` (new — owner submits accountant_id, creates link + notification)

**Frontend**
- `HomeOfficeOnboarding.tsx`: role question first.
- `HomeOffice.tsx`: notification bell, route by `account_type`.
- `Taxes.tsx`: year header, Stripe banner/modal, Set Accountant by ID, remove pull-from-invoices button.
- `InvoiceAdmin.tsx`: fix delete.
- New `HomeOfficeAccountant.tsx` dashboard + route in `App.tsx`.
- Small `NotificationBell.tsx` component.

---

## 7. Verification

- Playwright: delete an invoice, reload, confirm it's gone.
- Playwright: load Taxes, see "2026" header + Stripe banner.
- Manual: create accountant account, copy ID, log in as owner, paste ID, see request appear on accountant dashboard.

I'll request the user's Stripe secret key via `add_secret` only if needed for testing; the per-user key is stored in their own profile row, not the project secrets.