import { useDayStore } from '@/stores/useDayStore'
import { Trophy } from 'lucide-react'

export function WinsSection() {
    const { day, setWins } = useDayStore()

    return (
        <section className="py-6 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Trophy size={16} className="text-[var(--color-text-primary)]" />
                Wins
            </h3>
            <p className="text-[12px] text-[var(--color-text-muted)] mb-4">
                Name anything that took effort today, however small.
            </p>
            <textarea
                value={day.wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="I replied to that one email... I drank water... I showed up..."
                rows={3}
                className="w-full py-2 text-[14px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors resize-none placeholder-[var(--color-text-muted)]"
            />
        </section>
    )
}
