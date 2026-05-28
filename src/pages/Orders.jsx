import React, { useState } from 'react'
import { FiEye, FiX, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiSearch } from 'react-icons/fi'

const INITIAL_ORDERS = [
  { id: '#12345', customer: 'John Smith', product: 'Product A', date: '2024-01-15', status: 'Completed', amount: '$234.00', qty: 2, address: 'Jl. Sudirman No.1, Jakarta', phone: '081234567890', note: '' },
  { id: '#12346', customer: 'Sarah Johnson', product: 'Product B', date: '2024-01-14', status: 'Processing', amount: '$567.00', qty: 1, address: 'Jl. Gatot Subroto No.22, Bandung', phone: '082345678901', note: 'Tolong dibungkus rapi' },
  { id: '#12347', customer: 'Mike Brown', product: 'Product C', date: '2024-01-14', status: 'Pending', amount: '$123.00', qty: 3, address: 'Jl. Merdeka No.5, Surabaya', phone: '083456789012', note: '' },
  { id: '#12348', customer: 'Emily Davis', product: 'Product D', date: '2024-01-13', status: 'Completed', amount: '$890.00', qty: 1, address: 'Jl. Diponegoro No.8, Yogyakarta', phone: '084567890123', note: '' },
  { id: '#12349', customer: 'David Wilson', product: 'Product E', date: '2024-01-13', status: 'Shipped', amount: '$456.00', qty: 4, address: 'Jl. Ahmad Yani No.15, Medan', phone: '085678901234', note: 'Kirim pagi hari' },
]

const STATUS_LIST = ['Pending', 'Processing', 'Shipped', 'Completed']

const STATUS_CONFIG = {
  Completed:  { color: 'bg-green-100 text-green-800',  icon: FiCheckCircle, iconColor: 'text-green-500' },
  Processing: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock,        iconColor: 'text-yellow-500' },
  Pending:    { color: 'bg-red-100 text-red-800',       icon: FiAlertCircle,  iconColor: 'text-red-500' },
  Shipped:    { color: 'bg-blue-100 text-blue-800',     icon: FiTruck,        iconColor: 'text-blue-500' },
}

// ── Modal detail order ──────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending
  const Icon = cfg.icon

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onUpdateStatus(order.id, status)
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Detail Order</h2>
            <p className="text-sm text-gray-400">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Info rows */}
          {[
            ['Pelanggan', order.customer],
            ['Produk', order.product],
            ['Jumlah', `${order.qty} item`],
            ['Total', order.amount],
            ['Tanggal', order.date],
            ['Telepon', order.phone],
            ['Alamat', order.address],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
              <span className="text-gray-800 text-right">{val}</span>
            </div>
          ))}

          {order.note && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 w-28 flex-shrink-0">Catatan</span>
              <span className="text-gray-800 text-right italic">"{order.note}"</span>
            </div>
          )}

          {/* Status update */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_LIST.map(s => {
                const c = STATUS_CONFIG[s]
                const SIcon = c.icon
                const active = status === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      active
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <SIcon size={15} className={active ? 'text-blue-500' : c.iconColor} />
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleSave}
            disabled={saving || status === order.status}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-medium transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Status'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast ───────────────────────────────────────────────────────────
const Toast = ({ message }) => (
  <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
    {message}
  </div>
)

// ── Komponen utama ──────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    showToast(`Status order ${id} diperbarui ke "${status}"`)
  }

  const FILTER_TABS = [
    { key: 'all', label: 'All' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Completed', label: 'Completed' },
  ]

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      {toast && <Toast message={toast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600">Manage your orders</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search for orders, customers, products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              filter === key ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {key === 'all' ? orders.length : orders.filter(o => o.status === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Order ID', 'Customer', 'Product', 'Date', 'Status', 'Amount', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                  Tidak ada order ditemukan.
                </td>
              </tr>
            ) : filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_CONFIG[order.status]?.color}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelected(order)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders