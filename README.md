# Shopy

Phone-first shop admin for small stores. GitHub repo name: **`shopy`** (rename the current `cv` repository).

This started in 2022 as a Next.js 12 learning project: Iranian mobile OTP login, a seller panel, and an admin catalog with role checks. The default Next.js homepage was never replaced, and the GitHub name (`cv`) did not match the product (`shopy`).

## What it is now

Shopy is the store back office, not a public storefront.

- Register / login with an Iranian mobile number and SMS code
- Seller account panel
- Admin dashboard with permission-based product CRUD
- RTL Persian UI
- Talks to a separate API (`NEXT_PUBLIC_API_URL`, default `http://localhost:5000/api`)

The 2026 rewrite keeps that product and moves it onto Next.js 16 App Router, React 19, Tailwind 4, Redux Toolkit 2, SWR 2, Axios 1, and Headless UI 2.

## How to develop it from here

Treat Shopy as a **commerce OS for small shops**, in this order:

1. **Catalog** — categories from the API, product images, stock, search
2. **Orders** — incoming orders, status, invoices
3. **Customers** — finish the users page, roles, staff invites
4. **Storefront** — a public shop that reads the same catalog
5. **Ops** — Telegram/WhatsApp order alerts, PWA, dark mode

## Rename the GitHub repo

```bash
# GitHub website: Settings → General → Repository name → shopy
# or:
gh repo rename shopy
```

Then update the local remote if GitHub prints a new URL:

```bash
git remote set-url origin https://github.com/selengr/shopy.git
```

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API must be running for login, the panel, and product pages.
