import { useState, useEffect } from 'react'
import { loadWeekDays, computeWeeklyStats, loadPreviousWeekStats, getWeekKey } from '@/lib/analytics'
import type { WeeklyStats } from '@/lib/analytics'
import { CompletionChart } from './CompletionChart'
import { EnergyCorrelation } from './EnergyCorrelation'
import { ObstacleRanking } from './ObstacleRanking'
import { WeekOverWeek } from './WeekOverWeek'
import { GoalSection } from './GoalSection'
import { WeeklyWins } from './WeeklyWins'
import { motion } from 'framer-motion'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, CalendarDays, Zap, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

export function WeeklyDashboard() {
    const [weekDate, setWeekDate] = useState(() => new Date())
    const [stats, setStats] = useState<WeeklyStats | null>(null)
    const [prevStats, setPrevStats] = useState<WeeklyStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            const days = await loadWeekDays(weekDate)
            const weekStats = computeWeeklyStats(days, weekDate)
            setStats(weekStats)
            const prev = await loadPreviousWeekStats(weekDate)
            setPrevStats(prev)
            setLoading(false)
        }
        load()
    }, [weekDate])

    const start = startOfWeek(weekDate, { weekStartsOn: 1 })
    const end = endOfWeek(weekDate, { weekStartsOn: 1 })

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-sm text-[var(--color-text-muted)]">Loading your week...</p>
                </div>
            </div>
        )
    }

    const hasData = stats.totalTasks > 0 || stats.averageEnergy > 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            {/* Week navigation */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setWeekDate((d) => subWeeks(d, 1))}
                    className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] transition-colors"
                >
                    <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
                </button>
                <div className="text-center">
                    <h2
                        className="text-2xl font-semibold text-[var(--color-navy)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Weekly Dashboard
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                        {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
                    </p>
                </div>
                <button
                    onClick={() => setWeekDate((d) => addWeeks(d, 1))}
                    className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] transition-colors"
                >
                    <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
                </button>
            </div>

            {!hasData ? (
                <div className="bg-white rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] text-center">
                    <div className="text-4xl mb-3">🌱</div>
                    <h3 className="text-lg font-semibold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        No data yet for this week
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
                        Start logging your days and your weekly insights will appear here. Every entry counts — even a single energy check-in.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard
                            icon={<CheckCircle2 size={18} className="text-[var(--color-green)]" />}
                            label="Completion"
                            value={`${stats.completionRate}%`}
                            sub={`${stats.completedTasks}/${stats.totalTasks} tasks`}
                        />
                        <StatCard
                            icon={<Zap size={18} className="text-[var(--color-amber)]" />}
                            label="Avg Energy"
                            value={stats.averageEnergy > 0 ? stats.averageEnergy.toFixed(1) : '—'}
                            sub="out of 5"
                        />
                        <StatCard
                            icon={<Clock size={18} className="text-[var(--color-blue)]" />}
                            label="Time Invested"
                            value={stats.totalTimeSpent > 0 ? `${Math.round(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m` : '—'}
                            sub="total tracked"
                        />
                        <StatCard
                            icon={<TrendingUp size={18} className="text-[var(--color-rose)]" />}
                            label="Best Day"
                            value={stats.mostProductiveDay || '—'}
                            sub="most completed"
                        />
                    </div>

                    {/* Charts */}
                    <CompletionChart stats={stats} />
                    <EnergyCorrelation stats={stats} />
                    <WeeklyWins days={stats.days} />
                    <GoalSection weekKey={getWeekKey(weekDate)} />
                    <ObstacleRanking stats={stats} />

                    {/* Week-over-week */}
                    {prevStats && <WeekOverWeek current={stats} previous={prevStats} />}
                </>
            )}
        </motion.div>
    )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
    return (
        <div className="bg-white rounded-[var(--radius-lg)] p-3.5 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
            <div className="flex items-center gap-2 mb-1.5">
                {icon}
                <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
            </div>
            <p className="text-xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {value}
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">{sub}</p>
        </div>
    )
}
