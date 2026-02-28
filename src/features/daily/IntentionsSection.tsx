import { useDayStore } from '@/stores/useDayStore'
import { Lightbulb } from 'lucide-react'

export function IntentionsSection() {
    const { day, updateIntention } = useDayStore()

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Lightbulb size={18} className="text-[var(--color-amber)]" />
                Implementation Intentions
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
                If-then plans help bridge the knowing-doing gap.
            </p>

            <div className="space-y-3">
                {day.intentions.map((intention, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--color-text-muted)] mt-1.5 shrink-0 text-xs font-medium">
                            {i + 1}.
                        </span>
                        <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center gap-1.5">
                                <span className="text-xs text-[var(--color-text-secondary)] font-medium shrink-0">When</span>
                                <input
                                    type="text"
                                    value={intention.trigger}
                                    onChange={(e) =>
                                        updateIntention(i, { ...intention, trigger: e.target.value })
                                    }
                                    placeholder="I sit at my desk..."
                                    className="flex-1 px-2.5 py-1.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors bg-[var(--color-paper)]"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-1.5">
                                <span className="text-xs text-[var(--color-text-secondary)] font-medium shrink-0">I will</span>
                                <input
                                    type="text"
                                    value={intention.action}
                                    onChange={(e) =>
                                        updateIntention(i, { ...intention, action: e.target.value })
                                    }
                                    placeholder="open my IDE and code for 10 min"
                                    className="flex-1 px-2.5 py-1.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-amber)] transition-colors bg-[var(--color-paper)]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
