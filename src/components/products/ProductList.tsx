"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  handle: string
  price: number
  image_url?: string
  description?: string
  stock_quantity: number
}

interface ProductListProps {
  categoryId?: string
  limit?: number
  featured?: boolean
}

/**
 * ProductList - Display products with optional category filtering
 */
export const ProductList = ({
  categoryId,
  limit = 12,
  featured = false,
}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/store/products`

        if (categoryId) {
          url += `?category_id=${categoryId}&limit=${limit}`
        }

        const response = await fetch(url)
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load products
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        No products found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.handle}`}
          className="group"
        >
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price?.toFixed(2) || "N/A"}
                </span>
                <span
                  className={`text-sm font-medium ${
                    product.stock_quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock_quantity > 0 ? "In Stock" : "Out"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductList
