import type { WeeklyStats } from '@/lib/analytics'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function EnergyCorrelation({ stats }: { stats: WeeklyStats }) {
    const data = stats.energyProductivityData.filter((d) => d.energy > 0 || d.total > 0)

    if (data.length === 0) return null

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                ⚡ Energy vs. Productivity
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
                See how your energy relates to task completion across the week.
            </p>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ left: -10, right: 10, top: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                        <XAxis
                            dataKey="dayOfWeek"
                            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                            width={30}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const d = payload[0]?.payload
                                return (
                                    <div className="bg-white px-3 py-2 rounded-[var(--radius-md)] shadow-[var(--shadow-md)] border border-[var(--color-border)] text-xs">
                                        <p className="font-medium text-[var(--color-navy)]">{d.dayOfWeek}</p>
                                        <p style={{ color: 'var(--color-amber)' }}>Energy: {d.energy}/5</p>
                                        <p style={{ color: 'var(--color-green)' }}>Completed: {d.completed}/{d.total}</p>
                                    </div>
                                )
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="energy"
                            stroke="var(--color-amber)"
                            strokeWidth={2.5}
                            dot={{ fill: 'var(--color-amber)', r: 4 }}
                            name="Energy"
                        />
                        <Line
                            type="monotone"
                            dataKey="completed"
                            stroke="var(--color-green)"
                            strokeWidth={2.5}
                            dot={{ fill: 'var(--color-green)', r: 4 }}
                            name="Completed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-3">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <div className="w-3 h-0.5 bg-[var(--color-amber)] rounded" />
                    Energy
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <div className="w-3 h-0.5 bg-[var(--color-green)] rounded" />
                    Tasks completed
                </div>
            </div>
        </section>
    )
}
