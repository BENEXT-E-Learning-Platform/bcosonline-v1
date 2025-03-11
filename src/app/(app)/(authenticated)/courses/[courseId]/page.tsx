import { CourseDetail } from '../../components/course-detail'
import { getCourseById } from '../../components/courses-data'
import { DashboardLayout } from '../../components/dashboard-layout'

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourseById(params.courseId)
  return (
    <DashboardLayout>
      <CourseDetail course={course} />
    </DashboardLayout>
  )
}
