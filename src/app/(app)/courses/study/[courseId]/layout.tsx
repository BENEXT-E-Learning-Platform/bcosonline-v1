import { redirect } from 'next/navigation'
import { getClient } from '@/app/(app)/(authenticated)/_actions/getClient'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function checkEnrollment(userId: string, courseId: string) {
  try {
    const payload = await getPayload({ config: await configPromise })
    const enrollment = await payload.find({
      collection: 'participation',
      where: {
        and: [
          { client: { equals: userId } },
          { course: { equals: courseId } },
          { status: { equals: 'enrolled' } },
        ],
      },
      limit: 1,
    })
    return enrollment.docs.length > 0
  } catch (error) {
    console.error('Error checking enrollment:', error)
    return false
  }
}

export default async function StudyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { courseId: string }
}) {
  const session = await getClient()
  if (!session) {
    redirect('/login')
  }

  const courseId = params?.courseId
  if (!courseId) {
    redirect('/courses')
  }

  const hasAccess = await checkEnrollment(session.id.toString(), courseId)
  if (!hasAccess) {
    redirect(`/courses/${courseId}?error=not-enrolled`)
  }

  return <>{children}</>
}
