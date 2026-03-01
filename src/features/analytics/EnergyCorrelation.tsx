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
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-muted)" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="dayOfWeek"
                            tick={{ fontSize: 13, fill: 'var(--color-text-primary)', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={{ stroke: 'var(--color-border-focus)' }}
                        />
                        <YAxis
                            tick={{ fontSize: 13, fill: 'var(--color-text-primary)' }}
                            tickLine={false}
                            axisLine={false}
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
                            stroke="var(--color-amber)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-surface)', stroke: 'var(--color-amber)', r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: 'var(--color-amber)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                            name="Energy"
                        />
                        <Line
                            type="monotone"
                            dataKey="completed"
                            stroke="var(--color-blue)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-surface)', stroke: 'var(--color-blue)', r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: 'var(--color-blue)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                            name="Completed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-6 justify-center mt-6">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
                    <div className="w-3 h-3 bg-[var(--color-amber)] rounded-full" />
                    Energy
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
                    <div className="w-3 h-3 bg-[var(--color-blue)] rounded-full" />
                    Tasks completed
                </div>
            </div>
        </section>
    )
}
