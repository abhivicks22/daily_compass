import type { WeeklyStats } from '@/lib/analytics'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function EnergyCorrelation({ stats }: { stats: WeeklyStats }) {
    const data = stats.energyProductivityData.filter((d) => d.energy > 0 || d.total > 0)

    if (data.length === 0) return null

    return (
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Energy vs. Productivity
            </h3>
            <p className="text-[12px] text-[var(--color-text-muted)] mb-6">
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
                                    <div className="bg-[var(--color-surface-card)] px-3 py-2 rounded-lg shadow-md border border-[var(--color-border)] text-[11px]">
                                        <p className="font-semibold text-[var(--color-text-primary)] mb-1">{d.dayOfWeek}</p>
                                        <p className="text-[var(--color-text-secondary)]">Energy: <span className="font-medium text-[var(--color-text-primary)]">{d.energy}/5</span></p>
                                        <p className="text-[var(--color-text-secondary)]">Completed: <span className="font-medium text-[var(--color-text-primary)]">{d.completed}/{d.total}</span></p>
                                    </div>
                                )
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="energy"
                            stroke="var(--color-border)"
                            strokeWidth={2}
                            dot={{ fill: 'var(--color-surface)', stroke: 'var(--color-border)', r: 3, strokeWidth: 2 }}
                            name="Energy"
                        />
                        <Line
                            type="monotone"
                            dataKey="completed"
                            stroke="var(--color-text-primary)"
                            strokeWidth={2}
                            dot={{ fill: 'var(--color-surface)', stroke: 'var(--color-text-primary)', r: 3, strokeWidth: 2 }}
                            name="Completed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
                    <div className="w-2.5 h-0.5 bg-[var(--color-border)] rounded" />
                    Energy
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
                    <div className="w-2.5 h-0.5 bg-[var(--color-text-primary)] rounded" />
                    Tasks completed
                </div>
            </div>
        </section>
    )
}
