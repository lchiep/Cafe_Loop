import { useQuery } from '@tanstack/react-query'
import { reviewApi } from '../services/api'

/**
 * Fetch reviews for a specific cafe.
 * Only fires when cafeId is truthy.
 */
export function useReviews(cafeId) {
  return useQuery({
    queryKey: ['reviews', cafeId],
    queryFn:  () => reviewApi.list(cafeId),
    staleTime: 2 * 60 * 1000,
    enabled:  !!cafeId,
  })
}
