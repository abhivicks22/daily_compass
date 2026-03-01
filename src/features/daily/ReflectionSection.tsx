import { useDayStore } from '@/stores/useDayStore'
import { getPromptForDate } from '@/constants/compassionPrompts'
import { Heart } from 'lucide-react'

export function ReflectionSection() {
    const { day, currentDate, setReflection } = useDayStore()
    const prompt = getPromptForDate(currentDate)

    return (
        <section className="py-2">
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
