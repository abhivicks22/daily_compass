import { useDayStore } from '@/stores/useDayStore'
import { Trophy } from 'lucide-react'

export function WinsSection() {
    const { day, setWins } = useDayStore()

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Trophy size={18} className="text-[var(--color-green)]" />
                Wins
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Name anything that took effort today, however small.
            </p>
            <textarea
                value={day.wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="I replied to that one email... I drank water... I showed up..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-green)] transition-colors resize-none bg-[var(--color-paper)]"
            />
        </section>
    )
}
