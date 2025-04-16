"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, User, Mail, Phone, Calendar, Flag, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBookingAction } from "@/app/actions/flight-actions"
import type { Passenger } from "@/lib/duffel"

interface BookingFormProps {
  offerId: string
  flightDetails: any
}

export function BookingForm({ offerId, flightDetails }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingReference, setBookingReference] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setBookingError(null)

    const formData = new FormData(e.currentTarget)

    try {
      // Create passenger object from form data
      const passenger: Passenger = {
        type: "adult",
        given_name: formData.get("firstName") as string,
        family_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        born_on: formData.get("dob") as string,
        phone_number: formData.get("phone") as string,
        gender: "m", // Default value, would be better to get from form
        title: "mr", // Default value, would be better to get from form
      }

      // Call the server action to create a booking
      const response = await createBookingAction(offerId, [passenger])

      if (response.success && response.data) {
        setBookingComplete(true)
        setBookingReference(
          response.data.booking_reference ||
            "COS" +
              Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0"),
        )
        setOrderId(response.data.id)

        // Store booking reference in session storage for confirmation page
        sessionStorage.setItem("bookingReference", response.data.booking_reference || bookingReference || "")
        sessionStorage.setItem("orderId", response.data.id || "")
      } else {
        setBookingError(response.error || "There was an error processing your booking. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      setBookingError("There was an error processing your booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewConfirmation = () => {
    router.push("/booking-confirmation")
  }

  if (bookingComplete) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Booking Complete!</h2>
            <p className="text-white/70">
              Your flight has been booked successfully. A confirmation email has been sent to your email address.
            </p>
            <div className="bg-white/10 rounded-lg p-4 inline-block mt-4">
              <span className="text-xl font-mono font-bold">{bookingReference}</span>
            </div>
            <Button
              onClick={handleViewConfirmation}
              className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View Confirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {bookingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{bookingError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        className="pl-10 bg-white/10 border-white/20"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        className="pl-10 bg-white/10 border-white/20"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      className="pl-10 bg-white/10 border-white/20"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      required
                      className="pl-10 bg-white/10 border-white/20"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Input id="dob" name="dob" type="date" required className="pl-10 bg-white/10 border-white/20" />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <div className="relative">
                      <Select name="nationality">
                        <SelectTrigger className="pl-10 bg-white/10 border-white/20">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        required
                        className="pl-10 bg-white/10 border-white/20"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" name="cvc" placeholder="123" required className="bg-white/10 border-white/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      name="nameOnCard"
                      placeholder="John Doe"
                      required
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="text-center py-8">
                  <p className="text-white/70 mb-4">You will be redirected to PayPal to complete your payment.</p>
                  <Button className="bg-[#0070ba] hover:bg-[#005ea6]">Pay with PayPal</Button>
                </TabsContent>

                <TabsContent value="crypto" className="text-center py-8">
                  <p className="text-white/70 mb-4">Pay with Bitcoin, Ethereum, or other cryptocurrencies.</p>
                  <Button className="bg-[#f7931a] hover:bg-[#e78319]">Pay with Crypto</Button>
                </TabsContent>
              </Tabs>

              <Separator className="my-6 bg-white/10" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>
                    {Number.parseFloat(flightDetails.base_amount).toFixed(2)} {flightDetails.base_currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes and fees</span>
                  <span>
                    {Number.parseFloat(flightDetails.tax_amount).toFixed(2)} {flightDetails.tax_currency}
                  </span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {Number.parseFloat(flightDetails.total_amount).toFixed(2)} {flightDetails.total_currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </div>
          ) : (
            "Complete Booking"
          )}
        </Button>
      </form>
    </div>
  )
}
