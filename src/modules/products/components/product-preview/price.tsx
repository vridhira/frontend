import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-xs mr-1"
          style={{ color: "#8D6E63" }}
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className="text-sm font-semibold"
        style={{ color: price.price_type === "sale" ? "#C9762B" : "#5C4033" }}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  )
}

