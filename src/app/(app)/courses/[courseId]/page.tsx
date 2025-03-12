// src/app/(app)/course-list/[courseId]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
import { Course as ComponentCourse } from '@/collections/Courses/Courses'
import CourseDetail from '../_components/CourseDetail'
import { notFound } from 'next/navigation'

// Create a type converter function
function convertCourseType(payloadCourse: PayloadCourse): ComponentCourse {
  return {
    ...payloadCourse,
    id: String(payloadCourse.id), // Convert id to string
    // Add any other field conversions needed here
  } as unknown as ComponentCourse
}

// This replaces getServerSideProps in App Router
async function getCourseData(courseId: string) {
  const payload = await getPayload({ config: configPromise })
  let course: PayloadCourse | null = null

  try {
    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
    })
    course = courseRes as unknown as PayloadCourse
  } catch (e) {
    console.error('Error fetching course:', e)
  }

  return course ? convertCourseType(course) : null
}

// Server Component
export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = await getCourseData(params.courseId)

  // If course is null, return a 404 page
  if (!course) {
    notFound()
  }

  // Pass the course data to your client component
  return <CourseDetail course={course} />
}