# Shopy

Admin panel for a small shop. Login with an Iranian phone number, manage products, that's basically it.

The app name is Shopy. 

```bash
gh repo rename shopy
```

I started this around 2022 with Next.js 12. It sat for a while. I updated the stack (Next 16, React 19, Tailwind 4) and kept the same idea.

## What it does

- sign up / login with phone + SMS code (local hint or Kavenegar)
- seller panel
- catalog: products, photos, categories, stock
- orders: status flow, manual orders, printable invoice
- admin can manage products and user roles
- public shop: browse, search, cart, guest checkout
- payments: COD, in-app sandbox gateway, or Zarinpal when configured
- order tracking for customers (`/shop/track`)
- product reviews on `/shop/products/[id]`
- stock alerts for sellers when inventory hits 5 or below
- wishlist / favorites on the public shop
- seller analytics charts on `/panel/analytics`
- order notifications for sellers (`/panel/notifications`, optional webhook)
- shop catalog FA/EN toggle
- discount codes / coupons (`/panel/coupons`, checkout codes like WELCOME10)
- customer shop accounts (`/shop/account`) with order history
- shipping methods (`/panel/shipping`) and customer address book at checkout / account
- UI is RTL / Persian (EN flips shop direction)

By default it runs without a backend (`NEXT_PUBLIC_LOCAL_AUTH=true`). Login with `09121111111` and use the code shown on the next screen. Public shop is at `/shop`.

### Optional: Kavenegar SMS

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

Use Zarinpal's sandbox merchant for local tests. Callback is `/shop/pay/callback`. For a phone to reach localhost you may need a tunnel and set `NEXT_PUBLIC_APP_URL` to that URL.

If you later hook a real API, set `NEXT_PUBLIC_LOCAL_AUTH=false` and:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run it

```bash
cp .env.example .env.local
npm install
npm run dev
```

Then open http://localhost:3000

## Later

Stuff I still want to add, whenever I get to it:

- product variants (size / color)
