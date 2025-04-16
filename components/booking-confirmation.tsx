"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, Plane, User, Mail, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getBookingDetails } from "@/app/actions/flight-actions"
import { format } from "date-fns"

export function BookingConfirmation() {
  const router = useRouter()
  const [bookingReference, setBookingReference] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get booking reference and order ID from session storage
    const reference = sessionStorage.getItem("bookingReference")
    const id = sessionStorage.getItem("orderId")

    if (reference) {
      setBookingReference(reference)
    }

    if (id) {
      setOrderId(id)
      fetchBookingDetails(id)
    } else if (!reference) {
      // If no booking reference or order ID, redirect to home
      router.push("/")
    } else {
      setLoading(false)
    }
  }, [router])

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await getBookingDetails(id)
      if (response.success && response.data) {
        setBookingDetails(response.data)
      } else {
        setError("Failed to fetch booking details")
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
      setError("An error occurred while fetching booking details")
    } finally {
      setLoading(false)
    }
  }

  // Format departure date from the first slice if available
  const getDepartureDate = () => {
    if (bookingDetails && bookingDetails.slices && bookingDetails.slices.length > 0) {
      const departureDate = new Date(bookingDetails.slices[0].segments[0].departing_at)
      return format(departureDate, "MMMM d, yyyy")
    }
    return "April 15, 2025" // Fallback date
  }

  // Get flight number from the first slice if available
  const getFlightNumber = () => {
    if (bookingDetails && bookingDetails.slices && bookingDetails.slices.length > 0) {
      const segment = bookingDetails.slices[0].segments[0]
      return `${segment.operating_carrier.iata_code}${segment.operating_carrier_flight_number}`
    }
    return "CosmoAir CA1234" // Fallback flight number
  }

  // Get passenger name if available
  const getPassengerName = () => {
    if (bookingDetails && bookingDetails.passengers && bookingDetails.passengers.length > 0) {
      const passenger = bookingDetails.passengers[0]
      return `${passenger.given_name} ${passenger.family_name}`
    }
    return "John Doe" // Fallback name
  }

  // Get passenger email if available
  const getPassengerEmail = () => {
    if (bookingDetails && bookingDetails.passengers && bookingDetails.passengers.length > 0) {
      return bookingDetails.passengers[0].email
    }
    return "john.doe@example.com" // Fallback email
  }

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
            <h2 className="text-2xl font-bold">Loading Booking Details...</h2>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold">Error Loading Booking</h2>
            <p className="text-white/70">{error}</p>
            <Button
              onClick={() => router.push("/")}
              className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-white/70">
              Your flight has been booked successfully. Please save your booking reference.
            </p>
            <div className="bg-white/10 rounded-lg p-4 inline-block mt-4">
              <span className="text-xl font-mono font-bold">{bookingReference}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Departure Date</p>
                <p className="text-white/70">{getDepartureDate()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Plane className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Flight</p>
                <p className="text-white/70">{getFlightNumber()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Passenger</p>
                <p className="text-white/70">{getPassengerName()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-white/70">{getPassengerEmail()}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download E-Ticket
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
              <Share2 className="w-4 h-4" />
              Share Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          Return to Home
        </Button>
      </div>
    </div>
  )
}
