import Dexie, { type EntityTable } from 'dexie'
import type { DayEntry } from '@/types/day'

const db = new Dexie('DailyCompassDB') as Dexie & {
    days: EntityTable<DayEntry, 'date'>
}

db.version(1).stores({
    days: 'date', // primary key is the ISO date string
})

export { db }
