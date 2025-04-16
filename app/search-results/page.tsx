"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlightSearchResults } from "@/components/flight-search-results"
import { SearchSummary } from "@/components/search-summary"
import { FilterSidebar } from "@/components/filter-sidebar"

export default function SearchResultsPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
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
              <FlightSearchResults />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
