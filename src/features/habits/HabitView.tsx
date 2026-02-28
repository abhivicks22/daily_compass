import { useEffect, useState, useCallback, useMemo } from 'react'
import { useHabitStore, type HabitDefinition } from '@/stores/useHabitStore'
import { useDayStore } from '@/stores/useDayStore'
import { format, subDays, addDays, startOfWeek } from 'date-fns'
import { Plus, Trash2, Check, X, Settings2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EMOJI_OPTIONS = ['💧', '📚', '🧘', '🏃', '💪', '🍎', '✍️', '🎯', '🎨', '🧹', '💤', '🧠']
const COLOR_OPTIONS = [
    '#9D4EDD', // Electric Purple
    '#FF416C', // Vibrant Pink
    '#FF9900', // Bright Orange
    '#00F2FE', // Neon Cyan
    '#4FACFE', // Bright Blue
    '#43E97B', // Neon Green
    '#FA709A', // Soft Rose
    '#FEE140', // Golden Yellow
]

export function HabitView() {
    const currentDate = useDayStore((s) => s.currentDate)
    const { setCurrentDate } = useDayStore()
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
    const [emoji, setEmoji] = useState('💧')
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
        setEmoji('💧')
        setColor(COLOR_OPTIONS[0])
        setShowForm(false)
    }, [name, emoji, color, addHabit])

    // Generate 7-day strip (Mon-Sun)
    const weekDays = useMemo(() => {
        const current = new Date(currentDate + 'T12:00:00')
        const start = startOfWeek(current, { weekStartsOn: 1 }) // Mon
        return Array.from({ length: 7 }).map((_, i) => {
            const d = addDays(start, i)
            return {
                dateObj: d,
                key: format(d, 'yyyy-MM-dd'),
                letter: format(d, 'eeeee'), // S, M, T, W...
            }
        })
    }, [currentDate])

    return (
        <div className="min-h-screen sm:-mx-6 -mx-4 -my-6 sm:-my-8 px-4 sm:px-6 py-8 bg-[#0F1015] text-white overflow-hidden relative">

            {/* Subtle background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9D4EDD] opacity-[0.15] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF416C] opacity-[0.1] blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 space-y-10">
                {/* Header Sequence */}
                <div className="flex flex-col items-center">
                    <p className="text-white/40 text-sm font-medium tracking-wide mb-1 uppercase">
                        {format(new Date(currentDate + 'T12:00:00'), 'MMMM yyyy')}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight mb-8">
                        daily activity
                    </h1>

                    {/* Dribbble Style Date Navigator */}
                    <div className="flex gap-3 sm:gap-6">
                        {weekDays.map(({ key, letter }) => {
                            const isActive = key === currentDate
                            return (
                                <button
                                    key={key}
                                    onClick={() => setCurrentDate(key)}
                                    className="flex flex-col items-center gap-2 group transition-all"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                                            ${isActive
                                                ? 'border-2 border-[#ff3366] text-white shadow-[0_0_15px_rgba(255,51,102,0.3)]'
                                                : 'border border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white/70'
                                            }
                                        `}
                                    >
                                        {letter}
                                    </div>
                                    {isActive && (
                                        <motion.div layoutId="activedot" className="w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
                                    )}
                                    {!isActive && <div className="w-1.5 h-1.5 rounded-full bg-transparent" />}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold tracking-wide">your habits</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-lg"
                        >
                            {showForm ? <X size={18} /> : <Plus size={18} />}
                        </button>
                    </div>

                    {/* Add Habit Form Modal/Inline */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                                className="overflow-hidden mb-8"
                            >
                                <div className="bg-[#1C1C24] rounded-[24px] p-6 border border-white/10 space-y-6 shadow-2xl relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                        <Settings2 size={100} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name (e.g., Read 10 pages)"
                                        className="w-full relative z-10 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#9D4EDD] transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                    />
                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-white/40 mb-3 font-medium">Icon</p>
                                            <div className="flex flex-wrap gap-2">
                                                {EMOJI_OPTIONS.map((e) => (
                                                    <button
                                                        key={e}
                                                        onClick={() => setEmoji(e)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all
                                                            ${emoji === e ? 'bg-white/20 scale-110 shadow-lg' : 'bg-transparent text-white/50 hover:bg-white/5'}
                                                        `}
                                                    >
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-white/40 mb-3 font-medium">Color</p>
                                            <div className="flex flex-wrap gap-3">
                                                {COLOR_OPTIONS.map((c) => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setColor(c)}
                                                        className="w-8 h-8 rounded-full transition-all"
                                                        style={{
                                                            background: c,
                                                            transform: color === c ? 'scale(1.2)' : 'scale(1)',
                                                            boxShadow: color === c ? `0 0 0 2px #1C1C24, 0 0 0 4px ${c}` : 'none',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        disabled={!name.trim()}
                                        className="w-full relative z-10 py-3.5 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
                                    >
                                        Create Habit
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Habit Grid */}
                    {habits.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                            <div className="text-center py-20 text-white/30">
                                <Plus size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">No habits yet.</p>
                                <p className="text-xs mt-1">Add one to begin your journey.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Dribbble-Style Habit Card ───────────────────────────────────────────────

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
    // Generate subset (e.g. 14 days) of heatmap for the mini card display
    const heatmapCells = useMemo(() => {
        const cells: { date: string; filled: boolean }[] = []
        const end = new Date(date + 'T12:00:00')
        for (let i = 13; i >= 0; i--) {
            const d = subDays(end, i)
            const key = format(d, 'yyyy-MM-dd')
            cells.push({ date: key, filled: heatmap.has(key) })
        }
        return cells
    }, [date, heatmap])

    return (
        <motion.div
            layout
            className="rounded-[28px] p-5 flex flex-col justify-between relative group border border-white/5 transition-all duration-300"
            style={{
                background: completed ? '#1A1C25' : '#141419',
                boxShadow: completed ? '0 10px 40px -10px rgba(0,0,0,0.5)' : 'none'
            }}
        >
            {/* Background Inner Glow if completed */}
            {completed && (
                <div
                    className="absolute inset-0 rounded-[28px] opacity-10 pointer-events-none transition-all duration-500"
                    style={{ background: `linear-gradient(145deg, ${habit.color} 0%, transparent 100%)` }}
                />
            )}

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner"
                        style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))` }}
                    >
                        {habit.emoji}
                    </div>
                    <span className="font-semibold text-white/90 text-sm tracking-wide">{habit.name}</span>
                </div>
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-colors p-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Middle Big Gradient Block */}
            <div
                className="relative z-10 w-full rounded-[20px] p-5 mb-5 flex flex-col overflow-hidden transition-all duration-300 transform group-hover:scale-[1.02]"
                style={{
                    background: `linear-gradient(135deg, ${habit.color} 0%, ${habit.color}88 100%)`,
                    boxShadow: `0 10px 30px -10px ${habit.color}80`
                }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/3" />

                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="text-white drop-shadow-md">
                        <p className="text-4xl font-bold tracking-tight">{streak}</p>
                        <p className="text-[10.5px] uppercase tracking-widest text-white/90 font-medium mt-0.5 opacity-90">
                            {streak === 1 ? 'Day Streak' : 'Days Streak'}
                        </p>
                    </div>
                    {completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <Check size={16} className="text-white" />
                        </motion.div>
                    )}
                </div>

                {/* Heatmap Mini Line */}
                <div className="flex items-center gap-1.5 opacity-90 relative z-10">
                    {heatmapCells.map((cell) => (
                        <div
                            key={cell.date}
                            className="flex-1 h-1.5 rounded-full transition-colors"
                            style={{
                                background: cell.filled ? '#fff' : 'rgba(255,255,255,0.2)'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Button */}
            <button
                onClick={onToggle}
                className="relative z-10 w-full py-3.5 rounded-[16px] flex items-center justify-center transition-all font-semibold text-sm border hover:bg-white/10"
                style={{
                    background: completed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    borderColor: completed ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    color: completed ? '#fff' : 'rgba(255,255,255,0.6)'
                }}
            >
                {completed ? 'Complete' : 'Start'}
            </button>
        </motion.div>
    )
}

