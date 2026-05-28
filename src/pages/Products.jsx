import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX, FiAlertTriangle, FiSearch } from 'react-icons/fi'

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Product A', category: 'Electronics', price: 299, stock: 45 },
  { id: 2, name: 'Product B', category: 'Clothing',    price: 59,  stock: 120 },
  { id: 3, name: 'Product C', category: 'Books',       price: 29,  stock: 8 },
  { id: 4, name: 'Product D', category: 'Electronics', price: 199, stock: 0 },
]

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Food', 'Sports', 'Other']

const EMPTY_FORM = { name: '', category: 'Electronics', price: '', stock: '' }

const getStatus = (stock) => {
  if (stock === 0)  return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
  if (stock <= 10)  return { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-800' }
  return               { label: 'In Stock',      color: 'bg-green-100 text-green-800' }
}

// ── Modal hapus ─────────────────────────────────────────────────────
const DeleteModal = ({ product, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
        <FiAlertTriangle size={22} className="text-red-500" />
      </div>
      <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">Hapus produk?</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        <strong>{product.name}</strong> akan dihapus secara permanen.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
          Batal
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
          Ya, Hapus
        </button>
      </div>
    </div>
  </div>
)

// ── Modal form tambah / edit ────────────────────────────────────────
const ProductFormModal = ({ editProduct, onSave, onCancel }) => {
  const [form, setForm] = useState(
    editProduct
      ? { ...editProduct, price: String(editProduct.price), stock: String(editProduct.stock) }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())          e.name  = 'Nama produk wajib diisi'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
                                    e.price = 'Harga harus berupa angka positif'
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
                                    e.stock = 'Stok harus berupa angka positif'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
  }

  const Field = ({ label, fieldKey, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[fieldKey]}
        onChange={e => { setForm(f => ({ ...f, [fieldKey]: e.target.value })); setErrors(er => ({ ...er, [fieldKey]: '' })) }}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors[fieldKey] ? 'border-red-400' : 'border-gray-300'}`}
      />
      {errors[fieldKey] && <p className="text-xs text-red-500 mt-1">{errors[fieldKey]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">{editProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
        </div>

        <div className="space-y-4">
          <Field label="Nama Produk" fieldKey="name" placeholder="Masukkan nama produk" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <Field label="Harga ($)" fieldKey="price" type="number" placeholder="0" />
          <Field label="Stok"      fieldKey="stock" type="number" placeholder="0" />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
            {editProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast ───────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
    {message}
  </div>
)

// ── Komponen utama ──────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts]     = useState(INITIAL_PRODUCTS)
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget]     = useState(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [toast, setToast]               = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdd = (form) => {
    setProducts(prev => [...prev, { ...form, id: Date.now() }])
    setShowAdd(false)
    showToast(`${form.name} berhasil ditambahkan`)
  }

  const handleEdit = (form) => {
    setProducts(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...form } : p))
    setEditTarget(null)
    showToast(`${form.name} berhasil diperbarui`)
  }

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    showToast(`${deleteTarget.name} berhasil dihapus`, 'error')
    setDeleteTarget(null)
  }

  // Stats dihitung dinamis
  const total    = products.length
  const inStock  = products.filter(p => p.stock > 10).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length
  const outStock = products.filter(p => p.stock === 0).length

  const allCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchSearch && matchCat
  })

  return (
    <div>
      {deleteTarget && <DeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {showAdd      && <ProductFormModal onSave={handleAdd} onCancel={() => setShowAdd(false)} />}
      {editTarget   && <ProductFormModal editProduct={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} />}
      {toast        && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">Manage your products</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm font-medium">
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: total,    color: 'text-gray-800' },
          { label: 'In Stock',       value: inStock,  color: 'text-green-600' },
          { label: 'Low Stock',      value: lowStock, color: 'text-yellow-600' },
          { label: 'Out of Stock',   value: outStock, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg shadow-md p-5">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a product or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filterCat === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">Tidak ada produk ditemukan.</td>
              </tr>
            ) : filtered.map(product => {
              const status = getStatus(product.stock)
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => setEditTarget(product)} className="text-blue-500 hover:text-blue-700 mr-3">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => setDeleteTarget(product)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products