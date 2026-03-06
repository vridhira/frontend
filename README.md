<!--
  ============================================================
  VRIDHIRA — E-Commerce for Indian Artisans
  ============================================================
  Author:         Himanshu
  GitHub:         https://github.com/Newbie-Himanshu
  Repo:           https://github.com/Newbie-Himanshu/vridhira-frontend
  Copyright:      2026 Himanshu — Vridhira. All rights reserved.
  License:        Vridhira Attribution License v2.0
  Last Modified:  Himanshu via GitHub Copilot on 2026-03-06
  Change:         Nav + links converted to badge images (no underlines); license updated
  ============================================================
-->

<p align="center">
  <a href="https://github.com/vridhira/vridhira-frontend">
    <img
      src="https://img.shields.io/badge/%F0%9F%9B%95%20VRIDHIRA-Open%20Commerce%20for%20Indian%20Artisans-8B4513?style=for-the-badge&labelColor=2d1a0e&color=8B4513"
      alt="Vridhira Banner"
      height="48"
    />
  </a>
</p>

<h1 align="center">Vridhira — Storefront</h1>

<p align="center">
  India's open e-commerce platform for artisans and handcraft sellers<br />
  <em>Self-hosted · India-native payments · Open source</em>
</p>

<p align="center">
  <a href="#-quickstart"><img src="https://img.shields.io/badge/-Quickstart-8B4513?style=flat-square" alt="Quickstart" /></a>
  &nbsp;
  <a href="#-features"><img src="https://img.shields.io/badge/-Features-8B4513?style=flat-square" alt="Features" /></a>
  &nbsp;
  <a href="#-india-first-commerce"><img src="https://img.shields.io/badge/-India--First-FF6600?style=flat-square" alt="India-First" /></a>
  &nbsp;
  <a href="#-payments"><img src="https://img.shields.io/badge/-Payments-1976D2?style=flat-square" alt="Payments" /></a>
  &nbsp;
  <a href="https://github.com/Newbie-Himanshu/vridhira-backend"><img src="https://img.shields.io/badge/-Backend_Repo-24292f?style=flat-square&logo=github&logoColor=white" alt="Backend Repo" /></a>
  &nbsp;
  <a href="#-contributing"><img src="https://img.shields.io/badge/-Contributing-2da44e?style=flat-square" alt="Contributing" /></a>
</p>

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Vridhira_Attribution_v2.0-8B4513?style=flat-square" alt="Vridhira Attribution License v2.0" />
  </a>
  <img src="https://img.shields.io/badge/version-0.1.0-8B4513?style=flat-square" alt="v0.1.0" />
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  </a>
  <a href="https://medusajs.com">
    <img src="https://img.shields.io/badge/MedusaJS-v2-7c3aed?style=flat-square" alt="MedusaJS v2" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://github.com/Newbie-Himanshu/vridhira-frontend/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made_for-India_%F0%9F%87%AE%F0%9F%87%B3-FF9933?style=flat-square&labelColor=138808" alt="Made for India" />
  &nbsp;
  <img src="https://img.shields.io/badge/Payments-Razorpay_%7C_UPI_%7C_COD-2196F3?style=flat-square" alt="Payments" />
  &nbsp;
  <img src="https://img.shields.io/badge/Search-Algolia-003DFF?style=flat-square&logo=algolia&logoColor=white" alt="Algolia" />
  &nbsp;
  <img src="https://img.shields.io/badge/Fulfillment-Shiprocket-orange?style=flat-square" alt="Shiprocket" />
</p>

---

## 📋 Table of Contents

<details open>
<summary><strong>Click to expand / collapse</strong></summary>

| # | Section | What's inside |
|:---:|:---|:---|
| 1 | [🛕 Overview](#-overview) | What Vridhira is and why it exists |
| 2 | [✨ Features](#-features) | Full feature grid — commerce, payments, logistics, search |
| 3 | [🇮🇳 India-First Commerce](#-india-first-commerce) | UPI, COD-OTP, INR/GST, Devanagari — built for India |
| 4 | [🚀 Quickstart](#-quickstart) | Prerequisites → install → `.env` → running locally |
| 5 | [💳 Payments](#-payments) | Razorpay & COD setup, when to use each |
| 6 | [🔑 Environment Variables](#-environment-variables) | All env vars with required flags |
| 7 | [🗂️ Tech Stack](#%EF%B8%8F-tech-stack) | Full stack with links and rationale |
| 8 | [📁 Project Structure](#-project-structure) | Annotated directory tree |
| 9 | [🔗 Related Repositories](#-related-repositories) | Frontend & backend repos |
| 10 | [📚 Resources](#-resources) | Official docs for every integration |
| 11 | [🤝 Contributing](#-contributing) | How to fork, branch, commit, and PR |
| 12 | [🙏 Acknowledgements](#-acknowledgements) | Open-source projects that power Vridhira |
| 13 | [📜 License](#-license) | Vridhira Attribution License v2.0 — use freely, **always credit** |
| 14 | [👤 Author](#-author) | Built by Himanshu for India's artisans |

</details>

---

## 🛕 Overview

**Vridhira** is an **open-source**, **India-first** e-commerce storefront designed for artisans, weavers, potters, and handcraft sellers — people whose work deserves a digital home built for **how India actually shops**.

This is the **customer-facing storefront**. It connects to the **Vridhira Backend** — a **MedusaJS v2** server with custom Indian commerce modules — to deliver shopping experiences optimised for Indian buyers: **UPI**, **COD with OTP**, **GST-inclusive pricing**, **Hindi-ready typography**, and **Shiprocket logistics**.

> _Think of it as Shopify's Indian artisan cousin — **open source**, **self-hosted**, and built on **Indian payment rails** from day one._

> [!IMPORTANT]
> This repository is the **storefront only**. You also need the Vridhira Backend running to serve data. Both repos must be set up together for a working store. See [Related Repositories](#-related-repositories).

> [!NOTE]
> Vridhira is an **actively developed** project. Some features — Algolia search, Wishlist, and Google OAuth — are fully built in the backend but the storefront UI for these is still being migrated. The project is **not yet production-ready**. Track progress in the [GitHub issues](https://github.com/Newbie-Himanshu/vridhira-frontend/issues).

---

## ✨ Features

<table>
  <tr>
    <td valign="top" width="33%">
      <h3>🛒 Full Commerce</h3>
      <p>Product catalogue, collections, tags, <strong>inventory tracking</strong>, variants (size/colour/material). Everything a physical craft store needs, online.</p>
    </td>
    <td valign="top" width="33%">
      <h3>💳 India-Native Payments</h3>
      <p><strong>Razorpay UPI</strong>, cards, netbanking, wallets, and EMI. <strong>Cash on Delivery with OTP</strong> fraud prevention. Covers how India actually pays.</p>
    </td>
    <td valign="top" width="33%">
      <h3>🚚 Smart Fulfillment</h3>
      <p><strong>Shiprocket-powered</strong> shipping with real-time order tracking and delivery status updates. India's largest D2C logistics network.</p>
    </td>
  </tr>
  <tr>
    <td valign="top" width="33%">
      <h3>🔍 Instant Search</h3>
      <p><strong>Algolia-powered</strong> search with instant product results, filters, and faceted navigation. Finds the right craft at the right moment.</p>
    </td>
    <td valign="top" width="33%">
      <h3>👤 Customer Accounts</h3>
      <p>Registration, login, <strong>order history</strong>, saved addresses, and <strong>wishlist</strong> management. Repeat buyers, remembered.</p>
    </td>
    <td valign="top" width="33%">
      <h3>🌏 India-Ready Stack</h3>
      <p><strong>INR currency</strong>, GST-inclusive pricing, <strong>Hindi-ready fonts</strong> (Tiro Devanagari Hindi), and India region routing built in.</p>
    </td>
  </tr>
</table>

> [!TIP]
> All six features work **out of the box** after a standard setup. No paid plugins, no per-transaction SaaS fees — fully self-hosted.

> [!NOTE]
> **Feature readiness status:** Full Commerce ✅, Payments ✅, Fulfillment ✅ are production-wired in the backend. Instant Search (Algolia), Wishlist, and Google OAuth are **backend-complete but storefront UI is pending** — the API contracts exist, the React components are not yet migrated from the reference design.

---

## 🇮🇳 India-First Commerce

Vridhira is **not** a generic global storefront with INR added as an afterthought. Every layer is built for the way India shops, sells, and ships.

| Feature | Details |
|:---|:---|
| 🏦 **UPI-first Payments** | **Razorpay UPI** — India's dominant and fastest-growing payment method — integrated natively |
| 📦 **COD with OTP Verification** | Cash on Delivery with **Twilio OTP** to verify buyer intent and cut return fraud |
| 🚛 **Shiprocket Logistics** | Integrated with India's **largest D2C fulfillment** and real-time shipment tracking network |
| ₹ **INR & GST Display** | ₹ currency with **paisa precision** and **GST-inclusive** display pricing — no surprises at checkout |
| 🔤 **Devanagari Typography** | **Tiro Devanagari Hindi** font for authentic Hindi product names, descriptions, and labels |
| 🏘️ **Artisan-Focused UX** | Small-seller UX — **not** enterprise admin panels. Made for real craft businesses |
| 🔒 **Secure & Self-Hosted** | **Your data, your server, your control.** Zero SaaS lock-in |

> [!WARNING]
> Razorpay **live keys** require completed KYC and business activation on your Razorpay Dashboard. Test keys (`rzp_test_`) work without KYC. Do **not** use test keys in production — orders will appear successful but no money moves.

> [!TIP]
> Enabling **UPI** on Razorpay takes under 5 minutes after KYC. It is the single highest-converting payment option for Indian shoppers — don't skip it.

> [!TIP]
> **COD still accounts for ~45% of D2C orders** in Tier 2 and Tier 3 Indian cities. The built-in OTP verification step reduces "never ordered this" return fraud significantly.

---

## 🚀 Quickstart

### Prerequisites

| Requirement | Minimum Version | Notes |
|:---|:---|:---|
| **Node.js** | >= 20 | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| **Yarn** | >= 1.22 | `npm install -g yarn` |
| **Vridhira Backend** | Running at `:9000` | See [Related Repositories](#-related-repositories) |

> [!NOTE]
> A `.env.template` file is already included in the repo with all variable names and placeholder descriptions. Copy it to `.env.local` — never rename or edit `.env.template` itself, it's committed to the repo as a reference for contributors.

> [!TIP]
> On **Windows**, use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead of nvm. Run your terminal as Administrator when installing global packages.

### Install & Run

**1 · Clone the repo**

```bash
git clone https://github.com/Newbie-Himanshu/vridhira-frontend.git
cd vridhira-frontend
```

**2 · Install dependencies**

```bash
yarn
```

**3 · Set up environment**

```bash
cp .env.template .env.local
# Open .env.local and fill in your API keys — see Environment Variables below
```

**4 · Start the dev server**

```bash
yarn dev
```

Your storefront is live at `http://localhost:8000`.

> [!TIP]
> **Always start the backend first**, then the storefront. The storefront makes API calls to `NEXT_PUBLIC_MEDUSA_BACKEND_URL` on load — if the backend isn't up, you'll see empty pages rather than errors.

> [!TIP]
> Run `yarn tsc --noEmit` before committing to catch TypeScript errors early. The project ships with strict-mode TypeScript — fix type errors before they accumulate.

---

## 💳 Payments

Vridhira ships with **two payment providers**, pre-configured for Indian consumers out of the box.

| Provider | Methods Supported | Best For |
|:---|:---|:---|
| **Razorpay** | **UPI**, Cards, Netbanking, Wallets, EMI | Default for all online orders — covers **95%+** of Indian payment preferences |
| **Cash on Delivery** | COD + **OTP verification** | High-conversion option for **Tier 2/3 cities** — reduces return fraud |

> [!NOTE]
> **Razorpay** keys are configured in `.env.local` (`NEXT_PUBLIC_RAZORPAY_KEY_ID`). Always use your **test key** in development and your **live key** in production — never swap them accidentally.

> [!NOTE]
> **COD OTP** requires a Twilio account. Set up a Twilio Verify Service, copy the SID into your backend `.env`, and test with a real phone number before going live.

> [!TIP]
> Razorpay's **EMI option** unlocks high-AOV purchases (₹5,000+) for customers who would otherwise abandon. Enable it from the Razorpay Dashboard under Payment Methods → EMI.

> [!WARNING]
> **Always verify Razorpay webhook signatures** on the backend — never trust the webhook payload alone. Razorpay signs every webhook with your `RAZORPAY_WEBHOOK_SECRET`. Unverified webhooks are a fraud vector: an attacker can post a fake `payment.captured` event and trigger order fulfilment without paying.

> [!IMPORTANT]
> Razorpay **live-mode payments require HTTPS**. If you test with live keys on `http://localhost`, the Razorpay checkout will load but card/UPI flows will silently fail or be blocked by the browser. Use a tunnel like [ngrok](https://ngrok.com) for local live-key testing.

---

## 🔑 Environment Variables

Copy `.env.template` to `.env.local` and fill in your values:

| Variable | Required | Description |
|:---|:---:|:---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | ✅ | Backend API URL — default `http://localhost:9000` |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Storefront public URL — default `http://localhost:8000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | ✅ | Region code — use **`in`** for India |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Razorpay **public** key — starts with `rzp_test_` or `rzp_live_` |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | ⚠️ | Algolia application ID — required only if search is enabled |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | ⚠️ | Algolia **public** search-only API key — never use the Admin key here |

> [!WARNING]
> **Never commit `.env.local` to Git.** It contains live API keys. The `.gitignore` already excludes it, but double-check before pushing — especially `NEXT_PUBLIC_RAZORPAY_KEY_ID` in production mode.

> [!TIP]
> Variables prefixed with `NEXT_PUBLIC_` are **exposed to the browser**. Only put keys that are safe to be public there (e.g. Razorpay public key, Algolia search-only key). Secret keys like Razorpay secret and Twilio tokens belong in the **backend** `.env` only.

> [!WARNING]
> **Never use the Algolia Admin API key** in `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`. The Admin key grants full index write access — if leaked via the browser bundle, an attacker can delete or overwrite your entire search index. Use the **Search-Only** key from your Algolia Dashboard → API Keys.

---

## 🗂️ Tech Stack

| Layer | Technology | Why Vridhira chose it |
|:---|:---|:---|
| Framework | <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" /></a> | **App Router** + RSC + ISR — fast by default, SEO-friendly |
| Language | <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a> | **Type safety** across the full stack — catches bugs at compile time |
| Styling | <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a> | Utility-first with **Vridhira's earthy design tokens** (saffron, teak, wheat) |
| Commerce Engine | <a href="https://medusajs.com"><img src="https://img.shields.io/badge/MedusaJS-v2-7c3aed?style=flat-square" alt="MedusaJS v2" /></a> | **Headless, modular, open-licensed** — full control, no vendor lock-in |
| Payments | <a href="https://razorpay.com"><img src="https://img.shields.io/badge/Razorpay-payments-2196F3?style=flat-square" alt="Razorpay" /></a> | India's **most complete** payment gateway — UPI + COD + EMI in one SDK |
| Logistics | <a href="https://shiprocket.in"><img src="https://img.shields.io/badge/Shiprocket-logistics-FF6B00?style=flat-square" alt="Shiprocket" /></a> | India's **leading D2C** fulfillment & real-time tracking network |
| Search | <a href="https://www.algolia.com"><img src="https://img.shields.io/badge/Algolia-search-003DFF?style=flat-square&logo=algolia&logoColor=white" alt="Algolia" /></a> | **Sub-50ms** instant search with relevance tuning and facets |
| Package Manager | <a href="https://yarnpkg.com"><img src="https://img.shields.io/badge/Yarn-v4-2C8EBB?style=flat-square&logo=yarn&logoColor=white" alt="Yarn" /></a> | Fast, **deterministic** installs with lockfile consistency |

> [!WARNING]
> This project uses **Yarn exclusively** — do not run `npm install`. Using npm will generate a `package-lock.json` alongside `yarn.lock`, creating dependency version conflicts. If you accidentally ran npm, delete `node_modules/`, delete `package-lock.json`, and run `yarn` to restore a clean install.

> [!IMPORTANT]
> The `v0-boty-e-commerce-template/` folder in this monorepo is a **read-only visual reference** — it uses `shadcn/ui` which is **not** installed in the Vridhira storefront. When adapting components from it, re-implement the UI using Tailwind and existing module patterns. Never copy-paste its code directly.

> [!TIP]
> **MedusaJS v2** ships with a modular architecture — you can swap or extend individual modules (payments, inventory, fulfillment) without touching others. Vridhira uses this to plug in Razorpay and Shiprocket as first-class modules.

---

## 📁 Project Structure

```
vridhira-frontend/
├── src/
│   ├── app/
│   │   └── [countryCode]/              ← i18n-aware routing root (e.g. /in/…)
│   │       ├── (main)/                 ← Public storefront pages
│   │       │   ├── page.tsx            ← Homepage
│   │       │   ├── store/              ← Product listing & filters
│   │       │   ├── products/[handle]/  ← Product detail page
│   │       │   └── account/            ← Customer portal (orders, addresses)
│   │       └── (checkout)/             ← Isolated checkout flow
│   │           └── checkout/           ← Cart → Shipping → Payment → Confirm
│   ├── modules/                        ← Feature modules (co-located logic + UI)
│   │   ├── cart/                       ← Cart context, drawer, line items
│   │   ├── checkout/                   ← Step components, form, payment UI
│   │   ├── products/                   ← Product card, gallery, variants
│   │   ├── account/                    ← Login, register, order history
│   │   ├── home/                       ← Hero, featured collections
│   │   └── layout/
│   │       ├── templates/footer/       ← Footer with VridhiraCredits component
│   │       ├── templates/nav/          ← Top navigation bar
│   │       └── components/
│   │           └── vridhira-credits/   ← Brand attribution + GitHub link
│   ├── lib/
│   │   ├── data/                       ← Server actions & Medusa JS SDK calls
│   │   └── util/                       ← Price formatters, helpers, constants
│   └── styles/
│       └── globals.css                 ← Global CSS & CSS custom properties
├── public/                             ← Static assets (images, icons, fonts)
├── .env.template                       ← ← COPY THIS to .env.local
├── tailwind.config.js                  ← Brand colours & font family tokens
└── tsconfig.json                       ← TypeScript config (es2017, bundler)
```

> [!WARNING]
> Functions inside `src/lib/data/` are **server-only**. They use the Medusa JS SDK with a secure token and must never be imported into `"use client"` components. If you need data in a client component, fetch it in a Server Component parent and pass it down as props.

> [!TIP]
> Each feature in `src/modules/` is **self-contained** — components, hooks, and server actions live together. If you're adding a new feature (e.g. reviews, loyalty points), create a new module folder rather than scattering files across the tree.

---

## 🔗 Related Repositories

| Repository | Description | Visibility |
|:---|:---|:---:|
| <a href="https://github.com/vridhira/vridhira-frontend"><img src="https://img.shields.io/badge/vridhira--frontend-storefront-8B4513?style=flat-square&logo=github&logoColor=white" alt="vridhira-frontend" /></a> | **This repo** — public-facing brand org storefront | 🌐 Public |
| <a href="https://github.com/Newbie-Himanshu/vridhira-backend"><img src="https://img.shields.io/badge/vridhira--backend-backend-24292f?style=flat-square&logo=github&logoColor=white" alt="vridhira-backend" /></a> | MedusaJS v2 backend — **COD**, **Razorpay queue**, **Shiprocket**, **Wishlist**, **Algolia** modules | 🔒 Private |

> [!NOTE]
> The storefront and backend are **decoupled via REST API**. You can run the storefront against any MedusaJS v2 backend — not just Vridhira's. This makes it easy to prototype with a vanilla Medusa instance before wiring up the custom modules.

> [!TIP]
> When setting up both repos for the first time: (1) start the backend with `yarn dev` and wait for the `Server is ready` log, (2) run `yarn seed` in the backend to populate test products and regions, (3) **only then** start the storefront. The storefront expects the `in` (India) region to already exist — seeding creates it.

---

## 📚 Resources

**Core Frameworks**

- <a href="https://docs.medusajs.com"><img src="https://img.shields.io/badge/MedusaJS-Documentation-7c3aed?style=flat-square" alt="MedusaJS Documentation" /></a> — The **commerce engine** powering Vridhira's backend
- <a href="https://nextjs.org/docs"><img src="https://img.shields.io/badge/Next.js-Documentation-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js Documentation" /></a> — **App Router**, RSC, SSR, and ISR guides
- <a href="https://tailwindcss.com/docs"><img src="https://img.shields.io/badge/Tailwind_CSS-Documentation-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Documentation" /></a> — Utility classes and theme customisation

**Indian Integrations**

- <a href="https://razorpay.com/docs"><img src="https://img.shields.io/badge/Razorpay-Integration_Docs-2196F3?style=flat-square" alt="Razorpay Docs" /></a> — Payment methods, webhooks, and test mode setup
- <a href="https://apidocs.shiprocket.in"><img src="https://img.shields.io/badge/Shiprocket-API_Docs-FF6B00?style=flat-square" alt="Shiprocket API Docs" /></a> — Fulfillment, AWB generation, and tracking webhooks
- <a href="https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react"><img src="https://img.shields.io/badge/Algolia-InstantSearch_Docs-003DFF?style=flat-square&logo=algolia&logoColor=white" alt="Algolia InstantSearch Docs" /></a> — Connecting Algolia to your React/Next.js UI

> [!TIP]
> Medusa provides a **Storefront Development Guide** at `docs.medusajs.com/storefront-development` that explains exactly which API endpoints Vridhira's `src/lib/data/` calls map to. Read it if you're extending or debugging data-fetching logic.

> [!WARNING]
> **MedusaJS v2 is not backward-compatible with v1.** Most tutorials, YouTube videos, blog posts, and Stack Overflow answers you find online are for v1. Their code will not work — the module system, API routes, and SDK are completely different. Always check the URL contains `/v2/` or the version header says `2.x` before following any guide.

---

## 🤝 Contributing

Contributions are welcome — from fixing a typo in the README to building new features for Indian artisans.

**Steps to contribute**

1. <a href="https://github.com/Newbie-Himanshu/vridhira-frontend/fork"><img src="https://img.shields.io/badge/Fork-this_repo-8B4513?style=flat-square&logo=github&logoColor=white" alt="Fork" /></a> the repository
2. **Create a branch** — use a descriptive name: `feat/product-reviews` or `fix/cart-quantity-bug`
3. **Make focused changes** — one concern per PR keeps reviews fast
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org):
   - `feat(checkout): add Razorpay EMI selection step`
   - `fix(cart): prevent negative quantity on stepper`
   - `docs(readme): update environment variables table`
5. **Run checks** before pushing:

```bash
yarn tsc --noEmit   # TypeScript — zero errors required
yarn lint           # ESLint — no warnings on changed files
```

6. **Open a Pull Request** against `master` with a clear description of what changed and why

> [!TIP]
> **Small PRs merge faster.** If your change touches more than 3 files or 150 lines, consider splitting it. Reviewers are human — focused diffs get reviewed same-day.

> [!NOTE]
> Vridhira uses **Conventional Commits** — your PR title and commit messages must follow the pattern. PRs with messages like `update stuff` or `fix` will be asked to rebase with proper messages before merging.

> [!IMPORTANT]
> **Do not commit `.env.local`**, API keys, secrets, or any credentials. If you accidentally commit a secret, rotate it immediately — don't just delete the file in a follow-up commit (the secret is still in git history).

---

## 🙏 Acknowledgements

Vridhira is built on the shoulders of these excellent open-source projects:

| Project | Role in Vridhira | License |
|:---|:---|:---:|
| <a href="https://github.com/medusajs/medusa"><img src="https://img.shields.io/badge/MedusaJS-github-7c3aed?style=flat-square&logo=github&logoColor=white" alt="MedusaJS" /></a> | **Commerce engine** — orders, products, regions, payments | MIT |
| <a href="https://github.com/vercel/next.js"><img src="https://img.shields.io/badge/Next.js-github-000000?style=flat-square&logo=github&logoColor=white" alt="Next.js" /></a> | **React framework** — App Router, SSR, image optimisation | MIT |
| <a href="https://github.com/tailwindlabs/tailwindcss"><img src="https://img.shields.io/badge/Tailwind_CSS-github-06B6D4?style=flat-square&logo=github&logoColor=white" alt="Tailwind CSS" /></a> | **Styling system** — design tokens, responsive utilities | MIT |
| <a href="https://razorpay.com"><img src="https://img.shields.io/badge/Razorpay-website-2196F3?style=flat-square" alt="Razorpay" /></a> | **Payment infrastructure** — UPI, cards, COD flows | Commercial |
| <a href="https://shiprocket.in"><img src="https://img.shields.io/badge/Shiprocket-website-FF6B00?style=flat-square" alt="Shiprocket" /></a> | **Logistics infrastructure** — D2C fulfillment & tracking | Commercial |

> [!NOTE]
> The Vridhira **custom backend modules** (COD payment, Razorpay queue, Shiprocket fulfillment, Wishlist, Algolia indexing) are original work by Himanshu and are **not part of MedusaJS**. They are covered by the Vridhira Attribution License v2.0 — not by MedusaJS's MIT license. MedusaJS's MIT license applies only to the MedusaJS framework core.

---

## 📜 License

Distributed under the **Vridhira Attribution License v2.0** — see [LICENSE](./LICENSE) for full text.

Copyright © 2026 **Himanshu — Vridhira**. All rights reserved.

> [!NOTE]
> You are **free to fork, self-host, modify, and use commercially** — but you **must** publicly credit Vridhira and Himanshu in your README and keep the storefront credits visible. Removing attribution is a license violation. See [LICENSE](./LICENSE) for exact conditions.

> [!IMPORTANT]
> **v2.0 introduces a one-time cure rule.** If you violate the license and cure within 7 days, rights are reinstated — but **only once per licensee**. A second violation is permanent termination with no reinstatement path.

> [!WARNING]
> This is **not standard MIT**. It is a custom attribution-required license. If you fork this project, read [LICENSE](./LICENSE) before deploying publicly.

---

## 👤 Author

<table>
  <tr>
    <td valign="top" width="120">
      <a href="https://github.com/Newbie-Himanshu">
        <img
          src="https://github.com/Newbie-Himanshu.png"
          width="96"
          style="border-radius:50%"
          alt="Himanshu"
        />
      </a>
    </td>
    <td valign="top">
      <h3>Himanshu</h3>
      <p>
        Independent developer building open commerce infrastructure for India's artisans and handcraft sellers.<br/>
        Vridhira is a solo project — no team, no VC backing, no SaaS subscriptions. Just code, craft, and conviction.
      </p>
      <p>
        <a href="https://github.com/Newbie-Himanshu">
          <img src="https://img.shields.io/badge/GitHub-Newbie--Himanshu-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" />
        </a>
        &nbsp;
        <a href="https://github.com/Newbie-Himanshu/vridhira-frontend">
          <img src="https://img.shields.io/badge/Repo-vridhira--frontend-8B4513?style=flat-square&logo=github&logoColor=white" alt="Frontend Repo" />
        </a>
        &nbsp;
        <a href="https://github.com/Newbie-Himanshu/vridhira-backend">
          <img src="https://img.shields.io/badge/Repo-vridhira--backend-24292f?style=flat-square&logo=github&logoColor=white" alt="Backend Repo" />
        </a>
        &nbsp;
        <a href="https://github.com/vridhira">
          <img src="https://img.shields.io/badge/Org-vridhira-8B4513?style=flat-square&logo=github&logoColor=white" alt="Org: vridhira" />
        </a>
      </p>
    </td>
  </tr>
</table>

| | |
|---|---|
| **What I build** | Full-stack e-commerce — payments, logistics, search, storefront |
| **Stack** | Next.js · MedusaJS · TypeScript · Razorpay · Shiprocket · Algolia |
| **Why Vridhira** | India has 7 crore+ artisans with no good open-source digital storefront built for how India shops |
| **License** | [Vridhira Attribution License v2.0](./LICENSE) — free to use, always credit |

> [!NOTE]
> If you find this project useful — **star the repo**, share it with someone building for India, or open a PR. That's the best way to support independent open-source work.

---

<sub>Powered by <a href="https://github.com/medusajs/medusa"><img src="https://img.shields.io/badge/MedusaJS-medusajs%2Fmedusa-7c3aed?style=flat-square&logo=github&logoColor=white" alt="MedusaJS" /></a> — licensed separately under the MIT License by Medusa, Inc.</sub>
