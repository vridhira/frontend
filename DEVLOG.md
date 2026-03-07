# Vridhira Storefront — Development Log

> **Purpose:** Chronological record of every change made to this project, with full details, file citations, and commit references.
> **Format:** Newest entries at the top within each date section.
> **Repo:** [Newbie-Himanshu/vridhira-frontend](https://github.com/Newbie-Himanshu/vridhira-frontend)

---

## 2026-03-07 (Saturday) — NavShell Liquid-Glass Overhaul + Hero Cinematic Rebuild + Scroll-Glide Engine + CategoryStrip Curtain Reveal + FAQ Query System + Footer Locale Fix

**Session scope:**
- Morning: NavShell liquid-glass rebuild (previous session)
- Afternoon: Hero cinematic rebuild (previous session)
- Evening: Complete scroll interaction engine — velocity-matched auto-glide from hero to CategoryStrip, CategoryStrip curtain-reveal entrance animations, font scale polish, jitter elimination
- Night: FAQ Query System — full-stack customer question submission page; permanent footer Help Center locale fix

---

### Change 12 — Help Center: `/help-center/ask` — Customer FAQ Submission Page

**Files added:**
| File | Purpose |
|---|---|
| `src/modules/help-center/components/ask-form-client.tsx` | `"use client"` form — 4-state machine, client validation, `fetch()` to Medusa store API |
| `src/modules/help-center/templates/ask.tsx` | Server component page template — two-column layout, breadcrumb, sticky info panel |
| `src/app/[countryCode]/(main)/help-center/ask/page.tsx` | Next.js 15 App Router route with metadata |

**Why:** The "FAQs" footer link previously pointed to `/help-center` — a passive article listing. The user's requirement was an active submission form where customers submit questions and admins answer them from the Medusa Admin panel. This change is the storefront half of that full-stack system (backend in `vridhira-marketplace`).

**Architecture decision — server/client boundary:**
The page uses a two-component split to preserve Next.js server-rendering where possible:
- `ask.tsx` (server): renders static layout, breadcrumbs, sticky info panel — no JS needed on the client for these
- `ask-form-client.tsx` (client): owns all interactive state; `"use client"` boundary lets it use `useState`, controlled inputs, and `fetch()`

**`ask-form-client.tsx` — 4-state machine:**

| State | UI | Trigger |
|---|---|---|
| `idle` | Blank form, submit enabled | Initial render / "Ask another" button |
| `submitting` | Fields disabled, animated SVG spinner on button | `onSubmit` fires |
| `success` | Checkmark circle, "Question submitted!", two action buttons | HTTP 201 response |
| `error` | Red-tinted alert banner with SVG icon, form re-enabled | Non-2xx or network error |

The `success` screen offers two buttons:
- **"Back to Help Center"** — `LocalizedClientLink href="/help-center"`
- **"Ask another question"** — resets state back to `idle` (sets form fields back to empty via `useState` reset, transitions to `idle`)

**Client-side validation (mirrors server-side rules exactly):**

| Field | Rule | Message shown |
|---|---|---|
| `customer_name` | 2–100 chars | "Name must be 2–100 characters" |
| `customer_email` | RFC email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Enter a valid email address" |
| `subject` | 3–150 chars | "Subject must be 3–150 characters" |
| `question` | 10–2000 chars | "Your question must be 10–2000 characters" |

Validation runs on submit (not on every keystroke) to avoid jarring mid-type errors. All four fields must pass simultaneously; errors are shown as a `{ field: string }` map so each input can display its own inline message.

**`fetch` call:**
```ts
fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/faq-queries`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ customer_name, customer_email, subject, question }),
})
```
Response is typed as `{ faq_query: { id: string; subject: string; status: string; created_at: string } }` — only non-PII fields returned by the store API (backend deliberately omits `customer_email` from the 201 response to prevent email harvesting via the response body).

**`ask.tsx` — server component layout:**
- `content-container` → `grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8` — form takes the main column; sticky panel takes 340px right column
- Left: gradient header card (`linear-gradient(135deg, #8B4513 0%, #C9762B 100%)`), oversized question-mark icon, H1 "Ask a Question", subtitle text, then `<AskFormClient />`
- Right sticky panel: response time callout ("We typically reply within 1–2 business days"), quick-answer list (5 help articles linking to existing `/help-center/[articleId]` routes), back-to-help-center link
- Breadcrumb: Home icon → "Help Center" (`href="/help-center"`) → "Ask a Question" (active: amber pill `bg-[#C9762B]/10 text-[#C9762B]`) — consistent with other `help-center` pages

**`app/[countryCode]/(main)/help-center/ask/page.tsx`:**
```ts
export const metadata: Metadata = {
  title: "Ask a Question | Vridhira Help Center",
  description: "Submit your question to the Vridhira support team — we reply within 1–2 business days.",
}
```
Registered as a child route of the existing `help-center/` segment — no new route group needed; the `(main)` layout and locale middleware apply automatically.

---

### Change 11 — Footer: Permanent Help Center link fix + FAQs → `/help-center/ask`

**File:** `src/modules/layout/templates/footer/index.tsx`

**Root cause of the recurring Help Center disappearance:**

The bottom strip "Help Center" link used a bare `<a href="/help-center">`. In Medusa's Next.js storefront the entire route tree is prefixed with `/[countryCode]/` (e.g. `/in/`). A plain `<a>` bypasses Next.js `Link` entirely — the browser navigates to the literal string `"/help-center"` without the country code. This lands outside the Next.js App Router segment tree, producing a 404 on initial nav and a blank render on client-side transitions. Because the footer runs in a server component context, the error surfaces silently — the link visually disappears rather than throwing.

**Fix — `LocalizedClientLink`:**
```tsx
// BEFORE (broken — bare <a>, no locale prefix):
<a href="/help-center" className="text-sm text-neutral-400 hover:text-white transition-colors">
  Help Center
</a>

// AFTER (fixed — Medusa core component, prepends countryCode):
<LocalizedClientLink
  href="/help-center"
  className="text-sm text-neutral-400 hover:text-white transition-colors"
>
  Help Center
</LocalizedClientLink>
```

`LocalizedClientLink` is the Medusa-standard wrapper around Next.js `Link`. It reads the current `countryCode` from the URL context and prepends it before delegating to `<Link>`. Rendered `href` becomes `/in/help-center` (or whichever region). This is the permanent fix — the link will survive locale changes, server-side renders, and client-side navigations.

**Additional change — `title` attribute removed:**
```diff
- <a href="/help-center" title="Help Center" className="…">Help Center</a>
+ <LocalizedClientLink href="/help-center" className="…">Help Center</LocalizedClientLink>
```
The `title` attribute was redundant (link text is already "Help Center") and technically violates WCAG 2.4.6 — adding a `title` tooltip identical to the visible label provides no accessibility value.

**FAQ link update (Customer Services column):**
```tsx
// BEFORE:
{ label: "FAQs", href: "/help-center" }

// AFTER:
{ label: "FAQs", href: "/help-center/ask" }
```
"FAQs" now routes to the new customer question submission page (`/help-center/ask`) rather than the article listing. Customers who click "FAQs" have a question to ask — the submission form is the correct destination.

**References:**
- Medusa Storefront Docs — `LocalizedClientLink`: locale-aware navigation component, wraps Next.js `<Link>` with countryCode prefix
- WCAG 2.1 SC 2.4.6 — Headings and Labels: labels should describe purpose; redundant `title` tooltips violate the spirit of this criterion

---

### Change 10 — Hero: Velocity-matched auto-glide + CategoryStrip curtain reveal

**Files modified:**
| File | Summary |
|---|---|
| `src/modules/home/components/hero/index.tsx` | Auto-glide engine, CSS scroll-driven exit polish |
| `src/modules/home/components/category-strip/index.tsx` | Full rewrite: curtain-reveal entrance animations, font scale fix |

---

#### Part A — Hero: CSS scroll-driven exit

**Replaced:** `isExiting` React state + `exitDelay()` stagger + RAF `smoothScrollTo` loop + `wheelBlock`/`touchBlock` scroll-lock + event bus (`cat-strip-glide-start` / `cat-strip-glide-abort`) — ~100 lines removed.

**Added:**
```css
@supports (animation-timeline: scroll()) {
  .hero-scroll-exit {
    animation: hero-scroll-exit-kf linear both;
    animation-timeline: scroll(root);
    animation-range: 0vh 38vh;
  }
}
@keyframes hero-scroll-exit-kf {
  from { opacity: 1; transform: translateY(0px)   scale(1);    filter: blur(0px); }
  to   { opacity: 0; transform: translateY(-18px) scale(0.97); filter: blur(3px); }
}
```

`animation-timeline: scroll(root)` ties animation progress directly to `window.scrollY` — zero JS, auto-reverses on scroll-back, no state. The `scale(0.97)` gives depth as the hero recedes. `@supports` guard makes Firefox/Safari <18 show content at full opacity.

**Scroll indicator button:** `handleGlide` simplified from 20-line RAF loop to one line:
```ts
document.getElementById("category-strip")?.scrollIntoView({ behavior: "smooth", block: "start" })
```

---

#### Part B — Hero: Auto-glide engine (velocity-matched cubic Hermite spline)

**Trigger condition:** `scrollY ≥ heroHeight × 0.10` + downward velocity `> 0.04 px/ms`

**Velocity measurement:** 6-sample ring buffer with linearly increasing weights (most-recent sample has weight 6, oldest has weight 1). Far more accurate than exponential IIR on a sudden flick.

**Animation curve — cubic Hermite spline:**
```
pos(t) = fromY
       + D        × (−2t³ + 3t²)     ← smooth-step [0 → D]
       + v0s × T  × (t³ − 2t² + t)   ← velocity tangent
```

Four mathematical guarantees:
| Condition | Value | Meaning |
|---|---|---|
| `pos(0)` | `fromY` | Starts exactly where inertia stopped |
| `pos(T)` | `toY` | Lands exactly on CategoryStrip top |
| `pos'(0)` | `v0s` | Departure velocity matches user's scroll speed |
| `pos'(T)` | `0` | Zero-velocity landing — no bounce |

**No-overshoot proof:** overshoot occurs iff `v0s × T > 3D`. Cap is `v0s = min(v0, 2.0D/T)` → `v0s × T ≤ 2.0D < 3D`. ✓

**Duration:** `T = clamp(2.2 × D / v0, 520ms, 1200ms)` — the 2.2× multiplier is what produces the "glide" feel (page decelerates gradually rather than snapping).

**Jitter fix — deferred `fromY` capture:**
```ts
// BEFORE (caused jitter):
function smoothGlideTo(fromY: number, ...) {  // fromY captured in scroll handler
  frame(now) {
    window.scrollTo(0, fromY + ...)  // ← BACKWARD SNAP: inertia moved scrollY
  }                                  //   10–20px forward in the 16ms gap
}

// AFTER (jitter-free):
function smoothGlideTo(toY, v0) {
  let fromY = -1
  frame(now) {
    if (fromY === -1) fromY = window.scrollY  // capture AFTER inertia settles
    window.scrollTo(0, Math.round(getPos(elapsed)))
  }
}
```

**Direction guard + re-arm logic:**
- Glide only fires when `measuredVel() > 0 px/ms` (never on scroll-back)
- `glideFired` resets only when `scrollY < threshold × 0.5` — prevents CategoryStrip → Hero return journey from re-triggering mid-scrollback
- `wheel` + `touchmove` are `preventDefault()`-blocked during the RAF loop — prevents browser inertia engine from writing `scrollY` in parallel (root cause of original jitter)

---

#### Part C — CategoryStrip: curtain-reveal entrance animations

**Replaced:** `ready`/`entered` React state + `useEffect`/`useRef`/`useState` imports + IObs (threshold `[0, 0.85]`) + 3 CustomEvent listeners + visibility wrapper `<div>` with JS-driven `translateY`/`pointerEvents` + `smoothScrollTo` dead code — ~90 lines removed.

**Component is now a pure function** — zero hooks, zero state.

**New animation classes:**

| Class | Keyframe | Entrance |
|---|---|---|
| `.cat-curtain` | `cat-curtain-rise` | Word rises from `translateY(105%)` inside `overflow:hidden` mask — theatrical curtain effect |
| `.cat-eyebrow` | `cat-eyebrow-slide` | Eyebrow slides in from `translateX(-110%)` — reveals from behind left wall |
| `.cat-line` | `cat-line-wipe` | Decorative underline wipes `scaleX(0 → 1)` from center |
| `.cat-card` | `cat-card-in` | Card lifts from `translateY(36px) scale(0.95) opacity(0)` — depth approach |

All driven by `animation-timeline: view()` — fires as each element enters the viewport with no JS. `@supports not` fallback leaves all content visible on Firefox <135.

**Section heading font corrected:** `text-4xl md:text-5xl` (36–48px) → `text-2xl md:text-3xl` (24–30px) — industry-standard section subheading range (Amazon, Etsy, Shopify all use 24–28px).

**Card hover:** `.cat-card-inner:hover { transform: translateY(-4px) scale(1.015); box-shadow: 0 12px 36px rgba(139,69,19,0.14) }` — subtle physical lift, no abrupt jump.

---

#### Part D — Hero heading/subheading size reduction

| Element | Before | After | Δ |
|---|---|---|---|
| H1 (mobile) | `text-4xl` 36px | 34px | −2px |
| H1 (sm) | `text-5xl` 48px | 46px | −2px |
| H1 (lg) | `text-6xl` 60px | 58px | −2px |
| Sub-tagline (base) | `text-base` 16px | `text-xs` 12px | −4px |
| Sub-tagline (sm) | `text-lg` 18px | `text-sm` 14px | −4px |

---



**Session scope:** Complete rebuild of the navigation bar (morning) + complete rebuild of the homepage hero (afternoon). NavShell: scroll-driven liquid-glass pill with physics float, water ripple, and canvas halftone trail. Hero: canvas warm-dust particles, word-cascade entrance, three-layer scroll parallax, magnetic CTA button, artisan category chip mosaic with independent bob physics.

**Branch:** `master` (direct)
**Files added:** `src/modules/layout/components/nav-shell/` (new component directory)
**Files modified:** `src/modules/layout/components/cart-dropdown/index.tsx`, `src/modules/layout/templates/nav/index.tsx`, `src/modules/home/components/hero/index.tsx`, `src/app/[countryCode]/(main)/page.tsx`, `src/app/layout.tsx`, `src/modules/layout/templates/footer/index.tsx`, `src/styles/globals.css`, `tailwind.config.js`, `tsconfig.json`

---

### Change 8 — Hero: Cinematic full-screen rebuild

**File:** `src/modules/home/components/hero/index.tsx` (complete rewrite)

**Why:** The previous hero was a static server component with no animations, no interactivity, and no visual depth. A full-screen landing section for a premium artisan marketplace requires a cinematic first impression — felt motion, physical weight, and environmental richness.

**Architecture decision — `"use client"` conversion:**
The previous hero was a pure server component (`import ... from "..."` only). Converting to `"use client"` enables:
- `IntersectionObserver` for entrance-gated animations (text never animates if the user jumps mid-page)
- `useEffect` + `requestAnimationFrame` for the particle canvas (zero-overhead draw loop, no React re-renders)
- `onMouseMove` for the magnetic CTA (real-time cursor tracking)
- scroll listener (passive RAF-gated) for parallax

**Particle field — canvas imperative draw loop:**
52 warm-amber particles drift upward across the full hero surface. Each particle has:
- `vx` ∈ [−0.38, +0.38], `vy` ∈ [−0.64, −0.12] — slow upward drift with slight lateral spread
- Brownian micro-sway: each frame adds `± 0.012` to `vx`, clamped to ±0.42 — prevents particles from straightening out into vertical columns
- Two hues: warm amber `rgb(201,118,43)` (62% probability) and deep saddle-brown `rgb(139,69,19)` (38%) — matches the Vridhira brand palette
- Respawn from the bottom when exiting the top edge (continuous field)
- `ResizeObserver` syncs canvas pixel dimensions to CSS layout size each frame — no blurry/stretched particles on resize or orientation change

Architecture: imperative `canvas.getContext("2d")` draw loop gated by a single `requestAnimationFrame`. No React state is mutated per frame. `particlesRef` stores the array; the draw function reads and mutates it directly. Zero re-renders at 60 fps.

**Entrance animation system:**
`IntersectionObserver` (threshold: 0.15) fires once when the section enters the viewport. It sets `entered = true` and disconnects. JS then adds the `.entered` class to every hero element simultaneously — each element's `animation-delay` staggers them:

| Element | Delay | Effect |
|---|---|---|
| Eyebrow label | 0.08s | Hero-fade-up (14px rise) |
| "Handcrafted" | 0.28s | Hero-word-in (28px rise + blur clear) |
| "with" | 0.37s | Hero-word-in |
| "soul." | 0.46s | Hero-word-in |
| "Delivered" | 0.55s | Hero-word-in |
| … (every word + 0.09s) | … | … |
| Sub-tagline | 0.88s | Hero-fade-up |
| CTAs row | 1.02s | Hero-fade-up |
| Trust badges | 1.18s | Hero-fade-up |
| Scroll indicator | 1.50s | Hero-fade-up |

`hero-word-in` keyframe: `opacity: 0, translateY(28px), blur(8px)` → `opacity: 1, translateY(0), blur(0)` with `cubic-bezier(0.22, 1, 0.36, 1)` — Apple-style over-shoot spring feel.
`hero-fade-up` keyframe: same without blur (appropriate for paragraph text where per-word granularity isn't needed).

**Three-layer scroll parallax:**

| Layer | Translate scalar | Element |
|---|---|---|
| Background | `scrollY × 0.32` | Decorative amber/brown radial blobs |
| Ghost text | `scrollY × 0.52` | Oversized "Artisan" serif background text |
| Content | `scrollY × 0.10` | Main headline + CTA block |

The differential speeds create separated depth planes. Content barely moves (0.10×) so it reads clearly across the scroll range. The ghost text (0.52×) lags behind the real scroll creating a deep-background parallax. The blobs (0.32×) sit in the middle depth.

**Magnetic CTA button:**
`onMouseMove` fires on the whole `<section>`. On each event, it measures the distance from the cursor to the `ctaWrapRef` div's centre. If `dist < 130px`, it displaces the wrapper by `delta × (1 − dist/130) × 0.4` — the pull strength is maximum at the centre (1.0) and fades linearly to zero at the 130px radius boundary. A `cubic-bezier(0.22, 1, 0.36, 1)` CSS transition on the wrapper smoothly springs the button back when the cursor leaves.

Architecture: the magnetic transform is applied to a plain `<div>` wrapper (`ctaWrapRef`). `LocalizedClientLink` never needs a `ref` — avoids the `forwardRef` dependency on Next.js Link.

**CTA shimmer:**
The primary button uses a 200%-wide gradient background with `background-position` animated from `200% center` → `-200% center`. This sweeps a bright `#D4A574` band left-to-right across the button face like a specular highlight catching light. Starts only after `1.8s` (once the button is fully visible from the entrance animation).

**Artisan category mosaic (right panel, lg+ only):**
Six category chips (Textiles, Pottery, Jewellery, Woodcraft, Paintings, Metalwork) are absolutely positioned in a loose cluster around a central badge. Each chip has:
- Independent bob animation (`hero-bob-a/b/c` — three variants, different phases)
- Independent duration (4.2s–5.6s) and delay (0s–1.3s) — prevents synchronised "breathing" across chips
- `backdrop-blur-sm` + white glassmorphism fill — matches the NavShell glass aesthetic

Two spinning compass rings surround the cluster:
- Outer ring: 288px diameter, clockwise `36s linear infinite`
- Inner ring: 192px diameter, counter-clockwise `22s linear infinite`
- 8 radial tick marks on the outer ring rotate with it

The centre V-badge uses the same `linear-gradient(135deg, #8B4513, #C9762B)` radial graphic as the brand primary, positioned with `inset: 0; margin: auto` (the CSS centering trick for absolutely-positioned boxes with known dimensions).

**Three bob keyframe variants:**
```css
@keyframes hero-bob-a {
  0%,100% { transform: translateY(0px)  rotate(0deg);    }
  38%     { transform: translateY(-10px) rotate(1.2deg);  }
  68%     { transform: translateY(4px)   rotate(-0.5deg); }
}
@keyframes hero-bob-b {
  0%,100% { transform: translateY(0px)  rotate(0deg);    }
  32%     { transform: translateY(-7px)  rotate(-1.0deg); }
  63%     { transform: translateY(5px)   rotate(0.7deg);  }
}
@keyframes hero-bob-c {
  0%,100% { transform: translateY(0px);  }
  50%     { transform: translateY(-12px); }
}
```
The slight `rotate()` in `bob-a` and `bob-b` adds micro-tilt that makes the chips feel like they're reacting to air currents rather than oscillating mechanically.

**CSS injection pattern:** `<style>{`...`}</style>` inside the JSX return — same approach as NavShell, keeping all animation logic co-located with the component.

**References:**
- Apple WWDC 2023 — "Animate with springs" — spring easing characterisation
- `cubic-bezier(0.22, 1, 0.36, 1)` — approximates a spring with low damping and high stiffness (Josh W. Comeau, *The Magic of CSS Easing*, 2022)
- `IntersectionObserver` MDN — scroll-linked entrance animation pattern
- Brownian motion simulation: `vx += (Math.random()-0.5) * ε` per frame — Euler integration of a Wiener process with bounded drift

---

---

### Change 1 — NavShell: Scroll-driven bar → pill morphing

**File:** `src/modules/layout/components/nav-shell/index.tsx` (new)

**Why:** The original nav was a static, always-expanded full-width header with no scroll response. The product required an Apple-style floating pill that condenses out of the full-width bar as the user scrolls.

**Design:**
- A single scalar `p ∈ [0, 1]` drives every visual property. `p=0` is the fully expanded bar; `p=1` is the fully condensed pill.
- `p` = `ease(clamp(scrollY / SCROLL_RANGE, 0, 1))` where `ease` is the **ease-in-out-quint** function `t < 0.5 ? 16t⁵ : 1 − (−2t+2)⁵/2`. This produces a slow start, fast middle, slow end — matching the felt weight of a physical object responding to a finger.
- `SCROLL_RANGE = 120` px — the entire morph completes in the first 120px of scroll, keeping the pill visible before the page content begins.

**Scroll listener architecture:**
```
window 'scroll' (passive) → cancelAnimationFrame → requestAnimationFrame → setState(scrollY)
```
`passive: true` removes the browser's main-thread blocking on the scroll handler. `cancelAnimationFrame` before each `requestAnimationFrame` ensures at most one pending state update per display frame, preventing queued stale renders.

**Clip-path morph** — `clip-path: inset(T% S% B% S% round R)`:

| `p` value | top | side | bottom | radius | Visual |
|---|---|---|---|---|---|
| `0` | `0px` | `0%` | `0px` | `0px` | Full-width flat bar |
| `1` | `16px` | `10%` | `14px` | `9999px` | Floating pill, 80% wide |

All four values are linearly interpolated by `lerp(a, b, p)`.

**References:**
- Apple HIG — Translucent Materials: "Use a material that blurs the background to create visual depth."
- CSS `clip-path: inset()` MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
- `ease-in-out-quint` timing: Robert Penner, *Programming Macromedia Flash MX* (2002), Chapter 7 — Easing Functions.

---

### Change 2 — NavShell: Transparent frosted-glass pill (Layer 1)

**File:** `src/modules/layout/components/nav-shell/index.tsx`

**Why:** Standard `backdrop-filter: blur()` without careful alpha management produces a "foggy white slab" effect instead of true liquid glass. The glass aesthetic requires the fill opacity to nearly disappear (`bgAlpha ≈ 0.04`) while the blur and saturation carry the depth.

**Design:**
- `bgAlpha` interpolates to `0.04` at `p=1` — a barely-there warm tint. At `p=0` on non-landing pages, it holds at `0.97` (solid legible bar).
- `backdrop-filter: blur(48px) saturate(240%) brightness(1.08)` — the saturate push makes colours behind the pill appear more vivid (glass intensifies colour), the brightness lifts the apparent light level of the frosted surface.
- Both filters are **gated at `p < 0.01`** with a plain blur fallback. This prevents the saturate/brightness from firing on the fully-expanded bar at `p=0`, which would visually corrupt the standard navigation state on non-landing pages.
- Background switches from flat `rgba(250,247,242, α)` at `p<0.01` to a `linear-gradient(160deg, …)` with a top-left white bleed for the "catch the light" effect at `p≥0.01`.

**Layer stack:**

```
┌──────────────────────────────────┐
│ LAYER 1  — Glass background      │  clip-path=pillClip, backdrop-filter
│ LAYER 1b — Specular highlight    │  clip-path=pillClip, top→bottom white fade
│ LAYER 1c — Ripple / trail canvas │  clip-path=pillClip, overflow:hidden
│ LAYER 2  — Content (links, etc)  │  no clip-path (dropdowns overflow)
└──────────────────────────────────┘
All four live inside a FLOAT WRAPPER (ref=floatRef) that applies the CSS float animation.
```

**References:**
- Apple macOS Sequoia — Liquid Glass material spec: translucent surfaces with `backdrop-filter: blur + saturate`.
- CSS `backdrop-filter` MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

---

### Change 3 — NavShell: Continuous float animation

**File:** `src/modules/layout/components/nav-shell/index.tsx`

**Why:** A static pill feels inert. A subtle vertical oscillation makes it feel like it is hovering magnetically above the page.

**CSS keyframes:**
```css
@keyframes nvsh-float {
  0%, 100% { transform: translateY(  0px); }
  30%       { transform: translateY( -5px); }
  70%       { transform: translateY( +2px); }
}
```
The asymmetric timing (−5px at 30%, +2px at 70%) is intentional — a slight over-shoot downward before returning to rest mimics the damped oscillation of a real suspended object.

**Play-state gating:** `animationPlayState: rawP >= 0.98 ? "running" : "paused"`. Only the **un-eased** `rawP` is used here (not `p`) because `ease(0.98) ≈ 1.0` and we want the animation to start exactly when the pill fully closes, not when `p` crosses some eased threshold.

**Float wrapper as positioning anchor:** `floatRef.current.getBoundingClientRect()` inside `handleRipple` and `handleMouseMove` returns the post-transform coordinates. This ensures ripple and trail origins are always visually accurate regardless of where the float animation has moved the pill.

---

### Change 4 — NavShell: Water ripple on click (3-ring independent DOM nodes)

**File:** `src/modules/layout/components/nav-shell/index.tsx`

**Why:** Click feedback on a glass surface. Three concentric expanding rings simulate a water drop impact — the same idiom used in Android Material Design ripples and Apple touchscreen feedback.

**Architecture decision — why not `::before`/`::after`:**
Using CSS pseudo-elements to generate the secondary rings fails because `::before`/`::after` live in the parent element's CSS transform space. When the parent `.nvsh-ripple` is at scale `S` during its own animation keyframe, the pseudo-elements are already visually scaled by `S` before their own `animation` property is evaluated. All three "rings" end up moving together.

**Correct approach — 3 independent DOM nodes per click:**
```typescript
const base = (++rippleIdRef.current) * 10
setRipples(prev => [
  ...prev,
  { id: base,     x, y, delay: 0   },   // ring 1: fires immediately
  { id: base + 1, x, y, delay: 130 },   // ring 2: +130 ms
  { id: base + 2, x, y, delay: 260 },   // ring 3: +260 ms
])
```
- `id` is `base * 10 + offset` to allow easy group cleanup: `r.id < base || r.id > base + 2` removes exactly the three nodes spawned by this click.
- Each node is a separate DOM element with its own `animation-delay` via inline style. The transforms are independent since each element is its own stacking context.

**Visual design:**
- `width/height: 180px` — tight enough to see distinct arcs across the 88px-tall pill.
- `border: 5px solid rgba(255,255,255,1)` — thick crisp ring on black background; thinner borders become sub-pixel and invisible.
- `box-shadow` 4-layer glow: `0 0 0 2px` hard outer stroke + `0 0 18px` inner glow + `0 0 36px` mid glow + `0 0 54px` ambient spread + `inset 0 0 18px` inner fill glow.
- `mix-blend-mode: screen` — additive white light blend; the rings brighten on any background tint rather than compositing opaquely.
- All ripple divs are clipped by the pill's `clip-path` on Layer 1c, so they never paint outside the pill boundary.

**References:**
- Material Design 3 — Ripple: https://m3.material.io/foundations/interaction/states/overview
- CSS `mix-blend-mode: screen` MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode

---

### Change 5 — NavShell: Canvas halftone dot-ring mouse trail

**File:** `src/modules/layout/components/nav-shell/index.tsx`

**Why:** A plain cursor spotlight (single radial gradient div) does not convey motion history. The halftone concentric-dot pattern (as seen in radial halftone visualisers) creates a visible trail that communicates the direction and speed of cursor movement across the glass surface.

**Reference inspiration:** Radial halftone visualiser — concentric rings of dots, each ring at a larger orbit radius with more dots, all emanating from the same center point.

**Architecture — imperative canvas over React state:**
Using `setState` on every `mousemove` would trigger a full React reconcile and re-render at 60 fps, causing visible jitter. Instead:
- A `<canvas>` element (Layer 1c, `mix-blend-mode: screen`) is the rendering target.
- `trailRef` (a `useRef` holding a plain array) stores `{ x, y, t }` trail points — **not state**.
- A single `requestAnimationFrame` draw loop (started once in `useEffect`) reads `trailRef.current`, prunes expired points, and repaints the canvas each frame. No React re-renders are triggered.

**Per-point rendering — 4 concentric dot rings:**

| Ring | Orbit radius | Dot count | Dot base radius | Visual role |
|---|---|---|---|---|
| Center | 0 px | 1 dot | 2.5 px | Bright cursor core |
| Inner | 7 px | 6 dots | 2.0 px | Tight inner ring |
| Mid | 13 px | 9 dots | 1.5 px | Mid-distance ring |
| Outer | 20 px | 12 dots | 1.0 px | Fine outer ring |

As each point ages over its 700 ms lifetime (`age = (now - pt.t) / LIFETIME`):
- `inv = 1 − age`
- All orbit radii shrink by `inv` — the rings contract inward as the point fades, creating the "collapsing flower" effect.
- All dot radii shrink by `inv` — dots shrink to nothing.
- Alpha = `inv^1.4 × 0.92` — power curve gives a bright sharp head with a gently fading tail.

**Motion sampling:** New trail points are only appended when `Math.hypot(Δx, Δy) ≥ 10 px`. This prevents over-sampling at low speeds (which produces a smeared blob) while capturing sufficient density at normal cursor speeds.

**Trail buffer cap:** `trailRef.current.length > 32` — limits memory and ensures the canvas doesn't stale out on very long sessions.

**References:**
- Halftone dot patterns / radial halftone: Aaron Koblin, *Flight Patterns* (2009) — radial data visualisation.
- Canvas 2D API — `CanvasRenderingContext2D.arc()`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
- `requestAnimationFrame` loop pattern: Paul Lewis & Philip Walton, *Leaner, Meaner, Faster Animations with requestAnimationFrame* (2013), web.dev.

---

### Change 6 — NavShell: Liquid-glass icon hover (nvsh-icon)

**File:** `src/modules/layout/components/nav-shell/index.tsx`

**Why:** Icon buttons (search, account, cart) should react to hover with a micro glass-pane materialisation, matching the pill's glass aesthetic.

**CSS:**
```css
.nvsh-icon:hover {
  background: rgba(255,255,255,0.20);
  backdrop-filter: blur(14px) saturate(160%);
  border-color: rgba(255,255,255,0.32);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.62),   /* top specular */
              inset 0 -1px 0 rgba(0,0,0,0.05),          /* bottom shadow */
              0 4px 12px rgba(0,0,0,0.08);               /* lift */
  transform: scale(1.1);
}
.nvsh-icon:active { transform: scale(0.92); transition-duration: 100ms; }
```
The `inset 0 1px 0` top specular is the "glass edge catching the light" micro-detail that differentiates genuine glassmorphism from a plain white tint overlay.

---

### Change 7 — Cart dropdown: Replace text label with SVG icon + badge

**File:** `src/modules/layout/components/cart-dropdown/index.tsx`

**Why:** The original `PopoverButton` rendered `Cart (${totalItems})` as text. Replacing it with an icon is consistent with modern e-commerce nav conventions (Shopify, Amazon, Apple Store) and scales better at the reduced font sizes used in the pill.

**Before:**
```tsx
Cart ({totalItems})
```

**After:**
```tsx
<svg>…</svg>  {/* Lucide ShoppingCart icon, 18×18, stroke-based */}
{totalItems > 0 && (
  <span className="absolute -top-1 -right-1 … bg-vridhira-primary text-white text-[9px]">
    {totalItems > 9 ? "9+" : totalItems}
  </span>
)}
```
- Badge caps at `"9+"` to prevent 2-digit numbers overflowing the fixed-radius `w-4 h-4` badge circle.
- `aria-label={`Cart (${totalItems} items)`}` on the outer `LocalizedClientLink` preserves screen-reader accessibility after the visible text was removed.

**References:**
- Lucide Icons — ShoppingCart: https://lucide.dev/icons/shopping-cart (SVG path reproduced inline)
- WCAG 2.1 SC 1.1.1 — Non-text Content: icon-only controls must have a text alternative via `aria-label`.

---

## 2026-03-06 (Friday) — Docs, License & Brand Session

**Session scope:** LICENSE v1.0 → v2.0 legal hardening, README full redesign (15 callout blocks), Author section vibecoder identity rewrite, merge to master.
**Total commits today:** 14 (including 2 with duplicate hashes from branch merge)
**Branch:** `docs/readme-license-improvements` → merged to `master` via PR #1

---

### Change 13 — `3e54535` · 18:27 IST
**Type:** `docs(readme)` — fix
**Subject:** Switch vibecoder table to Markdown for full-width rendering on GitHub
**Branch:** `master` (direct)
**Diff:** `README.md` index `971689b..d107ed1` · +6 / −26 lines

**Why:** GitHub's HTML sanitizer strips `width="100%"` from `<table>` tags for XSS safety. The `dd0deb7` attempt used an HTML table with `width="100%"` but GitHub silently stripped the attribute on render, leaving the table at its default auto (narrow) width. A Markdown pipe table always fills 100% of the available container width by GitHub's own CSS — no attribute needed.

**Root cause detail:** GitHub's `cmark-gfm` renderer sanitizes the `width` attribute from all HTML table tags. This is documented behaviour — there is no way to override it from within a README file. The remaining grey space on either side of README content is GitHub's fixed layout shell (`.Layout-sidebar`, `.container-lg`) locked at ~1280px with the README pane at ~780px. This is GitHub's page chrome, not the table.

**Files changed:**
| File | +Lines | −Lines | Index |
|---|---|---|---|
| `README.md` | 6 | 26 | `971689b → d107ed1` |

**Exact diff — `README.md` (around line 508):**

Before (`dd0deb7`):
```html
<table width="100%">
  <thead>
    <tr>
      <th width="50%" align="center">❌ Old way</th>
      <th width="50%" align="center">✅ Vibecoder way</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Write every line manually</td>
      <td align="center">Define the system, direct the agents, review the output</td>
    </tr>
    <tr>
      <td align="center">Bottlenecked by typing speed</td>
      <td align="center">Bottlenecked only by thinking speed</td>
    </tr>
    <tr>
      <td align="center">One dev = one feature at a time</td>
      <td align="center">One dev = multiple modules in parallel</td>
    </tr>
    <tr>
      <td align="center">AI as autocomplete</td>
      <td align="center">AI as a junior engineer you manage</td>
    </tr>
  </tbody>
</table>
```

After (`3e54535`):
```md
| ❌ &nbsp; Old way | ✅ &nbsp; Vibecoder way |
|:---:|:---:|
| Write every line manually | Define the system, direct the agents, review the output |
| Bottlenecked by typing speed | Bottlenecked only by thinking speed |
| One dev = one feature at a time | One dev = multiple modules in parallel |
| AI as autocomplete | AI as a junior engineer you manage |
```

**Surrounding context preserved:** The paragraph `"Vridhira — the entire frontend + backend — is built this way…"` immediately following the table was unchanged.

**Technical note:** `&nbsp;` used inside column headers to add spacing between emoji and text without breaking the pipe-table parser. `:---:` syntax centres both column text and header.

---

### Change 12 — `dd0deb7` · 18:24 IST
**Type:** `docs(readme)` — fix attempt *(superseded 3 minutes later by `3e54535`)*
**Subject:** Convert vibecoder table to full-width HTML with centered columns
**Branch:** `master` (direct)
**Diff:** `README.md` index `12831be..971689b` · +26 / −6 lines

**Why:** After the vibecoder section (`fd66f02`), the comparison table used a basic Markdown pipe table that appeared narrower than the full README column on screen. The attempt was to switch to `<table width="100%">` which _should_ force a full-width render. This approach failed because GitHub strips the `width` attribute (see `3e54535` for explanation and fix).

**What was attempted in `README.md`:**

Replaced the Markdown pipe table:
```md
| Old way | Vibecoder way |
|:---|:---|
```

With an HTML table:
```html
<table width="100%">
  <thead>
    <tr>
      <th width="50%" align="center">❌ Old way</th>
      <th width="50%" align="center">✅ Vibecoder way</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">Write every line manually</td>
      <td align="center">Define the system, direct the agents, review the output</td>
    </tr>
    <tr>
      <td align="center">Bottlenecked by typing speed</td>
      <td align="center">Bottlenecked only by thinking speed</td>
    </tr>
    <tr>
      <td align="center">One dev = one feature at a time</td>
      <td align="center">One dev = multiple modules in parallel</td>
    </tr>
    <tr>
      <td align="center">AI as autocomplete</td>
      <td align="center">AI as a junior engineer you manage</td>
    </tr>
  </tbody>
</table>
```

**Outcome:** GitHub rendered the table but silently dropped `width="100%"` and `width="50%"` from the `<table>` and `<th>` elements respectively. Visual result was identical to the Markdown table — no width improvement. Reverted in `3e54535`.

---

### Change 11 — `fd66f02` · 18:22 IST
**Type:** `docs(readme)` — feature
**Subject:** Rewrite Author section — vibecoder identity + AI-native workflow
**Branch:** `master` (direct)
**Diff:** `README.md` index `b673253..12831be` · +76 / −45 lines · Section 14 (around line 463)

**Why:** The `4b32ba9` Author section used a standard two-column profile card (photo + bio). Requested a full identity rewrite to explicitly surface that this is a vibecoder project — built by directing AI agents, not writing every line by hand. The goal was to make the workflow visible to anyone who forks or stars the repo.

**Files changed:**
| File | +Lines | −Lines | Index |
|---|---|---|---|
| `README.md` | 76 | 45 | `b673253 → 12831be` |

**Before (section 14 structure from `4b32ba9`):**
```html
## 🙋 Author

<table>
  <tr>
    <td valign="top" width="120">
      <a href="https://github.com/Newbie-Himanshu">
        <img src="https://github.com/Newbie-Himanshu.png" width="96"
             style="border-radius:50%" alt="Himanshu" />
      </a>
    </td>
    <td valign="top">
      <h3>Himanshu</h3>
      <p>Independent developer building open commerce infrastructure for India's artisans...</p>
      <p>[badge links]</p>
    </td>
  </tr>
</table>
```

**After (section 14 structure — `fd66f02`):**
```html
## 🙋 Author

<p align="center">
  <a href="https://github.com/Newbie-Himanshu">
    <img src="https://github.com/Newbie-Himanshu.png" width="110" alt="Himanshu" />
  </a>
</p>

<h3 align="center">Himanshu</h3>

<p align="center">
  <strong>Vibecoder · AI-native builder · India-first indie dev</strong><br/>
  <em>I don't just write code — I orchestrate AI agents to build production software.</em>
</p>

<p align="center">[4 badge links — GitHub / Frontend / Backend / Org]</p>

---

### What is a vibecoder?
[prose + comparison table]

---

### How this project was built
[ASCII diagram]

> [!IMPORTANT]
> AI agents wrote the code. Himanshu owns it.

### Why Vridhira?
[7 crore artisan context]

> [!NOTE]
> [CTA for stars/shares/PRs]
```

**New subsections added (all net-new, no equivalents in prior version):**

| Subsection | Content summary |
|---|---|
| `What is a vibecoder?` | Defines vibecoder: directing AI agents as execution layer, owning architecture + decisions |
| Comparison table | 4-row Markdown table: `Old way` (manual, slow) vs `Vibecoder way` (agent-directed, parallel) |
| `How this project was built` | ASCII tree diagram showing `Himanshu → GitHub Copilot / Antigravity / Manual review` |
| `[!IMPORTANT]` callout | "AI agents wrote the code. Himanshu owns it." — explicit ownership statement |
| `Why Vridhira?` (expanded) | India has 7 crore+ artisans with no e-commerce infrastructure built for them. Vridhira is that infrastructure. |
| `[!NOTE]` CTA | Stars, shares, and PRs welcome |

**Badge links (unchanged structure, label text updated):**
```
GitHub: https://img.shields.io/badge/GitHub-Newbie--Himanshu-181717?style=flat-square&logo=github
Frontend: https://img.shields.io/badge/Frontend-vridhira--frontend-8B4513?style=flat-square
Backend: https://img.shields.io/badge/Backend-vridhira--backend-24292f?style=flat-square
Org: https://img.shields.io/badge/Org-vridhira-8B4513?style=flat-square
```
Label changed: `Repo-` → `Frontend-` / `Backend-` (more descriptive)

---

### Change 10 — `4b32ba9` · 18:15 IST
**Type:** `docs(readme)` — feature
**Subject:** Redesign Author section with profile card + context table
**Branch:** `master` (merged from `docs/readme-license-improvements` via `b260b0a`)
**Diff:** `README.md` +49 / −16 lines · Section 14

**Why:** The Author section before this commit was a single bare paragraph: `"Built by Himanshu — an independent developer from India…"` with no visual structure, no avatar, and no badge links. This was the first proper Author section design.

**Context:** This commit (`4b32ba9`) is a duplicate of `140b678` on the `docs/readme-license-improvements` branch. Both share the same content — `4b32ba9` is the version that landed on `master` after the rebase-merge.

**Files changed:**
| File | +Lines | −Lines |
|---|---|---|
| `README.md` | 49 | 16 |

**What was built — Section 14 structure:**
```html
## 🙋 Author

<table>
  <tr>
    <td valign="top" width="120">
      <a href="https://github.com/Newbie-Himanshu">
        <img src="https://github.com/Newbie-Himanshu.png" width="96"
             style="border-radius:50%" alt="Himanshu" />
      </a>
    </td>
    <td valign="top">
      <h3>Himanshu</h3>
      <p>Independent developer building open commerce infrastructure
         for India's artisans and handcraft sellers.<br/>
         Vridhira is a solo project — no team, no VC backing,
         no SaaS subscriptions. Just code, craft, and conviction.
      </p>
      <p>
        [GitHub badge]
        [Frontend Repo badge]
        [Backend Repo badge]
        [Org badge]
      </p>
    </td>
  </tr>
</table>
```

**Context table added (4 rows):**
| Field | Value |
|---|---|
| What I build | Open e-commerce infrastructure for India's artisan economy |
| Stack | Next.js · MedusaJS v2 · Razorpay · Shiprocket · Algolia · TypeScript |
| Motivation | India has 7 crore+ artisans — this is their commerce infrastructure |
| License | Vridhira Attribution License v2.0 — free to use, attribution required |

**`[!NOTE]` callout added:**
```
> [!NOTE]
> If Vridhira is useful to you — star the repo, share it with other
> indie devs, or open a PR. Solo projects run on community energy.
```

**Superseded by:** `fd66f02` (vibecoder identity rewrite, 7 minutes later)

---

### Change 9 — `84225a1` · 18:14 IST
**Type:** `docs(license)` — fix
**Subject:** Reduce cure period from 14 days to 7 days
**Branch:** `master` (direct)
**Diff:** `LICENSE` index `bbc7a63..cd2f44c` · +2/−2 · `README.md` +1/−1

**Why:** The `6c1f5fb` v2.0 upgrade introduced a 14-day cure period. After reviewing it, the decision was made to tighten it to 7 days to make the license harder to game (a violator dragging out the cure window for 2 weeks while still profiting). The user manually edited `LICENSE` in their editor and changed one occurrence — `"14 (fourteen)"` → `"7(seven)"` — but missed the second occurrence in the same paragraph: `"within this 14-day window"`. This left the document self-contradictory.

**The inconsistency created by the manual edit:**
```
# After user's manual edit (broken state):
"you have 7(seven) calendar days... to bring yourself into full compliance.
 If you cure the violation within this 14-day window, your rights..."
                                         ^^^ still said 14
```

**Files changed:**
| File | +Lines | −Lines | Index |
|---|---|---|---|
| `LICENSE` | 2 | 2 | `bbc7a63 → cd2f44c` |
| `README.md` | 1 | 1 | |

**Exact diff — `LICENSE` (section: CURE PERIOD AND ONE-TIME REINSTATEMENT, ~line 126):**

```diff
-   If you become aware that you are in violation, you have 14 (fourteen)
+   If you become aware that you are in violation, you have 7 (seven)
    calendar days from the date you first knew, or reasonably should have
    known, of the violation to bring yourself into full compliance. If you
-   cure the violation within this 14-day window, your rights under this
+   cure the violation within this 7-day window, your rights under this
    License are reinstated. This reinstatement is available ONCE per
```

**Exact diff — `README.md` (License section callout, ~line 454):**

```diff
-> [!IMPORTANT]
-> **v2.0 introduces a one-time cure rule.** If you violate the license
-> and cure within 14 days, rights are reinstated — but **only once per
-> licensee**.
+> [!IMPORTANT]
+> **v2.0 introduces a one-time cure rule.** If you violate the license
+> and cure within 7 days, rights are reinstated — but **only once per
+> licensee**.
```

**Also updated in same session:** `AI_WORKFLOW.md` cure period references changed to 7 days (not tracked as separate commit — rolled into this one)

---

### Change 8 — `2739b56` · 18:11 IST
**Type:** `docs(readme)` — feature
**Subject:** Add 8 more contextual callout blocks (round 2)

**Files changed:**
| File | Insertions | Deletions |
|---|---|---|
| `README.md` | +24 | 0 |

**Callouts added (section → type → content):**
| Section | Type | Content |
|---|---|---|
| Features | `[!NOTE]` | Feature readiness matrix — which features are UI-complete vs backend-only pending |
| Payments | `[!WARNING]` | Razorpay webhook: always verify `razorpay_signature`, never trust payload alone |
| Payments | `[!IMPORTANT]` | Live Razorpay keys require HTTPS — localhost will silently fail |
| Environment Variables | `[!WARNING]` | Never use Algolia Admin API key in `NEXT_PUBLIC_` — use Search-Only key |
| Tech Stack | `[!WARNING]` | Yarn-only project — `npm install` breaks lockfile; recovery steps included |
| Related Repositories | `[!TIP]` | First-time setup order: seed backend first, India region must exist before storefront starts |
| Resources | `[!WARNING]` | MedusaJS v2 ≠ v1 — most online tutorials are for v1, which is wrong for this project |
| Acknowledgements | `[!NOTE]` | Custom modules (COD, Razorpay, Shiprocket, Wishlist, Algolia) are Vridhira-original work under Attribution License, not MedusaJS MIT |

---

### Change 7 — `07bbb13` · 18:08 IST
**Type:** `docs(readme)` — feature
**Subject:** Add 7 contextual callout blocks (round 1)

**Files changed:**
| File | Insertions | Deletions |
|---|---|---|
| `README.md` | +21 | 0 |

**Callouts added (section → type → content):**
| Section | Type | Content |
|---|---|---|
| Overview | `[!NOTE]` | Active development status — Algolia/Wishlist/OAuth backend-complete, UI pending |
| India-First Commerce | `[!WARNING]` | Razorpay live keys require business KYC — test keys work without it |
| Quickstart | `[!NOTE]` | `.env.template` is a reference file — never edit the original; copy to `.env.local` |
| Tech Stack | `[!IMPORTANT]` | `v0-boty` reference template is READ-ONLY — do not copy-paste shadcn components |
| Project Structure | `[!WARNING]` | `lib/data` is server-only — never import into `"use client"` components |
| Contributing | `[!NOTE]` | Conventional commits enforced — PRs with unclear messages will be returned |
| License | `[!IMPORTANT]` | v2.0 one-time cure — second violation is permanent termination, no second chance |

---

### Change 6 — `b260b0a` · 17:59 IST
**Type:** merge commit
**Subject:** Merge pull request #1 from `Newbie-Himanshu/docs/readme-license-improvements`
**Parents:** `d1fb386` (master HEAD) ← `6c1f5fb` (branch HEAD)
**PR:** [#1 — docs: upgrade to Vridhira Attribution License v2.0](https://github.com/Newbie-Himanshu/vridhira-frontend/pull/1)

**Why:** All license v2.0 work (`6c1f5fb`) and the README badge fixes (`d1fb386`) were done on the `docs/readme-license-improvements` feature branch. Until merged to `master`, the changes were invisible to anyone visiting the repo on GitHub (which shows `master` by default). A user noticing the Author section wasn't showing on GitHub prompted the merge.

**Merge complication — rebase required:**
The remote `master` had one ahead commit that was not present locally (a direct GitHub edit or separate push). `git push` was rejected with `"rejected — non-fast-forward"`. Resolution:
```bash
git pull --rebase origin master   # rebase local branch tip onto remote master
git push origin master             # now fast-forward, accepted
```

**Branch lifecycle:**
```
ed52e15  initial commit (master)
d617264  feat(branding) (master)
   ...
d1fb386  docs(readme): fix license header  ← master was HERE
6c1f5fb  docs(license): upgrade to v2.0    ← docs/readme-license-improvements
```
After merge:
```
b260b0a  Merge pull request #1             ← new master HEAD
```

**Files changed (net diff across merge):**
| File | +Lines | −Lines |
|---|---|---|
| `LICENSE` | 71 | 66 |
| `README.md` | 8 | 8 |

**Branch status after merge:** `docs/readme-license-improvements` branch still exists locally — not deleted. Remote branch was auto-deleted by GitHub after PR merge.

---

### Change 5 — `6c1f5fb` · 17:58 IST
**Type:** `docs(license)` — major rewrite
**Subject:** Upgrade to Vridhira Attribution License v2.0
**Branch:** `docs/readme-license-improvements`
**Diff:** `LICENSE` index `484d079..bbc7a63` · +71/−66 · `README.md` +4/−4

**Why:** A full audit of v1.0 identified 6 exploitable loopholes, 3 sections with no legal weight, and 2 missing clauses. v1.0 could be meaningfully circumvented by anyone who read it carefully. v2.0 closes all identified gaps.

**Files changed:**
| File | +Lines | −Lines | Index |
|---|---|---|---|
| `LICENSE` | 71 | 66 | `484d079 → bbc7a63` |
| `README.md` | 4 | 4 | (version references only) |

---

**LOOPHOLE 1 — Wrong source URL**

v1.0 (broken):
```
Source: https://github.com/vridhira/vridhira-frontend
```
v2.0 (fixed):
```
Source: https://github.com/Newbie-Himanshu/vridhira-frontend
```
The `vridhira/` GitHub org does not exist. Any fork that used this URL in their attribution was linking to a 404. The correct owner is `Newbie-Himanshu`.

---

**LOOPHOLE 2 — "Substantively equivalent" wiggle room**

v1.0:
```
...your project's README MUST contain a clearly visible attribution section
that includes ALL of the following, word-for-word or substantively equivalent:
```
v2.0:
```
...your project's primary documentation file MUST contain a clearly visible
attribution section that includes ALL of the following fields exactly as written:

    Based on Vridhira — E-Commerce for Indian Artisans
    Original author: Himanshu (https://github.com/Newbie-Himanshu)
    Source: https://github.com/Newbie-Himanshu/vridhira-frontend
    License: Vridhira Attribution License v2.0

All four fields are required. No field may be omitted, paraphrased, summarised,
or replaced with a vague reference such as "inspired by a GitHub project."
```
"Substantively equivalent" was removed entirely. Exact wording is now required.

---

**LOOPHOLE 3 — Condition 1 heading limited to public repos**

v1.0 section heading:
```
CONDITION 1 — PROJECT README ATTRIBUTION (Public Repositories)
```
v1.0 trigger text:
```
If you distribute, publish, or publicly host a project...
```

v2.0 section heading:
```
CONDITION 1 — PROJECT DOCUMENTATION ATTRIBUTION
```
v2.0 trigger text:
```
If you use, distribute, publish, host, or deploy this software or any
portion of it — whether the project is public or private, commercial or
non-commercial, storefront-based or headless/API-only...
```
Now covers: private repos, internal tools, headless storefronts, API-only backends.

---

**LOOPHOLE 4 — CSS obfuscation techniques not named**

v1.0 Condition 2(c):
```
(c) Credits must be LEGIBLE — font size no smaller than 10px, colour
    contrast ratio of at least 3:1 against the background, and not hidden
    by CSS (display:none, visibility:hidden, opacity:0, or equivalent).
```

v2.0 Condition 2(c) — each technique listed individually:
```
(c) Credits must be fully LEGIBLE at all times. The following are
    explicitly prohibited and each independently constitutes a violation:
      — font-size below 10px
      — colour contrast ratio below 3:1 against background
      — display: none
      — visibility: hidden
      — opacity below 0.3
      — position: absolute or fixed with off-screen coordinates
        (e.g. left: -9999px, top: -9999px)
      — z-index placing the element behind other elements
      — any other CSS, HTML, or JavaScript technique that renders
        the credit invisible or inaccessible to a standard user
```

---

**LOOPHOLE 5 — No jurisdiction clause**

v1.0 Section 4:
```
4. REPORTING VIOLATIONS
   To report a violation of this License, open an issue at:
     https://github.com/Newbie-Himanshu/vridhira-frontend/issues
   or contact the author directly via the GitHub profile above.
```
No governing law = ambiguous enforcement jurisdiction. Foreign users could argue Indian courts have no standing.

v2.0 Section 4 (entire section replaced):
```
4. GOVERNING LAW AND JURISDICTION
   This License shall be governed by and construed in accordance with the
   laws of India. Any dispute arising from or related to this License shall
   be subject to the exclusive jurisdiction of the courts of India. If you
   are located outside India, you consent to the jurisdiction of Indian
   courts for the purposes of enforcing this License.
```

---

**LOOPHOLE 6 — Unlimited cure periods**

v1.0:
```
2. CURE PERIOD
   If you become aware that you are in violation, you have 14 (fourteen)
   calendar days... If you cure the violation within this 14-day window,
   your rights under this License are reinstated. If you do not cure
   within 14 days, termination is permanent and no reinstatement is available.
```
A bad actor could violate repeatedly, each time "curing" just before 14 days to reset the clock.

v2.0:
```
2. CURE PERIOD AND ONE-TIME REINSTATEMENT
   If you become aware that you are in violation, you have 14 (fourteen)
   calendar days... your rights under this License are reinstated. This
   reinstatement is available ONCE per licensee. A second violation by the
   same licensee results in permanent and irrevocable termination with no
   cure period available.
```
*(Note: the 14-day period shown here is the v2.0 text before `84225a1` changed it to 7 days.)*

---

**Sections stripped from `LICENSE`:**

| Section removed | Why |
|---|---|
| `Reporting Violations` (old Section 4) | Legally weak — implied an obligation to report before taking action. Replaced with jurisdiction clause. |
| `PROJECT DETAILS` metadata block | No legal weight. Just metadata (owner, org, MedusaJS). Belongs in README, not LICENSE. |
| `non-sublicensable` grant restriction | Conflicted with MIT-licensed npm dependencies which may sublicense. Caused unnecessary legal uncertainty. |

**Grant clause change:**
```diff
-royalty-free, non-exclusive, non-sublicensable license to:
+royalty-free, non-exclusive license to:
```

**What changed in `README.md` (4 line swap):**
```diff
-[![License: Vridhira v1.0](...)]
+[![License: Vridhira v2.0](...)]
```
All badge URLs, alt text, and version references in the License section updated from `v1.0` → `v2.0`.

---

### Change 4 — `d1fb386` · 17:21 IST
**Type:** `docs(readme)` — fix
**Subject:** Fix license header, convert text links to badge images (no underlines)
**Branch:** `docs/readme-license-improvements`
**Diff:** `README.md` · +41/−41 (net-zero size change — pure reformatting)

**Why:** The `ddcf569` commit added the Vridhira Attribution License v1.0 and updated the README License section. However, inline hyperlinks in Markdown render as underlined text, which looks inconsistent with the badge-heavy header strip at the top of the README. Shields.io badges render as images — no underline, icon included, visually consistent with the existing status badges.

**Files changed:**
| File | +Lines | −Lines |
|---|---|---|
| `README.md` | 41 | 41 |

**What changed — header badge strip (repo link style):**

Before (text links):
```md
[View on GitHub](https://github.com/Newbie-Himanshu/vridhira-frontend) ·
[License v1.0](./LICENSE)
```

After (Shields.io badge images):
```md
[![GitHub](https://img.shields.io/badge/GitHub-vridhira--frontend-181717?style=flat-square&logo=github)](https://github.com/Newbie-Himanshu/vridhira-frontend)
[![License](https://img.shields.io/badge/License-Vridhira%20Attribution%20v1.0-8B4513?style=flat-square)](./LICENSE)
```

**What changed — License section heading:**

Before:
```md
## 📄 License
This project is licensed under the **MIT License**...
```

After:
```md
## 📄 License
This project is licensed under the **Vridhira Attribution License v1.0**.
```

**Badge style parameters used:** `style=flat-square`, brand color `#8B4513` (vridhira-primary) for the license badge, `181717` (GitHub dark) for the GitHub badge.

---

### Change 3 — `ddcf569` · 17:11 IST
**Type:** `docs(license)` — major
**Subject:** Replace MIT with Vridhira Attribution License v1.0
**Branch:** `docs/readme-license-improvements`
**Diff:** `LICENSE` +156/−9 · `README.md` +5/−6 · `package.json` +1/0

**Why:** The raw Medusa Next.js starter template shipped with a standard MIT License. Vridhira includes original modules not present in the template (COD with OTP, Razorpay integration, Shiprocket integration, Wishlist, Algolia search — all built from scratch in `vridhira-marketplace/src/`). MIT would allow anyone to fork, strip all credits, and deploy a competing store without any attribution. A custom license was needed that:
- Keeps the code open and freely forkable
- Requires attribution to remain visible in both the README and the deployed UI
- Is enforceable under Indian Copyright Act, 1957

**Files changed:**
| File | +Lines | −Lines | Notes |
|---|---|---|---|
| `LICENSE` | 156 | 9 | Replaced 9-line MIT with 156-line custom license |
| `README.md` | 5 | 6 | License section rewritten |
| `package.json` | 1 | 0 | `"license"` field added |

**`LICENSE` — before (MIT, 9 lines):**
```
MIT License

Copyright (c) [year] [author]

Permission is hereby granted, free of charge, to any person obtaining a copy...
[standard MIT boilerplate]
```

**`LICENSE` — after (Vridhira Attribution License v1.0, full structure):**
```
Vridhira Attribution License
Version 1.0 — March 2026

Copyright (c) 2026 Himanshu — Vridhira
All rights reserved.

GRANT OF LICENSE
  royalty-free, non-exclusive, non-sublicensable license to:
  (a) use, copy, run for personal or commercial purposes
  (b) modify and create derivative works
  (c) distribute copies
```

**Condition 1 — README Attribution (Public Repositories):**
```
If you distribute, publish, or publicly host a project that includes
this software... your project's README MUST contain:

    Based on Vridhira — E-Commerce for Indian Artisans
    Original author: Himanshu (https://github.com/Newbie-Himanshu)
    Source: https://github.com/vridhira/vridhira-frontend    ← (dead URL, fixed in v2.0)
    License: Vridhira Attribution License v1.0
```

**Condition 2 — Storefront UI Credits:**
```
If you deploy a live storefront... the storefront MUST display visible
credits to the original project at ALL times:
  (a) VridhiraCredits component (src/modules/layout/components/vridhira-credits/)
      must remain in footer on every page
  (b) Credits must link to: source repo + author profile
  (c) Credits must be LEGIBLE — no display:none, visibility:hidden, opacity:0
```

**Condition 3 — Non-Removal (Additive Only):**
```
You MAY add your own credits.
You MAY NOT remove, replace, hide, obscure, or comment-out any existing
attribution text or components.
```

**Condition 4 — Source File Copyright Headers:**
```
Every source file that contains a copyright block comment MUST retain
that block unmodified. You may add additional notices above — not alter
or delete existing ones.
```

**Termination:**
```
1. AUTOMATIC TERMINATION — any violation immediately terminates all rights
2. CURE PERIOD — 14 days to bring into compliance (later changed to 7 in 84225a1)
3. LEGAL ACTION — Indian Copyright Act 1957, injunctive relief, damages
4. REPORTING VIOLATIONS — open GitHub issue (stripped in v2.0)
```

**`package.json` change:**
```diff
+  "license": "Vridhira Attribution License v1.0",
```

**`README.md` License section change:**
Replaced MIT license description paragraph with Vridhira Attribution License v1.0 description and badge.

---

### Change 2 — `6981284` · 17:06 IST
**Type:** `docs` — enhancement
**Subject:** Enhance README with styled TOC, 11 callouts, keyword highlights
**Branch:** `master` (direct — README-only changes before branch was created)
**Diff:** `README.md` +166/−106

**Why:** `9451da8` was the first structural README redesign but still lacked developer-facing guidance — warnings about environment variables, platform gotchas, and workflow tips that save a first-time contributor hours of debugging.

**Files changed:**
| File | +Lines | −Lines |
|---|---|---|
| `README.md` | 166 | 106 |

**TOC redesign — before vs after:**

Before (`9451da8`): Plain Markdown list
```md
## Contents
- [Overview](#overview)
- [Features](#features)
```

After: `<details open>` collapsible 3-column table
```html
<details open>
<summary><strong>Table of Contents</strong></summary>

| # | Section | Description |
|---|---|---|
| 1 | Overview | What Vridhira is and what it does |
| 2 | Features | Full feature list with India-specific callouts |
...
</details>
```

**11 callout blocks added (full inventory):**

| # | Section | Type | Content |
|---|---|---|---|
| 1 | Overview | `[!IMPORTANT]` | Storefront requires running backend to function — points to `vridhira-marketplace` |
| 2 | India-First | `[!TIP]` | UPI accounts for 40%+ of Indian online payments — prioritise UPI flow in Razorpay |
| 3 | India-First | `[!TIP]` | COD unlocks Tier 2/3 city conversions that UPI alone misses |
| 4 | Quickstart | `[!TIP]` | Windows: use nvm-windows, run terminal as admin for global npm installs |
| 5 | Quickstart | `[!TIP]` | Always start backend (`vridhira-marketplace`) before storefront — storefront calls Medusa API on boot |
| 6 | Quickstart | `[!TIP]` | Run `yarn tsc --noEmit` before every commit — catches type errors before CI does |
| 7 | Payments | `[!NOTE]` | Razorpay test keys (`rzp_test_...`) allow all transactions without KYC. Production keys (`rzp_live_...`) require business verification |
| 8 | Payments | `[!NOTE]` | COD SMS OTP requires Twilio credentials in backend env — not set up by default |
| 9 | Payments | `[!TIP]` | Enable Razorpay EMI to unlock high-AOV orders (₹10,000+) — significant conversion uplift |
| 10 | Env Vars | `[!WARNING]` | Never commit `.env.local` to git — rotate any key that gets committed immediately |
| 11 | Env Vars | `[!TIP]` | Any variable prefixed `NEXT_PUBLIC_` is bundled into the client JS — visible in browser DevTools. Never put secrets in `NEXT_PUBLIC_` vars |
| 12 | Tech Stack | `[!TIP]` | MedusaJS v2 uses a fully modular architecture — each module (payments, inventory, etc.) is independently swappable |
| 13 | Project Structure | `[!TIP]` | Each Medusa module follows: `src/modules/<name>/service.ts` + `src/links/<name>.ts` + `src/api/` registration |
| 14 | Related Repos | `[!NOTE]` | Storefront connects to backend via REST API — any MedusaJS v2 backend (including vanilla) works with it |
| 15 | Resources | `[!TIP]` | Medusa Storefront Development Guide is the canonical reference for App Router + MedusaJS v2 patterns |
| 16 | Contributing | `[!IMPORTANT]` | Never commit secrets or API keys. If you accidentally do, rotate them immediately — git history is public |

**Keyword bolding (inline `**text**` wrapping added throughout):**
`**open-source**`, `**India-first**`, `**UPI**`, `**COD with OTP**`, `**self-hosted**`, `**sub-50ms**` (Algolia search latency callout)

**Acknowledgements section redesign:**

Before: Bullet list
```md
- MedusaJS — commerce engine
- Razorpay — payments
```

After: Table with Role + License columns
```md
| Project | Role | License |
|---|---|---|
| MedusaJS | Commerce engine + API | MIT |
| Razorpay | Payment gateway | Proprietary API |
| Shiprocket | Shipping & tracking | Proprietary API |
| Algolia | Search | MIT client / Proprietary SaaS |
| shadcn/ui | UI components (v0-boty only) | MIT |
```

---

### Change 1 — `370309d` · 16:49 IST
**Type:** `docs` — redesign
**Subject:** Deep-redesign README with unique India-first layout
**Branch:** `master` (direct)
**Diff:** `README.md` +268/−89 · Total README: ~357 lines after this commit

**Why:** `d617264`'s README rewrite produced a functional 9-section document but was generic — it looked like any other Medusa starter. This commit was the first opinionated redesign: India-first framing, feature grids, dedicated India payments section.

**Design references:** cal.com README, medusajs/medusa README, shadcn/ui README — all use centered hero + badge strips + feature grids.

**Files changed:**
| File | +Lines | −Lines |
|---|---|---|
| `README.md` | 268 | 89 |

**Section-by-section changes:**

**Hero block (top of file):**
```html
<!-- Before: plain h1 + paragraph -->
# Vridhira Storefront
A Next.js storefront for Indian artisans...

<!-- After: centered HTML hero -->
<div align="center">
  <h1>Vridhira — E-Commerce for Indian Artisans</h1>
  <em>Self-hosted · India-first · Open-source · Powered by MedusaJS v2</em>
  <br/><br/>
  [.·. nav links: Overview · Features · Quickstart · Payments · Stack]
  <br/><br/>
  [Row 1 badges: version · license · Next.js · MedusaJS]
  [Row 2 badges: Razorpay · Shiprocket · Algolia · TypeScript]
</div>
```

**Features section:**
```
Before: Markdown bullet list (8 items)

After: 2×3 HTML table with emoji icon cards
| 🛒 Cart & Checkout | 📦 COD with OTP | 💳 Razorpay UPI/Cards |
| 🔍 Algolia Search  | ❤️ Wishlist     | 🚚 Shiprocket Tracking |
Each cell: emoji + title + description paragraph
```

**India-First Commerce section (new — did not exist in `d617264`):**
```md
## 🇮🇳 Built for India
| Feature | Why it matters in India |
|---|---|
| COD with OTP | 60-70% of Indian e-commerce is COD |
| Razorpay UPI | 40%+ of online payments via UPI |
| Tier 2/3 reach | COD unlocks markets UPI alone can't |
| Hindi font | Tiro Devanagari Hindi — native language support |
```

**Quickstart section evolution:**
```
Before: numbered list with bare commands

After:
- Prerequisites table: Node.js 20+ / Yarn 1.22+ / MedusaJS backend running
- Numbered bold steps: 1. Clone  2. Install  3. Configure  4. Run
- Commands in code blocks with comments
- [!TIP] callout added
```

**Payments section (new dedicated section):**
```md
## 💸 Payments & Integrations
[!NOTE] callout about test vs live keys
| Provider | Mode | Setup |
|---|---|---|
| Razorpay | UPI / Cards / Netbanking / EMI | RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET |
| COD | Cash on Delivery with OTP | TWILIO credentials in backend |
```

**Tech Stack section evolution:**
```
Before: 2-column table (Tech | Version)

After: 3-column table (Tech | Version | Why)
| Next.js 15 | 15.x | App Router, server components, ISR |
| MedusaJS v2 | 2.x | Modular commerce engine, headless API |
| Razorpay | latest | UPI, cards, EMI — India-native payments |
| Algolia | latest | sub-50ms search, typo-tolerance, instant UI |
```

**Project Structure — expanded tree:**
```
Before: 5-line abbreviated tree

After: Full tree with role annotations in comments
src/
  app/          ← Next.js App Router pages
  modules/      ← Feature modules (cart, checkout, products...)
    layout/     ← Header, footer, nav
    checkout/   ← Checkout flow (Razorpay + COD)
    cart/       ← Cart drawer + context
  lib/          ← Utility functions, server-only data fetchers
  styles/       ← globals.css, Tailwind entry
  types/        ← TypeScript type definitions
```

**Author section:**
```
Before: bare paragraph

After: badge links (GitHub profile + repo) + <sub> MedusaJS acknowledgement
```

---

### Change 0 — `d617264` · 16:40 IST
**Type:** `feat(branding)` — initial brand application
**Subject:** Apply Vridhira brand identity, credits system & tsconfig fixes
**Branch:** `master` (direct — first real commit after initial)
**Parent:** `ed52e15` (initial commit — raw Medusa template, 2026-02-28)
**Diff:** 10 files · +441/−145 lines total

**Why:** `ed52e15` was a raw clone of the [medusajs/nextjs-starter](https://github.com/medusajs/nextjs-starter) template. Every file had Medusa's branding: `"name": "medusa-next"`, `author: Kasper Fabricius Kristensen`, Inter font, no brand colors, MIT license with Medusa copyright. This commit was the full brand takeover — establishing the Vridhira design system, replacing every Medusa reference, and fixing TypeScript configuration that was incompatible with modern Next.js 15 App Router.

**Files changed:**
| File | +Lines | −Lines | Category |
|---|---|---|---|
| `LICENSE` | 1 | 1 | Copyright line swap |
| `README.md` | 117 | 93 | Full rewrite |
| `next.config.js` | 17 | 0 | Credit header + image domains |
| `package.json` | 9 | 2 | Name / author / keywords |
| `src/app/layout.tsx` | 35 | 11 | Fonts + metadata |
| `src/modules/layout/components/vridhira-credits/index.tsx` | 168 | 0 | **New file** |
| `src/modules/layout/templates/footer/index.tsx` | 31 | 23 | Replace MedusaCTA |
| `src/styles/globals.css` | 17 | 0 | CSS vars + credit header |
| `tailwind.config.js` | 43 | 6 | Brand tokens + fonts |
| `tsconfig.json` | 7 | 5 | Target + moduleResolution fixes |

---

**`package.json` — exact diff:**
```diff
-  "name": "medusa-next",
-  "version": "1.0.3",
+  "name": "vridhira-storefront",
+  "version": "1.0.0",
   "private": true,
-  "author": "Kasper Fabricius Kristensen <kasper@medusajs.com> & Victor Gerbrands <victor@medusajs.com> (https://www.medusajs.com)",
-  "description": "Next.js Starter to be used with Medusa V2",
+  "author": "Himanshu — Vridhira <https://github.com/Newbie-Himanshu>",
+  "description": "Vridhira — E-Commerce Storefront for Indian Artisans",
   "keywords": [
+    "vridhira",
+    "e-commerce",
+    "indian-artisans",
     "medusa-storefront"
   ],
```

---

**`tailwind.config.js` — brand tokens (full token list):**
```js
// tailwind.config.js — Vridhira brand palette
vridhira: {
  primary:    "#8B4513",  // Saddle brown — earthy, warm, artisan
  secondary:  "#D4A574",  // Warm sand
  accent:     "#C9762B",  // Burnt sienna — CTA color
  background: "#FAF7F2",  // Warm off-white — never pure white
  surface:    "#F5EFE7",  // Slightly deeper warm surface
  text:       "#2C1810",  // Deep warm brown — primary text
  muted:      "#8D6E63",  // Muted brown-gray — secondary text
  border:     "#E8DDD4",  // Soft warm border
  // Status
  success:    "#4CAF50",
  warning:    "#FF9800",
  error:      "#F44336",
  // Indian accent pops (use sparingly)
  saffron:    "#FF6F00",  // Badges, highlights
  indigo:     "#3F51B5",  // Links, info states
  gold:       "#FFD700",  // Ratings, premium indicators
},
```

**`tailwind.config.js` — font family replacements:**
```diff
-  sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI",
-         "Roboto", "Helvetica Neue", "Ubuntu", "sans-serif"],
+  sans:  ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
+  serif: ["'Playfair Display'", "Georgia", "serif"],
+  hindi: ["'Tiro Devanagari Hindi'", "serif"],
```

---

**`src/app/layout.tsx` — font loading:**
```diff
+import { Plus_Jakarta_Sans, Playfair_Display, Tiro_Devanagari_Hindi } from "next/font/google"
+
+const plusJakartaSans = Plus_Jakarta_Sans({
+  subsets: ["latin"],
+  variable: "--font-sans",
+  display: "swap",
+})
+
+const playfairDisplay = Playfair_Display({
+  subsets: ["latin"],
+  variable: "--font-serif",
+  display: "swap",
+})
+
+const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
+  subsets: ["devanagari"],
+  variable: "--font-hindi",
+  weight: "400",
+  display: "swap",
+})
```

**`src/app/layout.tsx` — metadata:**
```diff
 export const metadata: Metadata = {
   metadataBase: new URL(getBaseURL()),
+  title: "Vridhira — E-Commerce for Indian Artisans",
+  description: "An open e-commerce platform built for India's artisans and handcraft sellers.",
+  authors: [{ name: "Himanshu", url: "https://github.com/Newbie-Himanshu" }],
 }
```

**`src/app/layout.tsx` — font CSS variables on `<html>`:**
```diff
-<html lang="en" data-mode="light">
+<html
+  lang="en"
+  data-mode="light"
+  className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${tiroDevanagariHindi.variable}`}
+>
```

---

**`tsconfig.json` — exact diff:**
```diff
-  "target": "es5",
+  "target": "es2017",

-  "moduleResolution": "node",
+  "moduleResolution": "bundler",

-  "baseUrl": "./src",
+  "allowImportingTsExtensions": true,

-  "@lib/*": ["lib/*"],
-  "@modules/*": ["modules/*"],
-  "@pages/*": ["pages/*"]
+  "@lib/*": ["./src/lib/*"],
+  "@modules/*": ["./src/modules/*"],
+  "@pages/*": ["./src/pages/*"]
```

**Why each tsconfig change:**
- `es5 → es2017`: Next.js 15 App Router uses async/await natively. `es5` was from the original Medusa starter and caused unnecessary transpilation overhead and polyfill bloat.
- `node → bundler`: `moduleResolution: bundler` is the correct setting for Next.js 15 + Turbopack. `node` resolution doesn't understand `exports` field in `package.json`, causing import errors with modern dual-CJS/ESM packages.
- `baseUrl` removed: `baseUrl: "./src"` was redundant because all path aliases (`@lib/*`, etc.) now include `./src/` in their target — having `baseUrl` set separately caused double-resolution bugs.
- `allowImportingTsExtensions`: Required for importing `.ts`/`.tsx` files with explicit extensions in some Next.js 15 module patterns.
- Path alias targets changed from relative-to-baseUrl to absolute-from-root to match the new (no-baseUrl) configuration.

---

**`src/modules/layout/components/vridhira-credits/index.tsx`** — new file (168 lines)

This was the core compliance component required by Condition 2 of the Vridhira Attribution License. Key structure:
```tsx
/**
 * ============================================================
 * VRIDHIRA — E-Commerce for Indian Artisans
 * @author      Himanshu
 * @copyright   2026 Himanshu — Vridhira. All rights reserved.
 * @license     Vridhira Attribution License v1.0
 * ============================================================
 * NOTICE: This component is part of the attribution requirement.
 * You may NOT remove, hide, or modify this credit block.
 * ============================================================
 */
export default function VridhiraCredits() {
  return (
    <div className="vridhira-credits">
      <a href="https://github.com/Newbie-Himanshu/vridhira-frontend">
        © Himanshu — Vridhira
      </a>
      <span>Built with MedusaJS</span>
    </div>
  )
}
```

**`src/modules/layout/templates/footer/index.tsx`:**
```diff
-import MedusaCTA from "@modules/layout/components/medusa-cta"
+import VridhiraCredits from "@modules/layout/components/vridhira-credits"

-<MedusaCTA />
+<VridhiraCredits />
```

---

**`@author` credit block format** (added to 5 files: tailwind.config.js, layout.tsx, footer/index.tsx, next.config.js, globals.css):
```js
/**
 * ============================================================
 * VRIDHIRA — E-Commerce for Indian Artisans
 * ============================================================
 * @author      Himanshu
 * @github      https://github.com/Newbie-Himanshu
 * @repo        https://github.com/Newbie-Himanshu/vridhira-frontend
 * @copyright   2026 Himanshu — Vridhira. All rights reserved.
 * @license     MIT
 * ------------------------------------------------------------
 * @lastModifiedBy  Himanshu
 * @modifiedWith    GitHub Copilot
 * @modifiedOn      2026-03-06
 * @changeNote      [description specific to file]
 * ============================================================
 */
```

---

## 2026-03-06 (Friday) — Phase 3: Component Migration (Session 2)

**Session scope:** First wave of UI component migration — Hero, Nav, Footer redesigns. Base CSS layer. Path alias fix.
**Status:** ⚠️ UNCOMMITTED — 6 modified files staged for review, `DEVLOG.md` untracked
**Branch:** `master` (direct — should be on a feature branch before committing)

---

### Pending Change 5 — `src/app/layout.tsx` · Unstaged
**Type:** `fix` — import path correction
**Diff:** index `978f5f5..7a495e3` · +1/−1 line

**Why:** `moduleResolution: bundler` (set in `d617264`) does not resolve bare specifiers like `"styles/globals.css"` from the project root. It requires either a configured path alias or a relative path. The fix uses a relative path `../styles/globals.css` from the `src/app/` directory. A path alias `"styles/*": ["./src/styles/*"]` was also added to `tsconfig.json` (Pending Change 0) to support the original import style going forward.

**Exact diff:**
```diff
-import "styles/globals.css"
+import "../styles/globals.css"
```

**File location:** `src/app/layout.tsx` — line 20 (after the `next/font/google` import)

---

### Pending Change 4 — `src/modules/home/components/hero/index.tsx` · Unstaged
**Type:** `feat(hero)` — major component replacement
**Diff:** index `ab55c1f..fab2880` · +128/−35 lines (net: 163 lines total)
**Tool used:** Antigravity (`@modifiedWith: Antigravity`)

**Why:** The original file was the raw Medusa starter placeholder:
```tsx
// Before — Medusa placeholder (35 lines)
import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading level="h1" className="text-3xl leading-10 text-ui-fg-base font-normal">
            Ecommerce Starter Template
          </Heading>
          <Heading level="h2" className="text-3xl leading-10 text-ui-fg-subtle font-normal">
            Powered by Medusa and Next.js
          </Heading>
        </span>
        <a href="https://github.com/medusajs/nextjs-starter-medusa" target="_blank">
          <Button variant="secondary">View on GitHub <Github /></Button>
        </a>
      </div>
    </div>
  )
}
```

This showed "Ecommerce Starter Template — Powered by Medusa and Next.js" on the homepage.

**New component structure (163 lines):**

```tsx
// After — Vridhira branded hero
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Inline SVG — no @medusajs/icons dependency
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" ...>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
)

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 40%, #EDE0D0 70%, #E8D4BC 100%)" }}
    >
      {/* Decorative circles (earthy depth) */}
      {/* Big decorative serif 'Artisan' text (background, opacity 0.06) */}
      {/* Main content — headline + CTA + trust badges */}
      {/* Scroll indicator (animated pulse line) */}
    </section>
  )
}
```

**Section breakdown:**

| Element | Implementation |
|---|---|
| Background | `linear-gradient(135deg, #FAF7F2 → #E8D4BC)` — earthy warm gradient |
| Decorative circle 1 | `position: absolute, top-right, radial-gradient #C9762B (accent), opacity 0.30` |
| Decorative circle 2 | `position: absolute, bottom-left, radial-gradient #8B4513 (primary), opacity 0.20` |
| Background word | `"Artisan"` in serif, `clamp(120px, 18vw, 300px)`, `rgba(139,69,19,0.06)` — decorative, `aria-hidden` |
| Eyebrow label | `🇮🇳 India's Artisan Marketplace` — `text-xs tracking-[0.25em] uppercase text-vridhira-accent` |
| `<h1>` headline | Font-serif, `text-5xl sm:text-6xl lg:text-7xl`, splits across 4 lines: `Handcrafted` / `with soul.` (vridhira-primary) / `Delivered to` / `your door.` |
| Sub-tagline | `text-base sm:text-lg text-vridhira-muted`, max-w-md |
| CTA primary | `LocalizedClientLink href="/store"` — rounded-full, `bg: #8B4513`, `color: #FAF7F2`, `data-testid="hero-shop-button"`, `ArrowRightIcon` with hover translate-x-1 |
| CTA secondary | `LocalizedClientLink href="/collections"` — rounded-full, `border-2 border-vridhira-primary`, ghost style |
| Trust badges | 3 inline badges: `✦ Free shipping above ₹999` / `✦ Razorpay & UPI accepted` / `✦ 100% authentic handcrafted` |
| Scroll indicator | `position: absolute bottom-8`, animated pulse line — `w-px h-12 bg-vridhira-border`, `div.h-1/2 bg-vridhira-primary animate-pulse` |

**Imports removed:** `Github`, `Button`, `Heading` from `@medusajs/icons` and `@medusajs/ui`
**Imports added:** `LocalizedClientLink` from `@modules/common/components/localized-client-link`

**Accessibility:**
- `<section aria-label="Vridhira — Homepage hero">`
- Decorative elements: `aria-hidden="true"`
- CTA buttons: `data-testid` attributes preserved
- `ArrowRightIcon`: `aria-hidden="true"` on SVG

---

### Pending Change 3 — `src/modules/layout/templates/footer/index.tsx` · Unstaged
**Type:** `feat(footer)` — major redesign
**Diff:** index `11e3a0f..793f8b0` · +162/−122 lines
**Tool used:** Antigravity

**Why:** The previous footer was a Medusa-styled 3-column grid with `text-ui-fg-subtle` tokens, `txt-small` class names, and a dead GitHub link (`https://github.com/vridhira/vridhira-frontend` — the dead org URL). The redesign applies Vridhira brand tokens throughout and adds a 4-column layout with a giant serif watermark background.

**Before structure:**
```tsx
// Before (Medusa-styled)
<footer className="border-t border-ui-border-base w-full">
  <div className="content-container flex flex-col w-full">
    <div className="flex flex-col gap-y-6 xsmall:flex-row ... py-40">
      <div>  {/* Brand: "Vridhira" text link */} </div>
      <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
        {/* Categories column  */}
        {/* Collections column */}
        {/* "Vridhira" column  — contains GitHub link to dead vridhira/ org */}
      </div>
    </div>
    <div className="flex flex-col w-full mb-16">
      <VridhiraCredits />
    </div>
  </div>
</footer>
```

**After structure:**
```tsx
// After (Vridhira-branded)
<footer style={{ background: "#F5EFE7" }} className="w-full pt-20 pb-10 relative overflow-hidden">

  {/* Giant serif watermark "Vridhira" — color rgba(139,69,19,0.07), z-index 0 */}
  <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 ...">
    <span className="font-serif font-bold text-[380px] ..."
          style={{ color: "rgba(139, 69, 19, 0.07)" }}>
      Vridhira
    </span>
  </div>

  <div className="content-container relative z-10">

    {/* 4-column grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

      {/* Col 1 — Brand */}
      <div className="col-span-2 md:col-span-1">
        <h2 className="font-serif text-3xl text-vridhira-primary">Vridhira</h2>
        <p className="text-sm text-vridhira-muted">Open e-commerce for India's artisans...</p>
        <a href="https://github.com/Newbie-Himanshu">@Newbie-Himanshu</a>  {/* Fixed from dead vridhira/ org */}
      </div>

      {/* Col 2 — Categories (dynamic from listCategories()) */}
      {/* Col 3 — Collections (dynamic from listCollections()) */}

      {/* Col 4 — Support (new — didn't exist before) */}
      <div>
        <h3>Support</h3>
        <ul>
          <li>My Account → /account</li>
          <li>Cart → /cart</li>
          <li>Report an Issue → GitHub Issues</li>
        </ul>
      </div>
    </div>

    {/* VridhiraCredits — moved inside border-t divider */}
    <div className="border-t border-vridhira-border pt-8 mb-6">
      <VridhiraCredits />
    </div>

    {/* Copyright bar (new) */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
      <p className="text-xs text-vridhira-muted">© {new Date().getFullYear()} Himanshu — Vridhira.</p>
      <div className="flex gap-5">
        <LocalizedClientLink href="/">Privacy Policy</LocalizedClientLink>
        <LocalizedClientLink href="/">Terms of Service</LocalizedClientLink>
      </div>
    </div>
  </div>
</footer>
```

**Key changes vs before:**
| Change | Before | After |
|---|---|---|
| Background | `border-t border-ui-border-base` (white) | `background: #F5EFE7` (warm surface) |
| Layout | 2-row: brand + 3-col grid | 4-column grid + credits + copyright bar |
| Brand col | Text link `"Vridhira"` | `font-serif text-3xl` h2 + tagline + GitHub link |
| GitHub link | `github.com/vridhira/vridhira-frontend` (dead) | `github.com/Newbie-Himanshu` (correct) |
| Categories link style | `text-ui-fg-subtle txt-small hover:text-ui-fg-base` | `text-sm text-vridhira-muted hover:text-vridhira-primary` |
| Support column | None | `/account`, `/cart`, GitHub Issues |
| VridhiraCredits position | `mb-16` standalone div | Inside `border-t border-vridhira-border` |
| Copyright bar | None | Dynamic year + Privacy + Terms links |
| Watermark | None | Giant serif "Vridhira" at `opacity 0.07`, `z-index: 0` |

**@author header updates:**
```diff
-* @copyright   2026 Himanshu — Vridhira. All rights reserved.
-* @license     MIT
+* @copyright   2026 Himanshu. All rights reserved.
+* @license     SEE LICENSE IN LICENSE
-* @modifiedWith    GitHub Copilot
+* @modifiedWith    Antigravity
-* @changeNote      Replaced Medusa branding with Vridhira; added VridhiraCredits
+* @changeNote      Migrated to Vridhira brand identity — warm surface, giant serif watermark, 4-column grid, fixed GitHub link
```

---

### Pending Change 2 — `src/modules/layout/templates/nav/index.tsx` · Unstaged
**Type:** `feat(nav)` — major redesign
**Diff:** index `bedfeeb..9f57e83` · +88/−39 lines
**Tool used:** Antigravity

**Why:** The original nav was `position: sticky` with a `bg-white border-b` style, showing "Medusa Store" as the logo and a text "Account" link. Replaced with a floating glassmorphism pill nav that matches the earthy Vridhira brand.

**Before structure:**
```tsx
// Before (Medusa-styled, sticky)
<div className="sticky top-0 inset-x-0 z-50 group">
  <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
    <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full">

      {/* Left: SideMenu */}
      <div className="flex-1 basis-0 h-full flex items-center">
        <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
      </div>

      {/* Center: "Medusa Store" text link — data-testid="nav-store-link" */}
      <div className="flex items-center h-full">
        <LocalizedClientLink href="/" className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase" data-testid="nav-store-link">
          Medusa Store
        </LocalizedClientLink>
      </div>

      {/* Right: Account text link + Cart */}
      <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
        <div className="hidden small:flex items-center gap-x-6 h-full">
          <LocalizedClientLink href="/account" data-testid="nav-account-link">Account</LocalizedClientLink>
        </div>
        <Suspense ...><CartButton /></Suspense>
      </div>
    </nav>
  </header>
</div>
```

**After structure:**
```tsx
// After (Vridhira glassmorphism floating pill, fixed)
<div className="fixed top-0 inset-x-0 z-50 px-4 pt-3">
  <header
    className="max-w-7xl mx-auto rounded-xl border border-white/30 px-4 lg:px-8"
    style={{
      background: "rgba(250, 247, 242, 0.72)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(139, 69, 19, 0.12), 0 2px 8px rgba(44, 24, 16, 0.06)",
    }}
  >
    <nav className="flex items-center justify-between h-[64px]" aria-label="Main navigation">

      {/* Left: Mobile SideMenu + Desktop nav links (Shop / Collections / Categories) */}
      <div className="flex items-center gap-6 flex-1">
        <div className="lg:hidden"><SideMenu .../></div>
        <div className="hidden lg:flex items-center gap-7">
          <LocalizedClientLink href="/store">Shop</LocalizedClientLink>
          <LocalizedClientLink href="/collections">Collections</LocalizedClientLink>
          <LocalizedClientLink href="/categories">Categories</LocalizedClientLink>
        </div>
      </div>

      {/* Center: "Vridhira" serif logo (absolute positioned) */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <LocalizedClientLink href="/" aria-label="Vridhira — Home">
          <span className="font-serif text-2xl tracking-widest text-vridhira-primary">Vridhira</span>
        </LocalizedClientLink>
      </div>

      {/* Right: Search (disabled — Algolia Phase 5) + Account icon + Cart */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        <button disabled title="Search coming soon" aria-label="Search products"><SearchIcon /></button>
        <LocalizedClientLink href="/account" aria-label="My account"><AccountIcon /></LocalizedClientLink>
        <Suspense ...><CartButton /></Suspense>
      </div>
    </nav>
  </header>
</div>
```

**Key changes vs before:**
| Property | Before | After |
|---|---|---|
| Position | `sticky top-0` | `fixed top-0 px-4 pt-3` (floating above page) |
| Shape | Full-width bar with `border-b` | `rounded-xl`, `max-w-7xl`, border `border-white/30` |
| Background | `bg-white` (solid) | `rgba(250,247,242,0.72)` + `backdrop-filter: blur(16px)` (glassmorphism) |
| Logo | `"Medusa Store"` uppercase text link | `"Vridhira"` serif `text-2xl tracking-widest text-vridhira-primary`, centered absolute |
| Logo link `data-testid` | `data-testid="nav-store-link"` on logo | Moved `data-testid="nav-store-link"` to Shop link (functionally correct) |
| Nav links | None (desktop had no nav links) | Shop / Collections / Categories (hidden on mobile, `lg:flex`) |
| Account | Text `"Account"`, `hidden small:flex` | `AccountIcon` SVG, `hidden sm:flex`, `aria-label="My account"` |
| Search | None | `SearchIcon` SVG button, `disabled`, `title="Search coming soon"` (Algolia Phase 5 placeholder) |
| Shadow | None | `0 8px 32px rgba(139,69,19,0.12)` — warm brown shadow |

**Inline SVGs added (no `@medusajs/icons` dependency):**
```tsx
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" ...>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" ...>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)
```

---

### Pending Change 1 — `src/styles/globals.css` · Unstaged
**Type:** `feat(styles)` — base layer + header update
**Diff:** index `8c89688..f14ea12` · +10/−4 lines

**Why:** The Tailwind brand tokens (`vridhira-background: #FAF7F2`, `vridhira-text: #2C1810`) defined in `tailwind.config.js` were not being applied as defaults. Without a `@layer base` block, every component had to explicitly set `bg-vridhira-background text-vridhira-text` which is repetitive and error-prone. This addition sets them as the page-level defaults.

**Exact diff:**
```diff
+@layer base {
+  body {
+    background-color: #FAF7F2; /* vridhira-background */
+    color: #2C1810;            /* vridhira-text */
+    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
+    min-height: 100dvh;
+  }
+}
```

Position: inserted between `@import "tailwindcss/utilities"` and the existing `@layer utilities` block.

**Why `100dvh` instead of `100vh`:** On mobile browsers, `100vh` is calculated including the browser chrome (address bar), causing layout shifts when the bar shows/hides. `100dvh` (dynamic viewport height) adjusts in real time — supported in all modern browsers including Chrome 108+ and Safari 15.4+.

**@author header updates (same pattern as footer):**
```diff
-* @copyright   2026 Himanshu — Vridhira. All rights reserved.
-* @license     MIT
-* @modifiedWith    GitHub Copilot
-* @changeNote      Added Vridhira credit block
+* @copyright   2026 Himanshu. All rights reserved.
+* @license     SEE LICENSE IN LICENSE
+* @modifiedWith    Antigravity
+* @changeNote      Added Vridhira base CSS layer — warm body background (#FAF7F2), default font and text color
```

---

### Pending Change 0 — `tsconfig.json` · Unstaged
**Type:** `fix(tsconfig)` — path alias addition
**Diff:** index `cff3f70..5c14672` · +1/−0 lines

**Why:** `Pending Change 5` (`layout.tsx`) switched from `import "styles/globals.css"` to `import "../styles/globals.css"` as a temporary fix. This `tsconfig.json` change adds the proper path alias so either style works and is consistent with the other `@lib/*`, `@modules/*` aliases already defined.

**Exact diff:**
```diff
     "paths": {
       "@lib/*": ["./src/lib/*"],
       "@modules/*": ["./src/modules/*"],
-      "@pages/*": ["./src/pages/*"]
+      "@pages/*": ["./src/pages/*"],
+      "styles/*": ["./src/styles/*"]
     },
```

**After this alias, `import "styles/globals.css"` will correctly resolve to `./src/styles/globals.css`.** The `layout.tsx` relative path (`../styles/globals.css`) could optionally be reverted to `styles/globals.css` once this is committed and TypeScript picks up the new alias.

---

### Pending DEVLOG.md — Untracked
**Status:** New file, not yet added to git index.
**Contents:** This file — 960+ lines of change history for the entire project.

---

### Recommended commit order for Phase 3 changes

```bash
# On a feature branch (recommended)
git checkout -b feat/phase3-component-migration

# Commit 1 — infrastructure
git add tsconfig.json src/app/layout.tsx src/styles/globals.css
git commit -m "fix(config): add styles/* path alias, relative CSS import, base layer brand defaults"

# Commit 2 — hero
git add src/modules/home/components/hero/index.tsx
git commit -m "feat(hero): replace Medusa placeholder with Vridhira branded full-screen hero"

# Commit 3 — nav
git add src/modules/layout/templates/nav/index.tsx
git commit -m "feat(nav): replace Medusa nav with glassmorphism floating pill + Vridhira branding"

# Commit 4 — footer
git add src/modules/layout/templates/footer/index.tsx
git commit -m "feat(footer): redesign with 4-column grid, serif watermark, copyright bar"

# Commit 5 — devlog
git add DEVLOG.md
git commit -m "docs(devlog): add Phase 3 component migration change log"
```

---

## Log Format Reference

Each entry uses this structure:
```
### Change N — `<hash>` · HH:MM IST
**Type:** conventional-commit(scope) — category
**Subject:** commit subject line

**Why:** reason this change was needed

**Files changed:** table of files + line counts

**What changed:** specific code details, line references, before/after values
```

**Categories:** `feature` / `fix` / `major` / `redesign` / `enhancement` / `merge`

---

*Log maintained by: GitHub Copilot + Himanshu*
*Repo: [Newbie-Himanshu/vridhira-frontend](https://github.com/Newbie-Himanshu/vridhira-frontend)*
