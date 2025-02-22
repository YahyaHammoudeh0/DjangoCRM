import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return { isAuthenticated }
}
