"use client"

/**
 * ============================================================
 * VRIDHIRA — E-Commerce for Indian Artisans
 * ============================================================
 * @author      Himanshu
 * @github      https://github.com/Newbie-Himanshu
 * @repo        https://github.com/Newbie-Himanshu/vridhira-frontend
 * @copyright   2026 Himanshu. All rights reserved.
 * @license     SEE LICENSE IN LICENSE
 * ------------------------------------------------------------
 * @lastModifiedBy  Himanshu
 * @modifiedWith    GitHub Copilot
 * @modifiedOn      2026-03-07
 * @changeNote      Scroll engine: replaced RAF smoothScrollTo with scrollIntoView({behavior:'smooth'}).
 *                  Exit animation: replaced React isExiting state + exitDelay stagger + wheelBlock
 *                  with CSS animation-timeline: scroll(root). ~100 lines removed.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ─── Arrow icon ───────────────────────────────────────────────────────────────
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

// ─── Artisan category mosaic (right panel) ────────────────────────────────────
// Each chip has an independent bob phase, duration and absolute position within
// the 480px-tall right panel. Three animation variants (a/b/c) ensure no two
// adjacent chips ever move in perfect sync.
type Category = {
  label: string
  emoji: string
  href:  string
  bob:   "hero-bob-a" | "hero-bob-b" | "hero-bob-c"
  dur:   number              // animation duration (seconds)
  delay: number              // animation delay   (seconds)
  pos:   React.CSSProperties // absolute position inside the panel
}

// 6 representative picks from the 8 real admin categories — shown as floating chips
const CATEGORIES: Category[] = [
  { label: "Textile",    emoji: "🧵", href: "/categories/textile",           bob: "hero-bob-a", dur: 4.8, delay: 0.0, pos: { top: "6%",  left:  "5%"  } },
  { label: "Pottery",   emoji: "🏺", href: "/categories/pottery",           bob: "hero-bob-b", dur: 5.2, delay: 0.7, pos: { top: "8%",  right: "4%"  } },
  { label: "Jewellery", emoji: "💎", href: "/categories/handmade-jewellery", bob: "hero-bob-c", dur: 4.5, delay: 1.3, pos: { top: "42%", left:  "0%"  } },
  { label: "Woodcrafts",emoji: "🪵", href: "/categories/woodcraft",          bob: "hero-bob-b", dur: 5.6, delay: 0.3, pos: { top: "40%", right: "0%"  } },
  { label: "Art",       emoji: "🎨", href: "/categories/art",               bob: "hero-bob-a", dur: 4.2, delay: 1.0, pos: { top: "74%", left:  "10%" } },
  { label: "Terracotta",emoji: "🪴", href: "/categories/terracotta",        bob: "hero-bob-c", dur: 5.0, delay: 0.7, pos: { top: "72%", right: "8%"  } },
]

// Headline lines: words, accent flag, global word-index start (for stagger timing)
const HEADLINE_LINES = [
  { words: ["Handcrafted"],         accent: false, idx: 0 },
  { words: ["with", "soul."],       accent: true,  idx: 1 },
  { words: ["Delivered", "to"],     accent: false, idx: 3 },
  { words: ["your", "door."],       accent: false, idx: 5 },
] as const

// ─── Particle system ──────────────────────────────────────────────────────────
// 52 warm dust particles drift upward across the hero with slight Brownian sway —
// evoking pollen, smoke, or dust motes in a sunlit artisan workshop.
type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; warm: boolean }

function randomParticle(W: number, H: number, fromBottom = false): Particle {
  return {
    x:    Math.random() * W,
    y:    fromBottom ? H + Math.random() * 30 : Math.random() * H,
    vx:   (Math.random() - 0.5) * 0.38,
    vy:   -(0.12 + Math.random() * 0.52),   // always drifting upward
    r:    0.8 + Math.random() * 2.1,
    alpha: 0.04 + Math.random() * 0.22,
    warm: Math.random() < 0.62,              // warm amber vs deep saddle-brown
  }
}

function clamp(v: number, lo: number, hi: number) { return Math.min(Math.max(v, lo), hi) }

// ─── Component ────────────────────────────────────────────────────────────────
const Hero = () => {
  const [entered,   setEntered]   = useState(false)
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 0 })

  const sectionRef   = useRef<HTMLElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const ctaWrapRef   = useRef<HTMLDivElement>(null)
  const rafDrawRef   = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  // ── IntersectionObserver: fire entrance once ──────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Canvas: warm-dust particle field ─────────────────────────────────────
  // Imperative canvas draw loop — zero React re-renders per frame.
  // ResizeObserver syncs canvas pixel size to its CSS size on every resize.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let W = 0, H = 0

    const syncSize = () => {
      const wasZero = W === 0
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      if (wasZero) {
        // Initialise scattered across the full canvas on first mount
        particlesRef.current = Array.from({ length: 52 }, () => randomParticle(W, H))
      }
    }

    syncSize()
    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)

    const draw = () => {
      rafDrawRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      for (const p of particlesRef.current) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        // warm amber: rgb(201,118,43)  ·  deep saddle-brown: rgb(139,69,19)
        ctx.fillStyle = p.warm
          ? `rgba(201,118,43,${p.alpha.toFixed(3)})`
          : `rgba(139,69,19,${p.alpha.toFixed(3)})`
        ctx.fill()
        // Advance position
        p.x += p.vx
        p.y += p.vy
        // Brownian micro-sway — every frame adds a tiny random nudge to vx
        p.vx += (Math.random() - 0.5) * 0.012
        p.vx = clamp(p.vx, -0.42, 0.42)
        // Horizontal wrap
        if (p.x < -p.r)    p.x = W + p.r
        if (p.x > W + p.r) p.x = -p.r
        // Respawn from the bottom when a particle exits the top edge
        if (p.y < -p.r * 2) Object.assign(p, randomParticle(W, H, true))
      }
    }

    draw()
    return () => { cancelAnimationFrame(rafDrawRef.current); ro.disconnect() }
  }, [])

  // ── Auto-glide: velocity-matched cubic Hermite snap at 35% hero scroll ─────
  //
  // Curve:  pos(t) = fromY
  //                + D          × (−2t³ + 3t²)       ← smooth-step [0 → D]
  //                + v0_safe × T × (t³ − 2t² + t)    ← velocity tangent
  //
  // This is a cubic Hermite spline with four exact guarantees:
  //   pos(0)   = fromY          → starts exactly where scroll stopped
  //   pos(T)   = toY            → lands exactly on CategoryStrip
  //   pos'(0)  = v0_safe        → departure velocity equals user's scroll speed
  //   pos'(T)  = 0              → smooth, zero-velocity landing (no bounce)
  //
  // Overshoot proof: overshoot iff v0_safe × T > 3 × D.
  //   We cap v0_safe = min(v0, 2.8D/T) → v0_safe × T ≤ 2.8D < 3D. ✓ never overshoots.
  //
  // Velocity: measured from a 6-sample ring buffer with linearly increasing weights
  //   so the most recent samples dominate. Far more accurate than an exponential IIR
  //   that lags behind a sudden flick.
  //
  // Direction guard: only fires when measured velocity > 0.04 px/ms (downward).
  //   Re-arms only once scrollY drops back below 30% of the threshold — prevents
  //   coming-back-from-CategoryStrip from re-triggering mid-journey.
  useEffect(() => {
    type VelSample = { dy: number; dt: number }
    const velBuf: VelSample[] = []
    const VEL_WIN = 6

    let lastY       = window.scrollY
    let lastT       = performance.now()
    let glideActive = false
    let glideFired  = false
    let glideRaf    = 0

    // Lifted to outer scope so the useEffect cleanup can remove them if the
    // component unmounts while a glide is still in flight (prevents listener leaks).
    let activeBlock:    ((e: Event) => void) | null = null
    let activeBlockKey: ((e: Event) => void) | null = null

    const heroThreshold = () => {
      const hero = document.getElementById("hero")
      return (hero ? hero.offsetHeight : window.innerHeight) * 0.10
    }
    const catStripTop = () => {
      const cat = document.getElementById("category-strip")
      if (!cat) return window.innerHeight
      return cat.getBoundingClientRect().top + window.scrollY
    }

    // Weighted average over the ring buffer (most recent sample = highest weight)
    function measuredVel(): number {
      if (velBuf.length === 0) return 0
      let wSum = 0, vSum = 0
      velBuf.forEach(({ dy, dt }, i) => {
        const w = i + 1
        wSum += w
        vSum += w * (dy / Math.max(dt, 1))
      })
      return vSum / wSum
    }

    function smoothGlideTo(toY: number, v0: number) {
      glideActive = true
      glideFired  = true

      // ── Block ALL user scroll input during the glide ──────────────────────
      // wheel/touchmove/touchstart: preventDefault stops new scroll gestures.
      // keydown: blocks Arrow keys, Space, PgUp/PgDn, Home/End.
      // Listeners are stored in outer-scope vars so the useEffect cleanup can
      // remove them if the component unmounts mid-glide (prevents leaks).
      const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"])
      activeBlock    = (e: Event) => e.preventDefault()
      activeBlockKey = (e: Event) => { if (SCROLL_KEYS.has((e as KeyboardEvent).key)) e.preventDefault() }

      window.addEventListener("wheel",      activeBlock,    { passive: false })
      window.addEventListener("touchmove",  activeBlock,    { passive: false })
      window.addEventListener("touchstart", activeBlock,    { passive: false })
      window.addEventListener("keydown",    activeBlockKey)

      // ── Glide state ───────────────────────────────────────────────────────
      // Two-phase initialization solves the persistent "backward snap" jitter:
      //
      //   Phase 0 (frame 1): Write current scrollY via document.scrollingElement.scrollTop.
      //     A direct DOM property write is the only reliable way to interrupt Chrome/Safari's
      //     kinetic (momentum) scroll. window.scrollTo() to the same value is often a no-op
      //     that the compositor engine ignores, leaving inertia running.
      //
      //   Phase 1 (frame 2): Re-read fromY. By now the momentum engine has stopped because
      //     frame 1's write killed it. This is the true, stable departure point for the spline.
      //
      //   Phase 2+ (frame 3+): Cubic Hermite interpolation from stable fromY to toY.
      let fromY = -1
      let phase = 0
      let startT = -1
      let T = 0, v0s = 0, D = 0

      const MIN_DUR = 520    // ms — smooth even on the fastest flick
      const MAX_DUR = 1200   // ms — long enough for a contemplative float

      function end(finalY: number) {
        document.scrollingElement!.scrollTop = Math.round(finalY)
        window.removeEventListener("wheel",      activeBlock!)
        window.removeEventListener("touchmove",  activeBlock!)
        window.removeEventListener("touchstart", activeBlock!)
        window.removeEventListener("keydown",    activeBlockKey!)
        activeBlock    = null
        activeBlockKey = null
        // Re-sync velocity baseline so the first onScroll after landing doesn't
        // compute a giant stale dy (latY is still at pre-glide trigger position).
        // Also flush velBuf so stale fast-flick entries can't re-fire the glide.
        lastY = window.scrollY
        lastT = performance.now()
        velBuf.length = 0
        glideActive = false
      }

      function frame(now: number) {
        if (phase === 0) {
          // Frame 1: capture fromY and write it back via direct DOM assignment.
          // This synchronously interrupts browser kinetic scroll in all Chromium
          // and WebKit builds. Cannot use window.scrollTo() here — it is often
          // treated as no-op when writing the current position.
          fromY = window.scrollY
          document.scrollingElement!.scrollTop = Math.round(fromY)
          phase = 1
          glideRaf = requestAnimationFrame(frame)
          return
        }

        if (phase === 1) {
          // Frame 2: momentum is dead. Re-read the truly settled scroll position
          // and compute stable spline parameters from it.
          fromY  = window.scrollY
          startT = now
          D      = toY - fromY
          if (D <= 0) { end(fromY); return }   // already at/past target; bail cleanly

          T   = Math.max(MIN_DUR, Math.min((2.2 * D) / Math.max(v0, 0.001), MAX_DUR))
          // Cap v0 at 2.0 × D/T → departure tangent never > 2.0D which is < 3D,
          // mathematically guaranteeing zero overshoot on the Hermite spline. ✓
          v0s = Math.min(v0, (2.0 * D) / T)
          phase = 2
          glideRaf = requestAnimationFrame(frame)
          return
        }

        // Phase 2+ — cubic Hermite spline
        // pos(t) = fromY + D×(−2t³+3t²) + v0s×T×(t³−2t²+t)
        // Guarantees: pos(0)=fromY, pos(T)=toY, pos'(0)=v0s, pos'(T)=0
        const elapsed = now - startT
        if (elapsed < T) {
          const t = elapsed / T, t2 = t * t, t3 = t2 * t
          const pos = Math.min(
            fromY + D * (-2 * t3 + 3 * t2) + v0s * T * (t3 - 2 * t2 + t),
            toY   // hard ceiling — never scrolls past target
          )
          document.scrollingElement!.scrollTop = Math.round(pos)
          glideRaf = requestAnimationFrame(frame)
        } else {
          end(toY)
        }
      }

      glideRaf = requestAnimationFrame(frame)
    }

    function onScroll() {
      if (glideActive) return
      const now = performance.now()
      const y   = window.scrollY
      const dt  = now - lastT

      // Push into ring buffer, evict oldest when full
      velBuf.push({ dy: y - lastY, dt })
      if (velBuf.length > VEL_WIN) velBuf.shift()

      lastY = y
      lastT = now

      const threshold = heroThreshold()

      // Re-arm once scrollY drops below 50% of the trigger (~5% of hero height)
      if (y < threshold * 0.5) glideFired = false

      // Trigger: scrolling down past 10% of hero height, not already fired
      const vel = measuredVel()
      if (!glideFired && vel > 0.04 && y >= threshold) {
        smoothGlideTo(catStripTop(), vel)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(glideRaf)
      // Remove glide input-blockers if the component unmounts mid-glide
      if (activeBlock) {
        window.removeEventListener("wheel",      activeBlock)
        window.removeEventListener("touchmove",  activeBlock)
        window.removeEventListener("touchstart", activeBlock)
      }
      if (activeBlockKey) window.removeEventListener("keydown", activeBlockKey)
    }
  }, [])

  // ── Magnetic CTA ─────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const wrap = ctaWrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist < 130) {
      const s = (1 - dist / 130) * 0.4
      setCtaOffset({ x: dx * s, y: dy * s })
    } else {
      // Avoid redundant re-renders when already at (0,0)
      setCtaOffset(prev => (prev.x === 0 && prev.y === 0) ? prev : { x: 0, y: 0 })
    }
  }, [])

  const handleMouseLeave = useCallback(() => setCtaOffset({ x: 0, y: 0 }), [])

  // ── Scroll to CategoryStrip ───────────────────────────────────────────────
  // Native smooth scroll — no RAF loop, no scroll lock, no velocity tracking.
  // The CSS scroll-driven exit (hero-scroll-exit class, animation-timeline:scroll)
  // fades the hero content automatically as the user scrolls down.
  const handleGlide = useCallback(() => {
    document.getElementById("category-strip")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Vridhira — Homepage hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 40%, #EDE0D0 70%, #E8D4BC 100%)" }}
    >

      <style>{`
        /* ── Entrance keyframes ─────────────────────────────────────────── */
        @keyframes hero-word-in {
          from { opacity: 0; transform: translateY(28px); filter: blur(8px);  }
          to   { opacity: 1; transform: translateY(0px);  filter: blur(0px);  }
        }
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0px);  }
        }

        /* ── Scroll-driven exit ─────────────────────────────────────────────
             animation-timeline: scroll(root) ties progress to page scrollY.
             animation-range: 0vh 55vh — at 0 scroll = start, at 55vh = end.
             @supports guard: Firefox <135 / Safari <18 keep content visible. */
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

        /* ── Category chip bobs ─────────────────────────────────────────── */
        @keyframes hero-bob-a {
          0%,100% { transform: translateY(0px)   rotate(0deg);    }
          38%     { transform: translateY(-10px)  rotate(1.2deg);  }
          68%     { transform: translateY(4px)    rotate(-0.5deg); }
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
        /* Compass rings */
        @keyframes hero-spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes hero-spin-ccw { to { transform: rotate(-360deg); } }
        /* CTA shimmer */
        @keyframes hero-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        /* Scroll indicator drop-bounce */
        @keyframes hero-scroll-drop {
          0%,100% { transform: translateY(0px);  opacity: 0.5; }
          55%     { transform: translateY(10px);  opacity: 1;   }
        }

        /* ── Base hidden states ─────────────────────────────────────────── */
        .hero-word { display: inline-block; opacity: 0; }
        .hero-fade { opacity: 0; }

        /* ── Entrance triggered states ──────────────────────────────────── */
        .hero-word.entered {
          animation: hero-word-in 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-fade.entered {
          animation: hero-fade-up 0.68s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── CTA shimmer ────────────────────────────────────────────────── */
        .hero-cta-btn {
          background: linear-gradient(
            110deg,
            #8B4513 25%,
            #C9762B 45%,
            #D4A574 55%,
            #8B4513 75%
          );
          background-size: 200% auto;
          color: #FAF7F2;
          box-shadow: 0 2px 12px rgba(139,69,19,0.22);
          transition: box-shadow 0.3s ease;
        }
        .hero-cta-btn.entered { animation: hero-shimmer 4s linear 1.8s infinite; }
        .hero-cta-btn:hover   { box-shadow: 0 8px 32px rgba(139,69,19,0.42); }
      `}</style>

      {/* ── Layer 0: Particle canvas ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Layer 1a: Decorative blobs ── */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9762B 0%, transparent 70%)", zIndex: 1 }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8B4513 0%, transparent 70%)", zIndex: 1 }}
      />

      {/* ── Layer 1b: Ghost "Artisan" text ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-4 lg:pr-16 pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <span
          className="font-serif font-bold leading-none"
          style={{ fontSize: "clamp(120px, 18vw, 300px)", color: "rgba(139,69,19,0.055)", whiteSpace: "nowrap" }}
        >
          Artisan
        </span>
      </div>

      {/* ── Layer 2: Main content — hero-scroll-exit ties opacity/blur to scrollY via CSS ── */}
      <div
        className="relative w-full pt-24 lg:pt-20 pb-20 lg:pb-28 hero-scroll-exit"
        style={{ zIndex: 2 }}
      >
        <div className="content-container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6">

            {/* ═══════════════════════ LEFT: TEXT BLOCK ═══════════════════════ */}
            <div className="flex-1 max-w-2xl">

              {/* Eyebrow */}
              <span
                className={`hero-fade${entered ? " entered" : ""} inline-block text-xs font-semibold tracking-[0.25em] uppercase text-vridhira-accent mb-6 pl-8`}
                style={{ animationDelay: "0.08s" }}
              >
                🇮🇳 &nbsp;India's Artisan Marketplace
              </span>

              {/* ── Headline: word-by-word cascade ──────────────────────────
                   Each word is an independent .hero-word span hidden by default.
                   Adding .entered triggers hero-word-in with a staggered delay
                   computed from the word's global index across all lines.     */}
              <h1 className="font-serif text-[34px] sm:text-[46px] lg:text-[58px] leading-[1.08] text-vridhira-text mb-6 pl-8">
                {HEADLINE_LINES.map((line, li) => (
                  <span key={li} className="block">
                    {line.words.map((word, wi) => (
                      <span
                        key={`${li}-${wi}`}
                        className={`hero-word${entered ? " entered" : ""} mr-[0.26em]${line.accent ? " text-vridhira-primary" : ""}`}
                        style={{ animationDelay: `${0.28 + (line.idx + wi) * 0.09}s` }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              {/* Sub-tagline */}
              <p
                className={`hero-fade${entered ? " entered" : ""} text-xs sm:text-sm text-vridhira-muted leading-relaxed max-w-md mb-10 pl-8`}
                style={{ animationDelay: "0.88s" }}
              >
                Discover authentic handmade goods directly from India's artisans and
                craftspeople. Every purchase supports a maker.
              </p>

              {/* CTAs */}
              <div
                className={`hero-fade${entered ? " entered" : ""} flex flex-col sm:flex-row gap-4 pl-8`}
                style={{ animationDelay: "1.02s" }}
              >
                <div
                  ref={ctaWrapRef}
                  style={{
                    display: "inline-block",
                    transform: `translate(${ctaOffset.x}px, ${ctaOffset.y}px)`,
                    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <LocalizedClientLink
                    href="/store"
                    className={`hero-cta-btn${entered ? " entered" : ""} inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide group`}
                    data-testid="hero-shop-button"
                  >
                    Shop Now
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                  </LocalizedClientLink>
                </div>

                <LocalizedClientLink
                  href="/collections"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide border-2 border-vridhira-primary text-vridhira-primary bg-transparent hover:bg-vridhira-primary hover:text-white transition-all duration-200"
                >
                  Browse Collections
                </LocalizedClientLink>
              </div>

            </div>

            {/* ═══════════════════ RIGHT: ARTISAN MOSAIC ══════════════════════ */}
            <div
              className={`hero-fade${entered ? " entered" : ""} hidden lg:block flex-1 relative`}
              style={{ height: 480, animationDelay: "0.45s" }}
            >
              {/* Outer compass ring — clockwise slow spin */}
              <div
                aria-hidden="true"
                className="absolute inset-0 m-auto w-72 h-72 rounded-full border border-vridhira-border opacity-35 pointer-events-none"
                style={{ animation: "hero-spin-cw 36s linear infinite" }}
              >
                {/* 8 radial tick marks */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[2px] h-3 bg-vridhira-muted rounded-full opacity-60"
                    style={{
                      top: "50%", left: "50%",
                      transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateY(-144px)`,
                    }}
                  />
                ))}
              </div>

              {/* Inner ring — counter-clockwise, faster */}
              <div
                aria-hidden="true"
                className="absolute inset-0 m-auto w-48 h-48 rounded-full pointer-events-none opacity-20"
                style={{ border: "1px solid #D4A574", animation: "hero-spin-ccw 22s linear infinite" }}
              />

              {/* Floating category chips — each links to its category page */}
              {CATEGORIES.map(cat => (
                <LocalizedClientLink
                  key={cat.label}
                  href={cat.href}
                  className="absolute flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold select-none backdrop-blur-sm"
                  style={{
                    ...cat.pos,
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(139,69,19,0.16)",
                    color: "#2C1810",
                    boxShadow: "0 4px 20px rgba(139,69,19,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
                    animation: `${cat.bob} ${cat.dur}s ease-in-out ${cat.delay}s infinite`,
                    textDecoration: "none",
                  }}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </LocalizedClientLink>
              ))}

              {/* Centre badge — V mark with earthy gradient */}
              <div
                className="absolute inset-0 m-auto w-28 h-28 rounded-full flex items-center justify-center text-center pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #8B4513, #C9762B)",
                  boxShadow: "0 8px 40px rgba(139,69,19,0.38), 0 0 0 8px rgba(139,69,19,0.07)",
                  color: "#FAF7F2",
                }}
              >
                <div>
                  <div className="font-serif text-2xl font-bold leading-none">V</div>
                  <div className="text-[9px] tracking-[0.2em] uppercase mt-1 opacity-80">Vridhira</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <button
        onClick={handleGlide}
        aria-label="Scroll to next section"
        className={`hero-fade${entered ? " entered" : ""} absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-vridhira-muted bg-transparent border-0 p-2 cursor-pointer group`}
        style={{ zIndex: 2, animationDelay: "1.5s" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold opacity-70 transition-opacity duration-200 group-hover:opacity-100">Scroll</span>
        <div className="w-px h-12 bg-vridhira-border relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-1/2 bg-vridhira-primary"
            style={{ animation: "hero-scroll-drop 2s ease-in-out infinite" }}
          />
        </div>
        <svg
          width="12" height="8" viewBox="0 0 12 8" fill="none"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-y-1"
          style={{ animation: "hero-scroll-drop 2s ease-in-out 0.25s infinite" }}
        >
          <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

    </section>
  )
}

export default Hero
