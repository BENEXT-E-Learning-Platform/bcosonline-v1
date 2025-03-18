// app/(app)/courses/study/[courseId]/page.tsx
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
//import { notFound } from 'next/navigation'
import CourseStudyPageServer from './CourseStudyPage.server'

// Reuse the same converter function as detail page

async function getCourseData(courseId: string) {
  const payload = await getPayload({ config: configPromise })
  let course: PayloadCourse

  try {
    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 2,
    })
    course = courseRes as PayloadCourse
    return course
  } catch (e) {
    console.error('Error fetching course:', e)
  }
}

// Generate dynamic metadata for the study page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>
}): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourseData(courseId)

  if (!course) {
    return {
      title: 'BCOS - الدورة غير موجودة',
    }
  }

  return {
    title: `BCOS - ${course.title}`,
    description: `منصة التعلم لدورة ${course.title} - BCOS`,
  }
}

export default async function CourseStudyPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  console.log('Params received:', params)
  const { courseId } = await params
  const course = await getCourseData(courseId)

  // if (!course) {
  //  notFound()
  //}

  // Pass the courseId in params to match the expected props type
  return (
    <div className="w-full h-screen">
      <CourseStudyPageServer params={{ courseId: String(course?.id) }} />
    </div>
  )
}
