import { useDayStore } from '@/stores/useDayStore'
import { ENERGY_CONFIG } from '@/types/day'
import { motion } from 'framer-motion'

export function EnergyCheckin() {
    const { day, setEnergy } = useDayStore()

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                ☀️ How's your energy today?
            </h3>

            <div className="flex justify-between gap-2">
                {ENERGY_CONFIG.map(({ level, emoji, label, color }) => {
                    const isSelected = day.energy === level
                    return (
                        <motion.button
                            key={level}
                            onClick={() => setEnergy(level)}
                            whileTap={{ scale: 0.92 }}
                            className={`
                flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-[var(--radius-lg)] 
                transition-all duration-200 cursor-pointer border-2
                ${isSelected
                                    ? 'shadow-md'
                                    : 'border-transparent hover:bg-[var(--color-paper-dark)]'
                                }
              `}
                            style={{
                                borderColor: isSelected ? color : 'transparent',
                                backgroundColor: isSelected ? `${color}15` : undefined,
                            }}
                        >
                            <span className={`text-2xl ${isSelected ? 'animate-pulse-gentle' : ''}`}>
                                {emoji}
                            </span>
                            <span
                                className={`text-xs font-medium ${isSelected ? 'text-[var(--color-navy)]' : 'text-[var(--color-text-muted)]'}`}
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
