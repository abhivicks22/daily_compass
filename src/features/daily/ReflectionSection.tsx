import { useDayStore } from '@/stores/useDayStore'
import { getPromptForDate } from '@/constants/compassionPrompts'
import { Heart } from 'lucide-react'

export function ReflectionSection() {
    const { day, currentDate, setReflection } = useDayStore()
    const prompt = getPromptForDate(currentDate)

    return (
        <section className="py-6 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <Heart size={18} className="text-[var(--color-text-primary)]" />
                Reflection
            </h3>
            <p className="text-[14px] text-[var(--color-text-muted)] italic mb-4 mt-1">
                "{prompt}"
            </p>
            <textarea
                value={day.reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Take a moment to reflect..."
                rows={3}
                className="w-full py-3 px-2 text-[15px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors resize-none placeholder-[var(--color-text-muted)]"
            />
        </section>
    )
}
