import { useSettingsStore } from '@/stores/useSettingsStore'
import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function SettingsView() {
    const { categories, addCategory, removeCategory } = useSettingsStore()
    const [newCategory, setNewCategory] = useState('')

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategory.trim()) return
        addCategory(newCategory.trim())
        setNewCategory('')
    }

    return (
        <div className="space-y-6">
            <div>
                <h2
                    className="text-2xl font-semibold text-[var(--color-navy)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    ⚙️ Settings
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Customize your Daily Compass experience.
                </p>
            </div>

            {/* Categories */}
            <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
                <h3
                    className="text-base font-semibold text-[var(--color-navy)] mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Task Categories
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                    These appear in the dropdown when you create tasks.
                </p>

                <div className="space-y-1.5 mb-4">
                    <AnimatePresence>
                        {categories.map((cat) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-border-light)]"
                            >
                                <GripVertical size={14} className="text-[var(--color-text-muted)]" />
                                <span className="text-sm flex-1 text-[var(--color-navy)]">{cat}</span>
                                <button
                                    onClick={() => removeCategory(cat)}
                                    className="p-1 rounded hover:bg-[var(--color-rose)]/10 transition-colors"
                                >
                                    <Trash2 size={14} className="text-[var(--color-rose)]" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors bg-[var(--color-paper)]"
                    />
                    <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)] transition-colors"
                    >
                        <Plus size={14} />
                        Add
                    </button>
                </form>
            </section>

            {/* About */}
            <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
                <h3
                    className="text-base font-semibold text-[var(--color-navy)] mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    About Daily Compass
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    A personal operating system designed for brains with executive dysfunction.
                    Every feature is built to reduce decisions, eliminate blank-page paralysis,
                    and surface patterns — without shame.
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-3">
                    Phase 1 — Foundation • v0.1.0
                </p>
            </section>
        </div>
    )
}
