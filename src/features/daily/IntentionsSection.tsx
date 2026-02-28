import { useDayStore } from '@/stores/useDayStore'
import { Lightbulb } from 'lucide-react'

export function IntentionsSection() {
    const { day, updateIntention } = useDayStore()

    return (
        <section className="py-6 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Lightbulb size={16} className="text-[var(--color-text-primary)]" />
                Implementation Intentions
            </h3>
            <p className="text-[12px] text-[var(--color-text-muted)] mb-5">
                If-then plans help bridge the knowing-doing gap.
            </p>

            <div className="space-y-4">
                {day.intentions.map((intention, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <span className="text-[var(--color-text-muted)] mt-2 shrink-0 text-[12px] font-medium">
                            {i + 1}.
                        </span>
                        <div className="flex-1 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-[12px] text-[var(--color-text-secondary)] font-medium shrink-0">When</span>
                                <input
                                    type="text"
                                    value={intention.trigger}
                                    onChange={(e) =>
                                        updateIntention(i, { ...intention, trigger: e.target.value })
                                    }
                                    placeholder="I sit at my desk..."
                                    className="flex-1 py-1.5 text-[14px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-muted)]"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-[12px] text-[var(--color-text-secondary)] font-medium shrink-0">I will</span>
                                <input
                                    type="text"
                                    value={intention.action}
                                    onChange={(e) =>
                                        updateIntention(i, { ...intention, action: e.target.value })
                                    }
                                    placeholder="open my IDE and code for 10 min"
                                    className="flex-1 py-1.5 text-[14px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-muted)]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
