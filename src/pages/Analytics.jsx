import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiUsers, FiEye, FiPercent, FiCalendar, FiDownload, FiRefreshCw } from 'react-icons/fi'
import Chart from '../components/Chart'

// ── Metric Card Component (DIPERBAIKI - icon putih) ─────────────────
const MetricCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
)

// ── Toast Notifikasi ────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white font-medium transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {message}
  </div>
)

// ── Komponen Utama Analytics ────────────────────────────────────────
const Analytics = () => {
  const [dateRange, setDateRange] = useState('week')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {
      totalViews: 0,
      totalUsers: 0,
      conversionRate: 0,
      engagementRate: 0
    },
    trafficData: [],
    engagementData: []
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAnalyticsData = async (range) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const dataMap = {
      day: {
        metrics: { totalViews: '1,234', totalUsers: '456', conversionRate: '3.2', engagementRate: '67' },
        trafficData: [100, 150, 200, 180, 220, 250, 300],
        engagementData: [45, 52, 48, 60, 55, 65, 70]
      },
      week: {
        metrics: { totalViews: '12,345', totalUsers: '3,456', conversionRate: '3.8', engagementRate: '72' },
        trafficData: [1200, 1350, 1500, 1400, 1600, 1800, 2000],
        engagementData: [450, 520, 480, 600, 550, 650, 700]
      },
      month: {
        metrics: { totalViews: '45,678', totalUsers: '12,345', conversionRate: '4.2', engagementRate: '75' },
        trafficData: [4000, 4200, 4500, 4800, 5000, 5200, 5500],
        engagementData: [1800, 1900, 2000, 2100, 2200, 2300, 2400]
      },
      year: {
        metrics: { totalViews: '543,210', totalUsers: '123,456', conversionRate: '4.5', engagementRate: '78' },
        trafficData: [45000, 47000, 49000, 51000, 53000, 55000, 57000],
        engagementData: [18000, 19000, 20000, 21000, 22000, 23000, 24000]
      }
    }
    
    const data = dataMap[range] || dataMap.week
    setAnalyticsData(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAnalyticsData(dateRange)
  }, [dateRange])

  const handleExportData = () => {
    showToast('Data berhasil diekspor!', 'success')
    console.log('Exporting analytics data:', analyticsData)
  }

  const handleRefresh = () => {
    fetchAnalyticsData(dateRange)
    showToast('Data berhasil diperbarui!', 'success')
  }

  // Metric cards data dengan warna background yang lebih gelap/terang
  const metrics = [
    { title: 'Total Views', value: analyticsData.metrics.totalViews, change: 12.5, icon: FiEye, color: 'bg-blue-500' },
    { title: 'Total Users', value: analyticsData.metrics.totalUsers, change: 8.3, icon: FiUsers, color: 'bg-green-500' },
    { title: 'Conversion Rate', value: `${analyticsData.metrics.conversionRate}%`, change: 2.1, icon: FiPercent, color: 'bg-purple-500' },
    { title: 'Engagement Rate', value: `${analyticsData.metrics.engagementRate}%`, change: -1.5, icon: FiTrendingUp, color: 'bg-orange-500' }
  ]

  const rangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">View your business analytics and insights</p>
        </div>
        
        <div className="flex gap-3">
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
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
            Refresh
          </button>
          
          <button
            onClick={handleExportData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Traffic Overview</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar size={14} />
                  <span>Last 7 days</span>
                </div>
              </div>
              <div className="h-80">
                <Chart 
                  type="line" 
                  data={analyticsData.trafficData}
                  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                  color="#3B82F6"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User Engagement</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar size={14} />
                  <span>Last 7 days</span>
                </div>
              </div>
              <div className="h-80">
                <Chart 
                  type="bar" 
                  data={analyticsData.engagementData}
                  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                  color="#10B981"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <FiTrendingUp size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">Analytics data will appear here</p>
                  <p className="text-sm text-gray-400">
                    Upgrade to premium for detailed funnel analytics
                  </p>
                  <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-time Insights</h3>
                <p className="text-blue-100">
                  {Math.floor(Math.random() * 100)} active users on your site right now
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">+23% vs yesterday</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics