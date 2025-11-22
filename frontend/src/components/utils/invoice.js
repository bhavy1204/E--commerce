export function openInvoiceWindow(order) {
  if (!order) return;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up blocked. Enable pop-ups to view the invoice.");
    return;
  }

  const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;
  const dateStr = new Date(order.createdAt).toLocaleString();

  const rows = order.items.map((it, idx) => {
    const name = it.product?.name || it.name || "Item";
    const qty = it.quantity || 1;
    const price = it.price || it.product?.price || 0;
    const total = qty * price;

    return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${name}</td>
        <td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${qty}</td>
        <td style="padding:8px;text-align:right;border-bottom:1px solid #eee;">${formatCurrency(price)}</td>
        <td style="padding:8px;text-align:right;border-bottom:1px solid #eee;">${formatCurrency(total)}</td>
      </tr>
    `;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${order._id}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #222; }
        .container { max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .title { font-size: 22px; font-weight: bold; }
        .muted { color: #555; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">

        <div style="margin-bottom:16px;">
          <div class="title">Order Invoice</div>
          <div class="muted">Order ID: ${order._id}</div>
        </div>

        <div style="margin-bottom:16px;">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Status:</strong> ${order.status}</div>
        </div>

        <div style="margin-bottom:16px;">
          <strong>Customer:</strong><br>
          ${order.user?.firstName || ""} ${order.user?.lastName || ""} <br>
          ${order.user?.email || ""}
        </div>

        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #000;">#</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #000;">Item</th>
              <th style="text-align:center;padding:8px;border-bottom:2px solid #000;">Qty</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #000;">Price</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #000;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="margin-top:20px;text-align:right;font-size:18px;font-weight:bold;">
          Grand Total: ${formatCurrency(order.totalAmount)}
        </div>

        <div class="no-print" style="margin-top:24px;text-align:right;">
          <button onclick="window.print()" style="padding:8px 12px;background:black;color:white;border-radius:6px;">Print / Save PDF</button>
          <button onclick="window.close()" style="padding:8px 12px;border:1px solid #ccc;border-radius:6px;">Close</button>
        </div>

      </div>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
}
