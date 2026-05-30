import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'

const HomePage      = lazy(() => import('./pages/HomePage'))
const ResultsPage   = lazy(() => import('./pages/ResultsPage'))
const DetailPage    = lazy(() => import('./pages/DetailPage'))
const ProfilePage   = lazy(() => import('./pages/ProfilePage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const LoginPage     = lazy(() => import('./pages/LoginPage'))
const HistoryPage   = lazy(() => import('./pages/HistoryPage'))
const MyReviewsPage = lazy(() => import('./pages/MyReviewsPage'))
const SettingsPage  = lazy(() => import('./pages/SettingsPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            5 * 60 * 1000,
      retry:                1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <Suspense fallback={<PageLoader/>}><LoginPage /></Suspense>
            }/>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Suspense fallback={<PageLoader/>}><HomePage /></Suspense>} />
              <Route path="/results" element={<Suspense fallback={<PageLoader/>}><ResultsPage /></Suspense>} />
              <Route path="/cafe/:id" element={<Suspense fallback={<PageLoader/>}><DetailPage /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<PageLoader/>}><ProfilePage /></Suspense>} />
              <Route path="/favorites" element={<Suspense fallback={<PageLoader/>}><FavoritesPage /></Suspense>} />
              <Route path="/history" element={<Suspense fallback={<PageLoader/>}><HistoryPage /></Suspense>} />
              <Route path="/my-reviews" element={<Suspense fallback={<PageLoader/>}><MyReviewsPage /></Suspense>} />
              <Route path="/settings" element={<Suspense fallback={<PageLoader/>}><SettingsPage /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
