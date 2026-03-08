"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  id: string
  name: string
  handle: string
  level: number
}

interface CategoryBreadcrumbProps {
  categoryId: string
}

/**
 * CategoryBreadcrumb - Display breadcrumb navigation for categories
 * Shows: Home > Electronics > Computers > Laptops
 */
export const CategoryBreadcrumb = ({ categoryId }: CategoryBreadcrumbProps) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBreadcrumb = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/categories/${categoryId}/breadcrumb`
        )
        const data = await response.json()
        setBreadcrumb(data.breadcrumb || [])
      } catch (err) {
        console.error("Failed to fetch breadcrumb:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchBreadcrumb()
    }
  }, [categoryId])

  if (loading) {
    return (
      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
    )
  }

  if (error || !breadcrumb || breadcrumb.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Home
      </Link>

      {breadcrumb.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-gray-400" />
          {index === breadcrumb.length - 1 ? (
            <span className="text-gray-700 font-medium">{item.name}</span>
          ) : (
            <Link
              href={`/categories/${item.handle}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export default CategoryBreadcrumb
