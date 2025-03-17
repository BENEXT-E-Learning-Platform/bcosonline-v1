'use client'

import { useEffect, useState } from 'react'
import { IndividualAccount } from '@/payload-types'
import Header from './Header'

export default function ClientHeader() {
  const [user, setUser] = useState<IndividualAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use the correct collection endpoint for your custom user collection
    fetch('/api/individualAccount/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user')
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error)
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Return the Header component with user data
  return <Header user={user} />
}
