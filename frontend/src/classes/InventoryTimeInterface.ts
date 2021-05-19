import { Reservation } from './ReservationInterface'

export interface InventoryTime {
  reservations: Reservation[]
  size: number
  display: boolean
  disabled: boolean
  time: string
  militaryTime: string
  hour: number
  minutes: number
  suffix: string
  available: number
}
