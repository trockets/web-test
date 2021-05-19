export interface Inventory {
  id: number
  title: string
  color: string
  description: string
  size: number
  dayOfMonth: number[]
  dayOfWeek: number[]
  duration: number
  durationUnit: string
  month: number[]
  times: string[]
  year: number[]
  exclude: number[]
  start: number
  end: number
}
