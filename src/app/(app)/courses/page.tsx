// src/app/(app)/course-list/page.tsx
"use client"; // Keep this as a client component

import React, { useEffect, useState } from 'react';
import { Course as ComponentCourse } from '@/collections/Courses/Courses';
import CoursesContent from './_components/CoursesContent';
import { fetchCourses } from './_actions/getCoursesData';

export default function CourseListPage() {
  const [courses, setCourses] = useState<ComponentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses data on component mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await fetchCourses(); // Call the server action
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoursesContent 
        courses={courses} 
        onCourseSelect={() => {}} 
      />
    </div>
  );
}