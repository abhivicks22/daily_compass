import { useDayStore } from '@/stores/useDayStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { STATUS_CONFIG, STATUS_CYCLE, PRIORITY_CONFIG } from '@/types/day'
import type { TaskObject, Priority } from '@/types/day'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Clock, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

function TaskCard({ task }: { task: TaskObject }) {
    const { cycleTaskStatus, updateTask, deleteTask, addTimeToTask } = useDayStore()
    const [expanded, setExpanded] = useState(false)
    const statusConfig = STATUS_CONFIG[task.status]

    const timeButtons = [15, 30, 45, 60]

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] overflow-hidden"
        >
            {/* Main row */}
            <div className="flex items-center gap-3 p-3.5">
                {/* Status toggle */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => cycleTaskStatus(task.id)}
                    className={`
            w-9 h-9 flex-shrink-0 rounded-[var(--radius-md)] flex items-center justify-center text-lg
            transition-all duration-150 cursor-pointer border-2
            ${task.status === 'done' ? 'animate-check-pop' : ''}
          `}
                    style={{
                        borderColor: statusConfig.color,
                        backgroundColor: `${statusConfig.color}20`,
                    }}
                    title={`Status: ${statusConfig.label} (click to change)`}
                >
                    {statusConfig.icon}
                </motion.button>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-navy)]'
                            }`}
                    >
                        {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--color-paper-dark)] text-[var(--color-text-secondary)]">
                            {task.category}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                            {PRIORITY_CONFIG[task.priority].emoji} {PRIORITY_CONFIG[task.priority].label}
                        </span>
                        {task.timeSpent > 0 && (
                            <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-0.5">
                                <Clock size={10} />
                                {task.timeSpent}m
                            </span>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-paper-dark)] transition-colors"
                >
                    {expanded ? <ChevronUp size={16} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={16} className="text-[var(--color-text-muted)]" />}
                </button>
            </div>

            {/* Expanded section */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[var(--color-border-light)]"
                    >
                        <div className="p-3.5 space-y-3">
                            {/* Time buttons */}
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1">
                                    <Clock size={12} />
                                    Time spent
                                    {task.timeSpent > 0 && (
                                        <span className="text-[var(--color-amber-dark)] font-semibold">({task.timeSpent} min total)</span>
                                    )}
                                </label>
                                <div className="flex gap-1.5">
                                    {timeButtons.map((min) => (
                                        <button
                                            key={min}
                                            onClick={() => addTimeToTask(task.id, min)}
                                            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] bg-[var(--color-paper-dark)] hover:bg-[var(--color-amber)]/20 hover:text-[var(--color-amber-dark)] transition-colors font-medium"
                                        >
                                            +{min}m
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        placeholder="Custom"
                                        min={1}
                                        className="w-20 px-2 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = parseInt((e.target as HTMLInputElement).value)
                                                if (val > 0) {
                                                    addTimeToTask(task.id, val);
                                                    (e.target as HTMLInputElement).value = ''
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Obstacle */}
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    What got in the way? <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={task.obstacle}
                                    onChange={(e) => updateTask(task.id, { obstacle: e.target.value })}
                                    placeholder="External factors, distractions, unclear requirements..."
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors resize-none bg-[var(--color-paper)]"
                                />
                            </div>

                            {/* Delete */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="flex items-center gap-1.5 text-xs text-[var(--color-rose)] hover:text-[var(--color-rose-light)] px-2 py-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-rose)]/10 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function TaskList() {
    const { day, addTask } = useDayStore()
    const { categories } = useSettingsStore()
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(categories[0] || '')
    const [priority, setPriority] = useState<Priority>('not_urgent_important')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        addTask({ title: title.trim(), category, priority })
        setTitle('')
        setCategory(categories[0] || '')
        setPriority('not_urgent_important')
        setShowForm(false)
    }

    const taskStats = {
        total: day.tasks.length,
        done: day.tasks.filter((t) => t.status === 'done').length,
    }

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <div className="flex items-center justify-between mb-3">
                <h3
                    className="text-base font-semibold text-[var(--color-navy)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    📋 Tasks
                    {taskStats.total > 0 && (
                        <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                            {taskStats.done}/{taskStats.total} done
                        </span>
                    )}
                </h3>
                {!showForm && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)] transition-colors cursor-pointer"
                    >
                        <Plus size={14} />
                        Add task
                    </motion.button>
                )}
            </div>

            {/* Add task form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="mb-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-paper)] border border-[var(--color-border)]"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What do you need to do?"
                            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors bg-white mb-2"
                        />
                        <div className="flex flex-wrap gap-2 mb-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-2 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-amber)]"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="px-2 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-amber)]"
                            >
                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                    <option key={key} value={key}>{config.emoji} {config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-paper-dark)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-1.5 text-xs font-medium rounded-[var(--radius-md)] bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)] transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Task list */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {day.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty state */}
            {day.tasks.length === 0 && !showForm && (
                <div className="text-center py-6">
                    <p className="text-sm text-[var(--color-text-muted)]">No tasks yet for today</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-2 text-sm text-[var(--color-amber-dark)] hover:text-[var(--color-amber)] font-medium transition-colors"
                    >
                        + Add your first task
                    </button>
                </div>
            )}
        </section>
    )
}
