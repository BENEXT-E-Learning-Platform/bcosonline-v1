// app/(app)/courses/study/[courseid]/CourseStudyPage.server.tsx
import { notFound, redirect } from 'next/navigation'
import { Course as PayloadCourse } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CourseStudyPageClient from './CourseStudyPage.client'

// Fetch course data
async function getCourseData(courseId: string): Promise<PayloadCourse | null> {
  // Validate courseId format first

  try {
    const payload = await getPayload({ config: configPromise })

    const courseRes = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 5, // Increase depth for nested relationships
    })

    return courseRes as unknown as PayloadCourse
  } catch (e) {
    console.error('Error fetching course:', e)
    return null
  }
}

export default async function CourseStudyPageServer({ params }: { params: { courseId: string } }) {
  console.log('Course ID from params:', params.courseId)

  try {
    // Handle potential course ID format issues
    const courseId = params.courseId

    // If the URL param is numeric but doesn't match the actual course ID format
    // This is a fix for when the URL shows /2 but the actual ID is 5
    if (!isNaN(Number(courseId))) {
      // Optional: You can add a mapping here if needed
      // For example, if courseId "2" should actually be "5":
      // const courseIdMap = { '2': '5', '3': '6', ... };
      // if (courseIdMap[courseId]) courseId = courseIdMap[courseId];
    }

    const course = await getCourseData(courseId)

    if (!course) {
      console.error('Course not found:', courseId)
      notFound()
    }

    // Check if the URL parameter doesn't match the actual course ID
    // This ensures the URL always reflects the correct course ID
    if (params.courseId !== String(course.id) && course.id) {
      console.log(`Redirecting from incorrect ID ${params.courseId} to correct ID ${course.id}`)
      redirect(`/courses/study/${course.id}`)
      return null
    }

    // Preprocess course data to ensure proper formatting
    const processedCourse = {
      ...course,
      sections: course.sections?.map((section) => ({
        ...section,
        lessons: section.lessons?.map((lesson) => ({
          ...lesson,
          contentItems: lesson.contentItems?.map((item) => {
            if (item.blockType === 'videoContent' && item.videoFile) {
              console.log(`Processing video file: ${JSON.stringify(item.videoFile)}`)
              return item
            }
            return item
          }),
        })),
      })),
    }

    return <CourseStudyPageClient course={processedCourse} />
  } catch (error) {
    console.error('Error in CourseStudyPageServer:', error)
    notFound()
  }
}
