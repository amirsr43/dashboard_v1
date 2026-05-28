import React, { useState } from 'react'
import { FiAlertTriangle, FiX, FiSave, FiLock, FiBell } from 'react-icons/fi'

// ── Toast Notifikasi ────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white font-medium transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
    {message}
  </div>
)

// ── Modal Konfirmasi Update Password ────────────────────────────────
const PasswordConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
        <FiLock size={22} className="text-blue-500" />
      </div>
      <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">Update Password?</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Apakah Anda yakin ingin mengubah password?
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
          className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
        >
          Ya, Update
        </button>
      </div>
    </div>
  </div>
)

const Settings = () => {
  // State untuk notifikasi
  const [notifications, setNotifications] = useState(true)
  const [toast, setToast] = useState(null)
  
  // State untuk profile
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    company: 'Tech Corp'
  })
  
  // State untuk password
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  // State untuk modal password
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  // State untuk error validasi
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  // Helper untuk menampilkan toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Validasi Profile ──────────────────────────────────────────────
  const validateProfile = () => {
    const errors = {}
    if (!profile.fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi'
    if (!profile.email.trim()) errors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = 'Format email tidak valid'
    if (!profile.company.trim()) errors.company = 'Perusahaan wajib diisi'
    return errors
  }

  // ── Handle Save Profile ──────────────────────────────────────────
  const handleSaveProfile = (e) => {
    e.preventDefault()
    const errors = validateProfile()
    
    if (Object.keys(errors).length) {
      setProfileErrors(errors)
      return
    }
    
    // Simulasi API call
    console.log('Saving profile:', profile)
    showToast('Profil berhasil diperbarui!', 'success')
    setProfileErrors({})
  }

  // ── Handle Update Password (buka modal) ──────────────────────────
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    // Validasi password
    const errors = {}
    if (!passwords.current) errors.current = 'Password saat ini wajib diisi'
    if (!passwords.new) errors.new = 'Password baru wajib diisi'
    else if (passwords.new.length < 6) errors.new = 'Minimal 6 karakter'
    if (!passwords.confirm) errors.confirm = 'Konfirmasi password wajib diisi'
    else if (passwords.new !== passwords.confirm) errors.confirm = 'Password tidak cocok'
    
    if (Object.keys(errors).length) {
      setPasswordErrors(errors)
      return
    }
    
    // Buka modal konfirmasi
    setShowPasswordModal(true)
  }

  // ── Proses Update Password (setelah konfirmasi) ──────────────────
  const processPasswordUpdate = () => {
    // Simulasi API call
    console.log('Updating password:', passwords.current, passwords.new)
    
    // Reset form password
    setPasswords({ current: '', new: '', confirm: '' })
    setPasswordErrors({})
    setShowPasswordModal(false)
    showToast('Password berhasil diperbarui!', 'success')
  }

  // ── Handle Toggle Notifications ──────────────────────────────────
  const handleToggleNotifications = () => {
    setNotifications(!notifications)
    showToast(`Notifikasi ${!notifications ? 'diaktifkan' : 'dinonaktifkan'}`, 'success')
  }

  // ── Handle Input Profile ─────────────────────────────────────────
  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
    setProfileErrors({ ...profileErrors, [field]: '' }) // Hapus error saat typing
  }

  // ── Handle Input Password ────────────────────────────────────────
  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value })
    setPasswordErrors({ ...passwordErrors, [field]: '' }) // Hapus error saat typing
  }

  return (
    <div>
      {/* Toast Notifikasi */}
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Modal Konfirmasi Password */}
      {showPasswordModal && (
        <PasswordConfirmModal
          onConfirm={processPasswordUpdate}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your application settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiSave className="text-blue-500" />
            <h3 className="text-lg font-semibold">Profile Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${profileErrors.fullName ? 'border-red-400' : 'border-gray-300'}`}
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
              />
              {profileErrors.fullName && <p className="text-xs text-red-500 mt-1">{profileErrors.fullName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${profileErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
              {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input 
                type="text" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${profileErrors.company ? 'border-red-400' : 'border-gray-300'}`}
                value={profile.company}
                onChange={(e) => handleProfileChange('company', e.target.value)}
              />
              {profileErrors.company && <p className="text-xs text-red-500 mt-1">{profileErrors.company}</p>}
            </div>
            
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>
        </form>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBell className="text-blue-500" />
            <h3 className="text-lg font-semibold">Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email notifications about orders</p>
              </div>
              <button 
                type="button"
                onClick={handleToggleNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiLock className="text-blue-500" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${passwordErrors.current ? 'border-red-400' : 'border-gray-300'}`}
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
              />
              {passwordErrors.current && <p className="text-xs text-red-500 mt-1">{passwordErrors.current}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${passwordErrors.new ? 'border-red-400' : 'border-gray-300'}`}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
              />
              {passwordErrors.new && <p className="text-xs text-red-500 mt-1">{passwordErrors.new}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${passwordErrors.confirm ? 'border-red-400' : 'border-gray-300'}`}
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
              />
              {passwordErrors.confirm && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirm}</p>}
            </div>
            
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings