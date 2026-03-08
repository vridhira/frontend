/**
 * Frontend Store Components - Category Browsing
 * These components are for your storefront (Next.js app)
 *
 * Place in: vridhira-storefront/src/components/categories/
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Category {
  id: string
  name: string
  handle: string
  level: number
  children?: Category[]
}

/**
 * CategorySidebar - Display categories in a sidebar
 * Shows the full category tree with links
 */
export const CategorySidebar = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/store/categories?tree=true`
        )
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const renderCategory = (category: Category): JSX.Element => {
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id} className="mb-1">
        <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded transition">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronRight
                size={16}
                className={`transform transition ${
                  expandedIds.has(category.id) ? "rotate-90" : ""
                }`}
              />
            </button>
          ) : (
            <div className="w-4" />
          )}

          <Link
            href={`/categories/${category.handle}`}
            className="flex-1 text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            {category.name}
          </Link>
        </div>

        {hasChildren && expandedIds.has(category.id) && (
          <div className="ml-4 border-l border-gray-200">
            {category.children!.map((child) => renderCategory(child))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="p-4 text-gray-600">Loading categories...</div>
  }

  if (!categories || categories.length === 0) {
    return <div className="p-4 text-gray-600">No categories available</div>
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => renderCategory(category))}
      </div>
    </div>
  )
}

export default CategorySidebar
