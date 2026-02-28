import { useGoalStore } from '@/stores/useGoalStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useState } from 'react'
import { Target, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function GoalSection({ weekKey }: { weekKey: string }) {
    const { getGoalsForWeek, addGoal, updateGoalProgress, removeGoal } = useGoalStore()
    const { categories } = useSettingsStore()
    const goals = getGoalsForWeek(weekKey)
    const [showForm, setShowForm] = useState(false)
    const [text, setText] = useState('')
    const [target, setTarget] = useState(5)
    const [category, setCategory] = useState(categories[0] || '')

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return
        addGoal(weekKey, { text: text.trim(), target, category })
        setText('')
        setTarget(5)
        setShowForm(false)
    }

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <div className="flex items-center justify-between mb-3">
                <h3
                    className="text-base font-semibold text-[var(--color-navy)] flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    <Target size={18} className="text-[var(--color-amber)]" />
                    Weekly Goals
                </h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)] transition-colors"
                    >
                        <Plus size={14} />
                        Add goal
                    </button>
                )}
            </div>

            {/* Goals list */}
            <AnimatePresence>
                {goals.map((goal) => {
                    const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0
                    const isComplete = goal.current >= goal.target
                    return (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-paper)] border border-[var(--color-border-light)]"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className={`text-sm font-medium ${isComplete ? 'text-[var(--color-green)]' : 'text-[var(--color-navy)]'}`}>
                                        {isComplete ? '✅ ' : ''}{goal.text}
                                    </p>
                                    <span className="text-[11px] text-[var(--color-text-muted)]">{goal.category}</span>
                                </div>
                                <button
                                    onClick={() => removeGoal(weekKey, goal.id)}
                                    className="p-1 rounded hover:bg-[var(--color-rose)]/10"
                                >
                                    <Trash2 size={12} className="text-[var(--color-rose)]" />
                                </button>
                            </div>
                            {/* Progress bar */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[var(--color-paper-darker)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: isComplete ? 'var(--color-green)' : 'var(--color-amber)',
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => updateGoalProgress(weekKey, goal.id, Math.max(0, goal.current - 1))}
                                        className="w-6 h-6 flex items-center justify-center text-xs rounded bg-[var(--color-paper-darker)] hover:bg-[var(--color-border)] transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-xs font-medium text-[var(--color-navy)] min-w-[36px] text-center">
                                        {goal.current}/{goal.target}
                                    </span>
                                    <button
                                        onClick={() => updateGoalProgress(weekKey, goal.id, goal.current + 1)}
                                        className="w-6 h-6 flex items-center justify-center text-xs rounded bg-[var(--color-amber)]/20 hover:bg-[var(--color-amber)]/30 text-[var(--color-amber-dark)] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            {/* Add goal form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 rounded-[var(--radius-lg)] bg-[var(--color-paper)] border border-[var(--color-border)]"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (text.trim()) handleAdd(e)
                                }
                            }}
                            placeholder="e.g. Complete 5 job applications"
                            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] bg-white mb-2"
                        />
                        <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                                <label className="text-xs text-[var(--color-text-secondary)]">Target:</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={target}
                                    onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                                    className="w-16 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-amber)]"
                                />
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-amber)]"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowForm(false)
                                }}
                                className="px-3 py-1.5 text-xs rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-paper-dark)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="px-4 py-1.5 text-xs font-medium rounded bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)]"
                            >
                                Add goal
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {goals.length === 0 && !showForm && (
                <div className="text-center py-4">
                    <p className="text-xs text-[var(--color-text-muted)]">No goals set for this week yet.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-1 text-xs text-[var(--color-amber-dark)] hover:text-[var(--color-amber)] font-medium"
                    >
                        + Set a goal
                    </button>
                </div>
            )}
        </section>
    )
}
