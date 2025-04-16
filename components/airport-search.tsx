"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { searchAirports } from "@/app/actions/airport-actions"
import type { Airport } from "@/lib/duffel"

interface AirportSearchProps {
  name: string
  placeholder: string
  onChange: (value: string, code: string) => void
  value: string
  code: string
  label: string
  className?: string
}

export function AirportSearch({ name, placeholder, onChange, value, code, label, className }: AirportSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true)

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }

      searchTimeout.current = setTimeout(async () => {
        const results = await searchAirports(query)
        setAirports(results)
        setLoading(false)
      }, 300)
    } else {
      setAirports([])
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [query])

  const handleSelect = (airport: Airport) => {
    onChange(airport.city_name || airport.city, airport.iata_code)
    setOpen(false)
  }

  return (
    <div className={className}>
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center w-full p-4 text-left bg-white rounded-full focus:outline-none"
            aria-expanded={open}
          >
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            <div className="flex-1">
              {value ? (
                <div className="font-medium text-gray-900">{value}</div>
              ) : (
                <div className="text-gray-400">{placeholder}</div>
              )}
            </div>
            {code && <div className="text-[#4c4cda] font-medium">{code}</div>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
          <Command>
            <CommandInput placeholder="Search airports..." value={query} onValueChange={setQuery} className="h-9" />
            <CommandList>
              <CommandEmpty>{loading ? "Searching..." : "No airports found."}</CommandEmpty>
              <CommandGroup>
                {airports.map((airport) => (
                  <CommandItem
                    key={airport.id}
                    value={`${airport.iata_code}-${airport.name}`}
                    onSelect={() => handleSelect(airport)}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="mr-2">{airport.name}</span>
                        <span className="ml-auto text-[#4c4cda] font-medium">{airport.iata_code}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-6">
                        {airport.city_name || airport.city}, {airport.country_name || airport.country}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={code} />
    </div>
  )
}
