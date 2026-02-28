import type { WeeklyStats } from '@/lib/analytics'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function CompletionChart({ stats }: { stats: WeeklyStats }) {
    const data = Object.entries(stats.categoryBreakdown)
        .map(([category, info]) => ({
            category,
            done: info.done,
            remaining: info.total - info.done,
            total: info.total,
            rate: info.total > 0 ? Math.round((info.done / info.total) * 100) : 0,
        }))
        .sort((a, b) => b.total - a.total)

    if (data.length === 0) return null

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                📊 Completion by Category
            </h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="category"
                            width={90}
                            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.[0]) return null
                                const d = payload[0].payload
                                return (
                                    <div className="bg-white px-3 py-2 rounded-[var(--radius-md)] shadow-[var(--shadow-md)] border border-[var(--color-border)] text-xs">
                                        <p className="font-medium text-[var(--color-navy)]">{d.category}</p>
                                        <p className="text-[var(--color-green)]">{d.done} done / {d.total} total ({d.rate}%)</p>
                                    </div>
                                )
                            }}
                        />
                        <Bar dataKey="done" stackId="a" radius={[0, 0, 0, 0]} barSize={18}>
                            {data.map((_, i) => (
                                <Cell key={i} fill="var(--color-green)" />
                            ))}
                        </Bar>
                        <Bar dataKey="remaining" stackId="a" radius={[0, 4, 4, 0]} barSize={18}>
                            {data.map((_, i) => (
                                <Cell key={i} fill="var(--color-paper-darker)" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}
