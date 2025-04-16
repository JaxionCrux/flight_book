"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (!query) return undefined

    const mediaQuery = window.matchMedia(query)
    const handler = () => setMatches(mediaQuery.matches)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Add listener for changes
    mediaQuery.addEventListener("change", handler)

    // Clean up
    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}
