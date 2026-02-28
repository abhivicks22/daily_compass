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
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3
                    className="text-[14px] font-semibold text-[var(--color-text-primary)] flex items-center gap-2 tracking-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    <CheckSquare size={16} className="text-[var(--color-text-primary)]" />
                    Task Performance
                </h3>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                    1 = Completed, 0 = Incomplete/Moved
                </p>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 -mr-2 space-y-1 custom-scrollbar">
                {allTasks.map(task => {
                    const isDone = task.status === 'done'
                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-4 py-2 hover:bg-[var(--color-surface-hover)] px-2 rounded-md transition-colors group"
                        >
                            {/* Score Display */}
                            <div className={`
                                w-7 h-7 rounded text-[11px] flex items-center justify-center font-bold shrink-0 transition-colors
                                ${isDone
                                    ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
                                    : 'bg-[var(--color-border)] text-[var(--color-text-secondary)] grayscale group-hover:bg-[var(--color-text-muted)] group-hover:text-white'
                                }
                            `}>
                                {isDone ? '1' : '0'}
                            </div>

                            {/* Task Details */}
                            <div className="flex-1 min-w-0">
                                <p className={`truncate text-[13px] font-medium ${isDone ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'}`}>
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                                        {format(parseISO(task.date), 'EEE, MMM d')}
                                    </span>
                                    <span className="text-[10px] text-[var(--color-text-secondary)]">
                                        • {task.category}
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
