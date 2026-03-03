// Utility functions for search functionality
export interface SearchResult {
  sources: Array<{
    title: string
    url: string
    description?: string
    content?: string
    markdown?: string
    publishedTime?: string | null
    score?: number
  }>
  images: Array<{
    url: string
    title: string
    alt?: string
    source?: string
    photographer?: string
  }>
  news: Array<{
    title: string
    source: string
    time: string
    url?: string
  }>
}

export function formatSearchResults(data: Partial<SearchResult> = {}): SearchResult {
  return {
    sources: Array.isArray(data.sources) ? data.sources : [],
    images: Array.isArray(data.images) ? data.images : [],
    news: Array.isArray(data.news) ? data.news : []
  }
}

export function validateSearchQuery(query: string): boolean {
  const trimmedQuery = query.trim()
  return trimmedQuery.length > 0 && trimmedQuery.length <= 1000
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim().slice(0, 1000)
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message
    return typeof message === 'string' ? message : undefined
  }
  return undefined
}

export function getSearchError(error: { message?: string; status?: number } | unknown): string {
  const message = getErrorMessage(error)

  if (message?.includes('rate limit')) {
    return 'Search rate limit exceeded. Please try again later.'
  }
  if (message?.includes('API key')) {
    return 'Search service configuration error.'
  }
  if (message?.includes('timeout')) {
    return 'Search request timed out. Please try again.'
  }
  return 'Search failed. Please try again.'
}
