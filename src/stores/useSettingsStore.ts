import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_CATEGORIES = [
    'Coding',
    'Job Search',
    'Health',
    'Learning',
    'Admin',
    'Personal',
]

interface SettingsStore {
    categories: string[]
    addCategory: (name: string) => void
    removeCategory: (name: string) => void
    reorderCategories: (categories: string[]) => void
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            categories: DEFAULT_CATEGORIES,

            addCategory: (name: string) => {
                set((state) => {
                    if (state.categories.includes(name)) return state
                    return { categories: [...state.categories, name] }
                })
            },

            removeCategory: (name: string) => {
                set((state) => ({
                    categories: state.categories.filter((c) => c !== name),
                }))
            },

            reorderCategories: (categories: string[]) => {
                set({ categories })
            },
        }),
        {
            name: 'daily-compass-settings',
        }
    )
)
