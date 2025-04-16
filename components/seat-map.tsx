"use client"

import { useState, useEffect } from "react"
import { getSeatMapDetails } from "@/app/actions/flight-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SeatMapProps {
  offerId: string
}

export function SeatMap({ offerId }: SeatMapProps) {
  const [seatMaps, setSeatMaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchSeatMaps = async () => {
      try {
        const response = await getSeatMapDetails(offerId)
        if (response.success && response.data) {
          setSeatMaps(response.data.data || [])
        } else {
          setError("Failed to fetch seat maps")
        }
      } catch (error) {
        console.error("Error fetching seat maps:", error)
        setError("An error occurred while fetching seat maps")
      } finally {
        setLoading(false)
      }
    }

    fetchSeatMaps()
  }, [offerId])

  const handleSeatSelect = (cabinId: string, rowNumber: string, seatDesignator: string) => {
    setSelectedSeats((prev) => {
      // If this seat is already selected, unselect it
      if (prev[cabinId] === `${rowNumber}${seatDesignator}`) {
        const newSelected = { ...prev }
        delete newSelected[cabinId]
        return newSelected
      }

      // Otherwise, select this seat for the cabin
      return {
        ...prev,
        [cabinId]: `${rowNumber}${seatDesignator}`,
      }
    })
  }

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading seat maps...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <p>Seat selection is not available at this time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!seatMaps || seatMaps.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p>Seat maps are not available for this flight.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={`segment-0`} className="w-full">
          <TabsList className="w-full mb-4">
            {seatMaps.map((seatMap, index) => {
              // Check if seatMap and its properties exist
              if (
                !seatMap?.slice?.segments?.[0]?.origin?.iata_code ||
                !seatMap?.slice?.segments?.[0]?.destination?.iata_code
              ) {
                return null
              }

              return (
                <TabsTrigger key={index} value={`segment-${index}`}>
                  {seatMap.slice.segments[0].origin.iata_code} → {seatMap.slice.segments[0].destination.iata_code}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {seatMaps.map((seatMap, segmentIndex) => {
            // Skip rendering if required data is missing
            if (
              !seatMap?.slice?.segments?.[0]?.operating_carrier?.iata_code ||
              !seatMap?.slice?.segments?.[0]?.operating_carrier_flight_number ||
              !seatMap?.cabins
            ) {
              return null
            }

            return (
              <TabsContent key={segmentIndex} value={`segment-${segmentIndex}`} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-white/70">
                    Flight {seatMap.slice.segments[0].operating_carrier.iata_code}
                    {seatMap.slice.segments[0].operating_carrier_flight_number}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  {seatMap.cabins.map((cabin: any, cabinIndex: number) => {
                    // Skip rendering if required cabin data is missing
                    if (!cabin?.id || !cabin?.cabin_class?.title || !cabin?.deck?.seat_letters || !cabin?.deck?.rows) {
                      return null
                    }

                    return (
                      <div key={cabinIndex} className="mb-8">
                        <h3 className="font-medium mb-2">{cabin.cabin_class.title} Class</h3>

                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex justify-center mb-4">
                            <div className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs">
                              Front of Aircraft
                            </div>
                          </div>

                          <div className="grid grid-cols-[auto_1fr] gap-2">
                            {/* Seat letters header */}
                            <div className="col-start-2">
                              <div className="grid grid-cols-12 gap-1">
                                {cabin.deck.seat_letters.map((letter: string) => (
                                  <div key={letter} className="text-center text-xs font-medium">
                                    {letter}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Rows */}
                            {cabin.deck.rows.map((row: any) => {
                              // Skip rendering if required row data is missing
                              if (!row?.number || !row?.seats) {
                                return null
                              }

                              return (
                                <div key={row.number} className="contents">
                                  {/* Row number */}
                                  <div className="flex items-center justify-center text-xs font-medium pr-2">
                                    {row.number}
                                  </div>

                                  {/* Seats */}
                                  <div className="grid grid-cols-12 gap-1">
                                    {cabin.deck.seat_letters.map((letter: string, letterIndex: number) => {
                                      const seat = row.seats
                                        ? row.seats.find((s: any) => s?.designator === letter)
                                        : null

                                      // If no seat at this position
                                      if (!seat) {
                                        return <div key={`empty-${letterIndex}`} className="h-8"></div>
                                      }

                                      const isSelected = selectedSeats[cabin.id] === `${row.number}${letter}`
                                      const isAvailable = seat.available_services && seat.available_services.length > 0

                                      return (
                                        <button
                                          key={seat.designator}
                                          className={`
                                            h-8 rounded flex items-center justify-center text-xs font-medium
                                            ${
                                              isSelected
                                                ? "bg-purple-600 text-white"
                                                : isAvailable
                                                  ? "bg-white/10 hover:bg-white/20 text-white"
                                                  : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                                            }
                                          `}
                                          disabled={!isAvailable}
                                          onClick={() => handleSeatSelect(cabin.id, row.number, letter)}
                                        >
                                          {letter}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="flex justify-center mt-4">
                            <div className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs">
                              Rear of Aircraft
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/10 rounded"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-600 rounded"></div>
                            <span>Selected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-500/20 rounded"></div>
                            <span>Unavailable</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Confirm Seat Selection
                  </Button>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
