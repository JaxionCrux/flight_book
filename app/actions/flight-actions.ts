"use server"

import { searchFlights, getOffers, createOrder, getOrder, cancelOrder, getSeatMaps, type Passenger } from "@/lib/duffel"

export async function searchFlightsAction(formData: FormData) {
  const origin = formData.get("origin") as string
  const destination = formData.get("destination") as string
  const departureDate = formData.get("departureDate") as string
  const returnDate = (formData.get("returnDate") as string) || undefined
  const adults = Number.parseInt(formData.get("adults") as string) || 1
  const children = Number.parseInt(formData.get("children") as string) || 0
  const infants = Number.parseInt(formData.get("infants") as string) || 0
  const cabinClass = (formData.get("cabinClass") as string) || "economy"
  const tripType = formData.get("tripType") as string

  // Validate required fields
  if (!origin || !destination || !departureDate) {
    return {
      success: false,
      error: "Missing required fields: origin, destination, and departure date are required",
    }
  }

  // Handle multi-city trips
  const multiCity = []
  if (tripType === "multi") {
    const segments = formData.getAll("multiCitySegment") as string[]
    for (const segment of segments) {
      try {
        const segmentData = JSON.parse(segment)
        multiCity.push({
          origin: segmentData.origin,
          destination: segmentData.destination,
          departureDate: segmentData.departureDate,
        })
      } catch (e) {
        console.error("Error parsing multi-city segment:", e)
      }
    }
  }

  try {
    const response = await searchFlights({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "return" ? returnDate : undefined,
      adults,
      children,
      infants,
      cabinClass,
      multiCity: tripType === "multi" ? multiCity : [],
    })

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error searching flights:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search flights",
    }
  }
}

export async function getOfferDetails(offerId: string) {
  try {
    const response = await getOffers(offerId)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error getting offer details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get offer details",
    }
  }
}

export async function createBookingAction(offerId: string, passengers: Passenger[]) {
  try {
    const response = await createOrder(offerId, passengers)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    }
  }
}

export async function getBookingDetails(orderId: string) {
  try {
    const response = await getOrder(orderId)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error getting booking details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get booking details",
    }
  }
}

export async function cancelBooking(orderId: string) {
  try {
    const response = await cancelOrder(orderId)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error canceling booking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel booking",
    }
  }
}

export async function getSeatMapDetails(offerId: string) {
  try {
    const response = await getSeatMaps(offerId)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error getting seat map:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get seat map",
    }
  }
}
