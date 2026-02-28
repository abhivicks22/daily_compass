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
        <div className="h-full flex flex-col bg-[var(--color-navy)] text-white">
            {/* Brand */}
            <div className="px-5 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Compass size={28} className="text-[var(--color-amber)]" />
                    <div>
                        <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                            Daily Compass
                        </h1>
                        <p className="text-xs text-white/50 mt-0.5">Your personal OS</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
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
                                className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-white/30 cursor-not-allowed"
                            >
                                <Icon size={18} />
                                <span className="text-sm">{item.label}</span>
                                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">Soon</span>
                            </div>
                        )
                    }
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all duration-150
                ${isActive
                                    ? 'bg-[var(--color-amber)] text-[var(--color-navy)] font-medium shadow-md'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span className="text-sm">{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10">
                <p className="text-[11px] text-white/30 leading-relaxed">
                    Built for brains that know what to do but struggle to start.
                </p>
            </div>
        </div>
    )
}
