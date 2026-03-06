<!--
  ============================================================
  VRIDHIRA — E-Commerce for Indian Artisans
  ============================================================
  Author:         Himanshu
  GitHub:         https://github.com/Newbie-Himanshu
  Repo:           https://github.com/Newbie-Himanshu/vridhira-frontend
  Copyright:      2026 Himanshu — Vridhira. All rights reserved.
  License:        MIT
  Last Modified:  Himanshu via GitHub Copilot on 2026-03-06
  Change:         Redesigned README in Medusa visual style
  ============================================================
-->

<p align="center">
  <a href="https://github.com/vridhira/vridhira-frontend">
    <img
      alt="Vridhira"
      src="https://img.shields.io/badge/%F0%9F%9B%95_Vridhira-E--Commerce_for_Indian_Artisans-8B4513?style=for-the-badge&labelColor=2d1a0e"
    />
  </a>
</p>

<h1 align="center">Vridhira — Storefront</h1>

<p align="center">
  An open e-commerce storefront built for India's artisans and handcraft sellers.<br />
  Powered by <strong>Next.js 15</strong> and <strong>MedusaJS v2</strong>.
</p>

<p align="center">
  <a href="./LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://nextjs.org">
    <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  </a>
  <a href="https://medusajs.com">
    <img alt="MedusaJS v2" src="https://img.shields.io/badge/MedusaJS-v2-7c3aed?logo=medusa" />
  </a>
  <a href="https://github.com/Newbie-Himanshu/vridhira-frontend/pulls">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  </a>
  <a href="https://github.com/vridhira/vridhira-frontend">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-vridhira-181717?logo=github" />
  </a>
</p>

---

## Overview

Vridhira is an India-first e-commerce storefront that connects buyers to artisans and handcraft sellers across India. It handles the full shopping journey — browse, search, cart, checkout, payments, and order tracking — all optimised for Indian consumers.

**Highlights**

- India-first: INR currency, GST-inclusive pricing, Hindi-ready fonts
- Razorpay payments: UPI, cards, netbanking, wallets
- Cash on Delivery with OTP verification
- Shiprocket fulfillment and real-time shipment tracking
- Algolia-powered product search with instant results
- Wishlist, customer accounts, and order history
- Next.js 15 App Router with i18n-aware routing

---

## Quickstart

### Prerequisites

- Node.js >= 20
- Yarn
- Vridhira backend running at `http://localhost:9000`

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/Newbie-Himanshu/vridhira-frontend.git
cd vridhira-frontend

# 2. Install dependencies
yarn

# 3. Set up environment
cp .env.template .env.local
# Edit .env.local and fill in your values

# 4. Start the dev server
yarn dev
```

Open [http://localhost:8000](http://localhost:8000) to view your storefront.

---

## Payment Integrations

| Provider | Type | Notes |
|---|---|---|
| **Razorpay** | Cards, UPI, Netbanking, Wallets | Primary gateway — India-native |
| **Cash on Delivery** | COD | With OTP verification via Twilio |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | MedusaJS backend URL (default: `http://localhost:9000`) |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region code — use `in` for India |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Algolia public search-only key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key ID |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Commerce Engine | [MedusaJS v2](https://medusajs.com) |
| Payments | [Razorpay](https://razorpay.com) |
| Fulfillment | [Shiprocket](https://shiprocket.in) |
| Search | [Algolia](https://www.algolia.com) |
| Package Manager | [Yarn](https://yarnpkg.com) |

---

## Project Structure

```
src/
├── app/[countryCode]/       App Router pages (i18n-aware routing)
│   ├── (main)/              Public storefront pages
│   └── (checkout)/          Checkout flow
├── modules/                 Feature modules
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   ├── account/
│   ├── home/
│   └── layout/              Navbar, Footer, VridhiraCredits
├── lib/
│   ├── data/                Server-side Medusa SDK calls
│   └── util/                Utilities (formatting, helpers)
└── styles/                  Global CSS
```

---

## Related Repositories

| Repo | Description |
|---|---|
| [vridhira-frontend](https://github.com/vridhira/vridhira-frontend) | Public-facing storefront (this repo) |
| [vridhira-backend](https://github.com/Newbie-Himanshu/vridhira-backend) | MedusaJS backend with Indian commerce modules |

---

## Resources

- [MedusaJS Documentation](https://docs.medusajs.com) — Commerce engine powering Vridhira
- [Next.js Documentation](https://nextjs.org/docs) — React framework for the storefront
- [Razorpay Integration Docs](https://razorpay.com/docs) — Payment gateway
- [Algolia Docs](https://www.algolia.com/doc) — Search infrastructure
- [Shiprocket Docs](https://apidocs.shiprocket.in) — Fulfillment and tracking

---

## License

Distributed under the **MIT License** — see [LICENSE](./LICENSE) for full text.

Copyright © 2026 Himanshu — Vridhira. All rights reserved.

---

## Author

Built with ❤️ for India's artisans by **Himanshu** — independently, without commercial backing.

<p>
  <a href="https://github.com/Newbie-Himanshu">
    <img alt="GitHub: Newbie-Himanshu" src="https://img.shields.io/badge/GitHub-Newbie--Himanshu-181717?style=flat-square&logo=github" />
  </a>
  &nbsp;
  <a href="https://github.com/vridhira">
    <img alt="GitHub Org: vridhira" src="https://img.shields.io/badge/Org-vridhira-8B4513?style=flat-square&logo=github" />
  </a>
</p>

> _Framework: [MedusaJS](https://github.com/medusajs/medusa) by Medusa, Inc. — used as the commerce engine, licensed separately under the MIT License._
