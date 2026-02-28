import { useDayStore } from '@/stores/useDayStore'
import { getPromptForDate } from '@/constants/compassionPrompts'
import { Heart } from 'lucide-react'

export function ReflectionSection() {
    const { day, currentDate, setReflection } = useDayStore()
    const prompt = getPromptForDate(currentDate)

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Heart size={18} className="text-[var(--color-rose)]" />
                Reflection
            </h3>
            <p className="text-xs text-[var(--color-amber-dark)] italic mb-3">
                "{prompt}"
            </p>
            <textarea
                value={day.reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Take a moment to reflect..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-rose)] transition-colors resize-none bg-[var(--color-paper)]"
            />
        </section>
    )
}
