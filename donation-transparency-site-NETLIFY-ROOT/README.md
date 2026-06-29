# Donation Transparency Site

A simple static website for accepting donations and publishing receipts so supporters can verify where money is spent.

## Edit the site

- Site text and donation buttons: `data/config.json`
- Raised total and receipt ledger: `data/receipts.json`
- Receipt proof files: `receipts/`

## Add a receipt

1. Save the proof file in `receipts/`, for example `receipts/2026-07-01-supplies.pdf`.
2. Add a receipt item to `data/receipts.json`:

```json
{
  "date": "2026-07-01",
  "category": "Supplies",
  "vendor": "Vendor Name",
  "description": "What was purchased and why",
  "amount": 123.45,
  "proofUrl": "receipts/2026-07-01-supplies.pdf"
}
```

3. Update `summary.totalRaised` when new donations come in.
4. Update `summary.lastUpdated` to today's date.

## Add real donation links

Replace the placeholder URLs in `data/config.json` with your actual links:

- Stripe Payment Link: https://stripe.com/payments/payment-links
- PayPal.me: https://www.paypal.com/paypalme/
- Cash App: https://cash.app/
- Crypto/Lightning address page: your own address or hosted donation page

## Preview locally

From this folder:

```bash
python -m http.server 8080
```

Open: http://localhost:8080

## Deploy free/cheap

Recommended fast path:

1. Create a GitHub repo.
2. Push this folder.
3. Import the repo into Netlify or Vercel.
4. Set the build command to blank/none.
5. Set the publish directory to `/` or the project root.

Because this is static HTML/CSS/JS, it does not need a backend.
