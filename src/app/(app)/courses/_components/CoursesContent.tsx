'use client'

import { Course } from '@/collections/Courses/Courses'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CoursesContentProps {
  courses: Course[]
  onCourseSelect?: (course: Course) => void
}

const CoursesContent: React.FC<CoursesContentProps> = ({ courses, onCourseSelect }) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      // Text search
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      if (filter === 'all') return matchesSearch
      if (filter === 'free' && course.isPaid === 'free') return matchesSearch
      if (filter === 'paid' && course.isPaid === 'paid') return matchesSearch
      if (filter === 'published' && course.state === 'published') return matchesSearch
      return false
    })
    .sort((a, b) => {
      // Sort options
      if (sort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sort === 'a-z') {
        return a.title.localeCompare(b.title)
      }
      if (sort === 'z-a') {
        return b.title.localeCompare(a.title)
      }
      return 0
    })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#253b74]">Courses</h1>
          <p className="text-gray-600">Discover your next learning opportunity</p>
          <div className="w-16 h-1 bg-[#91be3f] rounded-full mt-2"></div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#91be3f] focus:border-[#91be3f] transition-all duration-300"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#91be3f] focus:border-[#91be3f] transition-all duration-300"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="published">Published</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#91be3f] focus:border-[#91be3f] transition-all duration-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden h-96 animate-pulse"
            >
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-gray-100 rounded p-2 h-14"></div>
                  <div className="bg-gray-100 rounded p-2 h-14"></div>
                  <div className="bg-gray-100 rounded p-2 h-14"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-md w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-gray-50 rounded-xl shadow-inner"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-[#253b74]">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you are looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilter('all')
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              Clear filters
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course) => (
            <motion.div
              variants={item}
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
              onClick={() => {
                if (onCourseSelect) onCourseSelect(course)
                router.push(`/courses/${course.id}`)
              }}
            >
              <div className="relative">
                <Image
                  src="/api/placeholder/400/250"
                  alt={course.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-2 right-2 flex space-x-1">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.state === 'published'
                        ? 'bg-[#91be3f]/20 text-[#91be3f]'
                        : course.state === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    } backdrop-blur-sm`}
                  >
                    {course.state.charAt(0).toUpperCase() + course.state.slice(1)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-[#253b74]/90 to-transparent">
                  {course.isPaid === 'paid' ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm">
                      ${course.price}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#91be3f]/20 text-white backdrop-blur-sm">
                      Free
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-[#253b74] truncate group-hover:text-[#91be3f] transition-colors duration-300">
                  {course.title}
                </h3>

                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-[#253b74]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>
                    {typeof course.instructor === 'object'
                      ? course.instructor.id
                      : course.instructor}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-[#91be3f]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8V12L14 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>
                      {Math.floor(course.description.infos.courseTime / 60)}h{' '}
                      {course.description.infos.courseTime % 60}m
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-[#91be3f]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 6.25278V19.2528M12 6.25278L6.25 10.0028M12 6.25278L17.75 10.0028"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{course.sections.length} sections</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#253b74]/5 rounded-lg p-2 transition-all duration-300 hover:bg-[#253b74]/10">
                    <div className="font-semibold text-[#253b74]">
                      {course.description.infos.numberOfVideos}
                    </div>
                    <div className="text-gray-500">Videos</div>
                  </div>
                  <div className="bg-[#253b74]/5 rounded-lg p-2 transition-all duration-300 hover:bg-[#253b74]/10">
                    <div className="font-semibold text-[#253b74]">
                      {course.description.infos.numberOfPracticalFiles}
                    </div>
                    <div className="text-gray-500">Files</div>
                  </div>
                  <div className="bg-[#253b74]/5 rounded-lg p-2 transition-all duration-300 hover:bg-[#253b74]/10">
                    <div className="font-semibold text-[#253b74]">
                      {course.description.infos.numberOfPracticalExamples}
                    </div>
                    <div className="text-gray-500">Examples</div>
                  </div>
                </div>

                <button className="w-full mt-5 bg-[#253b74] hover:bg-[#253b74]/90 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 group-hover:bg-[#91be3f] hover:shadow-md">
                  {course.isPaid === 'paid' ? `Enroll for $${course.price}` : 'Enroll for Free'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <button className="px-5 py-2.5 border border-[#91be3f] text-[#91be3f] rounded-lg text-sm font-medium bg-white hover:bg-[#91be3f] hover:text-white transition-all duration-300 flex items-center space-x-2 hover:shadow-md">
            <span>Load More Courses</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(180 12 12)"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default CoursesContent
