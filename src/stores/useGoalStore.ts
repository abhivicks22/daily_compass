import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WeeklyGoal {
    id: string
    text: string
    target: number
    current: number
    category: string
}

interface GoalStore {
    weeklyGoals: Record<string, WeeklyGoal[]> // keyed by week start date
    getGoalsForWeek: (weekKey: string) => WeeklyGoal[]
    addGoal: (weekKey: string, goal: Omit<WeeklyGoal, 'id' | 'current'>) => void
    updateGoalProgress: (weekKey: string, goalId: string, current: number) => void
    removeGoal: (weekKey: string, goalId: string) => void
}

function genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
}

export const useGoalStore = create<GoalStore>()(
    persist(
        (set, get) => ({
            weeklyGoals: {},

            getGoalsForWeek: (weekKey: string) => {
                return get().weeklyGoals[weekKey] || []
            },

            addGoal: (weekKey: string, goal) => {
                set((state) => {
                    const safeWeekly = state.weeklyGoals || {}
                    const existing = safeWeekly[weekKey] || []
                    return {
                        weeklyGoals: {
                            ...safeWeekly,
                            [weekKey]: [...existing, { ...goal, id: genId(), current: 0 }],
                        },
                    }
                })
            },

            updateGoalProgress: (weekKey: string, goalId: string, current: number) => {
                set((state) => {
                    const existing = state.weeklyGoals[weekKey] || []
                    return {
                        weeklyGoals: {
                            ...state.weeklyGoals,
                            [weekKey]: existing.map((g) => (g.id === goalId ? { ...g, current } : g)),
                        },
                    }
                })
            },

            removeGoal: (weekKey: string, goalId: string) => {
                set((state) => {
                    const existing = state.weeklyGoals[weekKey] || []
                    return {
                        weeklyGoals: {
                            ...state.weeklyGoals,
                            [weekKey]: existing.filter((g) => g.id !== goalId),
                        },
                    }
                })
            },
        }),
        { name: 'daily-compass-goals' }
    )
)
