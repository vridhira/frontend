import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AskFormClient } from "../components/ask-form-client"

// ─────────────────────────────────────────────────────────────────────────────
// Help Center — Ask a Question page template
// Route: /[countryCode]/help-center/ask
// Server component wrapper — breadcrumb + form card + side info panel.
// ─────────────────────────────────────────────────────────────────────────────

export default function AskTemplate() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAF7F2" }}
    >
      {/* ── Breadcrumb strip ── */}
      <div
        className="border-y border-vridhira-border/40 bg-white/60 backdrop-blur-sm"
        aria-label="Breadcrumb"
      >
        <div className="content-container py-2.5">
          <ol className="flex items-center gap-1 text-[13px] font-dm text-vridhira-muted flex-wrap">
            {/* Home */}
            <li>
              <LocalizedClientLink
                href="/"
                aria-label="Home"
                className="flex items-center gap-1 hover:text-vridhira-accent transition-colors px-2 py-1 rounded-md hover:bg-vridhira-surface"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </LocalizedClientLink>
            </li>
            <li aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
            {/* Help Center */}
            <li>
              <LocalizedClientLink
                href="/help-center"
                className="px-2 py-1 rounded-md transition-colors hover:bg-vridhira-surface hover:text-vridhira-accent"
              >
                Help Center
              </LocalizedClientLink>
            </li>
            <li aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
            {/* Current — active pill */}
            <li>
              <span
                className="px-2.5 py-1 rounded-full text-[13px] font-dm font-medium"
                style={{
                  background: "rgba(201,118,43,0.08)",
                  border:     "1px solid rgba(201,118,43,0.20)",
                  color:      "#C9762B",
                }}
                aria-current="page"
              >
                Ask a Question
              </span>
            </li>
          </ol>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="content-container py-14 lg:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

          {/* ── Left: form card ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:  "#FFFFFF",
              border:      "1px solid #E8DDD4",
              boxShadow:   "0 4px 24px rgba(44, 24, 16, 0.06)",
            }}
          >
            {/* Card header */}
            <div
              className="px-8 pt-8 pb-6 border-b border-vridhira-border"
              style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 100%)" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(201,118,43,0.10)",
                  border:     "1px solid rgba(201,118,43,0.20)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                     stroke="#C9762B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h1 className="font-serif font-semibold text-2xl md:text-3xl text-vridhira-text leading-tight tracking-tight">
                Ask a Question
              </h1>
              <p className="font-dm text-sm text-vridhira-muted mt-2 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Our support team will reply personally.
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <AskFormClient />
            </div>
          </div>

          {/* ── Right: info panel ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Response time */}
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: "rgba(201,118,43,0.06)", border: "1px solid rgba(201,118,43,0.18)" }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                     stroke="#C9762B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#C9762B" }}>
                  Response Time
                </p>
              </div>
              <p className="font-dm text-[13px] text-vridhira-text leading-relaxed">
                We typically respond within <strong>1–2 business days</strong>. Urgent issues are
                prioritised for same-day handling.
              </p>
            </div>

            {/* Quick answers */}
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: "#FFFFFF", border: "1px solid #E8DDD4" }}
            >
              <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70 mb-3">
                Quick Answers
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Track my order",        href: "/help-center/track-order" },
                  { label: "Return or exchange",     href: "/help-center/return-order" },
                  { label: "Payment failed?",        href: "/help-center/payment-failed" },
                  { label: "Refund timeline",        href: "/help-center/refund-timeline" },
                  { label: "Reset my password",      href: "/help-center/reset-password" },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="flex items-center gap-2 font-dm text-[13px] text-vridhira-muted hover:text-vridhira-accent transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none"
                           stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                           viewBox="0 0 24 24" className="opacity-40 group-hover:opacity-100" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back link */}
            <LocalizedClientLink
              href="/help-center"
              className="flex items-center gap-2 font-dm text-[13px] text-vridhira-muted hover:text-vridhira-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none"
                   stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                   viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Help Center
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
