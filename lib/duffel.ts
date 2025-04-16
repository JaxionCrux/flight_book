const DUFFEL_API_URL = "https://api.duffel.com"
// Update from "beta" to the current supported version
const DUFFEL_API_VERSION = "v1"

export async function duffelRequest(endpoint: string, method = "GET", data?: any) {
  const apiKey = process.env.DUFFEL_API_KEY

  if (!apiKey) {
    throw new Error("DUFFEL_API_KEY is not defined")
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Duffel-Version": DUFFEL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${DUFFEL_API_URL}${endpoint}`, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.text())
      console.error("Duffel API error response:", errorData)
      throw new Error(`Duffel API error: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return response.json()
  } catch (error) {
    console.error("Duffel API request failed:", error)
    throw error
  }
}

export async function searchFlights(params: {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  cabinClass: string
  children?: number
  infants?: number
  multiCity?: Array<{ origin: string; destination: string; departureDate: string }>
}) {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    cabinClass,
    children = 0,
    infants = 0,
    multiCity = [],
  } = params

  let slices = []

  // Handle multi-city itineraries
  if (multiCity.length > 0) {
    slices = multiCity.map((segment) => ({
      origin: segment.origin,
      destination: segment.destination,
      departure_date: segment.departureDate,
    }))
  } else {
    // Handle one-way and return trips
    slices = [
      {
        origin,
        destination,
        departure_date: departureDate,
      },
    ]

    if (returnDate) {
      slices.push({
        origin: destination,
        destination: origin,
        departure_date: returnDate,
      })
    }
  }

  // Build passengers array
  const passengers = []

  if (adults > 0) {
    passengers.push({ type: "adult", count: adults })
  }

  if (children > 0) {
    passengers.push({ type: "child", count: children })
  }

  if (infants > 0) {
    passengers.push({ type: "infant_without_seat", count: infants })
  }

  const requestData = {
    data: {
      slices,
      passengers,
      cabin_class: cabinClass.toLowerCase(),
    },
  }

  return duffelRequest("/air/offer_requests", "POST", requestData)
}

export async function getOffers(offerId: string) {
  return duffelRequest(`/air/offers/${offerId}`)
}

export async function getAirports(query: string) {
  return duffelRequest(`/air/airports?query=${encodeURIComponent(query)}`)
}

export async function createOrder(offerId: string, passengers: any[]) {
  const requestData = {
    data: {
      selected_offers: [offerId],
      passengers,
      payments: [
        {
          type: "balance",
          amount: "0",
          currency: "USD",
        },
      ],
    },
  }

  return duffelRequest("/air/orders", "POST", requestData)
}

export async function getOrder(orderId: string) {
  return duffelRequest(`/air/orders/${orderId}`)
}

export async function cancelOrder(orderId: string) {
  return duffelRequest(`/air/orders/${orderId}/actions/cancel`, "POST")
}

export async function getSeatMaps(offerId: string) {
  return duffelRequest(`/air/seat_maps?offer_id=${offerId}`)
}

export type Airport = {
  id: string
  name: string
  iata_code: string
  city: string
  city_name?: string
  country: string
  country_name?: string
}

export type FlightOffer = {
  id: string
  total_amount: string
  total_currency: string
  base_amount: string
  base_currency: string
  tax_amount: string
  tax_currency: string
  slices: any[]
  passengers: any[]
  owner: {
    name: string
    logo_symbol_url: string
  }
}

export type Passenger = {
  id?: string
  type: "adult" | "child" | "infant_without_seat"
  given_name: string
  family_name: string
  gender?: "m" | "f"
  title?: string
  born_on: string
  email: string
  phone_number?: string
}

export type Order = {
  id: string
  booking_reference: string
  created_at: string
  updated_at: string
  passengers: Passenger[]
  slices: any[]
  total_amount: string
  total_currency: string
  base_amount: string
  base_currency: string
  tax_amount: string
  tax_currency: string
  payment_status: {
    awaiting_payment: boolean
    payment_required_by: string
  }
}
