import { getCourses } from '../components/courses-data'
import { DashboardContent } from '../components/dashboard-content'
import { DashboardLayout } from '../components/dashboard-layout'

export default async function DashboardPage() {
  const courses = await getCourses()

  return (
    <DashboardLayout>
      <DashboardContent initialCourses={courses} />
    </DashboardLayout>
  )
}
