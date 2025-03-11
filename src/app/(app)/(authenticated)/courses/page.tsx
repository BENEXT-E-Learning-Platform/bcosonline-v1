import { CoursesContent } from '../components/courses-content'
import { getCourses } from '../components/courses-data'
import { DashboardLayout } from '../components/dashboard-layout'

export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <DashboardLayout>
      <CoursesContent initialCourses={courses} />
    </DashboardLayout>
  )
}
