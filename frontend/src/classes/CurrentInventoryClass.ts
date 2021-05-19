import { Inventory } from './InventoryInterface'
import { InventoryTime } from './InventoryTimeInterface'
import { Reservation } from './ReservationInterface'
import moment from 'moment'

enum momentDurations {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours'
}

/**
 * View Model class created to build nodes for time selection drop down and reservations/availability view
 */
export class CurrentInventory {
  public inventory: InventoryTime[] = []
  public empty = true

  private reservationsIndex: { [key: string]: Reservation[] } = {}
  private inventoryIndex: { [key: string]: InventoryTime } = {}

  constructor() {
    this.createInventory()
  }

  private createInventory(): void {
    const hours = 24
    for (let i = 0, ii = hours; i < ii; i++) {
      this.inventory.push(this.createInventoryTime(i, '00'))
      this.inventory.push(this.createInventoryTime(i, '15'))
      this.inventory.push(this.createInventoryTime(i, '30'))
      this.inventory.push(this.createInventoryTime(i, '45'))
    }
  }

  private createInventoryTime(hour: number, minutes: string): InventoryTime {
    const time = `${hour}:${minutes}`
    const inventoryTime = {
      reservations: [],
      size: null,
      display: false,
      disabled: true,
      time: `${hour > 12 ? hour - 12 : hour}:${minutes}`,
      militaryTime: time,
      hour: hour,
      suffix: hour > 12 ? 'pm' : 'am',
      minutes: parseInt(minutes, 10),
      available: 0
    }
    this.inventoryIndex[time] = inventoryTime
    return inventoryTime
  }

  public clear(): void {
    this.inventory.forEach(i => {
      i.reservations = []
      i.size = null
      i.disabled = true
      i.display = false
    })
    this.reservationsIndex = {}
  }

  public updateInventory(
    reservations: Reservation[],
    inventory: Inventory[]
  ): void {
    this.clear()
    inventory.forEach(i => this.addInventory(i))
    reservations.forEach(r => this.addReservation(r))
    this.empty = !this.inventory.find(i => i.display === true)
  }

  public addReservation(reservation: Reservation): void {
    if (!this.reservationsIndex[reservation.time]) {
      this.reservationsIndex[reservation.time] = []
    }
    this.reservationsIndex[reservation.time].push(reservation)

    const iTime = this.inventoryIndex[reservation.time]
    iTime.reservations.push(reservation)
    if (iTime.reservations.length >= iTime.size) {
      iTime.disabled = true
      iTime.available = 0
    }
    if (iTime.size > iTime.reservations.length) {
      iTime.available = iTime.size - iTime.reservations.length
    }
  }

  private addInventory(inventory: Inventory): void {
    const times = inventory.times || ['0']
    times.forEach(timeString => {
      const time = moment(timeString, 'HH:mm')
      const startHour = time.hours()
      const startMinutes = time.minutes()
      const endTime = inventory.duration
        ? time.add(
            inventory.duration + '',
            momentDurations[inventory.durationUnit]
          )
        : time.endOf('day')
      const endHour = endTime.hours()
      const endMinutes = endTime.minutes()

      let i = this.inventory.findIndex(
        i => i.hour === startHour && i.minutes >= startMinutes
      )
      let iTime = this.inventory[i]
      while (iTime.hour <= endHour) {
        if (iTime.hour === endHour && iTime.minutes >= endMinutes) {
          break
        }

        // Apply the smallest size if overlapping inventories
        if (iTime.size === null) {
          iTime.size = inventory.size
        } else if (iTime.size > inventory.size) {
          iTime.size = inventory.size
        }

        iTime.display = true
        iTime.disabled = iTime.size === 0
        iTime.available = iTime.size

        iTime = this.inventory[++i]
      }
    })
  }
}
