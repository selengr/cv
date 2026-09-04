# Shopy

Small-shop admin panel. You log in with an Iranian phone number, manage products and orders, and there's a public storefront at `/shop` if you want customers to buy without calling you.

I started this around 2022 on Next.js 12, left it alone for a long time, then dragged it onto Next 16 / React 19 / Tailwind 4. Same idea, less ancient tooling.

## What it does

- phone login (local OTP hint, or Kavenegar if you wire SMS)
- seller panel for catalog, stock, orders, invoices
- roles so an admin can manage products and people
- public shop: browse, search, cart, guest checkout
- payments: cash on delivery, a fake in-app gateway, or Zarinpal sandbox / live
- customers can track an order with the order id + phone (`/shop/track`)
- reviews on product pages
- stock alerts when something drops to 5 or below
- wishlist on the shop (stays on that browser)
- simple analytics (`/panel/analytics`) and order notifications (`/panel/notifications`)
- FA/EN toggle on the shop catalog
- discount codes (`/panel/coupons` — try `WELCOME10`)
- customer accounts at `/shop/account` (separate from seller login)
- shipping methods (`/panel/shipping`) plus an address book on checkout / account
- size / color variants on products (pick them on the product page; edit in admin)
- returns / refunds (`/panel/returns`, request from `/shop/account` on shipped orders)
- packing slips with seller packing notes (`/panel/orders/[id]/packing`)

Default mode needs no backend: `NEXT_PUBLIC_LOCAL_AUTH=true`. Sign in as `09121111111`, grab the code from the toast / next screen (it stays up a bit longer so you can copy it), and you're in. Shop is `/shop`.

### Optional: Kavenegar

```
SMS_PROVIDER=kavenegar
KAVENEGAR_API_KEY=your-key
KAVENEGAR_SENDER=10008663
NEXT_PUBLIC_SHOW_OTP_HINT=false
```

### Optional: Zarinpal

```
NEXT_PUBLIC_PAYMENT_DRIVER=zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Sandbox merchant is fine for local tries. Callback hits `/shop/pay/callback`. If your phone can't reach localhost, tunnel it and point `NEXT_PUBLIC_APP_URL` at that URL.

When you eventually plug a real API in:

```
NEXT_PUBLIC_LOCAL_AUTH=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Later

A proper image CDN would be nice someday. Not blocking anything right now.
