import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { DailyView } from '@/features/daily/DailyView'
import { WeeklyDashboard } from '@/features/analytics/WeeklyDashboard'
import { SettingsView } from '@/features/settings/SettingsView'

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/today" replace />} />
                <Route path="/today" element={<DailyView />} />
                <Route path="/week" element={<WeeklyDashboard />} />
                <Route path="/settings" element={<SettingsView />} />
            </Route>
        </Routes>
    )
}
