import { useDayStore } from '@/stores/useDayStore'
import { format, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

export function DateNavigator() {
    const { currentDate, goToPrevDay, goToNextDay, goToToday } = useDayStore()
    const dateObj = parseISO(currentDate)
    const isTodayDate = isToday(dateObj)

    return (
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={goToPrevDay}
                className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] transition-colors"
                aria-label="Previous day"
            >
                <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
            </button>

            <div className="text-center">
                <motion.h2
                    key={currentDate}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold text-[var(--color-navy)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {format(dateObj, 'EEEE')}
                </motion.h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {format(dateObj, 'MMMM d, yyyy')}
                </p>
                {!isTodayDate && (
                    <button
                        onClick={goToToday}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[var(--color-amber-dark)] hover:text-[var(--color-amber)] font-medium transition-colors"
                    >
                        <CalendarDays size={12} />
                        Go to today
                    </button>
                )}
            </div>

            <button
                onClick={goToNextDay}
                className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] transition-colors"
                aria-label="Next day"
            >
                <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
            </button>
        </div>
    )
}
