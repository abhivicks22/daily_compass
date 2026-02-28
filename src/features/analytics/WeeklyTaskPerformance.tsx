import type { WeeklyStats } from '@/lib/analytics'
import { CheckSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export function WeeklyTaskPerformance({ stats }: { stats: WeeklyStats }) {
    // Flatten all tasks from all days in the week
    const allTasks = stats.days.flatMap(day =>
        day.tasks.map(task => ({
            ...task,
            date: day.date
        }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (allTasks.length === 0) return null

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-4 sm:p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] overflow-hidden">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <CheckSquare size={18} className="text-[var(--color-blue)]" />
                Task Performance
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
                1 = Completed, 0 = Incomplete/Moved
            </p>

            <div className="max-h-[300px] overflow-y-auto pr-2 -mr-2 space-y-2">
                {allTasks.map(task => {
                    const isDone = task.status === 'done'
                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-paper)]"
                        >
                            {/* Score Display */}
                            <div className={`
                                w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0
                                ${isDone
                                    ? 'bg-[var(--color-green)]/15 text-[var(--color-green)] border border-[var(--color-green)]/30'
                                    : 'bg-[var(--color-rose)]/10 text-[var(--color-rose)] border border-[var(--color-rose)]/20'
                                }
                            `}>
                                {isDone ? '1' : '0'}
                            </div>

                            {/* Task Details */}
                            <div className="flex-1 min-w-0">
                                <p className={`truncate text-sm font-medium ${isDone ? 'text-[var(--color-text-secondary)] line-through' : 'text-[var(--color-navy)]'}`}>
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                        {format(parseISO(task.date), 'EEE, MMM d')}
                                    </span>
                                    <span className="text-[10px] px-1.5 rounded-full bg-[var(--color-paper-dark)] text-[var(--color-text-secondary)]">
                                        {task.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
