import { useEffect } from 'react'
import { useDayStore } from '@/stores/useDayStore'
import { DateNavigator } from '@/components/DateNavigator'
import { EnergyCheckin } from './EnergyCheckin'
import { TaskList } from './TaskList'
import { WinsSection } from './WinsSection'
import { ReflectionSection } from './ReflectionSection'
import { IntentionsSection } from './IntentionsSection'
import { Accordion } from '@/components/Accordion'
import { motion } from 'framer-motion'

export function DailyView() {
    const { currentDate, loadDay, isLoading } = useDayStore()

    useEffect(() => {
        loadDay(currentDate)
    }, [currentDate, loadDay])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-3xl mb-2">🧭</div>
                    <p className="text-sm text-[var(--color-text-muted)]">Loading your day...</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            key={currentDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-[80vh] gap-4 pb-20 max-w-2xl mx-auto w-full"
        >
            <DateNavigator />

            <Accordion title="Energy Check-in" defaultOpen={true}>
                <EnergyCheckin />
            </Accordion>

            <Accordion title="Tasks">
                <TaskList />
            </Accordion>

            <Accordion title="This Week's Wins">
                <WinsSection />
            </Accordion>

            <Accordion title="Daily Intentions">
                <IntentionsSection />
            </Accordion>

            <Accordion title="End of Day Reflection">
                <ReflectionSection />
            </Accordion>
        </motion.div>
    )
}
