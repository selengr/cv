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
- admin can add, edit, delete products (depends on permissions)
- UI is RTL / Persian

There is no public storefront. This is only the back office.

It talks to a separate API. Default is `http://localhost:5000/api`. You can change that in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If the API isn't running, login and product pages won't work.

## Run it

```bash
cp .env.example .env.local
npm install
npm run dev
```

Then open http://localhost:3000

## Later

Stuff I still want to add, whenever I get to it:

- product images, categories, stock
- orders
- the users page is empty, needs real work
- maybe a public shop later
