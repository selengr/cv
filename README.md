# Shopy

Admin panel for a small shop. Login with an Iranian phone number, manage products, that's basically it.

This repo used to be called `cv` which is confusing. The app name is Shopy. Rename it on GitHub if you haven't yet:

```bash
gh repo rename shopy
```

I started this around 2022 with Next.js 12. It sat for a while. I updated the stack (Next 16, React 19, Tailwind 4) and kept the same idea.

## What it does

- sign up / login with phone + SMS code
- seller panel
- catalog: products, photos, categories, stock
- orders: status flow, manual orders, printable invoice
- admin can manage products and user roles
- public shop: browse, search, cart, guest checkout
- mock payments: cash on delivery or online sandbox gateway (request → bank page → callback → verify)
- order tracking for customers (`/shop/track`)
- UI is RTL / Persian

By default it runs without a backend (`NEXT_PUBLIC_LOCAL_AUTH=true`). Login with `09121111111` and use the code shown on the next screen. Public shop is at `/shop`.

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

- hook a real merchant gateway (Zarinpal / similar) with live keys
- SMS provider instead of on-screen OTP
