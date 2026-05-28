import React, { useState } from 'react'
import { FiSearch, FiEdit2, FiTrash2, FiUserPlus, FiX, FiAlertTriangle } from 'react-icons/fi'

const INITIAL_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', joinDate: '2024-01-10' },
  { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Editor', status: 'Active', joinDate: '2024-03-01' },
  { id: 5, name: 'David Wilson', email: 'david@example.com', role: 'User', status: 'Active', joinDate: '2024-02-28' },
]

const EMPTY_FORM = { name: '', email: '', role: 'User', status: 'Active', joinDate: '' }

// ── Modal konfirmasi hapus ──────────────────────────────────────────
const DeleteModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
        <FiAlertTriangle size={22} className="text-red-500" />
      </div>
      <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">Hapus pengguna?</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        <strong>{user.name}</strong> akan dihapus secara permanen dan tidak bisa dikembalikan.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
        >
          Ya, Hapus
        </button>
      </div>
    </div>
  </div>
)

// ── Modal form tambah / edit ────────────────────────────────────────
const UserFormModal = ({ editUser, onSave, onCancel }) => {
  const [form, setForm] = useState(editUser || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (!form.email.trim()) e.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.joinDate) e.joinDate = 'Tanggal bergabung wajib diisi'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onSave(form)
  }

  const field = (label, key, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })) }}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors[key] ? 'border-red-400' : 'border-gray-300'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">{editUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
        </div>

        <div className="space-y-4">
          {field('Nama', 'name')}
          {field('Email', 'email', 'email')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {['Admin', 'Editor', 'User'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {field('Tanggal Bergabung', 'joinDate', 'date')}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
          >
            {editUser ? 'Simpan Perubahan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast notifikasi ────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white font-medium transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {message}
  </div>
)

// ── Komponen utama ──────────────────────────────────────────────────
const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast(`${deleteTarget.name} berhasil dihapus`, 'error')
  }

  const handleAdd = (form) => {
    const newUser = { ...form, id: Date.now() }
    setUsers(prev => [...prev, newUser])
    setShowAddModal(false)
    showToast(`${form.name} berhasil ditambahkan`)
  }

  const handleEdit = (form) => {
    setUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...form } : u))
    setEditTarget(null)
    showToast(`${form.name} berhasil diperbarui`)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAddModal && (
        <UserFormModal onSave={handleAdd} onCancel={() => setShowAddModal(false)} />
      )}
      {editTarget && (
        <UserFormModal editUser={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600">Manage your users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FiUserPlus /> Add User
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Join Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">Tidak ada pengguna ditemukan.</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => setEditTarget(user)} className="text-blue-500 hover:text-blue-700 mr-3">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => setDeleteTarget(user)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={18} />
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

export default Users