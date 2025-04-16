"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, Plane, User, Mail, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function BookingConfirmation() {
  const router = useRouter()
  const [bookingReference, setBookingReference] = useState<string | null>(null)

  useEffect(() => {
    // Get booking reference from session storage
    const reference = sessionStorage.getItem("bookingReference")
    if (reference) {
      setBookingReference(reference)
    } else {
      // If no booking reference, redirect to home
      router.push("/")
    }
  }, [router])

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
                <p className="text-white/70">April 15, 2025</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Plane className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Flight</p>
                <p className="text-white/70">CosmoAir CA1234</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Passenger</p>
                <p className="text-white/70">John Doe</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-white/70">john.doe@example.com</p>
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
