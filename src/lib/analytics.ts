import { db } from '@/db/database'
import type { DayEntry, TaskStatus } from '@/types/day'
import { startOfWeek, endOfWeek, format, eachDayOfInterval, parseISO, subWeeks } from 'date-fns'

export interface WeeklyStats {
    weekKey: string
    startDate: string
    endDate: string
    days: DayEntry[]
    totalTasks: number
    completedTasks: number
    completionRate: number
    totalTimeSpent: number
    averageEnergy: number
    categoryBreakdown: Record<string, { total: number; done: number; time: number }>
    energyProductivityData: { date: string; dayOfWeek: string; energy: number; completed: number; total: number }[]
    obstacleFrequency: { text: string; count: number }[]
    statusCounts: Record<TaskStatus, number>
    mostProductiveDay: string | null
}

export function getWeekKey(date: Date): string {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    return format(start, 'yyyy-MM-dd')
}

export async function loadWeekDays(anchorDate: Date): Promise<DayEntry[]> {
    const start = startOfWeek(anchorDate, { weekStartsOn: 1 })
    const end = endOfWeek(anchorDate, { weekStartsOn: 1 })
    const dateRange = eachDayOfInterval({ start, end })
    const dateKeys = dateRange.map((d) => format(d, 'yyyy-MM-dd'))

    const entries = await db.days.where('date').anyOf(dateKeys).toArray()

    // Fill in missing days with empty entries
    return dateKeys.map((dk) => {
        const existing = entries.find((e) => e.date === dk)
        return existing || {
            date: dk,
            energy: 0,
            tasks: [],
            wins: '',
            reflection: '',
            intentions: [],
        }
    })
}

export function computeWeeklyStats(days: DayEntry[], weekDate: Date): WeeklyStats {
    const start = startOfWeek(weekDate, { weekStartsOn: 1 })
    const end = endOfWeek(weekDate, { weekStartsOn: 1 })

    const allTasks = days.flatMap((d) => d.tasks)
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t) => t.status === 'done').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const totalTimeSpent = allTasks.reduce((sum, t) => sum + t.timeSpent, 0)

    const energyDays = days.filter((d) => d.energy > 0)
    const averageEnergy = energyDays.length > 0
        ? Math.round((energyDays.reduce((sum, d) => sum + d.energy, 0) / energyDays.length) * 10) / 10
        : 0

    // Category breakdown
    const categoryBreakdown: Record<string, { total: number; done: number; time: number }> = {}
    for (const task of allTasks) {
        if (!categoryBreakdown[task.category]) {
            categoryBreakdown[task.category] = { total: 0, done: 0, time: 0 }
        }
        categoryBreakdown[task.category].total++
        if (task.status === 'done') categoryBreakdown[task.category].done++
        categoryBreakdown[task.category].time += task.timeSpent
    }

    // Energy vs productivity
    const energyProductivityData = days.map((d) => ({
        date: d.date,
        dayOfWeek: format(parseISO(d.date), 'EEE'),
        energy: d.energy,
        completed: d.tasks.filter((t) => t.status === 'done').length,
        total: d.tasks.length,
    }))

    // Obstacle frequency
    const obstacleMap = new Map<string, number>()
    for (const task of allTasks) {
        if (task.obstacle.trim()) {
            const normalised = task.obstacle.toLowerCase().trim()
            obstacleMap.set(normalised, (obstacleMap.get(normalised) || 0) + 1)
        }
    }
    const obstacleFrequency = Array.from(obstacleMap.entries())
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

    // Status counts
    const statusCounts: Record<TaskStatus, number> = {
        not_started: 0,
        in_progress: 0,
        done: 0,
        moved: 0,
        dropped: 0,
    }
    for (const task of allTasks) {
        statusCounts[task.status]++
    }

    // Most productive day
    let mostProductiveDay: string | null = null
    let maxCompleted = 0
    for (const d of days) {
        const completed = d.tasks.filter((t) => t.status === 'done').length
        if (completed > maxCompleted) {
            maxCompleted = completed
            mostProductiveDay = format(parseISO(d.date), 'EEEE')
        }
    }

    return {
        weekKey: getWeekKey(weekDate),
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
        days,
        totalTasks,
        completedTasks,
        completionRate,
        totalTimeSpent,
        averageEnergy,
        categoryBreakdown,
        energyProductivityData,
        obstacleFrequency,
        statusCounts,
        mostProductiveDay,
    }
}

export async function loadPreviousWeekStats(anchorDate: Date): Promise<WeeklyStats | null> {
    const prevWeekDate = subWeeks(anchorDate, 1)
    const days = await loadWeekDays(prevWeekDate)
    if (days.every((d) => d.tasks.length === 0 && d.energy === 0)) return null
    return computeWeeklyStats(days, prevWeekDate)
}
