# Plan

## 1. Small UI cleanups
- **Remove** `PageLoader` from `src/App.tsx` (delete the component usage; keep file for now).
- **Replace** `RDGMemberPopup` modal with a small dismissible **bottom-right toast/banner** (same component file, new layout). No backdrop, no auto-blocking. Still hidden on `/apps`, `/admin`, `/portal`, `/home-office`, `/invoice`.

## 2. Per-user data scoping (multi-tenant invoices / bills / taxes)

Today every invoice/client/bill/tax row is global and readable by anyone. We need each Apps account to see only its own data, without deleting your existing rows.

### Database changes (migration)
Add a nullable `owner_user_id uuid` to:
- `clients`
- `invoices`
- `monthly_bills`
- `tax_reminders`
- `extra_income`
- `daily_notes`
- `goals`

All existing rows stay with `owner_user_id = NULL` → treated as **legacy / your data**, untouched. You can later run a one-line update to claim them to your real account.

Tighten RLS so clients can still read approved invoices via the public portal (by email lookup, unchanged behavior), but the new per-user app pages only return rows where `owner_user_id = auth.uid()`.

### Auth
The `/apps/login` page currently stores a fake user in `localStorage`. We switch it to real Lovable Cloud auth (email/password + Google), so `auth.uid()` exists. `guest@rdg.app` becomes a normal account → empty dataset on first login. Your existing `localStorage`-based session is replaced.

## 3. Apps dashboard restructure

`/apps/dashboard` becomes two clearly labeled sections:

```text
ADMIN
  - Invoice Admin   → /apps/admin/invoices    (new, per-user version of /admin)
  - Bills Tracker   → /apps/admin/bills       (per-user version of /home-office/bills)
  - Tax Tracker     → /apps/admin/taxes       (new)

CLIENT
  - Client Portal   → /apps/client/portal     (per-user invoice portal — what you'd send to YOUR clients)
  - Shareable link  → copy button that gives a URL scoped to this account
```

New pages are thin wrappers around the existing `InvoiceAdmin`, `BillsTracker`, and `InvoicePortal` UIs, but they:
- Read/write only rows where `owner_user_id = auth.uid()`.
- Insert new rows with `owner_user_id = auth.uid()`.

Same structure as today: editing an invoice in Admin updates what the Client Portal shows — just scoped per account.

The existing routes (`/admin`, `/portal`, `/home-office/*`) are **left untouched** so your current workflow keeps working until the data transfer.

## 4. Out of scope for this pass
- Actually transferring your existing rows to your future account (you'll tell me when).
- Tax Tracker UI beyond a basic list/add (matches existing `tax_reminders` table).
- Stripe per-user Connect accounts (payments still go through the existing platform Stripe key).

---

## Technical notes
- Migration uses `ALTER TABLE ... ADD COLUMN owner_user_id uuid` + new RLS policies: `USING (owner_user_id = auth.uid())` for authenticated CRUD, keeping the existing public-read policy on `invoices` for the unauthenticated client portal flow.
- `AppsLogin` switches to `supabase.auth.signInWithPassword` / `signUp` / `signInWithOAuth({provider:'google'})`. `AppsDashboard` switches to `supabase.auth.getUser()` + `onAuthStateChange`.
- New folder: `src/pages/apps/` with `AdminInvoices.tsx`, `AdminBills.tsx`, `AdminTaxes.tsx`, `ClientPortal.tsx`.
- `supabase/config.toml`: enable Google provider via `configure_social_auth` tool.

Confirm and I'll execute.