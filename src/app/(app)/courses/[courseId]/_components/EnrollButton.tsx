// components/EnrollButton.tsx (unchanged)
'use client'

import { useState } from 'react'

interface EnrollButtonProps {
  courseId: number
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleEnroll = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Enrollment failed')
      }

      setMessage(
        data.participation.status === 'enrolled'
          ? 'Successfully enrolled!'
          : 'Enrollment pending approval.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        className="w-full bg-white border border-[#253b74] text-[#253b74] py-3 rounded-lg font-semibold hover:bg-[#253b74]/10 transition-colors"
        onClick={handleEnroll}
        disabled={loading}
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
