// app/(app)/courses/study/[courseid]/CourseStudyPage.server.tsx
'use server'

import { notFound, redirect } from 'next/navigation'
import { Course as PayloadCourse } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CourseStudyPageClient from './CourseStudyPage.client'

export async function fetchCommentsForLesson(params: {
  courseId: number
  lessonId: string
  sectionIndex: number
  lessonIndex: number
}) {
  console.log('Fetching comments for lesson with params:', params)

  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized successfully')

  const commentsResult = await payload.find({
    collection: 'comments',
    where: {
      and: [
        {
          course: {
            equals: params.courseId,
          },
        },
        {
          lessonId: {
            equals: params.lessonId,
          },
        },
        {
          sectionIndex: {
            equals: params.sectionIndex,
          },
        },
        {
          lessonIndex: {
            equals: params.lessonIndex,
          },
        },
        {
          status: {
            equals: 'approved',
          },
        },
      ],
    },
    sort: '-createdAt',
  })

  console.log(`Found ${commentsResult.docs.length} comments for the lesson`)

  return commentsResult.docs
}

export async function createComment(params: {
  content: string
  courseId: string | number
  lessonId: string
  sectionIndex: number
  lessonIndex: number
}) {
  const payload = await getPayload({ config: configPromise })

  await payload.create({
    collection: 'comments',
    data: {
      content: params.content,
      course: typeof params.courseId === 'string' ? parseInt(params.courseId, 10) : params.courseId,
      sectionIndex: params.sectionIndex,
      lessonIndex: params.lessonIndex,
      lessonId: params.lessonId,
      lessonPath: `${params.sectionIndex}.${params.lessonIndex}`,
      status: 'pending',
    },
  })
}

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

export default async function CourseStudyPageServer({
  params,
}: {
  params: { courseId: string; sectionId: string }
}) {
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

    const sectionIndex = parseInt(params.sectionId, 10)
    const section = processedCourse.sections?.[sectionIndex]

    if (!section) {
      notFound()
    }

    return <CourseStudyPageClient course={processedCourse} section={section} />
  } catch (error) {
    console.error('Error in CourseStudyPageServer:', error)
    notFound()
  }
}
