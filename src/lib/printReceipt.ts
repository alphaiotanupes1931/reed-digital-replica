import logoAsset from "@/assets/rdg-header-logo.png.asset.json";

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

const longDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "—";

interface PrintDocumentOptions {
  invoice: ReceiptInvoice;
  clientName?: string | null;
  clientEmail?: string | null;
  businessName?: string;
  businessEmail?: string;
}

function printDocument(opts: PrintDocumentOptions, type: "invoice" | "receipt"): boolean {
  const {
    invoice,
    clientName,
    clientEmail,
    businessName = "Reed Digital Group LLC",
    businessEmail = "reeddigitalgroup@gmail.com",
  } = opts;

  const isMonthly = invoice.payment_plan === "monthly";
  const isPaid = invoice.status === "paid";
  const unit = isMonthly ? invoice.plan_monthly_amount || invoice.price : invoice.price;
  const paidDate = longDate(invoice.created_at ?? new Date().toISOString());
  const receiptNo = invoice.id.slice(0, 4).toUpperCase() + "-" + invoice.id.slice(4, 8).toUpperCase();
  const invoiceNo = invoice.id.slice(0, 8).toUpperCase();
  const logoUrl = `${window.location.origin}${logoAsset.url}`;
  const isReceipt = type === "receipt";
  const documentTitle = isReceipt ? "Receipt" : "Invoice";

  const items: { desc: string; sub?: string; qty: string; amount: number }[] = [
    {
      desc: esc(invoice.service),
      sub: isMonthly
        ? invoice.plan_months
          ? `Monthly plan — ${invoice.plan_months} months`
          : "Monthly plan — ongoing"
        : "One-time payment",
      qty: "1",
      amount: unit,
    },
  ];
  if (invoice.deposit_required && invoice.deposit_amount) {
    items.push({
      desc: "Deposit",
      sub: invoice.deposit_paid ? "Paid" : "Due",
      qty: "1",
      amount: 0,
    });
  }

  const total = unit;

  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) return false;

  w.document.write(`<!doctype html><html><head><meta charset="utf-8">
  <title>${documentTitle} ${esc(isReceipt ? receiptNo : invoiceNo)} — ${esc(businessName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page { size: letter; margin: 0.6in; }
    * { box-sizing: border-box; }
    body { font-family:'Figtree',system-ui,sans-serif; color:#111; background:#f3f3f3; margin:0; padding:32px; }
    .sheet { background:#fff; max-width:760px; margin:0 auto; padding:56px 56px 48px; }
    h1 { font-family:'Outfit',sans-serif; font-size:30px; font-weight:700; letter-spacing:-.02em; margin:0; }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; }
    .logo { height:34px; }
    .meta { margin-top:28px; font-size:12.5px; line-height:1.9; }
    .meta b { font-weight:600; }
    .cols { display:flex; gap:56px; margin-top:32px; font-size:12.5px; line-height:1.7; }
     .cols h3 { font-family:'Outfit',sans-serif; font-size:12.5px; margin:0 0 8px; font-weight:700; }
    .amount { font-family:'Outfit',sans-serif; font-size:20px; font-weight:600; margin:40px 0 18px; letter-spacing:-.01em; }
    .amount .gold { color:#c9a227; }
    table { width:100%; border-collapse:collapse; font-size:12.5px; }
    th { text-align:left; font-family:'Outfit',sans-serif; font-size:10.5px; text-transform:uppercase; letter-spacing:.1em; color:#8a8a8a; font-weight:600; padding:0 0 10px; border-bottom:1px solid #e6e6e6; }
    td { padding:14px 0; border-bottom:1px solid #f0f0f0; vertical-align:top; }
    .num { text-align:right; white-space:nowrap; }
    .sub { color:#8a8a8a; font-size:11.5px; margin-top:3px; }
    .totals td { border:0; padding:7px 0; }
    .totals tr:last-child td { border-top:1px solid #111; padding-top:12px; font-weight:700; font-family:'Outfit',sans-serif; font-size:14px; }
     .history { margin-top:48px; }
     .history h2 { font-family:'Outfit',sans-serif; font-size:20px; margin:0 0 22px; }
    .foot { margin-top:44px; padding-top:16px; border-top:1px solid #eee; font-size:10.5px; color:#9a9a9a; display:flex; justify-content:space-between; }
    @media print { body { background:#fff; padding:0; } .sheet { max-width:none; padding:0; } }
  </style></head><body>
  <div class="sheet">
    <div class="top">
       <h1>${documentTitle}</h1>
      <img class="logo" src="${esc(logoUrl)}" alt="Reed Digital Group" />
    </div>

    <div class="meta">
      <div><b>Invoice number</b> &nbsp;${esc(invoiceNo)}</div>
       ${isReceipt ? `<div><b>Receipt number</b> &nbsp;${esc(receiptNo)}</div>` : ""}
       <div><b>${isReceipt ? "Date paid" : "Date issued"}</b> &nbsp;${esc(paidDate)}</div>
    </div>

    <div class="cols">
      <div>
         <h3>${esc(businessName)}</h3>
        <div>Brandywine, Maryland</div>
        <div>United States</div>
        <div>${esc(businessEmail)}</div>
        <div>reeddigitalgroup.com</div>
      </div>
      <div>
        <h3>Bill to</h3>
        <div><b>${esc(clientName || "Client")}</b></div>
        ${clientEmail ? `<div>${esc(clientEmail)}</div>` : ""}
        <div>Due ${esc(longDate(invoice.due_date))}</div>
        ${!isReceipt && invoice.payment_method ? `<div>Payment method: ${esc(invoice.payment_method.toLowerCase() === "stripe" ? "Card" : invoice.payment_method.toUpperCase())}</div>` : ""}
      </div>
    </div>

    <div class="amount">
       ${isReceipt
        ? `<span class="gold">${money(total)}</span> paid on ${esc(paidDate)}`
        : `<span class="gold">${money(total)}</span> due ${esc(longDate(invoice.due_date))}`}
      ${isMonthly ? " (per month)" : ""}
    </div>

    <table>
      <thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${items.map(i => `<tr>
          <td><div><b>${i.desc}</b></div>${i.sub ? `<div class="sub">${esc(i.sub)}</div>` : ""}</td>
          <td class="num">${esc(i.qty)}</td>
          <td class="num">${money(i.amount)}</td>
          <td class="num">${money(i.amount)}</td>
        </tr>`).join("")}
      </tbody>
    </table>

    <table class="totals" style="margin-top:18px">
      <tr><td>Subtotal</td><td class="num">${money(total)}</td></tr>
      <tr><td>Tax</td><td class="num">${money(0)}</td></tr>
       <tr><td>${isReceipt ? "Amount paid" : "Amount due"}</td><td class="num">${money(total)}${isMonthly ? " /mo" : ""}</td></tr>
    </table>

     ${isReceipt ? `<section class="history">
       <h2>Payment history</h2>
       <table>
         <thead><tr><th>Payment method</th><th>Date</th><th class="num">Amount paid</th><th class="num">Receipt number</th></tr></thead>
         <tbody><tr>
           <td>${esc(invoice.payment_method ? (invoice.payment_method.toLowerCase() === "stripe" ? "Card" : invoice.payment_method.toUpperCase()) : "Payment")}</td>
           <td>${esc(paidDate)}</td>
           <td class="num">${money(total)}</td>
           <td class="num">${esc(receiptNo)}</td>
         </tr></tbody>
       </table>
     </section>` : ""}

    <div class="foot">
      <span>${esc(businessName)} — Thank you for your business.</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 500); };</script>
  </body></html>`);
  w.document.close();
  return true;
}

/** Opens the paid receipt layout and triggers the browser's Save as PDF dialog. */
export function printReceipt(opts: PrintDocumentOptions): boolean {
  return printDocument(opts, "receipt");
}

/** Opens the amount-due invoice layout and triggers the browser's Save as PDF dialog. */
export function printInvoice(opts: PrintDocumentOptions): boolean {
  return printDocument(opts, "invoice");
}
