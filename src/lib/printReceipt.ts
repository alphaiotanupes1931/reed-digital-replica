export interface ReceiptInvoice {
  id: string;
  service: string;
  price: number;
  status: string;
  created_at?: string | null;
  due_date?: string | null;
  deposit_required?: boolean | null;
  deposit_amount?: number | null;
  deposit_paid?: boolean | null;
  payment_method?: string | null;
  payment_plan?: string | null;
  plan_months?: number | null;
  plan_monthly_amount?: number | null;
  plan_start_date?: string | null;
  plan_end_date?: string | null;
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const dateOnly = (v?: string | null) => (v ? new Date(v).toLocaleDateString() : "—");

/**
 * Opens a narrow, thermal-style receipt in a new window and triggers print.
 * Returns false if the pop-up was blocked.
 */
export function printReceipt(opts: {
  invoice: ReceiptInvoice;
  clientName?: string | null;
  clientEmail?: string | null;
  businessName?: string;
  businessEmail?: string;
}): boolean {
  const {
    invoice,
    clientName,
    clientEmail,
    businessName = "Reed Digital Group LLC",
    businessEmail = "reeddigitalgroup@gmail.com",
  } = opts;

  const isMonthly = invoice.payment_plan === "monthly";
  const isPaid = invoice.status === "paid";
  const amount = isMonthly ? invoice.plan_monthly_amount || invoice.price : invoice.price;

  const rows: [string, string][] = [
    ["Receipt #", invoice.id.slice(0, 8).toUpperCase()],
    ["Date", dateOnly(invoice.created_at ?? new Date().toISOString())],
    ["Due", dateOnly(invoice.due_date)],
    ["Billing", isMonthly ? (invoice.plan_months ? `Monthly x${invoice.plan_months}` : "Monthly / ongoing") : "One-time"],
    ["Method", invoice.payment_method ? invoice.payment_method.toUpperCase() : "—"],
    ["Status", isPaid ? "PAID" : invoice.status.toUpperCase()],
  ];

  if (invoice.deposit_required && invoice.deposit_amount) {
    rows.push(["Deposit", `${money(invoice.deposit_amount)}${invoice.deposit_paid ? " (paid)" : " (due)"}`]);
  }

  const w = window.open("", "_blank", "width=460,height=760");
  if (!w) return false;

  w.document.write(`<!doctype html><html><head><meta charset="utf-8">
  <title>Receipt ${esc(invoice.id.slice(0, 8).toUpperCase())} — ${esc(businessName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { margin: 0.4in; }
    * { box-sizing: border-box; }
    body { font-family:'JetBrains Mono',monospace; color:#000; background:#f4f4f4; margin:0; padding:24px; display:flex; justify-content:center; }
    .receipt { background:#fff; width:320px; padding:22px 20px 26px; font-size:11px; line-height:1.7; }
    .center { text-align:center; }
    .biz { font-weight:700; font-size:13px; letter-spacing:.14em; text-transform:uppercase; }
    .sub { font-size:10px; color:#555; }
    .rule { border-top:1px dashed #000; margin:14px 0; }
    .row { display:flex; justify-content:space-between; gap:10px; }
    .row span:last-child { text-align:right; }
    .label { color:#555; }
    .item { font-weight:700; margin-top:2px; }
    .total { display:flex; justify-content:space-between; font-weight:700; font-size:14px; letter-spacing:.04em; }
    .stamp { margin-top:14px; text-align:center; font-weight:700; letter-spacing:.28em; text-transform:uppercase; border:2px solid #000; padding:6px 0; font-size:12px; }
    .foot { margin-top:16px; font-size:9px; color:#555; text-align:center; letter-spacing:.06em; }
    @media print { body { background:#fff; padding:0; } .receipt { width:100%; } }
  </style></head><body>
  <div class="receipt">
    <div class="center">
      <div class="biz">${esc(businessName)}</div>
      <div class="sub">${esc(businessEmail)}</div>
      <div class="sub">reeddigitalgroup.com</div>
    </div>
    <div class="rule"></div>
    <div class="center sub" style="letter-spacing:.24em;text-transform:uppercase">Receipt</div>
    <div class="rule"></div>
    ${rows.map(([k, v]) => `<div class="row"><span class="label">${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}
    <div class="rule"></div>
    <div class="row"><span class="label">Billed to</span><span>${esc(clientName || "—")}</span></div>
    ${clientEmail ? `<div class="row"><span class="label"></span><span>${esc(clientEmail)}</span></div>` : ""}
    <div class="rule"></div>
    <div class="item">${esc(invoice.service)}</div>
    <div class="row"><span class="label">${isMonthly ? "Per month" : "Amount"}</span><span>${money(amount)}</span></div>
    <div class="rule"></div>
    <div class="total"><span>${isMonthly ? "Monthly Total" : "Total"}</span><span>${money(amount)}${isMonthly ? " /mo" : ""}</span></div>
    ${isPaid ? `<div class="stamp">Paid in full</div>` : ""}
    <div class="foot">
      Printed ${esc(new Date().toLocaleString())}<br/>
      Thank you for your business.
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 350); };</script>
  </body></html>`);
  w.document.close();
  return true;
}
