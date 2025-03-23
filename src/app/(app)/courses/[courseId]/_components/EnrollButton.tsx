'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getClient } from '@/app/(app)/(authenticated)/_actions/getClient'

interface EnrollButtonProps {
  courseId: string
  firstSectionId: string
}
export default function EnrollButton({ courseId, firstSectionId }: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    'not-enrolled' | 'pending' | 'enrolled' | null
  >(null)
  const [message, setMessage] = useState<string | null>(null)

  // Check enrollment status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/enroll/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        })
        const data = await response.json()
        setEnrollmentStatus(data.status || 'not-enrolled')
      } catch (error) {
        console.error('Error checking enrollment:', error)
        setEnrollmentStatus('not-enrolled')
      }
    }
    checkStatus()
  }, [courseId])

  const handleEnroll = async () => {
    const session = await getClient()
    if (!session) {
      router.push('/login')
      return
    }

    if (enrollmentStatus === 'pending') {
      setMessage('طلب تسجيلك قيد المعالجة')
      return
    }

    if (enrollmentStatus === 'enrolled' && firstSectionId) {
      router.push(`/courses/study/${courseId}/${firstSectionId}`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setEnrollmentStatus(data.status)
      if (data.status === 'enrolled' && firstSectionId) {
        router.push(`/courses/study/${courseId}/${firstSectionId}`)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'حدث خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
        enrollmentStatus === 'enrolled'
          ? 'bg-green-600 hover:bg-green-700'
          : enrollmentStatus === 'pending'
            ? 'bg-yellow-500'
            : 'bg-blue-600 hover:bg-blue-700'
      } text-white`}
    >
      {loading
        ? 'جاري المعالجة...'
        : enrollmentStatus === 'enrolled'
          ? 'ابدأ التعلم'
          : enrollmentStatus === 'pending'
            ? 'قيد المعالجة'
            : 'سجل الآن'}
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </button>
  )
}
