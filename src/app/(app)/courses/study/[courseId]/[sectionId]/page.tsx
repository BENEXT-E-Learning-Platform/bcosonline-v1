// app/(app)/courses/study/[courseid]/[sectionid]/page.tsx
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course as PayloadCourse } from '@/payload-types'
import CourseStudyPageClient from './CourseStudyPage.client'

// Fetch course and section data
async function getCourseAndSectionData(courseId: string, sectionId: number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 4, // Adjust depth as needed
    })

    const course = courseRes as PayloadCourse

    // Find the specific section
    // const section = course.sections?.find((section) => section.order === sectionId)
    const section = course.sections?.[sectionId]

    if (!section) {
      throw new Error('Section not found')
    }

    return { course, section }
  } catch (e) {
    console.error('Error fetching course or section:', e)
    return null
  }
}

// Generate dynamic metadata for the section page
export async function generateMetadata({
  params,
}: {
  params: { courseId: string; sectionId: number }
}): Promise<Metadata> {
  const { courseId, sectionId } = await params
  const data = await getCourseAndSectionData(courseId, sectionId)

  if (!data) {
    return {
      title: 'BCOS - الدورة غير موجودة',
    }
  }

  return {
    title: `BCOS - ${data.course.title} - ${data.section.title}`,
    description: `منصة التعلم لدورة ${data.course.title} - ${data.section.title} - BCOS`,
  }
}

export default async function CourseSectionPage({
  params,
}: {
  params: { courseId: string; sectionId: number }
}) {
  const { courseId, sectionId } = await params
  const data = await getCourseAndSectionData(courseId, sectionId)

  if (!data) {
    return <div>Course or section not found</div>
  }

  return (
    <div className="w-full h-screen">
      <CourseStudyPageClient course={data.course} section={data.section} />
    </div>
  )
}
