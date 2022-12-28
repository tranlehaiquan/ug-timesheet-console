import { range } from 'lodash'

export const dayHours = (date: Date) => {
  return range(0, 24).map(hour => new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0))
}
