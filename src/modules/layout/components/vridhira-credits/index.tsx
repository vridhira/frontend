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
 * @changeNote      Initial creation of VridhiraCredits component
 * ============================================================
 */

import React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type VridhiraCreditsProps = {
  /** Controls visual weight. Use 'full' in footer, 'minimal' in tight spaces */
  variant?: "full" | "minimal"
  /** Optional custom class overrides for the wrapper */
  className?: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

/**
 * MAINTENANCE NOTE (for AI agents):
 * The social icon in the footer shows the Vridhira brand org repo only.
 * Himanshu's personal GitHub (Newbie-Himanshu) lives in code headers only — NOT here.
 * When Himanshu adds LinkedIn/Twitter/Instagram, add them to this array.
 */
const FOOTER_LINKS: Array<{ label: string; href: string; Icon: React.FC }> = [
  {
    label: "vridhira-frontend",
    href: "https://github.com/vridhira/vridhira-frontend",
    Icon: GitHubIcon,
  },
  // ← Future: LinkedIn, Twitter/X, Instagram go here
]

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * VridhiraCredits
 *
 * Renders visible author credits for Himanshu — Vridhira in the storefront footer.
 * This is a Server Component — no client-side logic needed.
 *
 * Usage:
 *   <VridhiraCredits />                    ← full variant (default)
 *   <VridhiraCredits variant="minimal" />  ← one-liner for tight spaces
 */
const VridhiraCredits: React.FC<VridhiraCreditsProps> = ({
  variant = "full",
  className = "",
}) => {
  if (variant === "minimal") {
    return (
      <p
        className={`text-xs text-vridhira-muted text-center ${className}`}
        aria-label="Project credits"
      >
        Built with ❤️ by{" "}
        <a
          href="https://github.com/Newbie-Himanshu"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-vridhira-primary transition-colors"
        >
          Himanshu — Vridhira
        </a>
        {" "}for Indian artisans.
      </p>
    )
  }

  return (
    <section
      className={`border-t border-vridhira-border pt-6 mt-6 ${className}`}
      aria-label="Project credits and attribution"
    >
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-vridhira-border" aria-hidden="true" />
        <span className="text-xs text-vridhira-muted font-medium tracking-widest uppercase">
          Crafted by
        </span>
        <div className="h-px flex-1 bg-vridhira-border" aria-hidden="true" />
      </div>

      {/* Main credits card */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Name */}
        <p className="text-sm font-semibold text-vridhira-text">
          Himanshu — Vridhira
        </p>

        {/* Tagline */}
        <p className="text-xs text-vridhira-muted max-w-xs leading-relaxed">
          Building Vridhira independently — an open platform for India&apos;s artisans.
        </p>

        {/* Social / repo links (brand org only — visible to website visitors) */}
        {FOOTER_LINKS.length > 0 && (
          <ul
            className="flex items-center gap-4 mt-1"
            aria-label="Vridhira project links"
          >
            {FOOTER_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} on GitHub`}
                  className="flex items-center gap-1.5 text-xs text-vridhira-muted hover:text-vridhira-primary transition-colors"
                >
                  <Icon />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Copyright */}
        <p className="text-xs text-vridhira-muted mt-1">
          © {new Date().getFullYear()} Himanshu — Vridhira. All rights reserved.
        </p>

        {/* Framework acknowledgment */}
        <p className="text-xs text-vridhira-muted">
          Built using{" "}
          <a
            href="https://github.com/medusajs/medusa"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-vridhira-primary transition-colors"
          >
            MedusaJS
          </a>{" "}
          framework
        </p>
      </div>
    </section>
  )
}

export default VridhiraCredits
