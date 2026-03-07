"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

const POPULAR_TAGS = ["Returns", "Shipping", "Refund"]

export function HelpSearchClient({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(defaultQuery)
  const [isPending, startTransition] = useTransition()

  function navigate(q: string) {
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    startTransition(() => {
      router.push(`${pathname}${params.toString() ? "?" + params.toString() : ""}`)
    })
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(query)
  }

  return (
    <div className="w-full max-w-2xl mt-16 relative">
      <form onSubmit={onSubmit}>
        <label className="relative flex w-full items-center bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-vridhira-border focus-within:ring-1 focus-within:ring-vridhira-accent/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <span className="pl-6 text-vridhira-muted/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for answers..."
            className="w-full h-16 border-none bg-transparent px-4 text-lg text-vridhira-text placeholder:text-vridhira-muted/40 focus:ring-0 font-sans outline-none"
            aria-label="Search help center articles"
          />
          <button
            type="submit"
            disabled={isPending}
            className="mr-2 px-6 py-2.5 bg-vridhira-text hover:bg-vridhira-primary text-white font-medium rounded-xl transition-colors text-sm tracking-wide disabled:opacity-60"
          >
            {isPending ? "Searching…" : "Search"}
          </button>
        </label>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-vridhira-muted">
        <span className="font-medium opacity-60">Popular:</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => { setQuery(tag); navigate(tag) }}
            className="hover:text-vridhira-accent hover:underline transition-all decoration-1 underline-offset-4"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
