// app/(app)/courses/[courseId]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
import { notFound } from 'next/navigation'
import CourseDetail from './_components/CourseDetail'
import { Metadata } from 'next'

async function getCourseData(courseId: string): Promise<PayloadCourse | undefined> {
  const payload = await getPayload({ config: configPromise })
  try {
    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 2,
    })
    return courseRes as unknown as PayloadCourse
  } catch (e) {
    console.error('Error fetching course:', e)
    return undefined
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>
}): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourseData(courseId)

  if (!course) {
    return { title: 'BCOS - الدورة غير موجودة' }
  }

  return {
    title: `BCOS - ${course.title}`,
    description:
      typeof course.description?.details?.overview?.[0]?.point?.root?.children?.[0]?.text ===
      'string'
        ? course.description.details.overview[0].point.root.children[0].text
        : 'دورة تدريبية متميزة من BCOS',
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await getCourseData(courseId)

  if (!course) {
    notFound()
  }

  return <CourseDetail course={course} />
}
