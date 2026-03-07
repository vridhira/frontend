import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div
        data-testid="product-wrapper"
        className="rounded-2xl overflow-hidden transition-all duration-300 h-full hover:-translate-y-1"
        style={{
          background: "#FFFDF9",
          border: "1px solid #E8DDD4",
          boxShadow: "0 1px 4px rgba(139, 69, 19, 0.06)",
        }}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-[#F5EFE7]" style={{ aspectRatio: "1 / 1" }}>
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="!rounded-none !shadow-none !p-0 !bg-transparent w-full h-full"
          />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
            style={{ background: "linear-gradient(to top, rgba(44,24,16,0.45) 0%, transparent 60%)" }}
          >
            <span
              className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
              style={{ background: "rgba(250,247,242,0.9)", color: "#8B4513" }}
            >
              View Product
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <p
            className="text-sm font-medium leading-snug mb-1 line-clamp-2"
            style={{ color: "#2C1810" }}
            data-testid="product-title"
          >
            {product.title}
          </p>
          <div className="flex items-center justify-between mt-1">
            {cheapestPrice && (
              <span
                className="text-sm font-semibold"
                style={{ color: "#C9762B" }}
              >
                <PreviewPrice price={cheapestPrice} />
              </span>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

