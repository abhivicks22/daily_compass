import { useEffect, useState, useCallback, useMemo } from 'react'
import { useHabitStore, type HabitDefinition } from '@/stores/useHabitStore'
import { useDayStore } from '@/stores/useDayStore'
import { format, subDays } from 'date-fns'
import { Target, Plus, Trash2, Flame, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DateNavigator } from '@/components/DateNavigator'

const EMOJI_OPTIONS = ['💪', '📚', '🧘', '🏃', '💧', '🎨', '✍️', '🧹', '💤', '🍎', '🎯', '🧠']
const COLOR_OPTIONS = ['#6BA3D6', '#7CB589', '#E8985E', '#D4726A', '#9b87f5', '#e8c95e', '#6bbfa3', '#d68fb5']

export function HabitView() {
    const currentDate = useDayStore((s) => s.currentDate)
    const {
        habits,
        completions,
        addHabit,
        removeHabit,
        toggleCompletion,
        loadCompletions,
        isCompleted,
        getStreak,
        getHeatmapData,
    } = useHabitStore()

    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [emoji, setEmoji] = useState('💪')
    const [color, setColor] = useState(COLOR_OPTIONS[0])

    // Load 12 weeks of data
    useEffect(() => {
        const end = currentDate
        const start = format(subDays(new Date(currentDate + 'T12:00:00'), 83), 'yyyy-MM-dd')
        loadCompletions(start, end)
    }, [currentDate, loadCompletions])

    const handleAdd = useCallback(() => {
        if (!name.trim()) return
        addHabit(name.trim(), emoji, color)
        setName('')
        setEmoji('💪')
        setColor(COLOR_OPTIONS[0])
        setShowForm(false)
    }, [name, emoji, color, addHabit])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <Target size={24} className="text-[var(--color-text-primary)]" />
                    <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Habits
                    </h1>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    {showForm ? <X size={14} /> : <Plus size={14} />}
                    {showForm ? 'Cancel' : 'Add Habit'}
                </button>
            </div>

            <DateNavigator />

            {/* Add Habit Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 border border-dashed border-[var(--color-border)] rounded-lg bg-[var(--color-surface-card)] space-y-5 mb-4">
                            <input
                                type="text"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Habit name (e.g., Read 10 pages)"
                                className="w-full py-2 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-muted)]"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />

                            {/* Emoji picker */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-medium">
                                    Icon
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_OPTIONS.map((e) => (
                                        <button
                                            key={e}
                                            onClick={() => setEmoji(e)}
                                            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] transition-all text-xl"
                                            style={{
                                                background: emoji === e ? 'var(--color-paper-dark)' : 'transparent',
                                                transform: emoji === e ? 'scale(1.15)' : 'scale(1)',
                                            }}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color picker */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-medium">
                                    Color
                                </p>
                                <div className="flex gap-2">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className="w-7 h-7 rounded-full transition-all"
                                            style={{
                                                background: c,
                                                transform: color === c ? 'scale(1.2)' : 'scale(1)',
                                                boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleAdd}
                                    disabled={!name.trim()}
                                    className="px-5 py-2 bg-[var(--color-text-primary)] text-[var(--color-surface)] rounded-md text-[13px] font-medium hover:bg-[var(--color-text-secondary)] transition-colors disabled:opacity-40"
                                >
                                    Create Habit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {habits.length > 0 ? (
                <div className="space-y-0">
                    {habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            date={currentDate}
                            completed={isCompleted(habit.id, currentDate)}
                            streak={getStreak(habit.id, currentDate)}
                            heatmap={getHeatmapData(habit.id)}
                            onToggle={() => toggleCompletion(habit.id, currentDate)}
                            onRemove={() => removeHabit(habit.id)}
                        />
                    ))}
                </div>
            ) : (
                !showForm && (
                    <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
                        <p className="text-[13px] text-[var(--color-text-muted)]">No habits yet. Small, consistent actions compound over time.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-[13px] font-medium text-[var(--color-text-primary)] hover:underline transition-all"
                        >
                            Create a Habit
                        </button>
                    </div>
                )
            )}
        </div>
    )
}

// ─── Habit Card ───────────────────────────────────────────────

interface HabitCardProps {
    habit: HabitDefinition
    date: string
    completed: boolean
    streak: number
    heatmap: Map<string, boolean>
    onToggle: () => void
    onRemove: () => void
}

function HabitCard({ habit, date, completed, streak, heatmap, onToggle, onRemove }: HabitCardProps) {
    // Generate 84 days (12 weeks) of heatmap cells
    const heatmapCells = useMemo(() => {
        const cells: { date: string; filled: boolean }[] = []
        const end = new Date(date + 'T12:00:00')
        for (let i = 83; i >= 0; i--) {
            const d = subDays(end, i)
            const key = format(d, 'yyyy-MM-dd')
            cells.push({ date: key, filled: heatmap.has(key) })
        }
        return cells
    }, [date, heatmap])

    return (
        <motion.div
            layout
            className="py-6 border-b border-[var(--color-border)] last:border-b-0 group"
        >
            {/* Top row */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={onToggle}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 border"
                    style={{
                        background: completed ? habit.color : 'var(--color-surface-hover)',
                        borderColor: completed ? 'transparent' : 'var(--color-border)',
                        color: completed ? '#fff' : 'var(--color-text-primary)',
                    }}
                    aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
                >
                    {completed ? (
                        <Check size={18} className="animate-check-pop" />
                    ) : (
                        <span className="text-[18px] opacity-70 grayscale">{habit.emoji}</span>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p
                        className="font-medium text-[15px] tracking-tight"
                        style={{ textDecoration: completed ? 'line-through' : 'none', color: completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}
                    >
                        {habit.name}
                    </p>
                    {streak > 0 && (
                        <p className="text-[12px] flex items-center gap-1.5 mt-1 font-medium" style={{ color: habit.color }}>
                            <Flame size={12} />
                            {streak} day streak
                        </p>
                    )}
                </div>

                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-rose)] transition-all"
                    aria-label="Remove habit"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Heatmap */}
            <div
                className="grid gap-1 ml-14"
                style={{
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridTemplateRows: 'repeat(7, 1fr)',
                    gridAutoFlow: 'column',
                }}
            >
                {heatmapCells.map((cell) => (
                    <div
                        key={cell.date}
                        className="aspect-square rounded-[2px] transition-colors"
                        style={{
                            background: cell.filled ? habit.color : 'transparent',
                            opacity: cell.filled ? 1 : 1,
                            border: cell.filled ? 'none' : '1px solid var(--color-border)'
                        }}
                        title={`${format(new Date(cell.date + 'T12:00:00'), 'MMM d')}${cell.filled ? ' ✓' : ''}`}
                    />
                ))}
            </div>
        </motion.div>
    )
}
