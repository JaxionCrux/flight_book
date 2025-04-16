const DUFFEL_API_URL = "https://api.duffel.com"
const DUFFEL_API_VERSION = "beta"

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

  const response = await fetch(`${DUFFEL_API_URL}${endpoint}`, options)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Duffel API error: ${response.status} ${errorText}`)
  }

  return response.json()
}

export async function searchFlights(params: {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  cabinClass: string
}) {
  const { origin, destination, departureDate, returnDate, adults, cabinClass } = params

  const slices = [
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

  const requestData = {
    data: {
      slices,
      passengers: [{ type: "adult", count: adults }],
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
