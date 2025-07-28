import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'admin'[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, hasRole } = useAuth()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated()
        setAuthenticated(isAuth)
      } catch (error) {
        setAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [isAuthenticated])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  if (requiredRole && !hasRole(requiredRole)) {
    // User is authenticated but doesn't have the required role
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
