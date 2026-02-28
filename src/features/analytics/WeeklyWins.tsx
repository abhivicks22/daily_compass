import type { DayEntry } from '@/types/day'
import { Trophy } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export function WeeklyWins({ days }: { days: DayEntry[] }) {
    const daysWithWins = days.filter((d) => d.wins.trim())

    if (daysWithWins.length === 0) return null

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Trophy size={18} className="text-[var(--color-green)]" />
                This Week's Wins
            </h3>

            <div className="space-y-2.5">
                {daysWithWins.map((d) => (
                    <div
                        key={d.date}
                        className="flex gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-green)]/5 border border-[var(--color-green)]/15"
                    >
                        <span className="text-xs font-medium text-[var(--color-green)] shrink-0 mt-0.5">
                            {format(parseISO(d.date), 'EEE')}
                        </span>
                        <p className="text-sm text-[var(--color-navy)] whitespace-pre-wrap">{d.wins}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
