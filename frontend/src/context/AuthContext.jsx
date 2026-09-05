import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [token, user])

  // Customer Login
  const customerLogin = async (email, password) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/customer/login', {
        email,
        password,
      })
      const { accessToken, user: userData } = response.data.data
      setToken(accessToken)
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // Customer Registration
  const customerRegister = async (email, password, confirmPassword) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/customer/register', {
        email,
        password,
        confirmPassword: confirmPassword || password,
      })
      return { success: true, data: response.data }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // Admin Login
  const adminLogin = async (email, password) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/admin/login', {
        email,
        password,
      })
      const { accessToken, user: userData } = response.data.data
      setToken(accessToken)
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Admin login failed. Please verify your credentials.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isCustomer: user?.role === 'CUSTOMER',
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    customerLogin,
    customerRegister,
    adminLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
