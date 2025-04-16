"use server"

import { searchFlights, getOffers } from "@/lib/duffel"

export async function searchFlightsAction(formData: FormData) {
  const origin = formData.get("origin") as string
  const destination = formData.get("destination") as string
  const departureDate = formData.get("departureDate") as string
  const returnDate = (formData.get("returnDate") as string) || undefined
  const adults = Number.parseInt(formData.get("adults") as string) || 1
  const cabinClass = (formData.get("cabinClass") as string) || "economy"
  const tripType = formData.get("tripType") as string

  try {
    const response = await searchFlights({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "return" ? returnDate : undefined,
      adults,
      cabinClass,
    })

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error searching flights:", error)
    return { success: false, error: "Failed to search flights" }
  }
}

export async function getOfferDetails(offerId: string) {
  try {
    const response = await getOffers(offerId)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error getting offer details:", error)
    return { success: false, error: "Failed to get offer details" }
  }
}
