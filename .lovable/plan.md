## Accounting App — Accountant Access + Plaid Write-Offs

Build out the Accounting app so an accountant can be invited (via link or email) to view a published, scoped subset of your finances, and so bank transactions flow in via Plaid for write-off review with a soft monthly close.

### 1. Accountant Access

**Two access modes, both supported:**
- **Share link + passcode** — generates `/accountant/:token` URL with a 6-digit passcode. No account needed.
- **Email invite** — sends invite email; accountant signs up, lands in a read-only accountant dashboard scoped to your data only.

**Settings page (inside Accounting app):**
- Toggle: Finances Published — ON/OFF (master switch the accountant view checks)
- Per-app visibility toggles: Bills, Invoices + Revenue, Write-offs/Transactions, Notes (Notes default OFF)
- List of active accountants — revoke access anytime
- Generate / rotate share link

When "Finances Published" is OFF, the accountant view shows: "Finances are not currently published."

### 2. Plaid Integration (Sandbox first)

- Plaid Link flow inside Accounting to connect bank accounts
- Daily transaction sync via edge function (and manual "Sync now" button)
- Transactions list grouped by month with check / X buttons for write-off classification
- Categories pulled from Plaid; user confirms or overrides

**Sandbox setup:** Add `PLAID_CLIENT_ID`, `PLAID_SECRET` (sandbox), `PLAID_ENV=sandbox` as secrets. Swap to production secret later — no code change.

### 3. Monthly Close (Soft)

- "Close [Month]" button per month
- If month being closed is the current month → confirm dialog: "You're still in this month. Are you sure?"
- Closed months show a "Reviewed" badge; transactions remain editable
- Reopen button to clear close state

### 4. Published Accountant View

Read-only dashboard at `/accountant/:token` (or `/accountant` for invited users) showing only the toggled-on sections:
- **Bills** — list of monthly bills + total
- **Invoices + Revenue** — paid invoices + revenue calendar
- **Write-offs** — transactions table grouped by month, write-off totals, export CSV
- **Notes** — only if explicitly shared

---

### Technical Details

**Database (new tables):**
- `accountant_settings` — `owner_user_id`, `published`, `show_bills`, `show_invoices`, `show_writeoffs`, `show_notes`, `share_token`, `share_passcode_hash`
- `accountant_invites` — `id`, `owner_user_id`, `email`, `accepted_at`, `accountant_user_id`, `revoked_at`
- `plaid_items` — `id`, `owner_user_id`, `access_token` (encrypted-at-rest), `item_id`, `institution_name`, `cursor`
- `plaid_accounts` — `id`, `item_id`, `account_id`, `name`, `mask`, `type`
- `bank_transactions` — `id`, `owner_user_id`, `account_id`, `plaid_transaction_id`, `date`, `name`, `amount`, `category`, `is_write_off` (nullable: null=unreviewed, true=yes, false=no), `notes`
- `month_closes` — `owner_user_id`, `year`, `month`, `closed_at`

All tables: RLS scoped to `owner_user_id = auth.uid()`. Accountant read access goes through a security-definer function that checks `accountant_invites.accepted_at` + `accountant_settings.published` + per-section toggles. Share-link access goes through a public edge function that validates `share_token + passcode`.

**Edge functions:**
- `plaid-link-token` — creates link token for frontend Plaid Link
- `plaid-exchange-token` — exchanges public_token for access_token, stores item
- `plaid-sync-transactions` — pulls latest transactions (cursor-based)
- `accountant-invite` — sends email invite via existing email infra
- `accountant-share-view` — public endpoint, validates token+passcode, returns scoped data

**Frontend:**
- `src/pages/Accounting.tsx` — replace "Coming Soon" with tabbed dashboard: Overview / Transactions / Bills / Invoices / Settings
- `src/pages/AccountantView.tsx` — read-only accountant dashboard
- `src/pages/AccountantShareLogin.tsx` — passcode entry for share links
- New components: `PlaidLinkButton`, `TransactionRow`, `MonthCloseCard`, `AccountantSettings`

**Sequencing (I'll ship in this order so you can test as we go):**
1. DB schema + Accounting Settings page (publish toggle, per-app permissions, generate share link)
2. Accountant view (share-link flow + invite flow) — using existing Bills/Invoices data
3. Plaid integration (sandbox) — Link, sync, transactions table
4. Write-off review UI + monthly soft close

This is ~4 sizeable chunks. After you approve, I'll start with #1 and pause between phases so you can review each before I move on.

**Before I start, I need:** `PLAID_CLIENT_ID` + `PLAID_SECRET` (sandbox) — I'll prompt you when we get to phase 3, not now. Phases 1 & 2 don't need Plaid.