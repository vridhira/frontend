/**
 * FAQ Articles Store API Client
 *
 * Service for fetching FAQ articles from the store endpoint.
 * Used by the storefront to display help center articles.
 */

export type FaqArticle = {
  id: string
  title: string
  description: string
  section: "buying" | "shipping" | "payments" | "account" | "trust"
  content: string
  is_visible: boolean
  display_order: number
  total_views: number
  created_at: string
  updated_at: string
}

export type FaqArticlesResponse = {
  articles: FaqArticle[]
  count: number
  offset: number
  limit: number
}

class FaqArticlesStoreService {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "") {
    this.baseUrl = baseUrl
  }

  /**
   * Fetch visible FAQ articles from the store API
   */
  async listArticles(params?: {
    section?: string
    limit?: number
    offset?: number
  }): Promise<FaqArticlesResponse> {
    const queryParams = new URLSearchParams()

    if (params?.section) {
      queryParams.set("section", params.section)
    }
    if (params?.limit) {
      queryParams.set("limit", params.limit.toString())
    }
    if (params?.offset) {
      queryParams.set("offset", params.offset.toString())
    }

    const url = `${this.baseUrl}/store/faq-articles?${queryParams.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch FAQ articles: ${response.statusText}`
      )
    }

    return await response.json()
  }

  /**
   * Fetch articles by section
   */
  async getBySection(section: string, limit: number = 50): Promise<FaqArticle[]> {
    const response = await this.listArticles({
      section,
      limit,
      offset: 0,
    })
    return response.articles
  }

  /**
   * Fetch articles with search (client-side filtering)
   */
  async search(query: string, section?: string): Promise<FaqArticle[]> {
    const response = await this.listArticles({
      section,
      limit: 200,
      offset: 0,
    })

    const searchLower = query.toLowerCase()
    return response.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower)
    )
  }

  /**
   * Fetch all visible articles
   */
  async getAllArticles(): Promise<FaqArticle[]> {
    const response = await this.listArticles({
      limit: 1000,
      offset: 0,
    })
    return response.articles
  }

  /**
   * Get articles organized by section
   */
  async getByAllSections(): Promise<Record<string, FaqArticle[]>> {
    const sections = [
      "buying",
      "shipping",
      "payments",
      "account",
      "trust",
    ]
    const result: Record<string, FaqArticle[]> = {}

    for (const section of sections) {
      result[section] = await this.getBySection(section)
    }

    return result
  }
}

// Export singleton instance
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
export const faqArticlesStoreService = new FaqArticlesStoreService(baseUrl)
