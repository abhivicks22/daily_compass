import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { DailyView } from '@/features/daily/DailyView'
import { WeeklyDashboard } from '@/features/analytics/WeeklyDashboard'
import { MoodView } from '@/features/mood/MoodView'
import { JournalView } from '@/features/journal/JournalView'
import { HabitView } from '@/features/habits/HabitView'
import { SettingsView } from '@/features/settings/SettingsView'

export function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/today" replace />} />
                <Route path="/today" element={<DailyView />} />
                <Route path="/week" element={<WeeklyDashboard />} />
                <Route path="/mood" element={<MoodView />} />
                <Route path="/journal" element={<JournalView />} />
                <Route path="/habits" element={<HabitView />} />
                <Route path="/settings" element={<SettingsView />} />
            </Route>
        </Routes>
    )
}

