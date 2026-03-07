"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <ul className="space-y-1">
      {sortOptions.map((opt) => {
        const isActive = sortBy === opt.value
        return (
          <li key={opt.value}>
            <button
              onClick={() => handleChange(opt.value as SortOptions)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all duration-200"
              style={{
                background: isActive ? "rgba(201,118,43,0.10)" : "transparent",
                color: isActive ? "#8B4513" : "#5C4033",
                fontWeight: isActive ? 600 : 400,
                border: isActive ? "1px solid rgba(201,118,43,0.25)" : "1px solid transparent",
                cursor: "pointer",
              }}
              data-testid={dataTestId}
            >
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#C9762B" }}
                />
              )}
              {!isActive && <span className="w-1.5 h-1.5 flex-shrink-0" />}
              {opt.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default SortProducts
