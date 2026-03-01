import { NavLink } from 'react-router-dom'
import { Compass, CalendarDays, Settings, BarChart3, BookOpen, Target, Heart, X } from 'lucide-react'

interface SidebarProps {
    onClose: () => void
}

const navItems = [
    { to: '/today', icon: CalendarDays, label: 'Today', enabled: true },
    { to: '/week', icon: BarChart3, label: 'Weekly Review', enabled: true },
    { to: '/mood', icon: Heart, label: 'Mood', enabled: true },
    { to: '/journal', icon: BookOpen, label: 'Journal', enabled: true },
    { to: '/habits', icon: Target, label: 'Habits', enabled: true },
    { to: '/settings', icon: Settings, label: 'Settings', enabled: true },
]

export function Sidebar({ onClose }: SidebarProps) {
    return (
        <div className="h-full flex flex-col bg-white border-r border-[var(--color-border)] text-[var(--color-text-primary)]">
            {/* Brand */}
            <div className="px-6 py-8 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-navy)] text-white flex items-center justify-center">
                        <Compass size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            Daily Compass
                        </h1>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    aria-label="Close menu"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    if (!item.enabled) {
                        return (
                            <div
                                key={item.to}
                                className="flex items-center gap-3 px-4 py-2 text-[var(--color-text-muted)] opacity-50 cursor-not-allowed mx-2"
                            >
                                <Icon size={18} />
                                <span className="text-[14px] font-medium">{item.label}</span>
                                <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold border border-[var(--color-border)] px-1.5 py-0.5 rounded-sm">Soon</span>
                            </div>
                        )
                    }
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 mx-2 mb-1 rounded-md transition-all duration-200
                ${isActive
                                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-navy)] font-semibold'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-hover)] font-medium'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={18} className={isActive ? 'text-[var(--color-navy)]' : 'text-[var(--color-text-muted)]'} />
                                    <span className="text-[14px]">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-7 py-6">
                <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed font-medium">
                    Built for brains that know what to do but struggle to start.
                </p>
            </div>
        </div>
    )
}
