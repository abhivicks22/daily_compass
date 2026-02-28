import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db, type HabitRecord } from '@/db/database'

export interface HabitDefinition {
    id: string
    name: string
    emoji: string
    color: string
    createdAt: number
}

interface HabitStore {
    habits: HabitDefinition[]
    completions: HabitRecord[]
    isLoading: boolean

    addHabit: (name: string, emoji: string, color: string) => void
    removeHabit: (id: string) => Promise<void>
    toggleCompletion: (habitId: string, date: string) => Promise<void>
    loadCompletions: (startDate: string, endDate: string) => Promise<void>
    isCompleted: (habitId: string, date: string) => boolean
    getStreak: (habitId: string, fromDate: string) => number
    getHeatmapData: (habitId: string) => Map<string, boolean>
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export const useHabitStore = create<HabitStore>()(
    persist(
        (set, get) => ({
            habits: [],
            completions: [],
            isLoading: false,

            addHabit: (name: string, emoji: string, color: string) => {
                const habit: HabitDefinition = {
                    id: generateId(),
                    name,
                    emoji,
                    color,
                    createdAt: Date.now(),
                }
                set((state) => ({ habits: [...state.habits, habit] }))
            },

            removeHabit: async (id: string) => {
                // Remove from definitions
                set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }))
                // Remove all completions from Dexie
                try {
                    await db.habitRecords.where('habitId').equals(id).delete()
                    set((state) => ({
                        completions: state.completions.filter((c) => c.habitId !== id),
                    }))
                } catch (err) {
                    console.error('Failed to remove habit records:', err)
                }
            },

            toggleCompletion: async (habitId: string, date: string) => {
                try {
                    const existing = await db.habitRecords
                        .where('[habitId+date]')
                        .equals([habitId, date])
                        .first()

                    if (existing) {
                        await db.habitRecords.delete(existing.id!)
                        set((state) => ({
                            completions: state.completions.filter((c) => c.id !== existing.id),
                        }))
                    } else {
                        const record: HabitRecord = { habitId, date }
                        const id = await db.habitRecords.add(record)
                        record.id = id as number
                        set((state) => ({
                            completions: [...state.completions, record],
                        }))
                    }
                } catch (err) {
                    console.error('Failed to toggle completion:', err)
                }
            },

            loadCompletions: async (startDate: string, endDate: string) => {
                set({ isLoading: true })
                try {
                    const records = await db.habitRecords
                        .where('date')
                        .between(startDate, endDate, true, true)
                        .toArray()
                    set({ completions: records, isLoading: false })
                } catch (err) {
                    console.error('Failed to load completions:', err)
                    set({ completions: [], isLoading: false })
                }
            },

            isCompleted: (habitId: string, date: string) => {
                return get().completions.some(
                    (c) => c.habitId === habitId && c.date === date
                )
            },

            getStreak: (habitId: string, fromDate: string) => {
                const completions = get().completions.filter((c) => c.habitId === habitId)
                const completedDates = new Set(completions.map((c) => c.date))

                let streak = 0
                const d = new Date(fromDate + 'T12:00:00')

                while (true) {
                    const key = d.toISOString().split('T')[0]
                    if (completedDates.has(key)) {
                        streak++
                        d.setDate(d.getDate() - 1)
                    } else {
                        break
                    }
                }
                return streak
            },

            getHeatmapData: (habitId: string) => {
                const completions = get().completions.filter((c) => c.habitId === habitId)
                const map = new Map<string, boolean>()
                completions.forEach((c) => map.set(c.date, true))
                return map
            },
        }),
        {
            name: 'daily-compass-habits',
            partialize: (state) => ({ habits: state.habits }),
        }
    )
)
