import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance'
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  FileText,
  Calendar,
  Clock,
} from 'lucide-react'

export default function ApplicationPage() {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    gender: 'MALE',
    mobileNumber: '',
    address: '',
    feedback: '',
  })

  const [existingSubmission, setExistingSubmission] = useState(null)
  const [isLoadingApp, setIsLoadingApp] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successData, setSuccessData] = useState(null)

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (successData || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessData(null)
        setErrorMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successData, errorMessage])

  useEffect(() => {
    let isMounted = true

    const fetchMyApplication = async () => {
      try {
        setIsLoadingApp(true)
        setErrorMessage('')
        const res = await axiosInstance.get('/submissions/my-application')
        if (!isMounted) return

        if (res.data?.success && res.data?.data?.hasSubmission && res.data?.data?.submission) {
          const sub = res.data.data.submission
          setExistingSubmission(sub)
          setFormData({
            firstName: sub.first_name || '',
            lastName: sub.last_name || '',
            email: sub.email || user?.email || '',
            gender: sub.gender || 'MALE',
            mobileNumber: sub.mobile_number || '',
            address: sub.address || '',
            feedback: sub.feedback || '',
          })
        } else {
          setExistingSubmission(null)
          setFormData({
            firstName: '',
            lastName: '',
            email: user?.email || '',
            gender: 'MALE',
            mobileNumber: '',
            address: '',
            feedback: '',
          })
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Error fetching application:', err)
        if (err.response?.status !== 404) {
          setErrorMessage(err.response?.data?.message || 'Failed to load your profile data.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingApp(false)
        }
      }
    }

    fetchMyApplication()

    return () => {
      isMounted = false
    }
  }, [user?.id, user?.email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Prevent numbers & special characters in name inputs
  const handleNameChange = (field) => (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z\s'-]/g, '')
    setFormData((prev) => ({ ...prev, [field]: sanitized }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Prevent letters & symbols in the phone number input (keeps numbers and optional leading +)
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value
    let sanitized = rawValue.replace(/[^0-9+]/g, '')
    if (sanitized.indexOf('+') > 0) {
      sanitized = sanitized.replace(/\+/g, '')
    }
    setFormData((prev) => ({ ...prev, mobileNumber: sanitized }))
    if (fieldErrors.mobileNumber) {
      setFieldErrors((prev) => ({ ...prev, mobileNumber: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setFieldErrors({})
    setSuccessData(null)
    setIsSubmitting(true)

    const payload = {
      firstName: (formData.firstName || '').trim(),
      lastName: (formData.lastName || '').trim(),
      email: (formData.email || '').trim(),
      gender: formData.gender,
      mobileNumber: (formData.mobileNumber || '').trim(),
      address: (formData.address || '').trim(),
      feedback: (formData.feedback || '').trim() || undefined,
    }

    try {
      if (existingSubmission?.submission_id) {
        // Update existing application
        const response = await axiosInstance.put(
          `/submissions/update/${existingSubmission.submission_id}`,
          payload
        )
        const updated = response.data?.data?.submission
        if (updated) {
          setExistingSubmission(updated)
          setFormData({
            firstName: updated.first_name || payload.firstName || '',
            lastName: updated.last_name || payload.lastName || '',
            email: updated.email || payload.email || '',
            gender: updated.gender || payload.gender || 'MALE',
            mobileNumber: updated.mobile_number || payload.mobileNumber || '',
            address: updated.address || payload.address || '',
            feedback: updated.feedback || '',
          })
        }
        setSuccessData({
          message: 'Your profile has been updated successfully.',
          submissionId: existingSubmission.submission_id,
          isUpdate: true,
        })
      } else {
        // Submit brand new application
        const response = await axiosInstance.post('/submissions/submit', payload)
        const newSubmission = response.data?.data?.submission
        const newSubmissionId = newSubmission?.submission_id || response.data?.data?.submissionId
        setSuccessData({
          message: 'Application submitted successfully.',
          submissionId: newSubmissionId,
          isUpdate: false,
        })
        if (newSubmission) {
          setExistingSubmission(newSubmission)
          setFormData({
            firstName: newSubmission.first_name || payload.firstName || '',
            lastName: newSubmission.last_name || payload.lastName || '',
            email: newSubmission.email || payload.email || '',
            gender: newSubmission.gender || payload.gender || 'MALE',
            mobileNumber: newSubmission.mobile_number || payload.mobileNumber || '',
            address: newSubmission.address || payload.address || '',
            feedback: newSubmission.feedback || '',
          })
        } else {
          setExistingSubmission({
            submission_id: newSubmissionId,
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            gender: payload.gender,
            mobile_number: payload.mobileNumber,
            address: payload.address,
            feedback: payload.feedback || '',
            date_created: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      const responseData = error.response?.data
      const rawErrors = responseData?.errors || []

      const newFieldErrors = {}
      rawErrors.forEach((err) => {
        if (err.field) {
          newFieldErrors[err.field] = err.message || err.msg
        }
      })
      setFieldErrors(newFieldErrors)

      const errorMsg =
        responseData?.message ||
        (rawErrors.length > 0 && (rawErrors[0].message || rawErrors[0].msg)) ||
        'Failed to save profile. Please check your details.'
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingApp) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading your profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-cyan-200/30 blur-[130px]" />

      <div className="mx-auto max-w-3xl">
        {/* Header section */}
        <div className="mb-8 text-center">
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            {existingSubmission
              ? 'Review and update your personal details and application data.'
              : 'Please fill out all required details accurately to create your profile.'}
          </p>
        </div>

        {/* Existing Application Overview Banner */}
        {existingSubmission && (
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-800">
                      Submission ID #{existingSubmission.submission_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    You can edit your information and click Save Changes below.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                {existingSubmission.date_created && (
                  <div className="flex items-center gap-1.5" title="Date Created">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Created:{' '}
                      <strong className="text-slate-700 font-medium">
                        {new Date(existingSubmission.date_created).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </strong>
                    </span>
                  </div>
                )}
                {existingSubmission.date_modified && (
                  <div className="flex items-center gap-1.5" title="Date Modified">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Last Modified:{' '}
                      <strong className="text-slate-700 font-medium">
                        {new Date(existingSubmission.date_modified).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successData && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  {existingSubmission ? 'Profile Updated Successfully!' : 'Application Submitted!'}
                </h3>
                <p className="mt-1 text-sm text-emerald-700">
                  {successData.message}
                </p>
                {successData.submissionId && (
                  <p className="mt-2 text-xs font-mono text-emerald-800">
                    Reference ID: #{successData.submissionId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-800">{errorMessage}</p>
                {Object.values(fieldErrors).filter(Boolean).length > 1 && (
                  <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-rose-700">
                    {Object.entries(fieldErrors)
                      .filter(([_, msg]) => Boolean(msg))
                      .map(([field, msg]) => (
                        <li key={field}>{msg}</li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    maxLength={100}
                    value={formData.firstName || ''}
                    onChange={handleNameChange('firstName')}
                    placeholder="John"
                    className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                      fieldErrors.firstName
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                        : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                    }`}
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    maxLength={100}
                    value={formData.lastName || ''}
                    onChange={handleNameChange('lastName')}
                    placeholder="Doe"
                    className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                      fieldErrors.lastName
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                        : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                    }`}
                  />
                </div>
                {fieldErrors.lastName && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email & Gender */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                      fieldErrors.email
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                        : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender || 'MALE'}
                  onChange={handleChange}
                  className={`w-full rounded-xl border py-3 px-4 text-sm text-slate-900 transition-colors focus:ring-1 focus:outline-none ${
                    fieldErrors.gender
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                      : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {fieldErrors.gender && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.gender}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber || ''}
                  onChange={handlePhoneChange}
                  placeholder="0712345678 or +94712345678"
                  className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                    fieldErrors.mobileNumber
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                      : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {fieldErrors.mobileNumber ? (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.mobileNumber}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  07XXXXXXXX or +947XXXXXXXX
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  required
                  maxLength={255}
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="123 Main Street, City"
                  className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                    fieldErrors.address
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                      : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {fieldErrors.address && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.address}</p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Feedback / Comments (Optional)
                </label>
                <span className="text-xs text-slate-500">{(formData.feedback || '').length} / 1000</span>
              </div>
              <div className="relative">
                <MessageSquare className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                <textarea
                  name="feedback"
                  rows={4}
                  maxLength={1000}
                  value={formData.feedback || ''}
                  onChange={handleChange}
                  placeholder="Optional details, notes, or feedback..."
                  className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:ring-1 focus:outline-none ${
                    fieldErrors.feedback
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-rose-600'
                      : 'border-slate-300 bg-white focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {fieldErrors.feedback && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.feedback}</p>
              )}
            </div>

            {/* Submit / Update Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/40 disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{existingSubmission ? 'Saving Changes...' : 'Submitting Profile...'}</span>
                  </>
                ) : (
                  <>
                    {existingSubmission ? (
                      <Save className="h-5 w-5 transition-transform group-hover:scale-110" />
                    ) : (
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                    <span>{existingSubmission ? 'Save Changes' : 'Create Profile'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

