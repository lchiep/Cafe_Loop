import { useState, useEffect } from 'react'

/**
 * Detect if viewport matches a media query.
 * Usage: const isDesktop = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}
