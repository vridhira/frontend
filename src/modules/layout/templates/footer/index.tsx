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
 * @modifiedWith    Antigravity
 * @modifiedOn      2026-03-06
 * @changeNote      Migrated to Vridhira brand identity — warm surface, giant serif watermark, 4-column grid, fixed GitHub link
 * ============================================================
 */

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import VridhiraCredits from "@modules/layout/components/vridhira-credits"

// ─── Social brand icons (inline SVG, server-safe) ────────────────────────────

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.012-5.5 4.72-10.5 10.686-10.5 5.974 0 9.814 4.3 9.814 9.5 0 3.28-1.27 5.5-3.5 5.5-1.29 0-2.18-.63-2.6-1.8-.7 1.14-1.87 1.8-3.35 1.8-2.7 0-4.55-2.1-4.55-5 0-2.92 1.85-5 4.55-5 1.44 0 2.6.63 3.3 1.72V7.5h1.7v7c0 1.1.5 1.5 1.25 1.5 1.2 0 2-1.5 2-4 0-4.35-3.12-8-8.3-8C5.52 4 3.5 8.2 3.5 12c0 3.05.73 5.5 2.12 7.06 1.43 1.62 3.66 2.45 6.58 2.47h.007c3.67 0 5.83-1.6 6.83-5.03l1.64.53C19.07 21.8 16.35 24 12.186 24zm-.226-14.5c-1.75 0-2.85 1.38-2.85 3.5 0 2.1 1.1 3.5 2.85 3.5 1.76 0 2.85-1.4 2.85-3.5 0-2.12-1.09-3.5-2.85-3.5z" />
  </svg>
)

// Single source of truth for all social links — used in both Connect column and bottom strip
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/vridhira.in",                Icon: InstagramIcon },
  { label: "Facebook",  href: "https://facebook.com/profile.php?id=61584546327635",  Icon: FacebookIcon  },
  { label: "Threads",   href: "https://threads.net/vridhira.in",                     Icon: ThreadsIcon   },
  { label: "GitHub",    href: "https://github.com/vridhira/vridhira-frontend",       Icon: GitHubIcon    },
]

export default async function Footer() {
  return (
    <footer
      className="w-full"
      style={{ background: "#FAF7F2" }}
    >
      <div className="content-container py-3">

        {/* ── One unified rounded box ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #C4B5A5",
            boxShadow: "0 4px 24px rgba(44, 24, 16, 0.07)",
          }}
        >

          {/* 3 columns flush inside the box — borders only between cols */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ borderBottom: "1px solid #C4B5A5" }}
          >

            {/* Col 1 — Customer Services */}
            <div className="px-8 py-5" style={{ borderRight: "1px solid #C4B5A5" }}>
              <h3 className="font-dm text-[13px] font-bold tracking-[0.05em] uppercase text-vridhira-text mb-4">
                Customer Services
              </h3>
              <ul className="flex flex-col gap-[12px]">
                {[
                  { label: "FAQs",        href: "/help-center/ask" },
                  { label: "Track Order", href: "/account/orders" },
                  { label: "Returns",     href: "/" },
                  { label: "Delivery",    href: "/" },
                  { label: "Payment",     href: "/" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <LocalizedClientLink
                      href={href}
                      className="font-dm text-sm font-normal text-vridhira-muted hover:text-vridhira-primary transition-colors duration-200"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2 — About */}
            <div className="px-8 py-5" style={{ borderRight: "1px solid #C4B5A5" }}>
              <h3 className="font-dm text-[13px] font-bold tracking-[0.05em] uppercase text-vridhira-text mb-4">
                About
              </h3>
              <ul className="flex flex-col gap-[12px]">
                {[
                  { label: "About us",                href: "/" },
                  { label: "Cancellation Policy",     href: "/" },
                  { label: "Refund & Return Policy",  href: "/" },
                  { label: "Privacy Policy",          href: "/" },
                  { label: "Terms & Conditions",      href: "/" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <LocalizedClientLink
                      href={href}
                      className="font-dm text-sm font-normal text-vridhira-muted hover:text-vridhira-primary transition-colors duration-200"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Connect */}
            <div className="px-8 py-5">
              <h3 className="font-dm text-[13px] font-bold tracking-[0.05em] uppercase text-vridhira-text mb-4">
                Connect
              </h3>
              <ul className="flex flex-col gap-[12px]">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 font-dm text-sm font-normal text-vridhira-muted hover:text-vridhira-primary transition-colors duration-200"
                    >
                      <Icon />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Full-width copyright strip inside the box ── */}
          <div className="py-3 px-8 flex flex-col sm:flex-row items-center gap-3">

            {/* Left — help center link */}
            <div className="flex items-center flex-1">
              <LocalizedClientLink
                href="/help-center"
                aria-label="Help Center"
                className="flex items-center gap-1.5 text-xs text-vridhira-muted hover:text-vridhira-primary transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                <span>Help Center</span>
              </LocalizedClientLink>
            </div>

            {/* Center — credits text */}
            <p className="text-xs text-center flex-shrink-0 text-vridhira-muted">
              Built with{" "}
              <span role="img" aria-label="love">❤️</span>
              {" "}by{" "}
              <a
                href="https://github.com/Newbie-Himanshu"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-vridhira-primary transition-colors"
                style={{ color: "#8B4513" }}
              >
                Himanshu — Vridhira
              </a>
              {" "}for Indian artisans.
            </p>

            {/* Right — social icon buttons */}
            <div className="flex items-center justify-end gap-1 flex-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Vridhira on ${label}`}
                  title={label}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-vridhira-muted hover:text-vridhira-primary hover:scale-110 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>
    </footer>
  )
}
