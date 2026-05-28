import React, { useState, useEffect } from 'react'
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage, FiRefreshCw, FiDownload, FiBell, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import StatsCard from '../components/StatsCard'
import Chart from '../components/Chart'
import RecentOrders from '../components/RecentOrders'

// ── Toast Notification ──────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white font-medium transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {message}
  </div>
)

// ── Notification Panel ─────────────────────────────────────────────
const NotificationPanel = ({ notifications, onClose }) => (
  <div className="fixed right-4 top-20 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-800">Notifications</h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No new notifications</div>
      ) : (
        notifications.map((notif, idx) => (
          <div key={idx} className="p-4 border-b border-gray-100 hover:bg-gray-50">
            <p className="text-sm text-gray-800">{notif.message}</p>
            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
          </div>
        ))
      )}
    </div>
  </div>
)

// ── Main Dashboard Component ───────────────────────────────────────
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [dateRange, setDateRange] = useState('week') // day, week, month
  
  // State untuk data dinamis
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      revenue: 0,
      products: 0
    },
    chartData: {
      revenue: [0, 0, 0, 0, 0, 0, 0],
      sales: [0, 0, 0, 0, 0, 0, 0]
    },
    recentActivity: [],
    notifications: []
  })

  // Achievement targets (untuk notifikasi)
  const targets = {
    revenue: 50000,
    orders: 1500,
    users: 15000
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch data dari API
  const fetchDashboardData = async (range) => {
    setIsLoading(true)
    
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Data berdasarkan range
    const dataMap = {
      day: {
        stats: { totalUsers: '12,345', totalOrders: '1,234', revenue: '$45,678', products: '567' },
        chartData: {
          revenue: [4000, 4200, 4500, 4300, 4800, 5000, 5200],
          sales: [12, 15, 18, 14, 20, 22, 25]
        },
        recentActivity: [
          { id: 1, action: 'New order #1234', user: 'John Doe', time: '2 minutes ago' },
          { id: 2, action: 'User registered', user: 'Sarah Smith', time: '15 minutes ago' },
          { id: 3, action: 'Product added', user: 'Admin', time: '1 hour ago' }
        ]
      },
      week: {
        stats: { totalUsers: '12,345', totalOrders: '1,234', revenue: '$45,678', products: '567' },
        chartData: {
          revenue: [28000, 32000, 35000, 38000, 42000, 45000, 45678],
          sales: [85, 92, 98, 105, 112, 120, 125]
        },
        recentActivity: [
          { id: 1, action: 'New order #1234', user: 'John Doe', time: '2 minutes ago' },
          { id: 2, action: 'User registered', user: 'Sarah Smith', time: '15 minutes ago' },
          { id: 3, action: 'Product added', user: 'Admin', time: '1 hour ago' },
          { id: 4, action: 'Order completed', user: 'Mike Johnson', time: '3 hours ago' },
          { id: 5, action: 'Refund processed', user: 'Emily Brown', time: '5 hours ago' }
        ]
      },
      month: {
        stats: { totalUsers: '12,345', totalOrders: '1,234', revenue: '$45,678', products: '567' },
        chartData: {
          revenue: [120000, 135000, 142000, 158000, 165000, 175000, 185000],
          sales: [350, 380, 420, 450, 480, 520, 560]
        },
        recentActivity: []
      }
    }
    
    const data = dataMap[range] || dataMap.week
    setDashboardData(data)
    
    // Cek pencapaian target untuk notifikasi
    const revenueNum = parseInt(data.stats.revenue.replace(/[^0-9]/g, ''))
    const ordersNum = parseInt(data.stats.totalOrders.replace(/,/g, ''))
    const usersNum = parseInt(data.stats.totalUsers.replace(/,/g, ''))
    
    const newNotifications = []
    
    if (revenueNum >= targets.revenue) {
      newNotifications.push({
        message: `🎉 Revenue target achieved! Current: ${data.stats.revenue}`,
        time: 'Just now'
      })
    }
    
    if (ordersNum >= targets.orders) {
      newNotifications.push({
        message: `📦 Order milestone reached! Total: ${data.stats.totalOrders} orders`,
        time: 'Just now'
      })
    }
    
    if (usersNum >= targets.users) {
      newNotifications.push({
        message: `👥 User growth milestone: ${data.stats.totalUsers} total users!`,
        time: 'Just now'
      })
    }
    
    setDashboardData(prev => ({ ...prev, notifications: newNotifications }))
    setIsLoading(false)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData(dateRange)
    
    const interval = setInterval(() => {
      fetchDashboardData(dateRange)
      showToast('Data auto-refreshed', 'success')
    }, 30000) // Refresh setiap 30 detik
    
    return () => clearInterval(interval)
  }, [dateRange])

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData(dateRange)
    showToast('Dashboard data refreshed!', 'success')
  }

  // Handle export report
  const handleExportReport = () => {
    // Simulasi export ke PDF/Excel
    showToast('Report exported successfully!', 'success')
    console.log('Exporting dashboard data:', dashboardData)
  }

  // Handle card click (navigasi)
  const handleCardClick = (title) => {
    showToast(`Navigating to ${title} page...`, 'success')
    // window.location.href = `/${title.toLowerCase().replace(' ', '')}`
    console.log(`Navigate to ${title} page`)
  }

  // Format stats untuk StatsCard component
  const statsData = [
    { 
      title: 'Total Users', 
      value: dashboardData.stats.totalUsers, 
      icon: FiUsers, 
      change: '+12%', 
      color: 'bg-blue-500',
      onClick: () => handleCardClick('Users')
    },
    { 
      title: 'Total Orders', 
      value: dashboardData.stats.totalOrders, 
      icon: FiShoppingCart, 
      change: '+8%', 
      color: 'bg-green-500',
      onClick: () => handleCardClick('Orders')
    },
    { 
      title: 'Revenue', 
      value: dashboardData.stats.revenue, 
      icon: FiDollarSign, 
      change: '+23%', 
      color: 'bg-purple-500',
      onClick: () => handleCardClick('Revenue')
    },
    { 
      title: 'Products', 
      value: dashboardData.stats.products, 
      icon: FiPackage, 
      change: '+5%', 
      color: 'bg-orange-500',
      onClick: () => handleCardClick('Products')
    },
  ]

  const rangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ]

  return (
    <div>
      {/* Toast & Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
      {showNotifications && (
        <NotificationPanel 
          notifications={dashboardData.notifications} 
          onClose={() => setShowNotifications(false)} 
        />
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, John! Here's what's happening today.</p>
        </div>
        
        <div className="flex gap-3">
          {/* Date Range Filter */}
          <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
            {rangeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === option.value
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-white text-gray-600 px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiBell size={18} />
            {dashboardData.notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {dashboardData.notifications.length}
              </span>
            )}
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
            Refresh
          </button>
          
          {/* Export Button */}
          <button
            onClick={handleExportReport}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards - Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsData.map((stat, index) => (
              <div key={index} className="cursor-pointer transform transition-transform hover:scale-105">
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Today's Revenue</p>
                  <p className="text-2xl font-bold">$2,345</p>
                </div>
                <FiTrendingUp size={24} className="opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Pending Orders</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <FiShoppingCart size={24} className="opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Conversion Rate</p>
                  <p className="text-2xl font-bold">3.8%</p>
                </div>
                <FiTrendingUp size={24} className="opacity-80" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Revenue Overview</h3>
                <span className="text-sm text-green-500 flex items-center gap-1">
                  <FiTrendingUp size={14} />
                  +23% vs last period
                </span>
              </div>
              <Chart 
                type="line" 
                data={dashboardData.chartData.revenue}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                color="#3B82F6"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sales by Category</h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <Chart 
                type="bar" 
                data={dashboardData.chartData.sales}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                color="#10B981"
              />
            </div>
          </div>

          {/* Recent Activity & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
              </div>
              <RecentOrders />
            </div>
            
            {/* Recent Activity Feed */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                ))}
                {dashboardData.recentActivity.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 text-xl">💡</div>
              <div>
                <h4 className="font-semibold text-yellow-800">Performance Tip</h4>
                <p className="text-sm text-yellow-700">
                  Your conversion rate is 3.8%. Optimizing your checkout process could increase this by 20%!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard