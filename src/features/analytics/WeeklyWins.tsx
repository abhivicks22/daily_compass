import type { DayEntry } from '@/types/day'
import { Trophy } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export function WeeklyWins({ days }: { days: DayEntry[] }) {
    const daysWithWins = days.filter((d) => d.wins.trim())

    if (daysWithWins.length === 0) return null

    return (
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Trophy size={16} className="text-[var(--color-text-primary)]" />
                This Week's Wins
            </h3>

            <div className="space-y-3">
                {daysWithWins.map((d) => (
                    <div
                        key={d.date}
                        className="flex gap-4 items-start pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0"
                    >
                        <span className="text-[11px] font-medium text-[var(--color-text-secondary)] shrink-0 mt-0.5 uppercase tracking-wider w-10">
                            {format(parseISO(d.date), 'EEE')}
                        </span>
                        <p className="text-[14px] text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">{d.wins}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
