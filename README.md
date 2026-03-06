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
  ============================================================
-->

# 🛕 Vridhira — Frontend Storefront

> An open e-commerce platform built for India's artisans and handcraft sellers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![MedusaJS v2](https://img.shields.io/badge/MedusaJS-v2-purple)](https://medusajs.com)

---

## ✨ Features

- Full e-commerce storefront powered by MedusaJS v2
- Product browsing, filtering, and search (Algolia)
- Cart and multi-step checkout
- Razorpay payment integration (UPI, cards, netbanking, wallets)
- Cash on Delivery with OTP verification
- Shiprocket fulfillment and shipment tracking
- Customer accounts, order history
- Wishlist
- India-first: INR currency, GST-inclusive pricing, Hindi-ready

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Commerce Engine | MedusaJS v2 |
| Payments | Razorpay |
| Fulfillment | Shiprocket |
| Search | Algolia |
| Package Manager | Yarn |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Yarn
- Vridhira backend running at `http://localhost:9000`

### Install & Run

```bash
# Install dependencies
yarn

# Copy env template
cp .env.template .env.local
# Fill in your values (see Environment Variables below)

# Start development server
yarn dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | MedusaJS backend URL (default: `http://localhost:9000`) |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region code (use `in` for India) |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Algolia public search-only key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key ID |

---

## 💳 Payment Integrations

| Provider | Type | Notes |
|---|---|---|
| Razorpay | Cards, UPI, Netbanking, Wallets | Primary payment gateway |
| Cash on Delivery | COD | With OTP verification via Twilio |

---

## 📁 Project Structure

```
src/
├── app/[countryCode]/     — App Router pages (i18n-aware routing)
│   ├── (main)/            — Public storefront pages
│   └── (checkout)/        — Checkout flow
├── modules/               — Feature modules
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   ├── account/
│   ├── home/
│   └── layout/            — Navbar, Footer, Credits
├── lib/
│   ├── data/              — Server-side Medusa SDK calls
│   └── util/              — Utilities (formatting, helpers)
└── styles/                — Global CSS
```

---

## 🔗 Related Repositories

- **Backend:** [github.com/Newbie-Himanshu/vridhira-backend](https://github.com/Newbie-Himanshu/vridhira-backend)

---

## 📜 License

MIT License — see [LICENSE](./LICENSE) for full text.

Copyright (c) 2026 Himanshu — Vridhira

---

## 👤 Author & Credits

Built with ❤️ for India's artisans by **Himanshu** — independently, without commercial backing.

| | |
|---|---|
| GitHub | [@Newbie-Himanshu](https://github.com/Newbie-Himanshu) |
| Frontend | [vridhira-frontend](https://github.com/Newbie-Himanshu/vridhira-frontend) |
| Backend | [vridhira-backend](https://github.com/Newbie-Himanshu/vridhira-backend) |

<!-- Add LinkedIn, Twitter, Instagram here when available -->

© 2026 Himanshu — Vridhira. All rights reserved.
