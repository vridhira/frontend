/**
 * ============================================================
 * VRIDHIRA — E-Commerce for Indian Artisans
 * ============================================================
 * @author      Himanshu
 * @github      https://github.com/Newbie-Himanshu
 * @copyright   2026 Himanshu. All rights reserved.
 * @license     SEE LICENSE IN LICENSE
 * @modifiedWith    GitHub Copilot
 * @modifiedOn      2026-03-07
 * @changeNote      Replaced event-bus (cat-strip-glide-start/enter/abort) + React ready/entered
 *                  state + IObs + visibility wrapper with CSS animation-timeline: view().
 *                  Each animated element runs its own scroll-driven entrance — zero JS state,
 *                  zero event listeners. @supports fallback keeps IObs for Firefox <135.
 * ============================================================
 */

"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ─── Category data ────────────────────────────────────────────────────────────
// Handles match the admin panel exactly (see /app/categories)
const categories = [
  {
    emoji: "🧵",
    title: "Textile",
    description: "Handlooms, block prints, fabrics",
    href: "/categories/textile",
  },
  {
    emoji: "🏺",
    title: "Pottery",
    description: "Blue pottery, stoneware, earthenware",
    href: "/categories/pottery",
  },
  {
    emoji: "🫙",
    title: "Ceramics",
    description: "Glazed, wheel-thrown, decorative ware",
    href: "/categories/ceramic",
  },
  {
    emoji: "🧶",
    title: "Crochet",
    description: "Handmade crochet wear & home décor",
    href: "/categories/Crochet",
  },
  {
    emoji: "🪴",
    title: "Terracotta",
    description: "Garden pots, figurines, wall art",
    href: "/categories/terracotta",
  },
  {
    emoji: "🎨",
    title: "Art",
    description: "Madhubani, Warli, Pattachitra & more",
    href: "/categories/art",
  },
  {
    emoji: "🪵",
    title: "Woodcrafts",
    description: "Carved furniture, toys, home décor",
    href: "/categories/woodcraft",
  },
  {
    emoji: "💎",
    title: "Handmade Jewellery",
    description: "Tribal, Kundan, oxidized silver",
    href: "/categories/handmade-jewellery",
  },
]

// Heading split into individual words for per-word cascade
const HEADING_WORDS = ["Shop", "by", "Category"]

// ─── Category Strip ───────────────────────────────────────────────────────────
// CSS scroll-driven entrance — no React state, no event bus, no IObs.
// Each .cat-word / .cat-fade element has animation-timeline: view() so its
// own entrance animation fires automatically as it scrolls into the viewport.
// @supports guard keeps the page functional on Firefox <135 (IObs fallback).
export default function CategoryStrip() {
  return (
    <section
      id="category-strip"
      className="py-20"
      style={{ background: "#F5EFE7" }}
      aria-label="Shop by category"
    >
      <style>{`
        /* ── Keyframes ──────────────────────────────────────────────────── */

        /* Curtain rise — word slides up from behind a hidden overflow mask */
        @keyframes cat-curtain-rise {
          from { transform: translateY(105%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* Eyebrow slide — reveals from left behind overflow:hidden wrapper */
        @keyframes cat-eyebrow-slide {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }

        /* Underline wipe — scaleX from center */
        @keyframes cat-line-wipe {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* Card lift — fade + rise + subtle scale for a 3D depth feel */
        @keyframes cat-card-in {
          from { opacity: 0; transform: translateY(36px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);    }
        }

        /* ── Base hidden states ─────────────────────────────────────────── */
        .cat-mask      { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .cat-curtain   { display: inline-block; opacity: 0; }
        .cat-eyebrow   { display: inline-block; opacity: 0; }
        .cat-line      { opacity: 0; }
        .cat-card      { opacity: 0; }

        /* ── CSS scroll-driven entrance ─────────────────────────────────────
             Each element owns its own view() timeline.
             animation-range: entry 0% entry 55% — plays as the element enters.
             @supports guard: Firefox <135 keeps opacity:1 (content always visible). */
        @supports (animation-timeline: view()) {
          .cat-curtain {
            animation: cat-curtain-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% entry 55%;
          }
          .cat-eyebrow {
            animation: cat-eyebrow-slide 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% entry 50%;
          }
          .cat-line {
            animation: cat-line-wipe 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% entry 55%;
            transform-origin: center;
          }
          .cat-card {
            animation: cat-card-in 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% entry 65%;
          }
          /* Fade variant for misc elements */
          .cat-fade {
            opacity: 0;
            animation: cat-card-in 0.68s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-timeline: view();
            animation-range: entry 0% entry 60%;
          }
        }

        /* ── Fallback: make all content visible if view() unsupported ───── */
        @supports not (animation-timeline: view()) {
          .cat-curtain, .cat-eyebrow, .cat-line, .cat-card, .cat-fade {
            opacity: 1;
            transform: none;
          }
        }

        /* ── Card hover lift ────────────────────────────────────────────── */
        .cat-card-inner {
          transition: box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cat-card-inner:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 12px 36px rgba(139, 69, 19, 0.14);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-14">

          {/* Eyebrow — slides in from left inside overflow:hidden wrapper */}
          <div className="overflow-hidden mb-4">
            <span
              className="cat-eyebrow text-xs tracking-[0.3em] uppercase"
              style={{ color: "#C9762B", animationDelay: "0.04s" }}
            >
              Explore the Craft
            </span>
          </div>

          {/* Heading — curtain reveal: each word rises from behind a hidden mask */}
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold mb-4"
            style={{ color: "#2C1810", lineHeight: 1.25, letterSpacing: "-0.01em" }}
          >
            {HEADING_WORDS.map((word, i) => (
              <span key={word} className="cat-mask mr-[0.24em]">
                <span
                  className="cat-curtain"
                  style={{ animationDelay: `${0.12 + i * 0.1}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* Decorative underline — wipes in from center */}
          <div
            className="cat-line mx-auto h-px w-20"
            style={{ background: "linear-gradient(90deg, transparent, #C9762B, transparent)", animationDelay: "0.44s" }}
          />
        </div>

        {/* ── Category grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, index) => (
            <LocalizedClientLink
              key={cat.title}
              href={cat.href}
              className="group block"
            >
              <div
                className="cat-card"
                style={{ animationDelay: `${0.26 + index * 0.06}s` }}
              >
                <div
                  className="cat-card-inner rounded-2xl p-6 lg:p-8 text-center cursor-pointer"
                  style={{
                    background: "#FFFDF9",
                    border: "1px solid #E8DDD4",
                    boxShadow: "0 1px 4px rgba(139, 69, 19, 0.06)",
                  }}
                >
                  <span
                    className="text-4xl mb-4 block transition-transform duration-300 group-hover:scale-110"
                    role="img"
                    aria-hidden="true"
                  >
                    {cat.emoji}
                  </span>

                  <h3
                    className="font-serif text-lg mb-1 leading-tight"
                    style={{ color: "#2C1810" }}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8D6E63" }}>
                    {cat.description}
                  </p>

                  <span
                    className="mt-3 inline-block text-xs tracking-wide transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ color: "#8B4513" }}
                  >
                    Browse →
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>


    </section>
  )
}
