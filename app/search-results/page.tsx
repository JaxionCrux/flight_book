"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlightSearchResults } from "@/components/flight-search-results"
import { SearchSummary } from "@/components/search-summary"
import { FilterSidebar } from "@/components/filter-sidebar"
import { searchFlightsAction } from "@/app/actions/flight-actions"

export default function SearchResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchResults() {
      try {
        setIsLoading(true)

        // First try to get results from sessionStorage
        const storedParams = sessionStorage.getItem("flightSearchParams")

        if (storedParams) {
          const params = JSON.parse(storedParams)

          // Create FormData from stored parameters
          const formData = new FormData()

          if (params.tripType === "multi_city") {
            formData.append("tripType", "multi_city")
            formData.append("adults", params.adults.toString())
            formData.append("cabinClass", params.cabinClass)

            params.multiCityFlights.forEach((flight, index) => {
              formData.append(`origin_${index}`, flight.originCode)
              formData.append(`destination_${index}`, flight.destinationCode)
              formData.append(`date_${index}`, flight.date)
            })

            formData.append("segments", params.multiCityFlights.length.toString())
          } else {
            formData.append("origin", params.origin)
            formData.append("destination", params.destination)
            formData.append("departureDate", params.departureDate)

            if (params.returnDate) {
              formData.append("returnDate", params.returnDate)
            }

            formData.append("adults", params.adults.toString())
            formData.append("cabinClass", params.cabinClass)
            formData.append("tripType", params.tripType)
          }

          // Fetch results directly
          const response = await searchFlightsAction(formData)

          if (response.success && response.data) {
            setSearchResults(response.data)
            // Make results available to the FlightSearchResults component
            window._flightSearchResultsData = response.data
          } else {
            setError(response.error || "Failed to fetch flight results. Please try searching again.")
          }
        } else {
          setError("No search parameters found. Please try searching again.")
        }
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("An unexpected error occurred. Please try searching again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  // Store results in component state for FlightSearchResults to use
  useEffect(() => {
    if (searchResults) {
      // Make results available to the FlightSearchResults component
      // without using sessionStorage for the full results
      window._flightSearchResultsData = searchResults
    }
  }, [searchResults])

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 pt-20 md:pt-24">
        {/* Search summary bar */}
        <SearchSummary />

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters - desktop only */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </div>

            {/* Results */}
            <div className="flex-1">
              {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
              ) : (
                <FlightSearchResults isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
