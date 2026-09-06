import { useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import {
  Shield,
  Search,
  RefreshCw,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  CheckCircle2,
  Users,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  UserPlus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Key,
  ShieldCheck,
  Calendar,
  UserX,
  UserCheck,
  User,
  Clock,
} from 'lucide-react'

export default function AdminDashboard() {
  const { isSuperAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('submissions') // 'submissions' | 'admins'

  // Submissions state
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Admins state
  const [activeAdmins, setActiveAdmins] = useState([])
  const [inactiveAdmins, setInactiveAdmins] = useState([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [adminStatusFilter, setAdminStatusFilter] = useState('active') // 'active' | 'inactive' | 'all'
  const [adminSearchTerm, setAdminSearchTerm] = useState('')

  // Edit modal state
  const [editingItem, setEditingItem] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Inactivate modal state
  const [deactivatingAdmin, setDeactivatingAdmin] = useState(null)
  const [isDeactivating, setIsDeactivating] = useState(false)

  // Reactivating ID state
  const [isReactivatingId, setIsReactivatingId] = useState(null)

  // Create Admin modal state
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [createAdminError, setCreateAdminError] = useState('')
  const [createdAdminResult, setCreatedAdminResult] = useState(null)
  const [showCreatedPassword, setShowCreatedPassword] = useState(true)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [credentialsCopied, setCredentialsCopied] = useState(false)

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const params = {}
      if (genderFilter) params.gender = genderFilter
      if (searchTerm) params.search = searchTerm

      const response = await axiosInstance.get('/submissions', { params })
      setSubmissions(response.data?.data?.submissions || [])
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to load submissions from server.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [genderFilter, searchTerm])

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) return
    setIsLoadingAdmins(true)
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        axiosInstance.get('/admin/fetch-active-admins'),
        axiosInstance.get('/admin/fetch-inactive-admins'),
      ])
      setActiveAdmins(activeRes.data?.data?.admins || [])
      setInactiveAdmins(inactiveRes.data?.data?.admins || [])
    } catch (error) {
      console.error('Failed to load admins:', error)
    } finally {
      setIsLoadingAdmins(false)
    }
  }, [isSuperAdmin])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubmissions()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchSubmissions])

  useEffect(() => {
    if (isSuperAdmin) {
      const timer = setTimeout(() => {
        fetchAdmins()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [fetchAdmins, isSuperAdmin])

  // Auto-dismiss notification messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('')
        setSuccessMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage, successMessage])

  // Auto-dismiss modal error messages after 5 seconds
  useEffect(() => {
    if (createAdminError) {
      const timer = setTimeout(() => {
        setCreateAdminError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [createAdminError])

  const handleRefresh = () => {
    fetchSubmissions()
    if (isSuperAdmin) {
      fetchAdmins()
    }
  }

  const handleEditClick = (sub) => {
    setEditingItem(sub)
    setEditFormData({
      firstName: sub.first_name || sub.firstName || '',
      lastName: sub.last_name || sub.lastName || '',
      email: sub.email || '',
      gender: sub.gender || 'MALE',
      mobileNumber: sub.mobile_number || sub.mobileNumber || '',
      address: sub.address || '',
      feedback: sub.feedback || '',
    })
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setErrorMessage('')
    try {
      const id = editingItem.submission_id || editingItem.id
      await axiosInstance.put(`/submissions/update/${id}`, editFormData)
      setSuccessMessage('Submission updated successfully.')
      setEditingItem(null)
      fetchSubmissions()
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to update submission.'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      await axiosInstance.delete(`/submissions/delete/${deletingId}`)
      setSuccessMessage('Submission deleted successfully.')
      setDeletingId(null)
      fetchSubmissions()
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to delete submission.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Inactivate Admin Handlers
  const handleInactivateConfirm = async () => {
    if (!deactivatingAdmin) return
    setIsDeactivating(true)
    setErrorMessage('')
    try {
      await axiosInstance.patch(`/admin/inactivate-admin/${deactivatingAdmin.user_id}`)
      setSuccessMessage(`Administrator ${deactivatingAdmin.email} has been inactivated.`)
      setDeactivatingAdmin(null)
      fetchAdmins()
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to inactivate administrator.'
      )
    } finally {
      setIsDeactivating(false)
    }
  }

  // Reactivate Admin Handler
  const handleReactivateAdmin = async (admin) => {
    setIsReactivatingId(admin.user_id)
    setErrorMessage('')
    try {
      await axiosInstance.patch(`/admin/activate-admin/${admin.user_id}`)
      setSuccessMessage(`Administrator ${admin.email} has been reactivated.`)
      fetchAdmins()
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to reactivate administrator.'
      )
    } finally {
      setIsReactivatingId(null)
    }
  }

  // Create Admin Handlers
  const handleOpenCreateAdminModal = () => {
    setNewAdminEmail('')
    setCreateAdminError('')
    setCreatedAdminResult(null)
    setPasswordCopied(false)
    setCredentialsCopied(false)
    setShowCreatedPassword(true)
    setIsCreateAdminOpen(true)
  }

  const handleCloseCreateAdminModal = () => {
    setIsCreateAdminOpen(false)
    setCreatedAdminResult(null)
    setNewAdminEmail('')
    setCreateAdminError('')
  }

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault()
    setIsCreatingAdmin(true)
    setCreateAdminError('')
    try {
      const response = await axiosInstance.post('/admin/create-admin', {
        email: newAdminEmail.trim(),
      })
      const data = response.data?.data
      setCreatedAdminResult(data)
      setSuccessMessage(`Admin account for ${data?.email} created successfully.`)
      fetchAdmins()
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Failed to create admin account.'
      setCreateAdminError(msg)
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const handleCopyPassword = () => {
    if (createdAdminResult?.generatedPassword) {
      navigator.clipboard.writeText(createdAdminResult.generatedPassword)
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 2000)
    }
  }

  const handleCopyCredentials = () => {
    if (createdAdminResult) {
      const creds = `Email: ${createdAdminResult.email}\nPassword: ${createdAdminResult.generatedPassword}\nRole: ${createdAdminResult.role}`
      navigator.clipboard.writeText(creds)
      setCredentialsCopied(true)
      setTimeout(() => setCredentialsCopied(false), 2000)
    }
  }

  // Metrics
  const maleCount = submissions.filter((s) => s.gender === 'MALE').length
  const femaleCount = submissions.filter((s) => s.gender === 'FEMALE').length
  const otherCount = submissions.filter((s) => s.gender === 'OTHER').length

  // Admin filter lists
  const allAdmins = [
    ...activeAdmins.map((a) => ({ ...a, status: 1 })),
    ...inactiveAdmins.map((a) => ({ ...a, status: 0 })),
  ]

  const displayedAdmins = (
    adminStatusFilter === 'active'
      ? activeAdmins
      : adminStatusFilter === 'inactive'
      ? inactiveAdmins
      : allAdmins
  ).filter((a) =>
    adminSearchTerm
      ? a.email?.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        String(a.user_id).includes(adminSearchTerm)
      : true
  )

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 shadow-2xs">
            {isSuperAdmin ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                <span>Super Admin Control Panel</span>
              </>
            ) : (
              <>
                <Shield className="h-3.5 w-3.5 text-purple-600" />
                <span>Admin Control Panel</span>
              </>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-['Outfit']">
            {isSuperAdmin && activeTab === 'admins' ? 'Admin Accounts' : 'Customer Profiles'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isSuperAdmin && activeTab === 'admins'
              ? 'Display, manage, and inactivate administrator accounts.'
              : 'Review, filter, and manage customer profiles and submissions in real-time.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleOpenCreateAdminModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create New Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || (isSuperAdmin && isLoadingAdmins)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <RefreshCw
              className={`h-4 w-4 text-slate-500 ${
                isLoading || (isSuperAdmin && isLoadingAdmins) ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Only for SUPER_ADMIN */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Customer Profiles</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                activeTab === 'submissions'
                  ? 'bg-indigo-500/50 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {submissions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'admins'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Team</span>
          </button>
        </div>
      )}

      {/* Banners */}
      {errorMessage && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* TAB 1: Customer Submissions */}
      {activeTab === 'submissions' || !isSuperAdmin ? (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-['Outfit']">{submissions.length}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Male</span>
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
              </div>
              <div className="text-2xl font-bold text-cyan-600 font-['Outfit']">{maleCount}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Female</span>
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              </div>
              <div className="text-2xl font-bold text-purple-600 font-['Outfit']">{femaleCount}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Other</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">{otherCount}</div>
            </div>
          </div>

          {/* Filter and Search Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by first or last name..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="py-4 px-6">Applicant</th>
                    <th className="py-4 px-6">Contact</th>
                    <th className="py-4 px-6">Gender</th>
                    <th className="py-4 px-6">Address</th>
                    <th className="py-4 px-6">Feedback</th>
                    <th className="py-4 px-6">Created Info</th>
                    <th className="py-4 px-6">Modified Info</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600 mb-2" />
                        Loading submissions...
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No submissions found. Try changing your search query or gender filter.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => {
                      const id = sub.submission_id || sub.id
                      const firstName = sub.first_name || sub.firstName
                      const lastName = sub.last_name || sub.lastName
                      const mobile = sub.mobile_number || sub.mobileNumber

                      return (
                        <tr key={id} className="transition-colors hover:bg-slate-50/80">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900">
                              {firstName} {lastName}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">ID: #{id}</div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                              <Mail className="h-3.5 w-3.5 text-indigo-600" />
                              <span>{sub.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{mobile}</span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                sub.gender === 'MALE'
                                  ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
                                  : sub.gender === 'FEMALE'
                                  ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                                  : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                              }`}
                            >
                              {sub.gender}
                            </span>
                          </td>

                          <td className="py-4 px-6 max-w-xs truncate text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{sub.address}</span>
                            </div>
                          </td>

                          <td className="py-4 px-6 max-w-xs truncate text-xs text-slate-600">
                            {sub.feedback ? (
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                                <span className="truncate">{sub.feedback}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </td>

                          {/* Created Info: user_created & date_created */}
                          <td className="py-4 px-6 text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                              <User className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                              <span className="truncate max-w-[140px]" title={sub.user_created_email || `User #${sub.user_created}`}>
                                {sub.user_created_email || (sub.user_created ? `User #${sub.user_created}` : 'N/A')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {sub.user_created ? `User ID: #${sub.user_created}` : ''}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
                              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>
                                {sub.date_created
                                  ? new Date(sub.date_created).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'N/A'}
                              </span>
                            </div>
                          </td>

                          {/* Modified Info: user_modified & date_modified */}
                          <td className="py-4 px-6 text-xs whitespace-nowrap">
                            {sub.user_modified || sub.date_modified ? (
                              <>
                                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                  <User className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                                  <span className="truncate max-w-[140px]" title={sub.user_modified_email || `User #${sub.user_modified}`}>
                                    {sub.user_modified_email || (sub.user_modified ? `User #${sub.user_modified}` : 'N/A')}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {sub.user_modified ? `User ID: #${sub.user_modified}` : ''}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
                                  <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span>
                                    {sub.date_modified
                                      ? new Date(sub.date_modified).toLocaleDateString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })
                                      : 'N/A'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Never modified</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditClick(sub)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                                title="Edit Submission"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(id)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete Submission"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Admin Accounts */
        <div>
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Admins</span>
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-['Outfit']">
                {activeAdmins.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Inactive Admins</span>
                <UserX className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-rose-600 font-['Outfit']">
                {inactiveAdmins.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Super Admins</span>
                <ShieldCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700 font-['Outfit']">
                {activeAdmins.filter((a) => a.role === 'SUPER_ADMIN').length}
              </div>
            </div>
          </div>

          {/* Admin Toolbar: Filter by status & Search */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAdminStatusFilter('active')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  adminStatusFilter === 'active'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active Admins</span>
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800">
                  {activeAdmins.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminStatusFilter('inactive')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  adminStatusFilter === 'inactive'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>Inactive Admins</span>
                <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] text-rose-800">
                  {inactiveAdmins.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminStatusFilter('all')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  adminStatusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All Accounts</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700">
                  {allAdmins.length}
                </span>
              </button>
            </div>

            {/* Search Admin */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                placeholder="Search admin email or ID..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pr-4 pl-10 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Admin Table Container */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="py-4 px-6">Admin Account</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Created At</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingAdmins ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-purple-600 mb-2" />
                        Loading administrators...
                      </td>
                    </tr>
                  ) : displayedAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No administrators found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    displayedAdmins.map((admin) => {
                      const isActive = admin.status === 1 || admin.status === '1' || activeAdmins.some(a => a.user_id === admin.user_id)
                      const isSuper = admin.role === 'SUPER_ADMIN'

                      return (
                        <tr key={admin.user_id} className="transition-colors hover:bg-slate-50/80">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${
                                  isActive
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-rose-50 text-rose-500'
                                }`}
                              >
                                {admin.email?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 font-mono text-sm">
                                  {admin.email}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                  ID: #{admin.user_id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                                isSuper
                                  ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                                  : 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                              }`}
                            >
                              {admin.role}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>
                                {admin.created_at
                                  ? new Date(admin.created_at).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'N/A'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            {isSuper ? (
                              <span className="text-xs text-slate-400 italic">Protected</span>
                            ) : isSuperAdmin ? (
                              isActive ? (
                                <button
                                  type="button"
                                  onClick={() => setDeactivatingAdmin(admin)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
                                  title="Inactivate Admin"
                                >
                                  <UserX className="h-3.5 w-3.5 text-rose-600" />
                                  <span>Inactivate</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isReactivatingId === admin.user_id}
                                  onClick={() => handleReactivateAdmin(admin)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
                                  title="Reactivate Admin"
                                >
                                  {isReactivatingId === admin.user_id ? (
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                                  ) : (
                                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                  )}
                                  <span>Reactivate</span>
                                </button>
                              )
                            ) : null}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Submission Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">Edit Submission</h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, firstName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, lastName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, gender: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    required
                    value={editFormData.mobileNumber}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, mobileNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback</label>
                <textarea
                  rows={3}
                  value={editFormData.feedback}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, feedback: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Audit Metadata */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                    Created:
                  </span>
                  <span className="font-mono text-slate-800">
                    {editingItem.user_created_email || (editingItem.user_created ? `User #${editingItem.user_created}` : 'N/A')}
                    {editingItem.date_created && ` (${new Date(editingItem.date_created).toLocaleString()})`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-purple-600" />
                    Last Modified:
                  </span>
                  <span className="font-mono text-slate-800">
                    {editingItem.user_modified || editingItem.date_modified
                      ? `${editingItem.user_modified_email || (editingItem.user_modified ? `User #${editingItem.user_modified}` : 'N/A')}${editingItem.date_modified ? ` (${new Date(editingItem.date_modified).toLocaleString()})` : ''}`
                      : 'Never modified'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Submission Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Delete Submission</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete submission #{deletingId}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inactivate Admin Confirmation Modal */}
      {deactivatingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <UserX className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Inactivate Administrator
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to inactivate administrator{' '}
              <span className="font-semibold text-slate-900 font-mono">
                {deactivatingAdmin.email}
              </span>{' '}
              (ID: #{deactivatingAdmin.user_id})?
            </p>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-left text-xs text-amber-800">
              <p>
                ⚠️ <strong>Impact:</strong> Once inactivated, this admin’s database status will be set to <strong>0</strong>, their active sessions will be terminated, and they will be barred from logging into the portal.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeactivatingAdmin(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeactivating}
                onClick={handleInactivateConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50 cursor-pointer shadow-xs transition-all active:scale-95"
              >
                {isDeactivating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Inactivating...</span>
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4" />
                    <span>Inactivate Admin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {isCreateAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                    {createdAdminResult ? 'Admin Account Created' : 'Create New Admin'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {createdAdminResult
                      ? 'Generated credentials are ready to share.'
                      : 'Provision a new admin with an auto-generated password.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCreateAdminModal}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!createdAdminResult ? (
              <form onSubmit={handleCreateAdminSubmit} className="space-y-5">
                {createAdminError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{createAdminError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4 text-xs text-purple-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-purple-800">
                    <Key className="h-4 w-4 text-purple-600" />
                    <span>Automatic Password Generation</span>
                  </div>
                  <p className="text-purple-700/90 leading-relaxed">
                    A cryptographically strong 12-character random password will be created and displayed on screen upon submission.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseCreateAdminModal}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingAdmin || !newAdminEmail.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    {isCreatingAdmin ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Generate & Create Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>Admin Account Created Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">
                    Please save and share the credentials below with the new admin.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-900 font-mono">{createdAdminResult.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Role:</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20">
                      {createdAdminResult.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500">User ID:</span>
                    <span className="font-mono text-slate-700 font-medium">#{createdAdminResult.userId}</span>
                  </div>
                </div>

                {/* Generated Password Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-purple-600" />
                      Generated Password
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Auto-generated (12 chars)</span>
                  </div>

                  <div className="relative flex items-center justify-between rounded-xl border border-slate-300 bg-slate-900 px-4 py-3 text-slate-100 shadow-inner">
                    <span className="font-mono text-base font-semibold tracking-wider text-emerald-400 select-all">
                      {showCreatedPassword
                        ? createdAdminResult.generatedPassword
                        : '••••••••••••'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowCreatedPassword(!showCreatedPassword)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        title={showCreatedPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCreatedPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer border border-slate-700"
                        title="Copy Password"
                      >
                        {passwordCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Copy All Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 hover:text-purple-800 transition-colors cursor-pointer"
                  >
                    {credentialsCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Full Credentials Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-purple-600" />
                        <span>Copy Full Credentials (Email & Password)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Important Security Notice:</strong> Please copy this password now. For security purposes, it will not be displayed again after closing this window.
                  </p>
                </div>

                <div className="flex justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedAdminResult(null)
                      setNewAdminEmail('')
                      setCreateAdminError('')
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Create Another Admin
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseCreateAdminModal}
                    className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors cursor-pointer shadow-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
