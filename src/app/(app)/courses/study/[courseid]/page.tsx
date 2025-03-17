// app/(app)/courses/study/[courseid]/page.tsx
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
import { notFound } from 'next/navigation'
import { Course as ComponentCourse } from '@/collections/Courses/Courses'
import CourseStudyPageServer from './CourseStudyPage.server'

// Reuse the same converter function as detail page
function convertCourseType(payloadCourse: PayloadCourse): ComponentCourse {
  return {
    ...payloadCourse,
    id: String(payloadCourse.id),
  } as unknown as ComponentCourse
}

async function getCourseData(courseId: string) {
  const payload = await getPayload({ config: configPromise })
  let course: PayloadCourse | null = null

  try {
    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 2,
    })
    course = courseRes as unknown as PayloadCourse
  } catch (e) {
    console.error('Error fetching course:', e)
  }

  return course ? convertCourseType(course) : null
}

// Generate dynamic metadata for the study page
export async function generateMetadata({
  params,
}: {
  params: { courseid: string }
}): Promise<Metadata> {
  const course = await getCourseData(params.courseid)

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

export default async function CourseStudyPage({ params }: { params: { courseid: string } }) {
  const course = await getCourseData(params.courseid)

  if (!course) {
    notFound()
  }

  // Pass the courseId in params to match the expected props type
  return (
    <div className="w-full h-screen">
      <CourseStudyPageServer params={{ courseid: params.courseid }} />
    </div>
  )
}
