import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
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
            <main className="flex-1 overflow-y-auto">
                {/* Mobile header */}
                <div className="sticky top-0 z-20 lg:hidden bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-paper-dark)] transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={22} className="text-[var(--color-navy)]" />
                    </button>
                    <span className="text-lg" style={{ fontFamily: 'var(--font-heading)' }}>🧭 Daily Compass</span>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
