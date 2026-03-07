import Link from "next/link"
import { Suspense } from "react"

import { HelpSearchClient } from "../components/help-search-client"
import {
  getMostViewed,
  getBySection,
  searchArticles,
  TOPICS,
  SIDEBAR_SECTIONS,
  type FAQArticle,
} from "../data/faq"

// ─── Icon helpers (inline SVG, no external deps) ─────────────────────────────

function TopicIcon({ id }: { id: string }) {
  const cls = "w-8 h-8"
  switch (id) {
    case "buying": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    )
    case "shipping": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
    case "payments": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    )
    case "account": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    )
    case "community": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
    case "trust": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    )
    default: return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    )
  }
}

function SidebarIcon({ id }: { id: string }) {
  const cls = "w-5 h-5 flex-shrink-0"
  switch (id) {
    case "all": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
    case "buying": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
    case "shipping": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
    case "payments": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    )
    case "account": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    )
    case "community": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
    case "trust": return (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    )
    default: return null
  }
}

function ArticleIcon() {
  return (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArticleListItem({ article }: { article: FAQArticle }) {
  return (
    <Link
      href={`/help-center/${article.id}`}
      className="group flex items-center gap-6 p-5 rounded-2xl hover:bg-vridhira-surface transition-all border border-transparent hover:border-vridhira-border/40"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-vridhira-surface border border-vridhira-border text-vridhira-accent group-hover:scale-105 transition-transform">
        <ArticleIcon />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-dm font-semibold text-[15px] text-vridhira-text truncate group-hover:text-vridhira-accent transition-colors">
          {article.title}
        </h4>
        <p className="font-dm text-xs text-vridhira-muted mt-0.5 truncate">
          {article.description}
        </p>
      </div>
      <span className="text-vridhira-border group-hover:text-vridhira-accent transition-colors">
        <ArrowRightIcon />
      </span>
    </Link>
  )
}

// ─── Main Template ────────────────────────────────────────────────────────────

type Props = {
  section: string
  q: string
}

export default function HelpCenterTemplate({ section, q }: Props) {
  // Server-side data resolution
  const searchResults = q ? searchArticles(q) : null
  const sectionArticles = !q && section && section !== "all" ? getBySection(section) : null
  const mostViewed = getMostViewed()

  const activeSection = section || "all"

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full py-24 flex items-center justify-center" style={{ paddingTop: 112 }}>
        <div className="w-full max-w-4xl px-6 text-center flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-vridhira-accent/5 border border-vridhira-accent/20 text-vridhira-accent font-dm text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
            Help Center
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-vridhira-text max-w-2xl mx-auto">
            How can we help?
          </h1>
          <p className="font-dm text-base text-vridhira-muted max-w-lg mx-auto mt-4 leading-relaxed">
            Find answers about orders, shipping, and managing your unique artisan shop.
          </p>

          {/* Search bar (client component for controlled input + router navigation) */}
          <Suspense fallback={null}>
            <HelpSearchClient defaultQuery={q} />
          </Suspense>
        </div>
      </div>

      {/* ── Breadcrumb strip ─────────────────────────────────────────────── */}
      <div className="border-y border-vridhira-border/40 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-2.5">
          <nav className="flex flex-wrap items-center gap-1" aria-label="breadcrumb">

            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-vridhira-muted hover:text-vridhira-accent hover:bg-vridhira-surface transition-all"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>

            {/* Chevron */}
            <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>

            {/* Help Center */}
            {!section || section === "all" ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-vridhira-accent bg-vridhira-accent/8 border border-vridhira-accent/20">
                Help Center
              </span>
            ) : (
              <Link
                href="/help-center"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-vridhira-muted hover:text-vridhira-accent hover:bg-vridhira-surface transition-all"
              >
                Help Center
              </Link>
            )}

            {/* Section */}
            {section && section !== "all" && !q && (
              <>
                <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-vridhira-accent bg-vridhira-accent/8 border border-vridhira-accent/20 capitalize">
                  {SIDEBAR_SECTIONS.find((s) => s.id === section)?.label ?? section}
                </span>
              </>
            )}

            {/* Search */}
            {q && (
              <>
                <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-vridhira-accent bg-vridhira-accent/8 border border-vridhira-accent/20">
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  &ldquo;{q}&rdquo;
                </span>
              </>
            )}

          </nav>
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">
              <div>
                <h3 className="font-dm text-[11px] font-bold tracking-[0.1em] uppercase text-vridhira-muted/70 mb-4 px-4">
                  Navigation
                </h3>
                <nav className="space-y-1" aria-label="Help Center sections">
                  {SIDEBAR_SECTIONS.map(({ id, label }) => {
                    const isActive = id === activeSection
                    const href = id === "all" ? "/help-center" : `/help-center?section=${id}`
                    return (
                      <Link
                        key={id}
                        href={href}
                        className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg font-dm text-sm transition-all ${
                          isActive
                            ? "bg-vridhira-surface text-vridhira-accent font-medium"
                            : "text-vridhira-muted hover:bg-vridhira-surface hover:text-vridhira-accent"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <SidebarIcon id={id} />
                        <span>{label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Contact card */}
              <div className="p-6 bg-white rounded-2xl border border-vridhira-border/50 shadow-sm">
                <h4 className="font-serif font-semibold text-base mb-1.5 text-vridhira-text">
                  Need personal help?
                </h4>
                <p className="font-dm text-[13px] text-vridhira-muted mb-4 leading-relaxed">
                  Our support team is here to assist with your specific inquiries.
                </p>
                <Link
                  href="/account"
                  className="block text-center w-full py-2 px-4 bg-transparent border border-vridhira-text/20 text-vridhira-text hover:border-vridhira-accent hover:text-vridhira-accent rounded-lg text-sm font-medium transition-all"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────── */}
          <main className="flex-1 order-1 lg:order-2 min-w-0">

            {/* ── Search results ──────────────────────────────────────── */}
            {searchResults !== null && (
              <section className="mb-16">
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-vridhira-border/40">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-vridhira-text">
                      Search results
                    </h2>
                    <p className="font-dm text-sm text-vridhira-muted mt-2">
                      {searchResults.length === 0
                        ? `No results for "${q}"`
                        : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${q}"`}
                    </p>
                  </div>
                  <Link href="/help-center" className="font-dm text-xs text-vridhira-accent hover:text-vridhira-primary font-semibold transition-colors">
                    Clear search
                  </Link>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-vridhira-muted">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <p className="font-serif text-xl">No articles found</p>
                    <p className="font-dm text-sm mt-2">Try different keywords or browse topics below.</p>
                    <Link
                      href="/help-center"
                      className="mt-6 inline-flex items-center gap-2 text-sm text-vridhira-accent hover:underline"
                    >
                      Browse all topics
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* ── Section-filtered articles ────────────────────────────── */}
            {sectionArticles !== null && (
              <section className="mb-16">
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-vridhira-border/40">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-vridhira-text capitalize">
                      {TOPICS.find((t) => t.id === section)?.title ?? section}
                    </h2>
                    <p className="font-dm text-sm text-vridhira-muted mt-2">
                      {sectionArticles.length} article{sectionArticles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link href="/help-center" className="font-dm text-xs text-vridhira-accent hover:text-vridhira-primary font-semibold transition-colors">
                    ← All topics
                  </Link>
                </div>
                <div className="space-y-2">
                  {sectionArticles.map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Overview (Topics grid + Most Viewed) ─────────────────── */}
            {searchResults === null && sectionArticles === null && (
              <>
                {/* Topics */}
                <section className="mb-16">
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-vridhira-border/40">
                    <div>
                      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-vridhira-text">Topics</h2>
                      <p className="font-dm text-sm text-vridhira-muted mt-2">Select a category to explore</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOPICS.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/help-center?section=${topic.id}`}
                        className="group flex flex-col p-6 bg-white rounded-2xl border border-vridhira-border/40 hover:border-vridhira-accent/30 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                      >
                        <div className="mb-5 text-vridhira-muted group-hover:text-vridhira-accent transition-colors">
                          <TopicIcon id={topic.id} />
                        </div>
                        <h3 className="font-dm text-base font-bold text-vridhira-text mb-2">
                          {topic.title}
                        </h3>
                        <p className="font-dm text-[13px] text-vridhira-muted leading-relaxed">
                          {topic.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Most Viewed */}
                <section className="bg-white rounded-3xl p-10 shadow-sm border border-vridhira-border/40">
                  <div className="flex items-baseline justify-between mb-8">
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-vridhira-text">
                    </h2>
                    <Link
                      href="/help-center?section=buying"
                      className="text-sm font-semibold text-vridhira-accent hover:text-vridhira-primary transition-colors tracking-wide"
                    >
                      View all articles →
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {mostViewed.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              </>
            )}

          </main>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="border-t border-vridhira-border/60 mt-8 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mb-6 flex justify-center text-vridhira-accent opacity-80">
            <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93 19.07 19.07" />
              <path d="M12 2a10 10 0 0 1 7.07 17.07" />
              <path d="M8.46 8.46A5 5 0 0 0 12 7a5 5 0 0 1 5 5 5 5 0 0 0-1.46 3.54" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-vridhira-text">
            Still can&apos;t find what you need?
          </h2>
          <p className="font-dm text-base text-vridhira-muted mb-10 max-w-lg mx-auto">
            Our dedicated support team is available to assist with your creative journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account"
              className="inline-flex justify-center items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "#C9762B", boxShadow: "0 4px 16px rgba(201,118,43,0.3)" }}
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-vridhira-text border border-vridhira-border hover:border-vridhira-accent/50 transition-all"
            >
              Visit Community Forum
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
