// app/(app)/courses/[courseId]/page.tsx - Course details/preview page
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
import { notFound } from 'next/navigation'
import CourseDetail from './_components/CourseDetail'
import { Course as ComponentCourse } from '@/collections/Courses/Courses'
import { Metadata } from 'next'

// Convert payload course to component course
function convertCourseType(payloadCourse: PayloadCourse): ComponentCourse {
  return {
    ...payloadCourse,
    id: String(payloadCourse.id),
    // Add any other field conversions needed here
  } as unknown as ComponentCourse
}

export async function generateMetadata({
  params,
}: {
  params: { courseId: string }
}): Promise<Metadata> {
  const course = await getCourseData(params.courseId)

  if (!course) {
    return {
      title: 'BCOS - الدورة غير موجودة',
    }
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

// Fetch course data
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

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = await getCourseData(params.courseId)

  if (!course) {
    notFound()
  }

  return <CourseDetail course={course} />
}
