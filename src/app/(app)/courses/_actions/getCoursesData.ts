'use server';

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { Course as PayloadCourse } from '@/payload-types';
import { Course as ComponentCourse } from '@/collections/Courses/Courses';

// Convert PayloadCourse to ComponentCourse
function convertCourseType(payloadCourse: PayloadCourse): ComponentCourse {
  return {
    ...payloadCourse,
    id: String(payloadCourse.id), // Convert id to string
    // Add any other field conversions needed here
  } as unknown as ComponentCourse;
}

// Fetch all courses from Payload CMS
export async function getCoursesData(): Promise<ComponentCourse[]> {
  const payload = await getPayload({ config: configPromise });
  let courses: PayloadCourse[] = [];

  try {
    const coursesRes = await payload.find({
      collection: 'courses',
      limit: 100,
    });
    courses = coursesRes.docs as unknown as PayloadCourse[];
  } catch (e) {
    console.error('Error fetching courses:', e);
  }

  // Convert each course to the component-compatible type
  return courses.map(course => convertCourseType(course));
}

export async function fetchCourses(): Promise<ComponentCourse[]> {
    return getCoursesData();
  }