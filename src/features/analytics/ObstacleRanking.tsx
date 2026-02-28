import type { WeeklyStats } from '@/lib/analytics'
import { AlertTriangle } from 'lucide-react'

export function ObstacleRanking({ stats }: { stats: WeeklyStats }) {
    if (stats.obstacleFrequency.length === 0) return null

    const maxCount = stats.obstacleFrequency[0]?.count || 1

    return (
        <section className="py-8 border-b border-[var(--color-border)] last:border-b-0">
            <h3
                className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <AlertTriangle size={16} className="text-[var(--color-text-primary)]" />
                Top Obstacles
            </h3>
            <p className="text-[12px] text-[var(--color-text-muted)] mb-6">
                What got in the way most often? These are systemic — not personal failures.
            </p>

            <div className="space-y-4">
                {stats.obstacleFrequency.slice(0, 5).map((obs, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[13px] text-[var(--color-text-primary)] capitalize font-medium">{obs.text}</p>
                            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                                {obs.count}×
                            </span>
                        </div>
                        <div className="h-[2px] bg-[var(--color-border)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-text-primary)] rounded-full transition-all duration-500"
                                style={{ width: `${(obs.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
