import Dexie, { type EntityTable } from 'dexie'
import type { DayEntry } from '@/types/day'

export interface MoodEntry {
    id?: number
    date: string
    timestamp: number
    level: number // 1-5
    note: string
}

export interface JournalEntry {
    date: string
    content: string
    promptUsed: string
    updatedAt: number
}

export interface HabitRecord {
    id?: number
    habitId: string
    date: string
}

const db = new Dexie('DailyCompassDB') as Dexie & {
    days: EntityTable<DayEntry, 'date'>
    moods: EntityTable<MoodEntry, 'id'>
    journals: EntityTable<JournalEntry, 'date'>
    habitRecords: EntityTable<HabitRecord, 'id'>
}

db.version(1).stores({
    days: 'date',
})

db.version(2).stores({
    days: 'date',
    moods: '++id, date, timestamp',
    journals: 'date',
    habitRecords: '++id, [habitId+date], date, habitId',
})

export { db }

