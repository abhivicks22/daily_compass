import { create } from 'zustand'
import { db } from '@/db/database'
import type { DayEntry, TaskObject, Intention, TaskStatus } from '@/types/day'
import { format } from 'date-fns'

function todayKey(): string {
    return format(new Date(), 'yyyy-MM-dd')
}

function createEmptyDay(date: string): DayEntry {
    return {
        date,
        energy: 0,
        tasks: [],
        wins: '',
        reflection: '',
        intentions: [
            { trigger: '', action: '' },
            { trigger: '', action: '' },
            { trigger: '', action: '' },
        ],
    }
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

interface DayStore {
    currentDate: string
    day: DayEntry
    isLoading: boolean
    hasUnsavedChanges: boolean

    // Navigation
    setCurrentDate: (date: string) => void
    goToToday: () => void
    goToPrevDay: () => void
    goToNextDay: () => void

    // Load/Save
    loadDay: (date: string) => Promise<void>
    saveDay: () => Promise<void>

    // Energy
    setEnergy: (level: number) => void

    // Tasks
    addTask: (task: Omit<TaskObject, 'id' | 'createdAt' | 'status' | 'timeSpent' | 'obstacle'>) => void
    updateTask: (id: string, updates: Partial<TaskObject>) => void
    cycleTaskStatus: (id: string) => void
    deleteTask: (id: string) => void
    addTimeToTask: (id: string, minutes: number) => void

    // Wins & Reflection
    setWins: (wins: string) => void
    setReflection: (reflection: string) => void

    // Intentions
    updateIntention: (index: number, intention: Intention) => void
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null

export const useDayStore = create<DayStore>((set, get) => {
    const debouncedSave = () => {
        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(() => {
            get().saveDay()
        }, 500)
    }

    const updateAndSave = (updater: (state: DayStore) => Partial<DayStore>) => {
        set((state) => ({ ...updater(state), hasUnsavedChanges: true }))
        debouncedSave()
    }

    return {
        currentDate: todayKey(),
        day: createEmptyDay(todayKey()),
        isLoading: true,
        hasUnsavedChanges: false,

        setCurrentDate: (date: string) => {
            set({ currentDate: date, isLoading: true })
            get().loadDay(date)
        },

        goToToday: () => {
            const today = todayKey()
            set({ currentDate: today, isLoading: true })
            get().loadDay(today)
        },

        goToPrevDay: () => {
            const current = new Date(get().currentDate + 'T12:00:00')
            current.setDate(current.getDate() - 1)
            const prev = format(current, 'yyyy-MM-dd')
            set({ currentDate: prev, isLoading: true })
            get().loadDay(prev)
        },

        goToNextDay: () => {
            const current = new Date(get().currentDate + 'T12:00:00')
            current.setDate(current.getDate() + 1)
            const next = format(current, 'yyyy-MM-dd')
            set({ currentDate: next, isLoading: true })
            get().loadDay(next)
        },

        loadDay: async (date: string) => {
            try {
                const existing = await db.days.get(date)
                if (existing) {
                    set({ day: existing, isLoading: false, hasUnsavedChanges: false })
                } else {
                    set({ day: createEmptyDay(date), isLoading: false, hasUnsavedChanges: false })
                }
            } catch (err) {
                console.error('Failed to load day:', err)
                set({ day: createEmptyDay(date), isLoading: false })
            }
        },

        saveDay: async () => {
            const { day } = get()
            try {
                await db.days.put(day)
                set({ hasUnsavedChanges: false })
            } catch (err) {
                console.error('Failed to save day:', err)
            }
        },

        setEnergy: (level: number) => {
            updateAndSave((state) => ({
                day: { ...state.day, energy: level },
            }))
        },

        addTask: (taskData) => {
            const newTask: TaskObject = {
                ...taskData,
                id: generateId(),
                status: 'not_started',
                timeSpent: 0,
                obstacle: '',
                createdAt: Date.now(),
            }
            updateAndSave((state) => {
                const existingDay = state.day || {} as DayEntry
                const existingTasks = existingDay.tasks || []
                return {
                    day: { ...existingDay, tasks: [...existingTasks, newTask] },
                }
            })
        },

        updateTask: (id: string, updates: Partial<TaskObject>) => {
            updateAndSave((state) => ({
                day: {
                    ...state.day,
                    tasks: state.day.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                },
            }))
        },

        cycleTaskStatus: (id: string) => {
            const statusOrder: TaskStatus[] = ['not_started', 'in_progress', 'done', 'moved', 'dropped']
            updateAndSave((state) => ({
                day: {
                    ...state.day,
                    tasks: state.day.tasks.map((t) => {
                        if (t.id !== id) return t
                        const currentIdx = statusOrder.indexOf(t.status)
                        const nextIdx = (currentIdx + 1) % statusOrder.length
                        return { ...t, status: statusOrder[nextIdx] }
                    }),
                },
            }))
        },

        deleteTask: (id: string) => {
            updateAndSave((state) => ({
                day: {
                    ...state.day,
                    tasks: state.day.tasks.filter((t) => t.id !== id),
                },
            }))
        },

        addTimeToTask: (id: string, minutes: number) => {
            updateAndSave((state) => ({
                day: {
                    ...state.day,
                    tasks: state.day.tasks.map((t) =>
                        t.id === id ? { ...t, timeSpent: t.timeSpent + minutes } : t
                    ),
                },
            }))
        },

        setWins: (wins: string) => {
            updateAndSave((state) => ({
                day: { ...state.day, wins },
            }))
        },

        setReflection: (reflection: string) => {
            updateAndSave((state) => ({
                day: { ...state.day, reflection },
            }))
        },

        updateIntention: (index: number, intention: Intention) => {
            updateAndSave((state) => {
                const intentions = [...state.day.intentions]
                intentions[index] = intention
                return { day: { ...state.day, intentions } }
            })
        },
    }
})
