export type TaskStatus = 'not_started' | 'in_progress' | 'done' | 'moved' | 'dropped'

export type Priority = 'urgent_important' | 'not_urgent_important' | 'urgent_not_important' | 'not_urgent_not_important'

export interface TaskObject {
    id: string
    title: string
    category: string
    status: TaskStatus
    timeSpent: number
    obstacle: string
    priority: Priority
    createdAt: number
}

export interface Intention {
    trigger: string
    action: string
}

export interface DayEntry {
    date: string // ISO date string YYYY-MM-DD, primary key
    energy: number // 1-5
    tasks: TaskObject[]
    wins: string
    reflection: string
    intentions: Intention[]
}

// Status display metadata
export const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: string; color: string }> = {
    not_started: { label: 'Not Started', icon: '⬜', color: 'var(--color-status-not-started)' },
    in_progress: { label: 'In Progress', icon: '◐', color: 'var(--color-status-in-progress)' },
    done: { label: 'Done', icon: '✅', color: 'var(--color-status-done)' },
    moved: { label: 'Moved', icon: '➡️', color: 'var(--color-status-moved)' },
    dropped: { label: 'Dropped', icon: '✖️', color: 'var(--color-status-dropped)' },
}

export const STATUS_CYCLE: TaskStatus[] = ['not_started', 'in_progress', 'done', 'moved', 'dropped']

export const PRIORITY_CONFIG: Record<Priority, { label: string; emoji: string; color: string }> = {
    urgent_important: { label: 'Do First', emoji: '🔴', color: '#ef4444' },
    not_urgent_important: { label: 'Schedule', emoji: '🟡', color: '#eab308' },
    urgent_not_important: { label: 'Minimize', emoji: '🟠', color: '#f97316' },
    not_urgent_not_important: { label: 'Eliminate', emoji: '⚪', color: '#9ca3af' },
}

export const ENERGY_CONFIG = [
    { level: 1, emoji: '😴', label: 'Exhausted', color: 'var(--color-energy-1)' },
    { level: 2, emoji: '😐', label: 'Low', color: 'var(--color-energy-2)' },
    { level: 3, emoji: '🙂', label: 'Okay', color: 'var(--color-energy-3)' },
    { level: 4, emoji: '😊', label: 'Good', color: 'var(--color-energy-4)' },
    { level: 5, emoji: '⚡', label: 'Charged', color: 'var(--color-energy-5)' },
]
