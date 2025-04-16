"use client"

import { useState } from "react"
import { User, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PassengersSelectorProps {
  adults: number
  onAdultsChange: (count: number) => void
  cabinClass: string
  onCabinClassChange: (value: string) => void
  className?: string
}

export function PassengersSelector({
  adults,
  onAdultsChange,
  cabinClass,
  onCabinClassChange,
  className,
}: PassengersSelectorProps) {
  const [open, setOpen] = useState(false)

  const formatPassengers = () => {
    const passengerText = adults === 1 ? "Adult" : "Adults"
    const cabinText = cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)
    return `${adults} ${passengerText}, ${cabinText}`
  }

  return (
    <div className={className}>
      <div className="text-sm font-medium text-gray-500 mb-1">Passengers & Class</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center w-full p-4 text-left bg-white rounded-full focus:outline-none"
          >
            <User className="w-5 h-5 mr-2 text-gray-400" />
            <div className="font-medium text-gray-900 flex-1">{formatPassengers()}</div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Passengers</h4>
              <div className="flex items-center justify-between">
                <span>Adults</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onAdultsChange(Math.min(9, adults + 1))}
                    disabled={adults >= 9}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Cabin Class</h4>
              <Select value={cabinClass} onValueChange={onCabinClassChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cabin class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" className="w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="cabinClass" value={cabinClass} />
    </div>
  )
}
