import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Lazy load pages untuk mengurangi bundle size awal
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Analytics = React.lazy(() => import('./pages/Analytics'))
const Users = React.lazy(() => import('./pages/Users'))
const Orders = React.lazy(() => import('./pages/Orders'))
const Products = React.lazy(() => import('./pages/Products'))
const Settings = React.lazy(() => import('./pages/Settings'))

// Komponen Loading Screen yang lebih ringan
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

// Komponen wrapper untuk lazy loading dengan fallback
const SuspenseWrapper = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      {children}
    </React.Suspense>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Optimasi: Minimal loading time
    // Hanya tampilkan loading screen jika diperlukan (misal: cek auth, init data penting)
    const initApp = async () => {
      try {
        // Ganti dengan inisialisasi yang benar-benar diperlukan
        // Contoh: cek token, load user data, dll.
        
        // Minimum loading time untuk UX (opsional, bisa dihapus jika tidak perlu)
        await new Promise(resolve => setTimeout(resolve, 300)) // Turunkan dari 2000ms ke 300ms
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setLoading(false)
      }
    }

    initApp()
  }, [])

  // Hapus loading screen jika tidak diperlukan
  // Atau pertahankan hanya untuk inisialisasi kritis
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto p-6">
            <SuspenseWrapper>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </SuspenseWrapper>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App