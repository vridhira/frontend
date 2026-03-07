"use client"

import { useState, useTransition } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FormState =
  | { stage: "idle" }
  | { stage: "submitting" }
  | { stage: "success"; subject: string }
  | { stage: "error"; message: string }

const BACKEND_URL =
  typeof window !== "undefined"
    ? ""
    : (process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000")

/**
 * AskFormClient – client-side form that POSTs a customer query to
 * POST /store/faq-queries on the Medusa backend.
 */
export function AskFormClient() {
  const [state, setState] = useState<FormState>({ stage: "idle" })
  const [, startTransition] = useTransition()

  const isSubmitting = state.stage === "submitting"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSubmitting) return

    const fd = new FormData(e.currentTarget)
    const name     = (fd.get("customer_name")  as string ?? "").trim()
    const email    = (fd.get("customer_email") as string ?? "").trim()
    const subject  = (fd.get("subject")        as string ?? "").trim()
    const question = (fd.get("question")       as string ?? "").trim()

    // Client-side quick validation (mirrors server rules)
    if (name.length < 2 || name.length > 100) {
      return setState({ stage: "error", message: "Name must be 2–100 characters." })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return setState({ stage: "error", message: "Please enter a valid email address." })
    }
    if (subject.length < 3 || subject.length > 150) {
      return setState({ stage: "error", message: "Subject must be 3–150 characters." })
    }
    if (question.length < 10 || question.length > 2000) {
      return setState({ stage: "error", message: "Question must be 10–2000 characters." })
    }

    setState({ stage: "submitting" })

    startTransition(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/store/faq-queries`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ customer_name: name, customer_email: email, subject, question }),
        })

        if (res.status === 429) {
          setState({ stage: "error", message: "Too many questions submitted. Please try again in an hour." })
          return
        }

        const json = await res.json()

        if (!res.ok) {
          setState({ stage: "error", message: json.error ?? json.message ?? "Something went wrong. Please try again." })
          return
        }

        setState({ stage: "success", subject: json.faq_query?.subject ?? subject })
      } catch {
        setState({ stage: "error", message: "Network error. Please check your connection and try again." })
      }
    })
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (state.stage === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        {/* checkmark circle */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
             style={{ background: "rgba(201,118,43,0.10)", border: "1px solid rgba(201,118,43,0.25)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
               stroke="#C9762B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
               viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="font-serif font-semibold text-2xl text-vridhira-text">Question submitted!</p>
          <p className="font-dm text-sm text-vridhira-muted mt-2 max-w-sm mx-auto">
            We&apos;ve received your question about &ldquo;{state.subject}&rdquo;.
            Our team will get back to you as soon as possible.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <LocalizedClientLink
            href="/help-center"
            className="font-dm text-sm font-semibold px-6 py-3 rounded-xl border border-vridhira-border hover:bg-vridhira-surface transition-colors"
            style={{ color: "#2C1810" }}
          >
            ← Back to Help Center
          </LocalizedClientLink>
          <button
            type="button"
            onClick={() => setState({ stage: "idle" })}
            className="font-dm text-sm font-semibold px-6 py-3 rounded-xl text-white transition-colors"
            style={{ background: "#C9762B" }}
          >
            Ask another question
          </button>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Error banner */}
      {state.stage === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-dm"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", color: "#b91c1c" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               viewBox="0 0 24 24" className="shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.message}
        </div>
      )}

      {/* Row 1 — name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70">
            Your name <span aria-hidden="true" style={{ color: "#C9762B" }}>*</span>
          </span>
          <input
            type="text"
            name="customer_name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Priya Sharma"
            disabled={isSubmitting}
            className="font-dm text-sm w-full h-11 px-4 rounded-xl border border-vridhira-border bg-white
                       text-vridhira-text placeholder:text-vridhira-muted/40
                       focus:outline-none focus:ring-2 focus:ring-vridhira-accent/30 focus:border-vridhira-accent
                       disabled:opacity-50 transition-all"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70">
            Email address <span aria-hidden="true" style={{ color: "#C9762B" }}>*</span>
          </span>
          <input
            type="email"
            name="customer_email"
            required
            maxLength={254}
            placeholder="priya@example.com"
            disabled={isSubmitting}
            className="font-dm text-sm w-full h-11 px-4 rounded-xl border border-vridhira-border bg-white
                       text-vridhira-text placeholder:text-vridhira-muted/40
                       focus:outline-none focus:ring-2 focus:ring-vridhira-accent/30 focus:border-vridhira-accent
                       disabled:opacity-50 transition-all"
          />
        </label>
      </div>

      {/* Row 2 — subject */}
      <label className="flex flex-col gap-1.5">
        <span className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70">
          Subject <span aria-hidden="true" style={{ color: "#C9762B" }}>*</span>
        </span>
        <input
          type="text"
          name="subject"
          required
          minLength={3}
          maxLength={150}
          placeholder="e.g. Where is my order?"
          disabled={isSubmitting}
          className="font-dm text-sm w-full h-11 px-4 rounded-xl border border-vridhira-border bg-white
                     text-vridhira-text placeholder:text-vridhira-muted/40
                     focus:outline-none focus:ring-2 focus:ring-vridhira-accent/30 focus:border-vridhira-accent
                     disabled:opacity-50 transition-all"
        />
      </label>

      {/* Row 3 — question */}
      <label className="flex flex-col gap-1.5">
        <span className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-vridhira-muted/70">
          Your question <span aria-hidden="true" style={{ color: "#C9762B" }}>*</span>
        </span>
        <textarea
          name="question"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="Please describe your question in detail…"
          disabled={isSubmitting}
          className="font-dm text-sm w-full px-4 py-3 rounded-xl border border-vridhira-border bg-white
                     text-vridhira-text placeholder:text-vridhira-muted/40 resize-y min-h-[120px]
                     focus:outline-none focus:ring-2 focus:ring-vridhira-accent/30 focus:border-vridhira-accent
                     disabled:opacity-50 transition-all"
        />
        <span className="font-dm text-[11px] text-vridhira-muted/50 text-right">max 2000 characters</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="font-dm text-sm font-semibold h-12 rounded-xl text-white transition-all duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
        style={{ background: "#C9762B" }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </span>
        ) : (
          "Submit question"
        )}
      </button>

      <p className="font-dm text-[11px] text-vridhira-muted/50 text-center leading-relaxed">
        By submitting, you agree to our{" "}
        <LocalizedClientLink href="/" className="underline hover:text-vridhira-accent">
          Privacy Policy
        </LocalizedClientLink>
        . We typically respond within 1–2 business days.
      </p>
    </form>
  )
}
