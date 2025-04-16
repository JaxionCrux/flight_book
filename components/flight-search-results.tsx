"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
  ArrowRight,
  Luggage,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SearchLoadingAnimation } from "@/components/search-loading-animation"
import type { FlightOffer } from "@/lib/duffel"

// Add this at the top of the file, after the imports
declare global {
  interface Window {
    _flightSearchResultsData: any
  }
}

interface FlightSearchResultsProps {
  isLoading?: boolean
  searchResults?: any
  searchCompleted?: boolean
}

export function FlightSearchResults({
  isLoading = false,
  searchResults: initialResults = null,
  searchCompleted = false,
}: FlightSearchResultsProps) {
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<any>(initialResults)
  const [loading, setLoading] = useState(isLoading)
  const [expandedFlights, setExpandedFlights] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState("best")

  useEffect(() => {
    // Update loading state based on props
    setLoading(isLoading)

    // If we have initial results from props, use those
    if (initialResults) {
      setSearchResults(initialResults)
    }
    // Otherwise, try to get results from window object
    else if (window._flightSearchResultsData) {
      setSearchResults(window._flightSearchResultsData)
    }
  }, [isLoading, initialResults])

  const handleSelectFlight = (offerId: string) => {
    router.push(`/flight-details/${offerId}`)
  }

  const toggleFlightDetails = (offerId: string) => {
    setExpandedFlights((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }))
  }

  const formatDuration = (duration: string) => {
    if (!duration) return "N/A"
    // Format ISO duration (PT2H30M) to readable format (2h 30m)
    const hours = duration.match(/(\d+)H/)?.[1] || "0"
    const minutes = duration.match(/(\d+)M/)?.[1] || "0"
    return `${hours}h ${minutes}m`
  }

  const getAirlineLogoUrl = (airlineCode: string) => {
    return `/placeholder.svg?height=40&width=40`
    // In a real app, you would use a service like:
    // return `https://content.airhex.com/content/logos/airlines_${airlineCode}_200_200_s.png`
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "HH:mm")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "EEE, MMM d")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  // Show loading animation while search is in progress
  if (loading || !searchCompleted) {
    return <SearchLoadingAnimation />
  }

  // Only show "no flights found" if search is completed and we have no results
  if (searchCompleted && (!searchResults || !searchResults.offers || searchResults.offers.length === 0)) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plane className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">No flights found</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any flights matching your search criteria. Try adjusting your search parameters or dates.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Back to Search
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{searchResults?.offers?.length || 0} flights found</h2>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          Modify Search
        </Button>
      </div>

      <Tabs defaultValue="best" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full bg-indigo-50 p-1 rounded-lg">
          <TabsTrigger
            value="best"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Best
          </TabsTrigger>
          <TabsTrigger
            value="cheapest"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Cheapest
          </TabsTrigger>
          <TabsTrigger
            value="fastest"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Fastest
          </TabsTrigger>
          <TabsTrigger
            value="recommended"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Recommended
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {searchResults?.offers?.map((offer: FlightOffer) => {
        // Safety check for required properties
        if (!offer || !offer.slices || !offer.slices[0] || !offer.slices[0].segments || !offer.slices[0].segments[0]) {
          return null // Skip rendering this offer if it's missing critical data
        }

        const firstSlice = offer.slices[0]
        const firstSegment = firstSlice.segments[0]
        const lastSegment = firstSlice.segments[firstSlice.segments.length - 1]

        return (
          <Card key={offer.id} className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Main flight info */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {offer.owner && offer.owner.logo_symbol_url ? (
                      <Image
                        src={offer.owner.logo_symbol_url || getAirlineLogoUrl(offer.owner.iata_code || "")}
                        alt={offer.owner?.name || "Airline"}
                        width={48}
                        height={48}
                        className="rounded-full bg-white p-1 border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Plane className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{offer.owner?.name || "Airline"}</h3>
                      <p className="text-sm text-gray-600">
                        {firstSlice.segments.length > 1
                          ? `${firstSlice.segments.length - 1} ${firstSlice.segments.length - 1 === 1 ? "stop" : "stops"}`
                          : "Direct flight"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{formatTime(firstSegment.departing_at)}</span>
                      <span className="text-xs text-gray-600">{firstSlice.origin?.iata_code || "N/A"}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-600">{formatDuration(firstSlice.duration || "")}</span>
                      <div className="relative w-24 md:w-32">
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-300" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2">
                          <PlaneTakeoff className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2">
                          <PlaneLanding className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{lastSegment ? formatTime(lastSegment.arriving_at) : "N/A"}</span>
                      <span className="text-xs text-gray-600">{firstSlice.destination?.iata_code || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-1">
                      {activeTab === "cheapest" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Best price
                        </Badge>
                      )}
                      {activeTab === "fastest" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Fastest
                        </Badge>
                      )}
                      {activeTab === "recommended" && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Recommended
                        </Badge>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save to favorites</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-lg font-bold text-indigo-700">
                      {Number.parseFloat(offer.total_amount || "0").toFixed(2)} {offer.total_currency || "USD"}
                    </span>
                    <Button
                      onClick={() => handleSelectFlight(offer.id)}
                      className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Select
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <Luggage className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600">Carry-on bag included</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 -mr-2"
                    onClick={() => toggleFlightDetails(offer.id)}
                  >
                    {expandedFlights[offer.id] ? (
                      <>
                        <span className="mr-1">Hide details</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="mr-1">Show details</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded flight details */}
              {expandedFlights[offer.id] && (
                <div className="p-4 bg-gray-50">
                  {offer.slices.map((slice: any, sliceIndex: number) => {
                    // Skip if slice doesn't have required data
                    if (!slice || !slice.segments || slice.segments.length === 0) {
                      return null
                    }

                    return (
                      <div key={slice.id || `slice-${sliceIndex}`} className="mb-4 last:mb-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="bg-white">
                            {sliceIndex === 0 ? "Outbound" : "Return"}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatDate(slice.segments[0]?.departing_at || "")}
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600">Total: {formatDuration(slice.duration || "")}</span>
                          </div>
                        </div>

                        {slice.segments.map((segment: any, index: number) => {
                          // Skip if segment doesn't have required data
                          if (!segment) {
                            return null
                          }

                          return (
                            <div key={segment.id || `segment-${index}`} className="mb-4 last:mb-0">
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                    <Image
                                      src={
                                        getAirlineLogoUrl(segment.operating_carrier?.iata_code || "") ||
                                        "/placeholder.svg"
                                      }
                                      alt={segment.operating_carrier?.name || "Airline"}
                                      width={20}
                                      height={20}
                                    />
                                  </div>
                                  {index < slice.segments.length - 1 && (
                                    <div className="h-16 border-l border-dashed border-gray-300 my-1"></div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between mb-2">
                                    <div>
                                      <div className="font-medium">{formatTime(segment.departing_at || "")}</div>
                                      <div className="text-sm text-gray-600">{segment.origin?.iata_code || "N/A"}</div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(segment.departing_at || "")}
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <div className="text-xs text-gray-600">
                                        {formatDuration(segment.duration || "")}
                                      </div>
                                      <div className="relative w-20 md:w-32 my-1">
                                        <div className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                        <div className="absolute top-1/2 right-0 -translate-y-1/2">
                                          <ArrowRight className="w-2 h-2 text-gray-400" />
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {segment.operating_carrier?.iata_code || ""}
                                        {segment.operating_carrier?.operating_carrier_flight_number || ""}
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className="font-medium">{formatTime(segment.arriving_at || "")}</div>
                                      <div className="text-sm text-gray-600">
                                        {segment.destination?.iata_code || "N/A"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(segment.arriving_at || "")}
                                      </div>
                                    </div>
                                  </div>

                                  {index < slice.segments.length - 1 &&
                                    slice.connections &&
                                    slice.connections[index] && (
                                      <div className="bg-white p-2 rounded border border-gray-200 text-xs text-gray-600 mb-2">
                                        <div className="font-medium">
                                          Connection • {formatDuration(slice.connections[index]?.duration || "")}
                                        </div>
                                        <div>
                                          {segment.destination?.name || ""} ({segment.destination?.iata_code || ""})
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium">Price breakdown</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Base fare: {Number.parseFloat(offer.base_amount || "0").toFixed(2)}{" "}
                          {offer.base_currency || "USD"}
                        </div>
                        <div className="text-xs text-gray-600">
                          Taxes & fees: {Number.parseFloat(offer.tax_amount || "0").toFixed(2)}{" "}
                          {offer.tax_currency || "USD"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Total price</div>
                        <div className="text-lg font-bold text-indigo-700">
                          {Number.parseFloat(offer.total_amount || "0").toFixed(2)} {offer.total_currency || "USD"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          Load more results
        </Button>
      </div>
    </div>
  )
}
