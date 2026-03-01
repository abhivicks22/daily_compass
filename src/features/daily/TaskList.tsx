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
            className="group relative rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
        >
            {/* Main row */}
            <div className="flex items-center gap-3 p-3.5">
                {/* Status toggle (Checkbox style) */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation()
                        const targetStatus = task.status === 'done' ? 'not_started' : 'done'
                        updateTask(task.id, { status: targetStatus })
                    }}
                    className={`
            w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs
            transition-all duration-200 cursor-pointer border-[1.5px]
            ${task.status === 'done'
                            ? 'bg-[var(--color-text-primary)] border-[var(--color-text-primary)] shadow-md'
                            : 'bg-transparent border-[var(--color-border-focus)] hover:border-[var(--color-text-muted)]'}
          `}
                    title={`Mark as ${task.status === 'done' ? 'incomplete' : 'complete'}`}
                >
                    {task.status === 'done' && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></motion.svg>}
                </motion.button>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-[16px] font-medium truncate ${task.status === 'done' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-navy)]'
                            }`}
                    >
                        {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] px-2 py-0.5 rounded-sm bg-[var(--color-border-light)] text-[var(--color-text-secondary)] font-medium">
                            {task.category}
                        </span>
                        <span className="text-[13px] text-[var(--color-text-muted)]">
                            {PRIORITY_CONFIG[task.priority].emoji} {PRIORITY_CONFIG[task.priority].label}
                        </span>
                        {task.timeSpent > 0 && (
                            <span className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-1">
                                <Clock size={12} />
                                {task.timeSpent}m
                            </span>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setExpanded(!expanded)}
                    className="p-2.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[var(--color-border-light)] transition-all sm:opacity-0 opacity-100"
                >
                    {expanded ? <ChevronUp size={16} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={16} className="text-[var(--color-text-muted)]" />}
                </motion.button>
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
                                <label className="text-[14px] font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                                    <Clock size={14} />
                                    Time spent
                                    {task.timeSpent > 0 && (
                                        <span className="text-[var(--color-amber-dark)] font-semibold">({task.timeSpent} min total)</span>
                                    )}
                                </label>
                                <div className="flex gap-2">
                                    {timeButtons.map((min) => (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            key={min}
                                            onClick={() => addTimeToTask(task.id, min)}
                                            className="px-4 py-2 text-[14px] rounded-md bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:bg-[var(--color-border-light)] hover:text-[var(--color-text-primary)] transition-colors font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)]"
                                        >
                                            +{min}m
                                        </motion.button>
                                    ))}
                                    <input
                                        type="number"
                                        placeholder="Custom"
                                        min={1}
                                        className="w-24 px-3 py-2 text-[14px] rounded bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors"
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
                                <label className="text-[14px] font-medium text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                                    <AlertTriangle size={14} />
                                    What got in the way? <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={task.obstacle}
                                    onChange={(e) => updateTask(task.id, { obstacle: e.target.value })}
                                    placeholder="External factors, distractions, unclear requirements..."
                                    rows={2}
                                    className="w-full px-3 py-3 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors resize-none mb-2"
                                />
                            </div>

                            {/* Delete */}
                            <div className="flex justify-end pt-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => deleteTask(task.id)}
                                    className="flex items-center gap-1.5 text-[14px] text-[var(--color-rose)] font-medium hover:text-[var(--color-rose)] px-3 py-2 rounded-md hover:bg-[var(--color-rose)]/10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Remove
                                </motion.button>
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

    const submitTask = () => {
        const safeTitle = title.trim()
        if (!safeTitle) {
            alert("Please type a task name first!")
            return
        }

        try {
            addTask({
                title: safeTitle,
                category: category || categories[0] || 'Uncategorized',
                priority: priority || 'not_urgent_important'
            })
            setTitle('')
            setCategory(categories[0] || 'Uncategorized')
            setPriority('not_urgent_important')
            setShowForm(false)
        } catch (error: any) {
            console.error("Failed to add task:", error)
            alert("Error adding task: " + error.message)
        }
    }

    const taskStats = {
        total: day.tasks.length,
        done: day.tasks.filter((t) => t.status === 'done').length,
    }

    return (
        <section className="py-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3
                    className="text-[18px] font-semibold text-[var(--color-navy)] flex items-center gap-2 tracking-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Tasks
                    {taskStats.total > 0 && (
                        <span className="text-[14px] font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                            {taskStats.done}/{taskStats.total}
                        </span>
                    )}
                </h3>
                {!showForm && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                        Add task
                    </motion.button>
                )}
            </div>

            {/* Add task form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 pl-8 pr-2"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    submitTask()
                                }
                            }}
                            placeholder="What do you need to do?"
                            className="w-full py-3 text-[16px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors mb-4 placeholder-[var(--color-text-muted)]"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex gap-2">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="px-3 py-1.5 text-[13px] font-medium rounded text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] cursor-pointer focus:outline-none"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    className="px-3 py-1.5 text-[13px] font-medium rounded text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] cursor-pointer focus:outline-none"
                                >
                                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.emoji} {config.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowForm(false)
                                    }}
                                    onPointerDown={(e) => {
                                        e.preventDefault()
                                        setShowForm(false)
                                    }}
                                    className="px-4 py-2.5 text-[15px] rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors relative z-10 pointer-events-auto touch-manipulation cursor-pointer font-medium flex-1 sm:flex-none"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        submitTask()
                                    }}
                                    onPointerDown={(e) => {
                                        e.preventDefault()
                                        submitTask()
                                    }}
                                    className="px-6 py-2.5 text-[15px] font-medium rounded-md bg-[var(--color-text-primary)] text-[var(--color-surface)] hover:bg-[var(--color-text-secondary)] transition-colors relative z-10 pointer-events-auto touch-manipulation cursor-pointer shadow-[var(--shadow-sm)] flex-1 sm:flex-none"
                                >
                                    Add Task
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <AnimatePresence>
                    {day.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty state */}
            {day.tasks.length === 0 && !showForm && (
                <div className="py-10 text-center border border-dashed border-[var(--color-border)] rounded-lg">
                    <p className="text-[15px] text-[var(--color-text-muted)]">No tasks yet for today</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-2 text-[15px] text-[var(--color-text-primary)] hover:underline font-medium transition-colors"
                    >
                        Add your first task
                    </button>
                </div>
            )}
        </section>
    )
}
