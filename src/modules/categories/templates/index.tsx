import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { listCategories } from "@lib/data/categories"
import SortBar from "@modules/store/components/sort-bar"

// Emoji map — same as sidebar, used in the banner
const EMOJI_MAP: Record<string, string> = {
  textile:              "🧵",
  pottery:              "🏺",
  ceramic:              "🪙",
  Crochet:              "🧶",
  terracotta:           "🪴",
  art:                  "🎨",
  woodcraft:            "🪵",
  "handmade-jewellery": "💎",
}

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  inStock,
  isNew,
  hasSale,
  maxPrice
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  inStock?: boolean
  isNew?: boolean
  hasSale?: boolean
  maxPrice?: number
}) {
  if (!category || !countryCode) notFound()

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Single fetch for sidebar categories — same call, auto-revalidates every 30s
  const allCategories = await listCategories({ limit: 100 }).catch(() => [])

  // Build breadcrumb parents (reversed so top-most is first)
  const parents: HttpTypes.StoreProductCategory[] = []
  const collectParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.unshift(cat.parent_category)
      collectParents(cat.parent_category)
    }
  }
  collectParents(category)

  const emoji = EMOJI_MAP[category.handle ?? ""] ?? "🛍️"

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }} data-testid="category-container">

      {/* ── Banner — pt-[88px] clears the fixed navbar ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 50%, #EDE0D0 100%)",
          borderBottom: "1px solid #E8DDD4",
          paddingTop: 88,
        }}
      >
        {/* Decorative blob */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #C9762B 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto pl-12 pr-6 lg:pl-20 lg:pr-8 pt-10 pb-16 lg:pb-20 relative">

          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-1 mb-7" aria-label="Breadcrumb">
            {/* Home chip */}
            <LocalizedClientLink
              href="/store"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-sm"
              style={{
                background: "rgba(201,118,43,0.08)",
                color: "#8B4513",
                border: "1px solid rgba(201,118,43,0.18)",
              }}
            >
              {/* tiny shop bag icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Shop
            </LocalizedClientLink>

            {/* Arrow separator + parent chips */}
            {parents.map((p) => (
              <span key={p.id} className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9BA9B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                <LocalizedClientLink
                  href={`/categories/${p.handle}`}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-sm"
                  style={{
                    background: "rgba(201,118,43,0.08)",
                    color: "#8B4513",
                    border: "1px solid rgba(201,118,43,0.18)",
                  }}
                >
                  {p.name}
                </LocalizedClientLink>
              </span>
            ))}

            {/* Arrow + current page (non-clickable, solid) */}
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9BA9B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(44,24,16,0.07)",
                  color: "#2C1810",
                  border: "1px solid rgba(44,24,16,0.12)",
                }}
              >
                {category.name}
              </span>
            </span>
          </nav>

          {/* Emoji badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4"
            style={{
              background: "rgba(201,118,43,0.10)",
              color: "#8B4513",
              border: "1px solid rgba(201,118,43,0.20)",
            }}
          >
            <span aria-hidden="true">{emoji}</span>
            <span className="uppercase tracking-[0.15em]">Handcrafted Collection</span>
          </div>

          {/* Heading */}
          <h1
            className="font-serif text-5xl lg:text-6xl font-semibold mb-4"
            style={{ color: "#2C1810", lineHeight: 1.1 }}
            data-testid="category-page-title"
          >
            {category.name}
          </h1>

          {/* Description — shown only when set from admin */}
          {category.description ? (
            <p
              className="text-base max-w-2xl leading-relaxed"
              style={{ color: "#6B4C3B" }}
            >
              {category.description}
            </p>
          ) : (
            <p
              className="text-sm max-w-xl italic"
              style={{ color: "#A08070" }}
            >
              Discover handcrafted {category.name.toLowerCase()} pieces made by skilled artisans across India.
            </p>
          )}

          {/* Subcategory pills */}
          {category.category_children && category.category_children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="text-xs self-center mr-1" style={{ color: "#8D6E63" }}>Browse:</span>
              {category.category_children.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-sm"
                  style={{
                    background: "rgba(201,118,43,0.10)",
                    color: "#8B4513",
                    border: "1px solid rgba(201,118,43,0.22)",
                  }}
                >
                  {c.name}
                </LocalizedClientLink>
              ))}
            </div>
          )}

          {/* Decorative underline */}
          <div
            className="mt-8 h-px w-32"
            style={{ background: "linear-gradient(90deg, #C9762B 0%, rgba(201,118,43,0.3) 60%, transparent 100%)" }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <RefinementList
              categories={allCategories}
              categoryHandle={category.handle}
              data-testid="sort-by-container"
            />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Sort bar row */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "flex-end",
                marginBottom:   20,
              }}
            >
              <SortBar sortBy={sort} inStock={inStock} isNew={isNew} hasSale={hasSale} maxPrice={maxPrice} />
            </div>

            <Suspense fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                inStock={inStock}
                isNew={isNew}
                hasSale={hasSale}
                maxPrice={maxPrice}
              />
            </Suspense>
          </div>

        </div>
      </div>

    </div>
  )
}
