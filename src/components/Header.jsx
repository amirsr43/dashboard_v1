import React, { useState, useRef, useEffect } from 'react'
import { FiBell, FiSearch, FiMenu, FiUser, FiUserPlus, FiCheck, FiAlertTriangle, FiMessageSquare, FiX, FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi'

// ── Data Notifikasi Awal ──────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: FiUserPlus, color: 'blue', text: <><strong>Alex Johnson</strong> menambahkan Anda sebagai kolaborator.</>, time: '2 menit lalu', unread: true, type: 'user' },
  { id: 2, icon: FiCheck, color: 'green', text: <>Tugas <strong>"Desain halaman login"</strong> telah selesai.</>, time: '15 menit lalu', unread: true, type: 'task' },
  { id: 3, icon: FiAlertTriangle, color: 'amber', text: <>Batas waktu laporan <strong>Q3 2025</strong> akan berakhir 2 jam lagi.</>, time: '1 jam lalu', unread: true, type: 'deadline' },
  { id: 4, icon: FiShoppingCart, color: 'blue', text: <>Pesanan baru <strong>#ORD-1234</strong> senilai $234</>, time: '3 jam lalu', unread: false, type: 'order' },
  { id: 5, icon: FiDollarSign, color: 'green', text: <>Pembayaran sebesar <strong>$1,234</strong> telah diterima</>, time: '5 jam lalu', unread: false, type: 'payment' },
]

// ── Modal Search Global ───────────────────────────────────────────
const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState(['Dashboard', 'Users', 'Analytics', 'Settings'])

  // Data yang bisa dicari (simulasi)
  const searchableData = [
    { id: 1, title: 'Dashboard', path: '/dashboard', type: 'Page', icon: FiMenu },
    { id: 2, title: 'Users', path: '/users', type: 'Page', icon: FiUser },
    { id: 3, title: 'Analytics', path: '/analytics', type: 'Page', icon: FiAlertTriangle },
    { id: 4, title: 'Settings', path: '/settings', type: 'Page', icon: FiMessageSquare },
    { id: 5, title: 'John Doe', path: '/users/1', type: 'User', icon: FiUser },
    { id: 6, title: 'Sarah Smith', path: '/users/2', type: 'User', icon: FiUser },
    { id: 7, title: 'Order #ORD-1234', path: '/orders/1234', type: 'Order', icon: FiShoppingCart },
    { id: 8, title: 'Product - Pro Plan', path: '/products/1', type: 'Product', icon: FiPackage },
  ]

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchableData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const handleSearch = (result) => {
    onSearch(result)
    // Simpan ke recent searches
    if (!recentSearches.includes(result.title)) {
      setRecentSearches(prev => [result.title, ...prev].slice(0, 5))
    }
    onClose()
    setSearchTerm('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              autoFocus
              placeholder="Search pages, users, orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button onClick={onClose} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchTerm.trim() && searchResults.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada hasil untuk "{searchTerm}"</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-gray-400 px-3 py-2">HASIL PENCARIAN</p>
              {searchResults.map(result => {
                const Icon = result.icon
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSearch(result)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-800">{result.title}</p>
                      <p className="text-xs text-gray-400">{result.type}</p>
                    </div>
                    <span className="text-xs text-gray-400">↵</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Recent Searches */}
          {!searchTerm.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-gray-400 px-3 py-2">PENCARIAN TERBARU</p>
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchTerm(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiSearch size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!searchTerm.trim() && (
            <div className="p-2 border-t border-gray-100 mt-2">
              <p className="text-xs font-medium text-gray-400 px-3 py-2">AKSI CEPAT</p>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUserPlus size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-800">Tambah User Baru</p>
                  <p className="text-xs text-gray-400">Buka form tambah user</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Modal Notifikasi Detail ────────────────────────────────────────
const NotificationModal = ({ notifications, onClose, onMarkAsRead, onMarkAllRead }) => {
  const [filter, setFilter] = useState('all') // all, unread

  const filteredNotif = notifications.filter(n => 
    filter === 'all' ? true : n.unread
  )

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Notifikasi</span>
          {notifications.filter(n => n.unread).length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.filter(n => n.unread).length} baru
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onMarkAllRead}
            className="text-xs text-blue-500 hover:underline"
          >
            Tandai semua
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 px-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            filter === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            filter === 'unread' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Belum Dibaca
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
        {filteredNotif.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FiBell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tidak ada notifikasi</p>
          </div>
        ) : (
          filteredNotif.map(notif => {
            const Icon = notif.icon
            return (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  notif.unread ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[notif.color]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">{notif.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{notif.time}</p>
                    {notif.type && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {notif.type}
                      </span>
                    )}
                  </div>
                </div>
                {notif.unread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <button className="w-full text-center text-sm text-blue-500 hover:text-blue-600">
          Lihat semua notifikasi
        </button>
      </div>
    </div>
  )
}

const iconColors = {
  blue: 'bg-blue-100 text-blue-500',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-500',
}

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleSearch = (result) => {
    console.log('Search result:', result)
    // Navigasi ke halaman yang dipilih
    // window.location.href = result.path
    alert(`Navigating to: ${result.title}`)
  }

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tutup search modal dengan ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSearch={handleSearch}
      />

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <FiMenu size={24} />
            </button>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:block relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-80"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            <button 
              className="md:hidden text-gray-600 hover:text-gray-800" 
              onClick={() => setSearchOpen(true)}
            >
              <FiSearch size={20} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="relative text-gray-600 hover:text-gray-800 p-1"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationModal 
                  notifications={notifications}
                  onClose={() => setNotifOpen(false)}
                  onMarkAsRead={markAsRead}
                  onMarkAllRead={markAllRead}
                />
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={16} />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-700">John Doe</span>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      
    </>
  )
}

export default Header