"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlightSearchForm } from "@/components/flight-search-form"
import { TrustpilotRating } from "@/components/trustpilot-rating"
import { PaymentMethods } from "@/components/payment-methods"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Clock, CreditCard, Gift, Star, ChevronRight, MapPin, Calendar } from "lucide-react"
import { FeaturedDestinations } from "@/components/featured-destinations"
import { Testimonials } from "@/components/testimonials"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { MobileAppPromo } from "@/components/mobile-app-promo"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallMobile = useMediaQuery("(max-width: 375px)")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>The Worldz Travel - Book flights. Pay later.</title>
        <meta
          name="description"
          content="Book your perfect flight with confidence. Flexible payment options, competitive prices, and exceptional service."
        />
        <meta name="keywords" content="flight booking, airline tickets, cheap flights, travel, pay later" />
        <meta property="og:title" content="The Worldz Travel - Book flights. Pay later." />
        <meta
          property="og:description"
          content="Book your perfect flight with confidence. Flexible payment options, competitive prices, and exceptional service."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://worldztravel.com" />
        <meta property="og:image" content="https://worldztravel.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section with enhanced design */}
          <section
            className={`relative ${isMobile ? "pt-28 pb-40" : "pt-32 pb-40"} px-4 overflow-hidden bg-gradient-to-r from-purple-100 via-lavender-200 to-indigo-200`}
            aria-labelledby="hero-heading"
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-pattern opacity-10" aria-hidden="true"></div>

            {/* Floating elements for visual interest */}
            <div
              className="absolute top-20 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-float-slow"
              aria-hidden="true"
            ></div>
            <div
              className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-float-medium"
              aria-hidden="true"
            ></div>
            <div
              className="absolute top-40 right-10 w-12 h-12 bg-indigo-300 rounded-full opacity-20 animate-float-fast"
              aria-hidden="true"
            ></div>

            <div className="container mx-auto text-center relative z-10">
              {isMobile ? (
                <>
                  <Badge
                    variant="outline"
                    className="mb-6 bg-white/80 backdrop-blur-sm text-indigo-700 border-indigo-200 px-4 py-1.5"
                  >
                    Limited Time: 10% Off All International Flights
                  </Badge>
                  <h1 id="hero-heading" className="text-5xl font-bold mb-4 text-gray-800">
                    Your Journey{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                      Starts Here
                    </span>
                  </h1>
                  <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                    Book your perfect flight with confidence. Flexible payment options, competitive prices, and
                    exceptional service.
                  </p>

                  <FlightSearchForm />

                  <div className="mt-16">
                    <TrustpilotRating />
                  </div>
                </>
              ) : (
                <>
                  <Badge
                    variant="outline"
                    className="mb-6 bg-white/80 backdrop-blur-sm text-indigo-700 border-indigo-200 px-4 py-1.5"
                  >
                    Limited Time: 10% Off All International Flights
                  </Badge>
                  <h1 id="hero-heading" className="text-7xl font-bold mb-4 text-gray-800">
                    Your Journey{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                      Starts Here
                    </span>
                  </h1>
                  <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                    Book your perfect flight with confidence. Flexible payment options, competitive prices, and
                    exceptional service.
                  </p>

                  <FlightSearchForm />

                  <div className="mt-16">
                    <TrustpilotRating />
                  </div>
                </>
              )}
            </div>

            {/* Enhanced cloud background with adjusted opacity */}
            <div className="absolute bottom-0 left-0 right-0 h-40 cloud-bg" aria-hidden="true"></div>
          </section>

          {/* Featured Destinations Section */}
          <section className="py-16 px-4 bg-white" aria-labelledby="featured-destinations-heading">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 id="featured-destinations-heading" className="text-3xl font-bold mb-4 text-gray-800">
                  Featured Destinations
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Explore our handpicked selection of amazing destinations with exclusive deals and offers.
                </p>
              </div>

              <FeaturedDestinations />

              <div className="text-center mt-10">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  aria-label="View all destinations"
                >
                  View All Destinations
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Special Offers Section */}
          <section className="py-16 px-4 bg-gray-50" aria-labelledby="special-offers-heading">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 id="special-offers-heading" className="text-3xl font-bold mb-4 text-gray-800">
                  Special Offers
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Take advantage of our limited-time deals and save on your next adventure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Early Bird Discount",
                    description: "Book 60 days in advance and save up to 20% on international flights.",
                    icon: Clock,
                    color: "bg-blue-100 text-blue-600",
                    cta: "Book Now",
                    badge: "Popular",
                  },
                  {
                    title: "Summer Getaway",
                    description: "Special summer packages with complimentary hotel stays on select destinations.",
                    icon: Gift,
                    color: "bg-purple-100 text-purple-600",
                    cta: "View Packages",
                    badge: "Limited Time",
                  },
                  {
                    title: "Loyalty Bonus",
                    description: "Earn double points on all bookings made this month. Redeem for future travel.",
                    icon: Star,
                    color: "bg-indigo-100 text-indigo-600",
                    cta: "Learn More",
                    badge: null,
                  },
                ].map((offer, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-full ${offer.color} flex items-center justify-center`}>
                            <offer.icon className="w-6 h-6" />
                          </div>
                          {offer.badge && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              {offer.badge}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                        <p className="text-gray-600 mb-6">{offer.description}</p>
                        <Button
                          variant="outline"
                          className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                          aria-label={offer.cta}
                        >
                          {offer.cta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 px-4 bg-white" aria-labelledby="why-choose-us-heading">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 id="why-choose-us-heading" className="text-3xl font-bold mb-4 text-gray-800">
                  Why Choose The Worldz Travel
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We're committed to providing the best travel experience from booking to landing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Flexible Booking",
                    description:
                      "Change or cancel your flights with minimal fees. Your plans may change, and we understand.",
                    icon: Calendar,
                  },
                  {
                    title: "Secure Payments",
                    description: "Multiple payment options with industry-leading security to protect your information.",
                    icon: Shield,
                  },
                  {
                    title: "24/7 Support",
                    description: "Our customer service team is available around the clock to assist with any issues.",
                    icon: Clock,
                  },
                  {
                    title: "Best Price Guarantee",
                    description: "Find a lower price elsewhere? We'll match it and give you extra loyalty points.",
                    icon: CreditCard,
                  },
                ].map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Destinations Quick Links */}
          <section className="py-16 px-4 bg-gray-50" aria-labelledby="popular-destinations-heading">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 id="popular-destinations-heading" className="text-3xl font-bold mb-4 text-gray-800">
                  Popular Destinations
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover our most sought-after destinations and start planning your next trip.
                </p>
              </div>

              <Tabs defaultValue="domestic" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="domestic">Domestic</TabsTrigger>
                  <TabsTrigger value="international">International</TabsTrigger>
                </TabsList>
                <TabsContent value="domestic" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { city: "New York", code: "NYC", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Los Angeles", code: "LAX", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Chicago", code: "CHI", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Miami", code: "MIA", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Las Vegas", code: "LAS", image: "/placeholder.svg?height=100&width=100" },
                      { city: "San Francisco", code: "SFO", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Seattle", code: "SEA", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Denver", code: "DEN", image: "/placeholder.svg?height=100&width=100" },
                    ].map((destination, index) => (
                      <Link
                        href="#"
                        key={index}
                        className="flex flex-col items-center p-4 rounded-lg bg-white hover:shadow-md transition-shadow"
                        aria-label={`Flights to ${destination.city}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                          <MapPin className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-800">{destination.city}</span>
                        <span className="text-sm text-indigo-600">{destination.code}</span>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="international" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { city: "London", code: "LHR", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Paris", code: "CDG", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Tokyo", code: "HND", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Sydney", code: "SYD", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Rome", code: "FCO", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Dubai", code: "DXB", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Singapore", code: "SIN", image: "/placeholder.svg?height=100&width=100" },
                      { city: "Bangkok", code: "BKK", image: "/placeholder.svg?height=100&width=100" },
                    ].map((destination, index) => (
                      <Link
                        href="#"
                        key={index}
                        className="flex flex-col items-center p-4 rounded-lg bg-white hover:shadow-md transition-shadow"
                        aria-label={`Flights to ${destination.city}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                          <MapPin className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-800">{destination.city}</span>
                        <span className="text-sm text-indigo-600">{destination.code}</span>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 px-4 bg-white" aria-labelledby="testimonials-heading">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 id="testimonials-heading" className="text-3xl font-bold mb-4 text-gray-800">
                  What Our Customers Say
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Don't just take our word for it. Here's what travelers have to say about their experience with us.
                </p>
              </div>

              <Testimonials />
            </div>
          </section>

          {/* Mobile App Promo Section */}
          <MobileAppPromo />

          {/* Newsletter Section */}
          <section className="py-16 px-4 bg-white" aria-labelledby="newsletter-heading">
            <div className="container mx-auto">
              <NewsletterSignup />
            </div>
          </section>

          {/* Payment Methods Section */}
          <section className="py-12 bg-gray-50" aria-labelledby="payment-methods-heading">
            <div className="container mx-auto">
              <h2 id="payment-methods-heading" className="text-2xl font-bold mb-8 text-center text-gray-800">
                Trusted Payment Methods
              </h2>
              <PaymentMethods />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
