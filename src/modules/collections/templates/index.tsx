import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SortBar from "@modules/store/components/sort-bar"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  inStock,
  isNew,
  hasSale,
  maxPrice,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  inStock?: boolean
  isNew?: boolean
  hasSale?: boolean
  maxPrice?: number
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6 content-container">
      <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
        <RefinementList />
      </aside>
      <div className="flex-1 min-w-0">
        <div className="mb-8 flex items-center justify-between text-2xl-semi">
          <h1>{collection.title}</h1>
          <SortBar sortBy={sort} inStock={inStock} isNew={isNew} hasSale={hasSale} maxPrice={maxPrice} />
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            inStock={inStock}
            isNew={isNew}
            hasSale={hasSale}
            maxPrice={maxPrice}
          />
        </Suspense>
      </div>
    </div>
  )
}
