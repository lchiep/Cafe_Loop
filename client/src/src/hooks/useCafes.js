import { useQuery } from '@tanstack/react-query'
import { cafeApi } from '../services/api'

/**
 * Fetch cafe list with optional filters.
 * Supports: q, sort, amenities, maxDist, price, lat, lng, limit, page, featured
 *
 * When `q` is present, delegates to search endpoint.
 * Cache: 5 minutes — back-navigation is instant.
 */
export function useCafes(filters = {}) {
  const { q, ...rest } = filters

  return useQuery({
    queryKey: ['cafes', filters],
    queryFn: () => {
      if (q && q.trim().length >= 2) {
        // Search mode — use text search endpoint
        return cafeApi.search(q, rest).then(data => ({
          cafes:  data.cafes || [],
          total:  data.cafes?.length || 0,
          page:   1,
          limit:  rest.limit || 20,
        }))
      }
      // Normal list / filter mode
      return cafeApi.list(rest)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,   // keep previous data while fetching
  })
}

/**
 * Fetch single cafe detail by id.
 */
export function useCafe(id) {
  return useQuery({
    queryKey: ['cafe', id],
    queryFn:  () => cafeApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled:  !!id,
  })
}

/**
 * Search with standalone hook (used in SearchBar autocomplete if needed).
 */
export function useSearchCafes(query) {
  return useQuery({
    queryKey: ['cafes', 'search', query],
    queryFn:  () => cafeApi.search(query),
    staleTime: 2 * 60 * 1000,
    enabled:  (query?.trim().length || 0) >= 2,
  })
}
