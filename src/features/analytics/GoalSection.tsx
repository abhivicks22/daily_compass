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

    const submitGoal = () => {
        const safeText = text.trim()
        if (!safeText) {
            alert("Please type a goal description first!")
            return
        }

        try {
            addGoal(weekKey, {
                text: safeText,
                target: target || 5,
                category: category || categories[0] || 'Uncategorized'
            })
            setText('')
            setTarget(5)
            setShowForm(false)
        } catch (error: any) {
            console.error("Failed to add goal:", error)
            alert("Error adding goal: " + error.message)
        }
    }

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3
                    className="text-[16px] font-semibold text-[var(--color-navy)] flex items-center gap-2 tracking-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    <Target size={16} className="text-[var(--color-text-primary)]" />
                    Weekly Goals
                </h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
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
                            className="group relative rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors p-3.5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className={`text-[14px] font-medium ${isComplete ? 'text-[var(--color-text-primary)] line-through opacity-50' : 'text-[var(--color-text-primary)]'}`}>
                                        {goal.text}
                                    </p>
                                    <span className="text-[11px] px-1.5 py-0.5 rounded-sm bg-[var(--color-border-light)] text-[var(--color-text-secondary)] font-medium mt-1 inline-block">{goal.category}</span>
                                </div>
                                <button
                                    onClick={() => removeGoal(weekKey, goal.id)}
                                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[var(--color-rose)]/10 transition-all"
                                >
                                    <Trash2 size={14} className="text-[var(--color-rose)]" />
                                </button>
                            </div>
                            {/* Progress bar */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: isComplete ? 'var(--color-text-primary)' : 'var(--color-green)',
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => updateGoalProgress(weekKey, goal.id, Math.max(0, goal.current - 1))}
                                        className="w-6 h-6 flex items-center justify-center text-[14px] rounded hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                    >
                                        −
                                    </button>
                                    <span className="text-[11px] font-medium text-[var(--color-text-secondary)] min-w-[36px] text-center">
                                        {goal.current}/{goal.target}
                                    </span>
                                    <button
                                        onClick={() => updateGoalProgress(weekKey, goal.id, goal.current + 1)}
                                        className="w-6 h-6 flex items-center justify-center text-[14px] rounded hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
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
                        className="mb-4 pl-4 pr-2"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    submitGoal()
                                }
                            }}
                            placeholder="e.g. Complete 5 job applications"
                            className="w-full py-2 text-[14px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors mb-3 placeholder-[var(--color-text-muted)]"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Target:</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={target}
                                    onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                                    className="w-16 px-2 py-1 text-[11px] font-medium rounded text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] hover:bg-[var(--color-border)] cursor-pointer focus:outline-none"
                                />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="px-2 py-1 text-[11px] font-medium rounded text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] cursor-pointer focus:outline-none"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowForm(false)
                                    }}
                                    onPointerDown={(e) => {
                                        e.preventDefault()
                                        setShowForm(false)
                                    }}
                                    className="px-3 py-1.5 text-[12px] rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors relative z-10 pointer-events-auto touch-manipulation cursor-pointer font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        submitGoal()
                                    }}
                                    onPointerDown={(e) => {
                                        e.preventDefault()
                                        submitGoal()
                                    }}
                                    className="px-4 py-1.5 text-[12px] font-medium rounded-md bg-[var(--color-text-primary)] text-[var(--color-surface)] hover:bg-[var(--color-text-secondary)] transition-colors relative z-10 pointer-events-auto touch-manipulation cursor-pointer"
                                >
                                    Add goal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {goals.length === 0 && !showForm && (
                <div className="py-8 text-center border border-dashed border-[var(--color-border)] rounded-lg">
                    <p className="text-[13px] text-[var(--color-text-muted)]">No goals set for this week yet.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-2 text-[13px] text-[var(--color-text-primary)] hover:underline font-medium transition-colors"
                    >
                        Set a goal
                    </button>
                </div>
            )}
        </section>
    )
}
