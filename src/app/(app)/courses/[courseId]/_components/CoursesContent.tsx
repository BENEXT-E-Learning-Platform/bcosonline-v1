'use client'

import { Course } from '@/payload-types'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CourseDetailProps {
  course: Course
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      {/* Course Preview Image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg mb-8"
      >
        {typeof course.coverPhoto === 'object' && course.coverPhoto.sizes?.thumbnail?.url && (
          <Image
            src={course.coverPhoto.sizes?.thumbnail?.url || '/placeholder-course.jpg'}
            alt={course.title}
            width={course.coverPhoto.sizes?.thumbnail?.width || 500}
            height={course.coverPhoto.sizes?.thumbnail?.height || 500}
            objectFit="cover"
            className="transition-transform duration-700 hover:scale-105"
          />
        )}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Course Details and Sections */}
        <div className="md:col-span-2">
          {/* Course Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#253b74] mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">
              {course.description?.details?.overview?.[0]?.point?.root?.children?.[0]?.text &&
              typeof course.description.details.overview[0].point.root.children[0].text === 'string'
                ? course.description.details.overview[0].point.root.children[0].text
                : ''}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                المدرب:{' '}
                {typeof course.instructor === 'object' ? course.instructor.id : course.instructor}
              </span>
              <span>المدة: {course.description.infos.courseTime} دقيقة</span>
              <span>المستوى: مبتدئ</span>
            </div>
          </motion.div>

          {/* Course Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {course.sections?.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-[#253b74]">{section.title}</h3>
                {section.description && <p className="text-gray-600 mt-2">{section.description}</p>}
                {/* Lessons within the section */}
                {section.lessons && (
                  <div className="mt-4 space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center space-x-2 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 7C11.45 7 11 7.45 11 8V12C11 12.55 11.45 13 12 13H15C15.55 13 16 12.55 16 12C16 11.45 15.55 11 15 11H13V8C13 7.45 12.55 7 12 7Z"
                          />
                        </svg>
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Enrollment and Details */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sticky top-8 space-y-4"
          >
            {/* Price and Enrollment Button */}
            <div className="bg-gradient-to-br from-[#253b74]/95 to-[#253b74]/75 text-white rounded-xl p-6 text-center">
              <p className="text-2xl font-bold mb-2">
                {course.isPaid === 'paid' ? `$${course.price}` : 'مجانا'}
              </p>
              <button className="w-full bg-white text-[#253b74] py-2.5 px-4 rounded-lg font-semibold hover:bg-[#253b74]/10 transition-colors">
                سجل الآن
              </button>
            </div>

            {/* Course Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-[#253b74] mb-4">تفاصيل الدورة</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>عدد الفيديوهات:</span>
                  <span>{course.description.infos.numberOfVideos}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الأقسام:</span>
                  <span>{course.description.infos.numberOfSections}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الملفات العملية:</span>
                  <span>{course.description.infos.numberOfPracticalFiles}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الأمثلة العملية:</span>
                  <span>{course.description.infos.numberOfPracticalExamples}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
