"use client"

import React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlightDetails } from "@/components/flight-details"
import { SeatMap } from "@/components/seat-map"

export default function FlightDetailsPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = React.useState(true)
  const [flightDetails, setFlightDetails] = React.useState(null)

  React.useEffect(() => {
    // Simulate loading and fetching data
    setTimeout(() => {
      setLoading(false)
      setFlightDetails({
        /* Your flight details data here */
      })
    }, 1000)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 pt-20 md:pt-24">
        <h1 className="text-3xl font-bold mb-8">Flight Details</h1>
        <FlightDetails offerId={params.id} />
        {!loading && flightDetails && (
          <div className="mb-8">
            <SeatMap offerId={params.id} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
