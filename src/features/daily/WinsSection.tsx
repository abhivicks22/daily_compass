import { useDayStore } from '@/stores/useDayStore'
import { Trophy, Plus } from 'lucide-react'
import { useState } from 'react'

export function WinsSection() {
    const { day, setWins } = useDayStore()
    const [isEditing, setIsEditing] = useState(false)

    return (
        <section className="py-2">
            <h3
                className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Trophy size={18} className="text-[var(--color-text-primary)]" />
                Wins
            </h3>
            <p className="text-[14px] text-[var(--color-text-muted)] mb-4">
                Name anything that took effort today, however small.
            </p>
            {day.wins || isEditing ? (
                <textarea
                    autoFocus={isEditing && !day.wins}
                    value={day.wins}
                    onChange={(e) => setWins(e.target.value)}
                    onBlur={() => {
                        if (!day.wins) setIsEditing(false)
                    }}
                    placeholder="I replied to that one email... I drank water... I showed up..."
                    rows={3}
                    className="w-full py-3 px-2 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors resize-none placeholder-[var(--color-text-muted)]"
                />
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={16} />
                    Log a win
                </button>
            )}
        </section>
    )
}
