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
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-6 tracking-tight flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Completion by Category
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
                                    <div className="bg-[var(--color-surface-card)] px-3 py-2 rounded-lg shadow-md border border-[var(--color-border)] text-[11px]">
                                        <p className="font-semibold text-[var(--color-text-primary)] mb-0.5">{d.category}</p>
                                        <p className="text-[var(--color-text-secondary)]"><span className="text-[var(--color-green)] font-medium">{d.done} done</span> / {d.total} total ({d.rate}%)</p>
                                    </div>
                                )
                            }}
                        />
                        <Bar dataKey="done" stackId="a" radius={[0, 0, 0, 0]} barSize={12}>
                            {data.map((_, i) => (
                                <Cell key={i} fill="var(--color-text-primary)" />
                            ))}
                        </Bar>
                        <Bar dataKey="remaining" stackId="a" radius={[0, 2, 2, 0]} barSize={12}>
                            {data.map((_, i) => (
                                <Cell key={i} fill="var(--color-border)" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}
