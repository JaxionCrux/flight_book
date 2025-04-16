"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Calendar, User, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "./filter-sidebar"

export function SearchSummary() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<{
    origin: string
    originCode: string
    destination: string
    destinationCode: string
    departureDate: string
    returnDate?: string
    adults: number
    cabinClass: string
    tripType: string
  } | null>(null)

  useEffect(() => {
    // Get search parameters from session storage
    const params = sessionStorage.getItem("flightSearchParams")
    if (params) {
      setSearchParams(JSON.parse(params))
    }
  }, [])

  if (!searchParams) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-20 md:top-24 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Route and dates */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">From</span>
                <span className="font-semibold">{searchParams.originCode}</span>
              </div>
              <ArrowRight className="mx-2 text-gray-400" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">To</span>
                <span className="font-semibold">{searchParams.destinationCode}</span>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-400" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Dates</span>
                <span className="font-semibold">
                  {formatDate(searchParams.departureDate)}
                  {searchParams.returnDate && ` - ${formatDate(searchParams.returnDate)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <User className="mr-2 text-gray-400" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Travelers</span>
                <span className="font-semibold">
                  {searchParams.adults} {searchParams.adults === 1 ? "Adult" : "Adults"},{" "}
                  {searchParams.cabinClass.charAt(0).toUpperCase() + searchParams.cabinClass.slice(1).replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex items-center gap-2">
                  <Filter size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="p-6 overflow-y-auto h-full">
                  <h2 className="text-xl font-bold mb-4">Filters</h2>
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Modify Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
