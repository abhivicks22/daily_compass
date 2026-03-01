import { useDayStore } from '@/stores/useDayStore'
import { Lightbulb, Plus } from 'lucide-react'
import { useState } from 'react'

export function IntentionsSection() {
    const { day, updateIntention } = useDayStore()

    // Find how many intentions actually have content
    const activeCount = day.intentions.filter(i => i.trigger || i.action).length
    // State to determine if we are showing a blank entry field
    const [isAdding, setIsAdding] = useState(false)

    // We show intentions that have content, plus one empty one if isAdding is true
    const visibleIntentions = day.intentions.map((intention, index) => ({ intention, index }))
        .filter(({ intention, index }) =>
            intention.trigger || intention.action || (isAdding && index === activeCount)
        )

    return (
        <section className="py-2">
            <p className="text-[14px] text-[var(--color-text-muted)] mb-5">
                If-then plans help bridge the knowing-doing gap.
            </p>

            <div className="space-y-4">
                {visibleIntentions.map(({ intention, index }) => (
                    <div key={index} className="flex items-start gap-4">
                        <span className="text-[var(--color-text-muted)] mt-2.5 shrink-0 text-[14px] font-medium">
                            {index + 1}.
                        </span>
                        <div className="flex-1 flex flex-col sm:flex-row gap-5">
                            <div className="flex-1 flex items-center gap-3">
                                <span className="text-[14px] text-[var(--color-text-secondary)] font-medium shrink-0">When</span>
                                <input
                                    type="text"
                                    autoFocus={isAdding && index === activeCount}
                                    value={intention.trigger}
                                    onChange={(e) =>
                                        updateIntention(index, { ...intention, trigger: e.target.value })
                                    }
                                    onBlur={() => {
                                        if (!intention.trigger && !intention.action) setIsAdding(false)
                                    }}
                                    placeholder="I sit at my desk..."
                                    className="flex-1 py-2 px-1 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-muted)]"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                                <span className="text-[14px] text-[var(--color-text-secondary)] font-medium shrink-0">I will</span>
                                <input
                                    type="text"
                                    value={intention.action}
                                    onChange={(e) =>
                                        updateIntention(index, { ...intention, action: e.target.value })
                                    }
                                    onBlur={() => {
                                        if (!intention.trigger && !intention.action) setIsAdding(false)
                                    }}
                                    placeholder="open my IDE and code for 10 min"
                                    className="flex-1 py-2 px-1 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-muted)]"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {activeCount < 3 && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] px-4 py-2 rounded-md transition-colors mt-2"
                    >
                        <Plus size={16} />
                        Add Intention
                    </button>
                )}
            </div>
        </section>
    )
}
