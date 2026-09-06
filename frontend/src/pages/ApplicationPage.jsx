import { useState } from 'react'
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
  Sparkles,
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessData(null)
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.post('/submissions/submit', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim(),
        feedback: formData.feedback.trim() || undefined,
      })

      setSuccessData(response.data?.data || { message: 'Application submitted successfully.' })
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        gender: 'MALE',
        mobileNumber: '',
        address: '',
        feedback: '',
      })
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Failed to submit application. Please check your details.'
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

    // Prevent numbers & special characters in name inputs
    const handleNameChange = (field) => (e) => {
        const sanitized = e.target.value.replace(/[^a-zA-Z\s'-]/g, '')
        setFormData((prev) => ({ ...prev, [field]: sanitized }))
    }

    // Prevent letters & symbols in the phone number input (keeps numbers and optional leading +)
    const handlePhoneChange = (e) => {
        const rawValue = e.target.value
        // Allows an optional '+' only at the start, followed strictly by digits
        let sanitized = rawValue.replace(/[^0-9+]/g, '')
        if (sanitized.indexOf('+') > 0) {
            sanitized = sanitized.replace(/\+/g, '')
        }
        setFormData((prev) => ({ ...prev, mobileNumber: sanitized }))
    }


  return (
    <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-cyan-200/30 blur-[130px]" />

      <div className="mx-auto max-w-3xl">
        {/* Header section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Update Customer Profile</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-['Outfit']">
            Profile Details
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Please fill out all required details accurately to create your profile.
          </p>
        </div>

        {/* Success Alert */}
        {successData && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Profile Updated Successfully!
                </h3>
                <p className="mt-1 text-sm text-emerald-700">
                  Your profile has been updated successfully.
                </p>
                {successData.submissionId && (
                  <p className="mt-2 text-xs font-mono text-emerald-800">
                    Reference ID: #{successData.submissionId}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                >
                  Update your profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMessage}</span>
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
                    value={formData.firstName}
                    onChange={handleNameChange('firstName')}
                    placeholder="John"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
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
                    value={formData.lastName}
                    onChange={handleNameChange('lastName')}
                    placeholder="Doe"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 px-4 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
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
                  value={formData.mobileNumber}
                  onChange={handlePhoneChange}
                  placeholder="0712345678 or +94712345678"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                07XXXXXXXX or +947XXXXXXXX
              </p>
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
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Feedback */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Feedback / Comments (Optional)
                </label>
                <span className="text-xs text-slate-500">{formData.feedback.length} / 1000</span>
              </div>
              <div className="relative">
                <MessageSquare className="pointer-events-none absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
                <textarea
                  name="feedback"
                  rows={4}
                  maxLength={1000}
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Optional details, notes, or feedback..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/40 disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <span>Update Profile</span>
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
