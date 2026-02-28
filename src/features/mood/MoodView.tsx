import { useEffect, useState, useCallback } from 'react'
import { useMoodStore } from '@/stores/useMoodStore'
import { useDayStore } from '@/stores/useDayStore'
import { format } from 'date-fns'
import { Heart, Trash2, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { DateNavigator } from '@/components/DateNavigator'

const MOOD_LEVELS = [
    { level: 1, emoji: '😞', label: 'Rough', color: '#D4726A' },
    { level: 2, emoji: '😔', label: 'Low', color: '#E8985E' },
    { level: 3, emoji: '😐', label: 'Neutral', color: '#e8c95e' },
    { level: 4, emoji: '🙂', label: 'Good', color: '#7CB589' },
    { level: 5, emoji: '😊', label: 'Great', color: '#6BA3D6' },
]

export function MoodView() {
    const currentDate = useDayStore((s) => s.currentDate)
    const { moods, isLoading, loadMoods, addMood, deleteMood, loadWeekMoods } = useMoodStore()
    const [selectedLevel, setSelectedLevel] = useState<number>(0)
    const [note, setNote] = useState('')
    const [weekData, setWeekData] = useState<{ date: string; avg: number }[]>([])

    useEffect(() => {
        loadMoods(currentDate)
        loadWeekMoods(currentDate).then(setWeekData)
    }, [currentDate, loadMoods, loadWeekMoods])

    const handleAddMood = useCallback(async () => {
        if (selectedLevel === 0) return
        await addMood(selectedLevel, note)
        setSelectedLevel(0)
        setNote('')
        // Refresh week data
        const data = await loadWeekMoods(currentDate)
        setWeekData(data)
    }, [selectedLevel, note, addMood, loadWeekMoods, currentDate])

    const handleDeleteMood = useCallback(async (id: number) => {
        await deleteMood(id)
        const data = await loadWeekMoods(currentDate)
        setWeekData(data)
    }, [deleteMood, loadWeekMoods, currentDate])

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Heart size={28} className="text-[var(--color-rose)]" />
                <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Mood Tracker
                </h1>
            </div>

            <DateNavigator />

            {/* Log Mood Card */}
            <div className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
                <h2 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                    How are you feeling?
                </h2>
                <div className="flex justify-center gap-3 mb-4">
                    {MOOD_LEVELS.map((m) => (
                        <button
                            key={m.level}
                            onClick={() => setSelectedLevel(selectedLevel === m.level ? 0 : m.level)}
                            className="flex flex-col items-center gap-1 transition-all duration-150"
                            style={{
                                transform: selectedLevel === m.level ? 'scale(1.2)' : 'scale(1)',
                                opacity: selectedLevel === 0 || selectedLevel === m.level ? 1 : 0.4,
                            }}
                        >
                            <span className="text-3xl">{m.emoji}</span>
                            <span className="text-[11px] text-[var(--color-text-muted)]">{m.label}</span>
                        </button>
                    ))}
                </div>
                <AnimatePresence>
                    {selectedLevel > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What's on your mind? (optional)"
                                className="w-full p-3 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm resize-none bg-[var(--color-paper)] focus:outline-none focus:border-[var(--color-blue)] transition-colors"
                                rows={2}
                            />
                            <button
                                onClick={handleAddMood}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-[var(--color-rose)] text-white rounded-[var(--radius-md)] text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                <Plus size={16} />
                                Log Mood
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Today's Timeline */}
            {moods.length > 0 && (
                <div className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
                    <h2 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                        Today's Mood Timeline
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {moods.map((mood) => {
                                const config = MOOD_LEVELS.find((m) => m.level === mood.level)
                                return (
                                    <motion.div
                                        key={mood.id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 16 }}
                                        className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-paper)] group"
                                    >
                                        <span className="text-2xl">{config?.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium" style={{ color: config?.color }}>
                                                    {config?.label}
                                                </span>
                                                <span className="text-[11px] text-[var(--color-text-muted)]">
                                                    {format(new Date(mood.timestamp), 'h:mm a')}
                                                </span>
                                            </div>
                                            {mood.note && (
                                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{mood.note}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => mood.id && handleDeleteMood(mood.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--color-rose)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-rose)] transition-all"
                                            aria-label="Delete mood"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* 7-Day Chart */}
            {weekData.length > 1 && (
                <div className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
                    <h2 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                        7-Day Mood Trend
                    </h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={weekData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                                tickFormatter={(d) => format(new Date(d + 'T12:00:00'), 'EEE')}
                            />
                            <YAxis
                                domain={[1, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--color-surface-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '12px',
                                }}
                                formatter={(value: number | undefined) => {
                                    const v = value ?? 0
                                    const cfg = MOOD_LEVELS.find((m) => m.level === Math.round(v))
                                    return [`${cfg?.emoji} ${v}`, 'Mood']
                                }}
                                labelFormatter={(d) => format(new Date(d + 'T12:00:00'), 'MMM d')}
                            />
                            <Line
                                type="monotone"
                                dataKey="avg"
                                stroke="var(--color-rose)"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: 'var(--color-rose)', strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: 'var(--color-rose)', strokeWidth: 2, stroke: 'white' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Empty state */}
            {moods.length === 0 && !isLoading && (
                <div className="text-center py-10 text-[var(--color-text-muted)]">
                    <Heart size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No moods logged yet today. How are you?</p>
                </div>
            )}
        </div>
    )
}
