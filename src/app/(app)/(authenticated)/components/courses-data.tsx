// src/app/(app)/(authenticated)/components/courses-data.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course } from '@/payload-types'

export async function getCourses() {
  const payload = await getPayload({ config: configPromise })

  try {
    const coursesRes = await payload.find({
      collection: 'courses',
      depth: 2,
      limit: 100,
      sort: '-createdAt',
    })

    return coursesRes.docs
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const course = await payload.findByID({
      collection: 'courses',
      id,
      depth: 2, // Keep consistent with getCourses depth
    })

    return course as Course
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error)
    return null
  }
}
