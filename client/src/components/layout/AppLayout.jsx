import { Outlet } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Header    from './Header'
import Sidebar   from './Sidebar'
import BottomNav from './BottomNav'

/**
 * AppLayout — 1 component, 2 layouts:
 *   Desktop (≥1024px): Header + Sidebar + main content
 *   Mobile  (<1024px): Header + main content + BottomNav
 */
export default function AppLayout() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* ── Sticky top header ── */}
      <Header />

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar: desktop only */}
        {isDesktop && <Sidebar />}

        {/* Main scrollable area */}
        <main className={`
          flex-1 overflow-y-auto
          ${isDesktop ? 'pb-6' : 'pb-20'}
        `}>
          <Outlet />
        </main>

      </div>

      {/* ── Bottom nav: mobile only ── */}
      {!isDesktop && <BottomNav />}

    </div>
  )
}
