import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlightDetails } from "@/components/flight-details"

export default function FlightDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Flight Details</h1>
        <FlightDetails offerId={params.id} />
      </main>

      <Footer />
    </div>
  )
}
