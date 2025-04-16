"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { getOfferDetails } from "@/app/actions/flight-actions"
import { Skeleton } from "@/components/ui/skeleton"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [flightDetails, setFlightDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await getOfferDetails(params.id)
        if (response.success && response.data) {
          setFlightDetails(response.data)
        } else {
          console.error("Failed to get offer details:", response.error)
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching offer details:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchOfferDetails()
  }, [params.id, router])

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 pt-20 md:pt-24">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          flightDetails && <BookingForm offerId={params.id} flightDetails={flightDetails} />
        )}
      </main>

      <Footer />
    </div>
  )
}
