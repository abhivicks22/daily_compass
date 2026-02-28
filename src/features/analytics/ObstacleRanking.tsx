import type { WeeklyStats } from '@/lib/analytics'
import { AlertTriangle } from 'lucide-react'

export function ObstacleRanking({ stats }: { stats: WeeklyStats }) {
    if (stats.obstacleFrequency.length === 0) return null

    const maxCount = stats.obstacleFrequency[0]?.count || 1

    return (
        <section className="bg-white rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <h3
                className="text-base font-semibold text-[var(--color-navy)] mb-1 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                <AlertTriangle size={18} className="text-[var(--color-rose)]" />
                Top Obstacles
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
                What got in the way most often? These are systemic — not personal failures.
            </p>

            <div className="space-y-2.5">
                {stats.obstacleFrequency.slice(0, 5).map((obs, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--color-navy)] capitalize">{obs.text}</p>
                            <span className="text-xs font-medium text-[var(--color-text-muted)]">
                                {obs.count}×
                            </span>
                        </div>
                        <div className="h-1.5 bg-[var(--color-paper-dark)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-rose)] rounded-full transition-all duration-500"
                                style={{ width: `${(obs.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
