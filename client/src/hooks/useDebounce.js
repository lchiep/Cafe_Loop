import { useState, useEffect } from 'react'

/**
 * Delays updating a value until after `delay` ms of no changes.
 * Usage: const debouncedQuery = useDebounce(searchInput, 300)
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
