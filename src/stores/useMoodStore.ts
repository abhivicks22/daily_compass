import { create } from 'zustand'
import { db, type MoodEntry } from '@/db/database'

interface MoodStore {
    currentDate: string
    moods: MoodEntry[]
    isLoading: boolean

    loadMoods: (date: string) => Promise<void>
    addMood: (level: number, note: string) => Promise<void>
    deleteMood: (id: number) => Promise<void>
    loadWeekMoods: (endDate: string) => Promise<{ date: string; avg: number }[]>
}

export const useMoodStore = create<MoodStore>((set, get) => ({
    currentDate: '',
    moods: [],
    isLoading: false,

    loadMoods: async (date: string) => {
        set({ currentDate: date, isLoading: true })
        try {
            const moods = await db.moods.where('date').equals(date).sortBy('timestamp')
            set({ moods, isLoading: false })
        } catch (err) {
            console.error('Failed to load moods:', err)
            set({ moods: [], isLoading: false })
        }
    },

    addMood: async (level: number, note: string) => {
        const { currentDate } = get()
        const entry: MoodEntry = {
            date: currentDate,
            timestamp: Date.now(),
            level,
            note,
        }
        try {
            const id = await db.moods.add(entry)
            entry.id = id as number
            set((state) => ({ moods: [...state.moods, entry] }))
        } catch (err) {
            console.error('Failed to add mood:', err)
        }
    },

    deleteMood: async (id: number) => {
        try {
            await db.moods.delete(id)
            set((state) => ({ moods: state.moods.filter((m) => m.id !== id) }))
        } catch (err) {
            console.error('Failed to delete mood:', err)
        }
    },

    loadWeekMoods: async (endDate: string) => {
        const end = new Date(endDate + 'T23:59:59')
        const start = new Date(end)
        start.setDate(start.getDate() - 6)

        const results: { date: string; avg: number }[] = []
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0]
            const dayMoods = await db.moods.where('date').equals(dateKey).toArray()
            if (dayMoods.length > 0) {
                const avg = dayMoods.reduce((sum, m) => sum + m.level, 0) / dayMoods.length
                results.push({ date: dateKey, avg: Math.round(avg * 10) / 10 })
            }
        }
        return results
    },
}))
