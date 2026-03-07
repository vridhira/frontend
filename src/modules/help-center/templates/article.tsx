import Link from "next/link"
import { notFound } from "next/navigation"

import {
  getArticleById,
  getRelated,
  getSectionLabel,
  ARTICLES,
  type FAQArticle,
} from "../data/faq"

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
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

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.9 10.1 19 8.7 19 7a7 7 0 1 0-13.9 1.3C5.4 9.9 6.6 11.2 8 12.5c.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  )
}

function ArticleIcon() {
  return (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

type Props = { articleId: string }

export default function ArticleDetailTemplate({ articleId }: Props) {
  const article = getArticleById(articleId)
  if (!article) notFound()

  const related = getRelated(article)
  const sectionLabel = getSectionLabel(article.section)

  // Prev / next within same section
  const sectionArticles = ARTICLES.filter((a) => a.section === article.section)
  const idx = sectionArticles.findIndex((a) => a.id === article.id)
  const prev = idx > 0 ? sectionArticles[idx - 1] : null
  const next = idx < sectionArticles.length - 1 ? sectionArticles[idx + 1] : null

  return (
    <div className="bg-[#FAF7F2] min-h-screen">

      {/* ── Breadcrumb strip ─────────────────────────────────────────────── */}
      <div
        className="border-b border-vridhira-border/40 bg-white/60 backdrop-blur-sm"
        style={{ paddingTop: 88 }}
      >
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

            <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>

            {/* Help Center */}
            <Link
              href="/help-center"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-vridhira-muted hover:text-vridhira-accent hover:bg-vridhira-surface transition-all"
            >
              Help Center
            </Link>

            <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>

            {/* Section */}
            <Link
              href={`/help-center?section=${article.section}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-vridhira-muted hover:text-vridhira-accent hover:bg-vridhira-surface transition-all capitalize"
            >
              {sectionLabel}
            </Link>

            <svg className="w-3 h-3 text-vridhira-border flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>

            {/* Article title — active pill */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-vridhira-accent bg-vridhira-accent/8 border border-vridhira-accent/20 truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>

          </nav>
        </div>
      </div>

      {/* ── Page body ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">

              {/* Back link */}
              <Link
                href={`/help-center?section=${article.section}`}
                className="inline-flex items-center gap-2 font-dm text-[13px] text-vridhira-muted hover:text-vridhira-accent transition-colors font-medium"
              >
                <ArrowLeftIcon />
                Back to {sectionLabel}
              </Link>

              {/* Articles in same section */}
              <div>
                <h3 className="font-dm text-[11px] font-bold tracking-[0.1em] uppercase text-vridhira-muted/70 mb-3 px-1">
                  {sectionLabel}
                </h3>
                <nav className="space-y-1" aria-label="Articles in this section">
                  {sectionArticles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/help-center/${a.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-dm text-[13px] transition-all ${
                        a.id === article.id
                          ? "bg-vridhira-surface text-vridhira-accent font-medium"
                          : "text-vridhira-muted hover:bg-vridhira-surface hover:text-vridhira-accent"
                      }`}
                      aria-current={a.id === article.id ? "page" : undefined}
                    >
                      <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                      {a.title}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Contact card */}
              <div className="p-5 bg-white rounded-2xl border border-vridhira-border/50 shadow-sm">
                <h4 className="font-serif font-semibold text-base mb-1 text-vridhira-text">
                  Still need help?
                </h4>
                <p className="font-dm text-xs text-vridhira-muted mb-3 leading-relaxed">
                  Our support team is here for your specific inquiries.
                </p>
                <Link
                  href="/account"
                  className="block text-center w-full py-2 px-3 bg-transparent border border-vridhira-text/20 text-vridhira-text hover:border-vridhira-accent hover:text-vridhira-accent rounded-lg text-sm font-medium transition-all"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Main article ───────────────────────────────────────────── */}
          <main className="flex-1 order-1 lg:order-2 min-w-0 max-w-3xl">

            {/* Article header */}
            <div className="mb-10 pb-8 border-b border-vridhira-border/40">
              <span className="inline-block font-dm text-[10px] font-bold uppercase tracking-[0.15em] text-vridhira-accent bg-vridhira-accent/5 border border-vridhira-accent/20 px-3 py-1 rounded-full mb-5">
                {sectionLabel}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-vridhira-text leading-[1.15] tracking-tight">
                {article.title}
              </h1>
              <p className="font-dm mt-4 text-base text-vridhira-muted leading-relaxed">
                {article.description}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8 mb-12">
              {article.steps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  {/* Step number badge */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-vridhira-accent bg-vridhira-accent/10 border border-vridhira-accent/20 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-dm text-[17px] font-semibold text-vridhira-text mb-2">
                      {step.heading}
                    </h2>
                    <p className="font-dm text-[15px] text-vridhira-muted leading-relaxed">
                      {step.body}
                    </p>
                    {/* Inline link */}
                    {step.link && (
                      <Link
                        href={step.link.href}
                        className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-vridhira-accent hover:underline transition-colors"
                      >
                        {step.link.label}
                      </Link>
                    )}
                    {/* Inline button */}
                    {step.button && (
                      <Link
                        href={step.button.href}
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-vridhira-accent/10 border border-vridhira-accent/25 text-sm font-semibold text-vridhira-accent hover:bg-vridhira-accent hover:text-white transition-all"
                      >
                        {step.button.label}
                        <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips box */}
            {article.tips && article.tips.length > 0 && (
              <div className="mb-12 rounded-2xl bg-amber-50 border border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-4 text-amber-700">
                  <LightbulbIcon />
                  <h3 className="font-dm font-semibold text-[15px]">Helpful tips</h3>
                </div>
                <ul className="space-y-3">
                  {article.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 font-dm text-[13px] text-amber-800 leading-relaxed">
                      <span className="text-amber-600 mt-0.5"><CheckIcon /></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="mb-12 flex flex-col sm:flex-row gap-3">
              {prev && (
                <Link
                  href={`/help-center/${prev.id}`}
                  className="flex-1 flex items-center gap-3 p-4 bg-white rounded-xl border border-vridhira-border/40 hover:border-vridhira-accent/30 hover:shadow-md transition-all group"
                >
                  <ArrowLeftIcon />
                  <div className="min-w-0">
                    <div className="font-dm text-[10px] font-bold uppercase tracking-wide text-vridhira-muted/60 mb-0.5">Previous</div>
                    <div className="font-dm text-[13px] font-medium text-vridhira-text group-hover:text-vridhira-accent truncate transition-colors">
                      {prev.title}
                    </div>
                  </div>
                </Link>
              )}
              {next && (
                <Link
                  href={`/help-center/${next.id}`}
                  className="flex-1 flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-vridhira-border/40 hover:border-vridhira-accent/30 hover:shadow-md transition-all group text-right"
                >
                  <div className="min-w-0">
                    <div className="font-dm text-[10px] font-bold uppercase tracking-wide text-vridhira-muted/60 mb-0.5">Next</div>
                    <div className="font-dm text-[13px] font-medium text-vridhira-text group-hover:text-vridhira-accent truncate transition-colors">
                      {next.title}
                    </div>
                  </div>
                  <ArrowRightIcon />
                </Link>
              )}
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div>
                <h3 className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70 mb-4">
                  Related articles
                </h3>
                <div className="space-y-2">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/help-center/${rel.id}`}
                      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-vridhira-border/40 hover:border-vridhira-accent/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-vridhira-surface border border-vridhira-border text-vridhira-accent group-hover:scale-105 transition-transform">
                        <ArticleIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm font-semibold text-[13px] text-vridhira-text group-hover:text-vridhira-accent transition-colors truncate">
                          {rel.title}
                        </p>
                        <p className="font-dm text-xs text-vridhira-muted mt-0.5 truncate">
                          {rel.description}
                        </p>
                      </div>
                      <ArrowRightIcon />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="border-t border-vridhira-border/60 mt-4 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3 text-vridhira-text">
            Was this article helpful?
          </h2>
          <p className="font-dm text-sm text-vridhira-muted mb-8">
            If you&apos;re still stuck, our support team is one click away.
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
              href="/help-center"
              className="inline-flex justify-center items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-vridhira-text border border-vridhira-border hover:border-vridhira-accent/50 transition-all"
            >
              Browse Help Center
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
