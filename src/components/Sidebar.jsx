import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FiHome, FiBarChart2, FiUsers, FiShoppingCart, 
  FiPackage, FiSettings, FiLogOut, FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'

const menuItems = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
  { name: 'Users', icon: FiUsers, path: '/users' },
  { name: 'Orders', icon: FiShoppingCart, path: '/orders' },
  { name: 'Products', icon: FiPackage, path: '/products' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
]

const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
        <FiLogOut size={22} className="text-red-500" />
      </div>
      <h2 className="text-center text-lg font-semibold text-gray-800  mb-1">
        Keluar dari aplikasi?
      </h2>
      <p className="text-center text-sm text-gray-500  mb-6">
        Sesi Anda akan diakhiri dan Anda perlu login kembali.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700  text-sm font-medium  transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
        >
          Ya, Keluar
        </button>
      </div>
    </div>
  </div>
)

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    // Tambahkan logic clear token/session di sini
    navigate('/')
  }

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 flex flex-col dark:bg-gray-950 dark:border-gray-800 dark:text-white`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-500 text-white dark:bg-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg px-2 py-2 transition-colors"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar