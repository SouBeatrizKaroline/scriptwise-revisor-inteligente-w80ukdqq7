/* Layout Component - A component that wraps the main content of the app
   - Use this file to add a header, footer, or other elements that should be present on every page
   - This component is used in the App.tsx file to wrap the main content of the app */

import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { useTheme } from '@/hooks/use-theme'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  return (
    <main className="flex flex-col min-h-screen">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Outlet />
    </main>
  )
}
