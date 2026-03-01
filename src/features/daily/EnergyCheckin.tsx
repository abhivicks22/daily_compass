import { useDayStore } from '@/stores/useDayStore'
import { ENERGY_CONFIG } from '@/types/day'
import { motion } from 'framer-motion'

export function EnergyCheckin() {
    const { day, setEnergy } = useDayStore()

    return (
        <section className="py-2">

            <div className="flex justify-between gap-2">
                {ENERGY_CONFIG.map(({ level, emoji, label, color }) => {
                    const isSelected = day.energy === level
                    return (
                        <motion.button
                            key={level}
                            onClick={() => setEnergy(level)}
                            whileTap={{ scale: 0.95 }}
                            className={`
                flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg
                transition-all duration-200 cursor-pointer border
                ${isSelected
                                    ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-hover)]'
                                    : 'border-transparent hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)]'
                                }
              `}
                        >
                            <span className={`text-[20px] ${isSelected ? 'animate-pulse-gentle grayscale-0' : 'grayscale opacity-70'}`}>
                                {emoji}
                            </span>
                            <span
                                className={`text-[13px] font-medium ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}
                            >
                                {label}
                            </span>
                        </motion.button>
                    )
                })}
            </div>
        </section>
    )
}
