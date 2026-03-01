import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-transparent">
            <AnimatedBackground />
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                {/* Mobile header (Glassmorphic) */}
                <div className="sticky top-0 z-20 lg:hidden bg-[var(--color-surface)]/70 backdrop-blur-xl border-b border-[var(--color-border)] px-5 py-4 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Daily Compass
                    </span>
                </div>

                <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 sm:py-16">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
