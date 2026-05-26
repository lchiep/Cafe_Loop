import { Outlet } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Header    from './Header'
import Sidebar   from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isDesktop && <Sidebar />}
        <main className={`flex-1 overflow-y-auto ${isDesktop ? 'pb-8' : 'pb-20'}`}>
          <Outlet />
        </main>
      </div>
      {!isDesktop && <BottomNav />}
    </div>
  )
}
