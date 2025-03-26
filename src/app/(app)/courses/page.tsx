// app/(app)/courses/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Course as PayloadCourse } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeaderServer from '../header/ClientHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BCOS - الدورات التدريبية',
  description: 'استكشف مجموعة متنوعة من الدورات المتخصصة لتطوير مهاراتك',
}

// Fetch all published courses with related data
async function getCourses(): Promise<PayloadCourse[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'courses',
    where: {
      state: {
        equals: 'published',
      },
    },
    depth: 2, // Fetch related data for instructor and coverPhoto
  })
  return result.docs as PayloadCourse[]
}

// Helper function to format time in hours and minutes
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}` : `${mins} دقيقة`
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <>
      <HeaderServer />
      <div className="min-h-screen bg-white to-white" dir="rtl">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-right text-[#91be3f]">
              الدورات التدريبية المتاحة
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              استكشف مجموعة متنوعة من الدورات المتخصصة لتطوير مهاراتك وتحقيق أهدافك المهنية
            </p>
          </div>

          {/* Categories/Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button className="bg-[#91be3f] text-white px-6 py-2 rounded-full font-medium hover:bg-[#7fa82e] transition">
              جميع الدورات
            </button>
            <button className="bg-white text-[#91be3f] px-6 py-2 rounded-full font-medium border border-[#91be3f] hover:bg-[#b8d77a] transition">
              الدورات المجانية
            </button>
            <button className="bg-white text-[#91be3f] px-6 py-2 rounded-full font-medium border border-[#91be3f] hover:bg-[#b8d77a] transition">
              الأكثر شعبية
            </button>
            <button className="bg-white text-[#91be3f] px-6 py-2 rounded-full font-medium border border-[#91be3f] hover:bg-[#b8d77a] transition">
              الجديدة
            </button>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const instructorName =
                typeof course.instructor === 'object'
                  ? course.instructor.name || 'مدرس متميز'
                  : 'مدرس متميز'

              const courseInfo = course.description?.infos || {
                numberOfVideos: 0,
                courseTime: 0,
                numberOfSections: 0,
              }

              const shortDescription =
                (course.description?.details?.overview?.[0]?.point?.root?.children?.[0]
                  ?.text as string) ||
                (course.description?.details?.challenges?.[0]?.point?.root?.children?.[0]
                  ?.text as string) ||
                'دورة تدريبية متميزة تساعدك على تطوير مهاراتك'

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-r from-[#91be3f] to-[#91be3f] overflow-hidden">
                    {typeof course.coverPhoto === 'object' && course.coverPhoto.url ? (
                      <Image
                        src={course.coverPhoto.sizes?.thumbnail?.url || '/placeholder-course.jpg'}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-3xl font-bold">
                        {course.title.charAt(0)}
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-white text-[#91be3f] px-3 py-1 rounded-full font-bold text-sm">
                      {course.isPaid === 'paid' ? `${course.price || 0} د.إ` : 'مجاني'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#b8d77a] flex items-center justify-center text-[#91be3f] text-sm font-bold ml-2">
                        {instructorName.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-600">{instructorName}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2">{shortDescription}</p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-[#91be3f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatTime(courseInfo.courseTime)}
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-[#91be3f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        {courseInfo.numberOfVideos} فيديو
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-[#91be3f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                        {courseInfo.numberOfSections} قسم
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/courses/study/${course.id}/${course.sections?.[0]?.order}`}
                        className="block w-full bg-[#91be3f] hover:bg-[#7fa82e] text-white text-center py-2 rounded-lg font-semibold transition-colors"
                      >
                        ابدأ التعلم الآن
                      </Link>
                      <Link
                        href={`/courses/${course.id}`}
                        className="block w-full bg-transparent border border-[#91be3f] text-[#91be3f] hover:bg-[#b8d77a] text-center py-2 rounded-lg font-semibold transition-colors"
                      >
                        معاينة الدورة
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
