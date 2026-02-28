import { create } from 'zustand'
import { db, type JournalEntry } from '@/db/database'

interface JournalStore {
    currentDate: string
    entry: JournalEntry | null
    isLoading: boolean
    isSaving: boolean

    loadEntry: (date: string) => Promise<void>
    saveEntry: (content: string, promptUsed: string) => Promise<void>
    clearEntry: (date: string) => Promise<void>
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null

export const useJournalStore = create<JournalStore>((set, get) => ({
    currentDate: '',
    entry: null,
    isLoading: false,
    isSaving: false,

    loadEntry: async (date: string) => {
        set({ currentDate: date, isLoading: true })
        try {
            const entry = await db.journals.get(date)
            set({ entry: entry || null, isLoading: false })
        } catch (err) {
            console.error('Failed to load journal:', err)
            set({ entry: null, isLoading: false })
        }
    },

    saveEntry: async (content: string, promptUsed: string) => {
        const { currentDate } = get()
        set({ isSaving: true })

        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(async () => {
            try {
                const entry: JournalEntry = {
                    date: currentDate,
                    content,
                    promptUsed,
                    updatedAt: Date.now(),
                }
                await db.journals.put(entry)
                set({ entry, isSaving: false })
            } catch (err) {
                console.error('Failed to save journal:', err)
                set({ isSaving: false })
            }
        }, 600)
    },

    clearEntry: async (date: string) => {
        try {
            await db.journals.delete(date)
            set({ entry: null })
        } catch (err) {
            console.error('Failed to clear journal:', err)
        }
    },
}))
