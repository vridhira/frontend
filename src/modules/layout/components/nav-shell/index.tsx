"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ")

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const AccountIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14" height="14"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

type SearchProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: Array<{
    calculated_price?: {
      calculated_amount?: number
      currency_code?: string
    }
  }>
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

// The scroll range (px) over which the morph from bar → pill completes.
// At scrollY=0: full-width bar. At scrollY=SCROLL_RANGE: full pill.
const SCROLL_RANGE = 120

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ease-in-out-quint — smooth acceleration + deceleration matching the scroll feel
function ease(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

// ─── WCAG background luminance helper ────────────────────────────────────────
// Returns true when the RGB colour (0-255 range) is perceptually "dark",
// meaning white text will have better contrast than black text.
// Uses the WCAG 2.1 relative-luminance formula with a threshold of 0.35.
function isColorDark(r: number, g: number, b: number): boolean {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) < 0.35
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  /** Slot: SideMenu (mobile hamburger) */
  sideMenu: React.ReactNode
  /** Slot: CartButton wrapped in Suspense */
  cartButton: React.ReactNode
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NavShell({ sideMenu, cartButton }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const rafRef        = useRef<number>(0)
  const floatRef      = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const trailRef      = useRef<{ x: number; y: number; t: number }[]>([])
  const rafTrailRef   = useRef<number>(0)
  const lastTrailPt   = useRef<{ x: number; y: number } | null>(null)
  const rippleIdRef   = useRef(0)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

  // Adaptive foreground colour — true when the section beneath the pill is dark
  const [isDark, setIsDark] = useState(false)
  // Ref to the outermost fixed wrapper so we can exclude our own elements from
  // elementsFromPoint() hits during luminance sampling.
  const outerRef = useRef<HTMLDivElement>(null)

  // ─── Search state ────────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // ── Automatic background luminance detector ─────────────────────────────
    // Samples the pixel column at the horizontal centre of the navbar (y=44,
    // the vertical midpoint of the 88px bar) using document.elementsFromPoint.
    // Works across EVERY page — no section annotations required.
    //
    // Walk order: topmost rendered element first.
    // Skip: our own glass / content layers (identified via outerRef.contains).
    // Parse: solid backgroundColor first, then first colour-stop of a gradient
    //        backgroundImage (covers sections that use linear-gradient).
    // Decide: WCAG luminance < 0.35 → dark bg → use light text.
    function detectIsDark() {
      const x = window.innerWidth / 2
      const y = 44 // vertical centre of 88px navbar
      for (const el of document.elementsFromPoint(x, y)) {
        // Exclude our own navbar DOM nodes
        if (outerRef.current?.contains(el)) continue
        const s = window.getComputedStyle(el as HTMLElement)

        // 1. Solid background-color
        let m = s.backgroundColor.match(
          /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
        )
        if (m && (m[4] === undefined ? 1 : +m[4]) >= 0.05) {
          setIsDark(isColorDark(+m[1], +m[2], +m[3]))
          return
        }

        // 2. Gradient background-image — extract first colour stop
        const bi = s.backgroundImage
        if (bi && bi !== 'none') {
          m = bi.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
          if (m && (m[4] === undefined ? 1 : +m[4]) >= 0.05) {
            setIsDark(isColorDark(+m[1], +m[2], +m[3]))
            return
          }
        }
      }
      setIsDark(false) // nothing found — assume light
    }

    detectIsDark() // run once on mount for correct initial state

    // Use requestAnimationFrame to batch scroll updates at display refresh rate.
    // This ensures the nav is always in sync with the finger/wheel — never ahead,
    // never behind. cancelAnimationFrame prevents queued stale frames.
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        detectIsDark()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ─── Search: open → focus input ─────────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [isSearchOpen])

  // ─── Search: click-outside to close ──────────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isSearchOpen])

  // ─── Search: Escape to close ──────────────────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isSearchOpen])

  // ─── Search: close on route change ───────────────────────────────────────
  useEffect(() => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }, [pathname])

  // ─── Search: debounced product fetch ─────────────────────────────────────
  const fetchProducts = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim() || q.trim().length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const { getClientBackendUrl } = await import("@lib/util/get-client-backend-url")
        const baseUrl = getClientBackendUrl()
        const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        const res = await fetch(
          `${baseUrl}/store/products?q=${encodeURIComponent(q.trim())}&limit=5&fields=id,title,handle,thumbnail,*variants.calculated_price`,
          {
            headers: {
              "x-publishable-api-key": pubKey,
              "Content-Type": "application/json",
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setSearchResults((data.products || []).slice(0, 5))
        }
      } catch {
        // silent fail – suggestions are enhancement-only
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    fetchProducts(val)
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchQuery.trim()) return
    // Navigate to the localised /store page with the search query
    const segments = pathname.split("/").filter(Boolean)
    const countryCode = segments[0] || "in"
    router.push(`/${countryCode}/store?q=${encodeURIComponent(searchQuery.trim())}`)
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  // rawP: 0 at top, 1 when fully scrolled (capped at SCROLL_RANGE)
  // p:    eased version — slow start, fast middle, slow end
  const rawP = clamp(scrollY / SCROLL_RANGE, 0, 1)
  const p    = ease(rawP)

  // Adaptive colour — mix-blend-mode: difference on the content wrapper.
  // All elements are white; difference blending inverts per-pixel:
  //   white on light bg  →  appears dark (near black)   ✓ readable
  //   white on dark bg   →  appears light (near white)  ✓ readable
  // Zero JS needed — the browser GPU handles it for every scroll position.

  // ─── Scroll-driven clip-path ─────────────────────────────────────────────
  // clip-path: inset(top side bottom side round radius)
  //
  // p=0 → inset(0px 0% 0px 0% round 0px)      — full-width flat bar
  // p=1 → inset(16px 10% 14px 10% round 9999px) — floating pill, 80% wide
  const clipTop    = lerp(0,    16,   p)
  const clipSide   = lerp(0,    10,   p)   // %
  const clipBottom = lerp(0,    14,   p)
  const clipRadius = lerp(0,    9999, p)
  const pillClip   = `inset(${clipTop.toFixed(1)}px ${clipSide.toFixed(2)}% ${clipBottom.toFixed(1)}px ${clipSide.toFixed(2)}% round ${clipRadius.toFixed(0)}px)`

  // ─── Background opacity & blur ───────────────────────────────────────────
  // Pill: nearly-invisible tint (0.10) — glass lives in the blur, not the fill
  // Bar : always starts transparent (0 → 0.04) across all pages — no white patch
  const bgAlpha    = lerp(0, 0.04, p)
  const blurAmount = lerp(0, 48, p)

  // Drop shadow intensity grows with scroll
  const shadowBlur    = lerp(0, 32, p)
  const shadowSpreadY = lerp(0, 12, p)

  // ─── Canvas dot-ring trail ─────────────────────────────────────────────────
  // Drawn on a canvas element (mix-blend-mode:screen) so the whole trail
  // renders without any React re-renders.  Each trail point spawns three
  // concentric dot-rings (referencing the halftone radial pattern):
  //   center dot + inner ring (r=7, 6 dots) + mid ring (r=13, 9 dots) + outer ring (r=20, 12 dots)
  // All rings scale & fade together as the point ages.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const LIFETIME = 700   // ms each trail point lives
    const RINGS = [
      { orbitR: 0,  count: 1,  dotR: 2.5 },   // center dot
      { orbitR: 7,  count: 6,  dotR: 2.0 },   // inner ring
      { orbitR: 13, count: 9,  dotR: 1.5 },   // mid ring
      { orbitR: 20, count: 12, dotR: 1.0 },   // outer ring
    ]

    const draw = () => {
      const now = Date.now()
      // Sync canvas pixel size to its rendered CSS size each frame
      if (canvas.width !== canvas.offsetWidth) canvas.width = canvas.offsetWidth

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Prune expired points
      trailRef.current = trailRef.current.filter(pt => now - pt.t < LIFETIME)

      for (const pt of trailRef.current) {
        const age  = (now - pt.t) / LIFETIME        // 0 → 1
        const inv  = 1 - age
        const alpha = Math.pow(inv, 1.4) * 0.92     // fast-in, slow tail

        for (const ring of RINGS) {
          const n = ring.count
          for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2
            const ox = Math.cos(angle) * ring.orbitR * inv
            const oy = Math.sin(angle) * ring.orbitR * inv
            const r  = Math.max(0.4, ring.dotR * inv)

            ctx.beginPath()
            ctx.arc(pt.x + ox, pt.y + oy, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
            ctx.fill()
          }
        }
      }

      rafTrailRef.current = requestAnimationFrame(draw)
    }

    rafTrailRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafTrailRef.current)
  }, [])

  // ─── Ripple handler ──────────────────────────────────────────────────────
  // Reads floatRef.getBoundingClientRect() so coords account for the float
  // CSS transform — the ripple always appears at the exact pointer position.
  const handleRipple = (e: React.MouseEvent) => {
    if (p < 0.45) return
    const rect = floatRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Spawn 3 independent ring elements per click with staggered delays.
    // Each is a separate DOM node so transforms are fully independent — no
    // pseudo-element inheritance issue. Delays: 0 / 130 / 260 ms.
    const base = (++rippleIdRef.current) * 10
    setRipples(prev => [
      ...prev,
      { id: base,     x, y, delay: 0   },
      { id: base + 1, x, y, delay: 130 },
      { id: base + 2, x, y, delay: 260 },
    ])
    // Remove all three after the longest ring finishes (260 + 1200ms)
    setTimeout(() => setRipples(prev => prev.filter(r => r.id < base || r.id > base + 2)), 1600)
  }

  // ─── Mouse-trail handler (feeds the canvas dot-ring trail) ──────────────
  // Only pushes a new point when the cursor has moved ≥10px from the last
  // one, keeping the trail density natural across fast and slow movements.
  const handleMouseMove = (e: React.MouseEvent) => {
    if (p < 0.45 || !floatRef.current) return
    const rect = floatRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const last = lastTrailPt.current
    if (last && Math.hypot(x - last.x, y - last.y) < 10) return
    lastTrailPt.current = { x, y }
    trailRef.current.push({ x, y, t: Date.now() })
    if (trailRef.current.length > 32) trailRef.current.shift()
  }
  const handleMouseLeave = () => {
    trailRef.current = []
    lastTrailPt.current = null
  }

  return (
    <>
      <style>{`
        /* ── Adaptive content layer ──────────────────────────────────
           Foreground colour is driven by the isDark state which is
           sampled from the page section beneath the pill on every
           scroll frame using WCAG luminance detection (elementsFromPoint
           + getComputedStyle). The transition delivers a smooth 300 ms
           cross-fade between dark-brown and warm-white as the user
           scrolls over light ↔ dark sections.                        */
        .nvsh-content {
          transition: color 300ms ease;
        }
        /* Stacking context for the glass pill layers. */
        .nvsh-glass-isolate {
          isolation: isolate;
        }

        /* ── Nav link: colour transition only, no box ──────────────── */
        .nvsh-link {
          position: relative;
          transition: opacity 200ms ease;
        }

        /* ── Liquid glass: icon button hover ───────────────────────── */
        .nvsh-icon {
          position: relative;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: color 700ms ease,
                      transform 220ms cubic-bezier(0.34,1.56,0.64,1),
                      background-color 250ms ease,
                      backdrop-filter 250ms ease, -webkit-backdrop-filter 250ms ease,
                      border-color 250ms ease, box-shadow 250ms ease;
        }
        .nvsh-icon:hover {
          background: rgba(255,255,255,0.20);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          backdrop-filter: blur(14px) saturate(160%);
          border-color: rgba(255,255,255,0.32);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.62),
                      inset 0 -1px 0 rgba(0,0,0,0.05),
                      0 4px 12px rgba(0,0,0,0.08);
          transform: scale(1.1);
        }
        .nvsh-icon:active {
          transform: scale(0.92);
          transition-duration: 100ms;
        }

        /* ── Logo hover ─────────────────────────────────────────────── */
        .nvsh-logo {
          display: inline-block;
          transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), color 700ms ease;
        }
        .nvsh-logo:hover { transform: scale(1.06); }

        /* ── Continuous pill float ───────────────────────────────────── */
        @keyframes nvsh-float {
          0%, 100% { transform: translateY( 0px); }
          30%       { transform: translateY(-5px); }
          70%       { transform: translateY( 2px); }
        }

        /* ── Water ripple — three independent ring elements per click ─── */
        /* Each .nvsh-ripple is one ring. JS spawns 3 per click (delay via  */
        /* inline style), so each expands independently from the same point. */
        @keyframes nvsh-ripple-ring {
          0%   { transform: translate(-50%, -50%) scale(0);    opacity: 1;    }
          20%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0;    }
        }
        .nvsh-ripple {
          position: absolute;
          /* 180px diameter — tight rings that travel clearly across the pill */
          width: 180px;
          height: 180px;
          border-radius: 50%;
          pointer-events: none;
          /* Thicker border + hard outer stroke = clearly visible ring      */
          border: 5px solid rgba(255,255,255,1);
          box-shadow:
            0 0 0 2px  rgba(255,255,255,0.70),
            0 0 18px   rgba(255,255,255,0.90),
            0 0 36px   rgba(255,255,255,0.55),
            0 0 54px   rgba(255,255,255,0.25),
            inset 0 0 18px rgba(255,255,255,0.40);
          mix-blend-mode: screen;
          animation: nvsh-ripple-ring 950ms cubic-bezier(0.2, 0.8, 0.4, 1) both;
        }

        /* ── Search result row hover ─────────────────────────────────── */
        .search-result-row {
          transition: background 150ms ease;
        }
        .search-result-row:hover {
          background: rgba(201,118,43,0.06);
        }
      `}</style>

      <div ref={outerRef} className="fixed top-0 left-0 w-full z-50 pointer-events-none" style={{ height: 88 }}>

        {/* ══════════════════════════════════════════════════════════════
             FLOAT WRAPPER — all layers (bg + content) move together.
             CSS animation runs only when pill is fully formed (rawP≥0.98).
             floatRef exposes the post-transform bounding rect so ripple
             hit coords are always visually accurate.                  */}
        <div
          ref={floatRef}
          style={{
            position: "absolute",
            inset: 0,
            animation: "nvsh-float 5s ease-in-out infinite",
            animationPlayState: rawP >= 0.98 ? "running" : "paused",
          }}
        >

          {/* ═══ LAYER 1: Transparent frosted glass ════════════════════
               bgAlpha target = 0.10 (barely-there tint).
               The glass look comes from blur + saturate, not from fill.
               Higher blur (36px) = deeper frosted depth.            */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: 88,
              pointerEvents: "none",
              clipPath: pillClip,
              // p=0 (extended): exact original flat colour, no gradient, no filter tweaks
              // p>0 (pill forming): gradient + saturate/brightness kick in
              background: p < 0.01
                ? `rgba(250, 247, 242, ${bgAlpha.toFixed(3)})`
                : `linear-gradient(160deg,
                    rgba(255,255,255,${(0.32 * p).toFixed(3)}) 0%,
                    rgba(250,247,242,${bgAlpha.toFixed(3)})     42%,
                    rgba(244,237,228,${(bgAlpha * 0.80).toFixed(3)}) 100%)`,
              backdropFilter: p < 0.01
                ? `blur(${blurAmount.toFixed(1)}px)`
                : `blur(${blurAmount.toFixed(1)}px) saturate(240%) brightness(1.08)`,
              WebkitBackdropFilter: p < 0.01
                ? `blur(${blurAmount.toFixed(1)}px)`
                : `blur(${blurAmount.toFixed(1)}px) saturate(240%) brightness(1.08)`,
              boxShadow: p > 0.01
                ? [
                    `inset 0 1.5px 0 rgba(255,255,255,${(1.00 * p).toFixed(3)})`,
                    `inset 0 -1px 0 rgba(139,69,19,${(0.05 * p).toFixed(3)})`,
                    `0 0 0 1.5px rgba(255,255,255,${(0.30 * p).toFixed(3)})`,
                  ].join(", ")
                : "none",
              filter: p > 0.01
                ? [
                    `drop-shadow(0 ${shadowSpreadY.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(139,69,19,${(0.12 * p).toFixed(3)}))`,
                    `drop-shadow(0 2px 6px rgba(0,0,0,${(0.10 * p).toFixed(3)}))`,
                  ].join(" ")
                : "none",
            }}
          />

          {/* ═══ LAYER 1b: Specular highlight ══════════════════════════
               Brighter now (0.55→0) since there's less fill to compete
               with — the bright rim IS the pill shape.             */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: 88,
              pointerEvents: "none",
              clipPath: pillClip,
              background: `linear-gradient(to bottom,
                rgba(255,255,255,${(0.75 * p).toFixed(3)}) 0%,
                rgba(255,255,255,${(0.22 * p).toFixed(3)}) 30%,
                rgba(255,255,255,${(0.06 * p).toFixed(3)}) 58%,
                transparent 75%)`
            }}
          />

          {/* ═══ LAYER 1c: Water ripples (clipped to pill) ════════════
               Ripple divs expand from the click point and are clipped
               to the pill shape by clip-path on this container.    */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: 88,
              overflow: "hidden",
              pointerEvents: "none",
              clipPath: pillClip,
            }}
          >
            {/* Canvas trail — dot-ring halftone pattern following the cursor */}
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
              height={88}
            />

            {ripples.map(r => (
              <div
                key={r.id}
                className="nvsh-ripple"
                style={{ left: r.x, top: r.y, animationDelay: `${r.delay}ms` }}
              />
            ))}
          </div>

          {/* ═══ LAYER 2: Content (inside float wrapper) ══════════════
               Moves with the pill. No clipPath — dropdowns overflow.
               nvsh-glass-isolate: creates a new stacking context so the
               blend mode on nvsh-content composites against ONLY the
               pill glass layers (LAYER 1 / 1b / 1c) — not the full page.
               nvsh-content: mix-blend-mode:difference + color:white makes
               all text/icons auto-invert against whatever is beneath.  */}
          <div
            className="pointer-events-none nvsh-glass-isolate"
            style={{
              position: "absolute",
              top: `${clipTop.toFixed(1)}px`,
              left: `${clipSide.toFixed(2)}%`,
              right: `${clipSide.toFixed(2)}%`,
              bottom: `${clipBottom.toFixed(1)}px`,
            }}
          >
            <div
              className="nvsh-content w-full h-full flex items-center relative pointer-events-auto"
              style={{
                paddingLeft:  `${lerp(65, 44, p).toFixed(1)}px`,
                paddingRight: `${lerp(65, 44, p).toFixed(1)}px`,
                // Adaptive foreground: WCAG luminance of the section beneath
                // the pill determines whether we use light or dark text.
                color: isDark ? '#FAF7F2' : '#2C1810',
              }}
              onClick={handleRipple}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >

              {/* Left: hamburger + nav links */}
              <div className="flex items-center gap-3">
                <div className="lg:hidden">{sideMenu}</div>

                <nav className="hidden lg:flex items-center" style={{ gap: `${lerp(32, 12, p).toFixed(1)}px` }} aria-label="Main navigation">
                  {[
                    { href: "/store",       label: "Shop"        },
                    { href: "/collections", label: "Collections" },
                    { href: "/categories",  label: "Categories"  },
                  ].map(({ href, label }) => {
                    const active = pathname.includes(href)
                    return (
                      <LocalizedClientLink
                        key={href}
                        href={href}
                        className={cn(
                          "nvsh-link relative py-1 px-1.5 text-[10px] font-bold tracking-[0.14em] uppercase group whitespace-nowrap",
                          active ? "opacity-100" : "opacity-70 hover:opacity-100",
                        )}
                      >
                        {label}
                        {/* Underline — also white so difference blend inverts it */}
                        <span
                          className={cn(
                            "absolute -bottom-1 left-0 h-0.5 rounded-full bg-current transition-all duration-300",
                            active ? "w-full" : "w-0 group-hover:w-full",
                          )}
                        />
                      </LocalizedClientLink>
                    )
                  })}
                </nav>
              </div>

              {/* Center: Logo — absolutely centered */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <LocalizedClientLink href="/" aria-label="Himanshu — Home">
                  {/* color: inherit picks up the white from nvsh-content → difference blend inverts */}
                  <span
                    className="nvsh-logo font-serif text-xl tracking-widest select-none whitespace-nowrap"
                  >
                    Himanshu
                  </span>
                </LocalizedClientLink>
              </div>

              {/* Right: Icons — inherit white from nvsh-content for blend-mode inversion */}
              <div className="ml-auto flex items-center gap-2">
                {/* ── Search widget ─────────────────────────────────────────── */}
                <div ref={searchContainerRef} className="relative hidden sm:block">
                  {isSearchOpen ? (
                    <>
                      <form
                        onSubmit={handleSearchSubmit}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.18)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          border: "1px solid rgba(255,255,255,0.35)",
                          borderRadius: "9999px",
                          padding: "0 8px 0 14px",
                          height: 36,
                          width: 280,
                          gap: 6,
                          boxShadow: "0 4px 20px rgba(44,24,16,0.10), inset 0 1px 0 rgba(255,255,255,0.5)",
                        }}
                        className="animate-in fade-in zoom-in-95 duration-200"
                      >
                        <SearchIcon />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search artisan wares…"
                          aria-label="Search products"
                          style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            fontSize: 13,
                            color: "inherit",
                            fontFamily: "inherit",
                          }}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => { setSearchQuery(""); setSearchResults([]); searchInputRef.current?.focus() }}
                            style={{ opacity: 0.6, display: "flex", alignItems: "center", cursor: "pointer", background: "none", border: "none", padding: 0, color: "inherit" }}
                          >
                            <CloseIcon />
                          </button>
                        )}
                        <button
                          type="submit"
                          aria-label="Submit search"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28, height: 28,
                            borderRadius: "50%",
                            background: "rgba(201,118,43,0.85)",
                            border: "none",
                            cursor: "pointer",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          <ArrowRightIcon />
                        </button>
                      </form>

                      {/* ── Suggestions dropdown (cart-style) ────────────────── */}
                      {(searchResults.length > 0 || isSearching) && (
                        <div
                          data-testid="search-dropdown"
                          style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            width: 320,
                            background: "rgba(255,253,249,0.97)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            border: "1px solid rgba(232,221,212,0.9)",
                            borderRadius: 20,
                            boxShadow: "0 20px 60px rgba(44,24,16,0.18), 0 4px 12px rgba(44,24,16,0.08)",
                            overflow: "hidden",
                            zIndex: 60,
                          }}
                          className="animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                          {/* Header */}
                          <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #E8DDD4" }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9762B", margin: 0 }}>
                              {isSearching ? "Searching…" : "Top Matches"}
                            </p>
                          </div>

                          {/* Product rows */}
                          {searchResults.map((product) => {
                            const price = product.variants?.[0]?.calculated_price?.calculated_amount
                            const currency = product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ?? "INR"
                            return (
                              <LocalizedClientLink
                                key={product.id}
                                href={`/products/${product.handle}`}
                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", color: "#2C1810", textDecoration: "none" }}
                                className="search-result-row"
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]) }}
                              >
                                {/* Thumbnail */}
                                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#F5EFE7", border: "1px solid #E8DDD4" }}>
                                  {product.thumbnail ? (
                                    <img src={product.thumbnail} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛍️</div>
                                  )}
                                </div>
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</p>
                                  {price !== undefined && (
                                    <p style={{ margin: 0, fontSize: 11, color: "#8D6E63", marginTop: 2 }}>
                                      {currency} {(price / 100).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                                <div style={{ opacity: 0.4, flexShrink: 0 }}><ArrowRightIcon /></div>
                              </LocalizedClientLink>
                            )
                          })}

                          {/* Footer CTA */}
                          <button
                            type="button"
                            onClick={handleSearchSubmit}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              width: "100%",
                              padding: "12px 16px",
                              borderTop: "1px solid #E8DDD4",
                              background: "none",
                              border: "none",
                              borderTopColor: "#E8DDD4",
                              borderTopWidth: 1,
                              borderTopStyle: "solid",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#C9762B",
                              letterSpacing: "0.05em",
                            }}
                          >
                            See all results for &ldquo;{searchQuery}&rdquo; <ArrowRightIcon />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="nvsh-icon p-1.5 opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Search products"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <SearchIcon />
                    </button>
                  )}
                </div>

                <LocalizedClientLink
                  href="/account"
                  className="nvsh-icon hidden sm:flex p-1.5 opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="My account"
                  data-testid="nav-account-link"
                >
                  <AccountIcon />
                </LocalizedClientLink>

                <div className="flex items-center">
                  {cartButton}
                </div>
              </div>

            </div>
          </div>

        </div>{/* end float wrapper */}
      </div>
    </>
  )
}
