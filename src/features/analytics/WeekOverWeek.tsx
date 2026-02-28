import type { WeeklyStats } from '@/lib/analytics'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
    current: WeeklyStats
    previous: WeeklyStats
}

function Trend({ curr, prev, suffix = '', invert = false }: { curr: number; prev: number; suffix?: string; invert?: boolean }) {
    const diff = curr - prev
    const isUp = invert ? diff < 0 : diff > 0
    const isDown = invert ? diff > 0 : diff < 0

    if (Math.abs(diff) < 0.5) {
        return (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Minus size={12} /> Flat
            </span>
        )
    }

    return (
        <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-[var(--color-green)]' : 'text-[var(--color-rose)]'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(diff).toFixed(diff % 1 === 0 ? 0 : 1)}{suffix} {isUp ? 'up' : 'down'}
        </span>
    )
}

export function WeekOverWeek({ current, previous }: Props) {
    return (
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-6 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Week-over-Week
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <CompareCard
                    label="Completion Rate"
                    current={`${current.completionRate}%`}
                    previous={`${previous.completionRate}%`}
                    trend={<Trend curr={current.completionRate} prev={previous.completionRate} suffix="%" />}
                />
                <CompareCard
                    label="Avg Energy"
                    current={current.averageEnergy.toFixed(1)}
                    previous={previous.averageEnergy.toFixed(1)}
                    trend={<Trend curr={current.averageEnergy} prev={previous.averageEnergy} />}
                />
                <CompareCard
                    label="Time Invested"
                    current={`${current.totalTimeSpent}m`}
                    previous={`${previous.totalTimeSpent}m`}
                    trend={<Trend curr={current.totalTimeSpent} prev={previous.totalTimeSpent} suffix="m" />}
                />
            </div>
        </section>
    )
}

function CompareCard({ label, current, previous, trend }: {
    label: string
    current: string
    previous: string
    trend: React.ReactNode
}) {
    return (
        <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)]">
            <p className="text-[11px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">{label}</p>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[20px] font-semibold text-[var(--color-text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{current}</span>
                <span className="text-[11px] text-[var(--color-text-muted)]">vs {previous}</span>
            </div>
            <div className="mt-2 text-[12px]">
                {trend}
            </div>
        </div>
    )
}
