// app/(app)/courses/study/[courseid]/[sectionid]/CourseStudyPage.client.tsx
'use client'
import { useState, useEffect } from 'react'
import { Course } from '@/payload-types'
import { ChevronRight, ChevronLeft, CheckCircle, Circle, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import gravatar from 'gravatar'
import { createComment, fetchCommentsForLesson } from './CourseStudyPage.server'
import { Comment as PayloadComment } from '@/payload-types'
import ContentItemRenderer from './itemRenderer'

interface CourseStudyPageClientProps {
  course: Course
  section: NonNullable<Course['sections']>[number]
}
interface ExtendedContentItem {
  id: string
  blockType: string
  title?: string
  description?: string
  videoUrl?: string
  pdfUrl?: string
  excelUrl?: string
  docUrl?: string
  fileName?: string
  fileType?: string
  question?: string
  options?: { text: string; isCorrect: boolean; feedback?: string }[]
  explanation?: string
  questionType?: 'single' | 'multiple'
}
const extractFileInfo = (
  fileData: any,
  defaultType: string = '',
): { fileName: string; fileType: string } => {
  let fileName = ''
  let fileType = defaultType

  // If it's a full URL, use it directly
  if (typeof fileData === 'string' && (fileData.startsWith('http') || fileData.startsWith('/'))) {
    fileName = fileData

    // Try to determine file type from extension if not provided
    if (!fileType) {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (extension) {
        if (['pdf'].includes(extension)) fileType = 'pdf'
        else if (['xlsx', 'xls', 'csv'].includes(extension)) fileType = 'excel'
        else if (['doc', 'docx'].includes(extension)) fileType = 'word'
        else if (['mp4', 'webm', 'mov'].includes(extension)) fileType = 'video'
      }
    }
  }
  // Handle object formats (e.g., file objects with URL or filename properties)
  else if (typeof fileData === 'object' && fileData !== null) {
    if ('url' in fileData && fileData.url) {
      fileName = fileData.url
    } else if ('filename' in fileData && fileData.filename) {
      fileName = fileData.filename
    }

    // Try to determine file type from extension if not provided
    if (!fileType && fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (extension) {
        if (['pdf'].includes(extension)) fileType = 'pdf'
        else if (['xlsx', 'xls', 'csv'].includes(extension)) fileType = 'excel'
        else if (['doc', 'docx'].includes(extension)) fileType = 'word'
        else if (['mp4', 'webm', 'mov'].includes(extension)) fileType = 'video'
      }
    }
  }

  return { fileName, fileType }
}
const CourseStudyPageClient = ({ course, section }: CourseStudyPageClientProps) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState<PayloadComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [expandedSection, setExpandedSection] = useState<number | null>(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // Save progress to localStorage
  useEffect(() => {
    if (course) {
      localStorage.setItem(
        `course-progress-${course.id}`,
        JSON.stringify({
          sectionId: section.order,
          lessonIndex: currentLessonIndex,
          completedLessons: Array.from(completedLessons),
        }),
      )
    }
  }, [currentLessonIndex, completedLessons, course, section])

  // Load progress from localStorage
  useEffect(() => {
    if (course) {
      const savedProgress = localStorage.getItem(`course-progress-${course.id}-${section.order}`)
      if (savedProgress) {
        const { lessonIndex, completedLessons: savedCompletedLessons } = JSON.parse(savedProgress)
        setCurrentLessonIndex(lessonIndex)
        setCompletedLessons(new Set(savedCompletedLessons))
      }
    }
  }, [course, section])

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!section?.lessons) return 0

    let completedItems = 0
    let totalItems = 0
    type Lesson = NonNullable<NonNullable<Course['sections']>[number]['lessons']>[number]

    section.lessons?.forEach((lesson: Lesson, lIndex: number) => {
      totalItems++
      const lessonId = `${section.id}-${lIndex}`
      if (completedLessons.has(lessonId)) {
        completedItems++
      }
    })

    return totalItems > 0 ? Math.floor((completedItems / totalItems) * 100) : 0
  }

  // Mark a lesson as completed
  const markLessonAsCompleted = () => {
    const lessonId = `${section.id}-${currentLessonIndex}`
    setCompletedLessons((prev) => new Set(prev).add(lessonId))
  }

  // Navigation handlers
  const navigateToPrevious = () => {
    if (!section?.lessons) return
    setIsLoading(true)

    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }

    // Simulate loading time for content transition
    setTimeout(() => setIsLoading(false), 300)
  }

  const navigateToNext = () => {
    if (!section?.lessons) return
    setIsLoading(true)

    if (currentLessonIndex < section.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }

    // Simulate loading time for content transition
    setTimeout(() => setIsLoading(false), 300)
  }

  const navigateToSection = (sectionOrder: number) => {
    window.location.href = `/courses/study/${course.id}/${sectionOrder}`
  }
  const handleSectionClick = (sectionIndex: number, sectionOrder: number) => {
    setExpandedSection(sectionOrder)
    navigateToSection(sectionOrder)
  }

  const currentLesson = section?.lessons?.[currentLessonIndex] ?? {
    title: '',
    description: '',
    contentItems: [],
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const progress = calculateProgress()

  // Handle comment submission
  const [commentStatus, setCommentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle',
  )

  const fetchComments = async () => {
    if (course) {
      try {
        const currentLesson = section?.lessons?.[currentLessonIndex]

        if (!currentLesson?.id) {
          console.error('Lesson ID not found')
          setComments([])
          return
        }

        const comments = await fetchCommentsForLesson({
          courseId: course.id,
          lessonId: currentLesson.id,
          sectionIndex: 0, // Since we're fetching per section, sectionIndex is not needed
          lessonIndex: currentLessonIndex,
        })

        setComments(Array.isArray(comments) ? comments : [])
      } catch (error) {
        console.error('Error fetching comments:', error)
        setComments([])
      }
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    setCommentStatus('pending')

    const currentLesson = section?.lessons?.[currentLessonIndex]
    const lessonId = currentLesson?.id

    if (!lessonId) {
      console.error('Lesson ID not found')
      setCommentStatus('error')
      return
    }

    try {
      await createComment({
        content: newComment,
        courseId: course.id,
        lessonId: lessonId,
        sectionIndex: 0, // Since we're fetching per section, sectionIndex is not needed
        lessonIndex: currentLessonIndex,
      })

      setNewComment('')
      setCommentStatus('success')
      fetchComments() // Refresh comments list
    } catch (error) {
      console.error('Error submitting comment:', error)
      setCommentStatus('error')
    }
  }

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden" dir="rtl">
      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50"
        style={{
          transition: 'margin-right 0.3s',
          marginRight: sidebarOpen ? '18rem' : '0',
        }}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100 ml-2">
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold">{currentLesson.title || 'درس بدون عنوان'}</h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            height: 'calc(100vh - 64px - 120px)', // Fixed height to fit between header and progress bar
          }}
        >
          {/* Lesson Content */}
          <div className="p-6">
            <div className="w-full">
              {currentLesson.contentItems ? (
                currentLesson.contentItems.map((contentItem: any) => {
                  // Extract file information based on block type
                  let fileInfo = {
                    fileName: '',
                    fileType: '',
                  }

                  // Handle video files
                  if (contentItem.blockType === 'videoContent' && contentItem.videoFile) {
                    fileInfo = extractFileInfo(contentItem.videoFile, 'video')
                  }
                  // Handle PDF files
                  else if (contentItem.blockType === 'pdfContent' && contentItem.pdfFile) {
                    fileInfo = extractFileInfo(contentItem.pdfFile, 'pdf')
                  }
                  // Handle Word documents
                  else if (contentItem.blockType === 'docContent' && contentItem.docFile) {
                    fileInfo = extractFileInfo(contentItem.docFile, 'word')
                  }
                  // Handle generic file content (determine type from extension)
                  else if (contentItem.blockType === 'excelContent' && contentItem.excelFile) {
                    fileInfo = extractFileInfo(contentItem.excelFile, 'excel')
                  }
                  // Add more comprehensive file detection logic
                  else if (contentItem.blockType === 'fileContent' && contentItem.file) {
                    const potentialFileInfo = extractFileInfo(contentItem.file)

                    // If it's an Excel file extension, explicitly set the type
                    const fileName =
                      typeof contentItem.file === 'string'
                        ? contentItem.file
                        : contentItem.file?.url || contentItem.file?.filename || ''

                    if (fileName.match(/\.(xlsx|xls|csv)$/i)) {
                      potentialFileInfo.fileType = 'excel'
                    }

                    fileInfo = potentialFileInfo
                  }

                  // Create the adapted content item with all possible file properties
                  const adaptedContentItem: ExtendedContentItem = {
                    id: contentItem.id || '',
                    blockType: contentItem.blockType,
                    title:
                      contentItem.blockType === 'quizQuestion'
                        ? contentItem.question
                        : contentItem.title || '',
                    description:
                      contentItem.blockType === 'quizQuestion'
                        ? contentItem.explanation || ''
                        : contentItem.description || '',
                    videoUrl:
                      contentItem.blockType === 'videoContent' ? fileInfo.fileName : undefined,
                    pdfUrl: contentItem.blockType === 'pdfContent' ? fileInfo.fileName : undefined,
                    excelUrl:
                      contentItem.blockType === 'excelContent' ? fileInfo.fileName : undefined,
                    docUrl: contentItem.blockType === 'docContent' ? fileInfo.fileName : undefined,
                    fileName: fileInfo.fileName || '',
                    fileType: fileInfo.fileType || '',
                    // Add quiz-specific fields
                    question:
                      contentItem.blockType === 'quizQuestion' ? contentItem.question : undefined,
                    options:
                      contentItem.blockType === 'quizQuestion' ? contentItem.options : undefined,
                    explanation:
                      contentItem.blockType === 'quizQuestion'
                        ? contentItem.explanation
                        : undefined,
                    questionType:
                      contentItem.blockType === 'quizQuestion'
                        ? contentItem.questionType
                        : undefined,
                  }

                  return (
                    <ContentItemRenderer key={adaptedContentItem.id} item={adaptedContentItem} />
                  )
                })
              ) : (
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">لا يوجد محتوى لهذا الدرس</div>
                </div>
              )}
            </div>

            {/* Updated Comments Section */}
            <div className="mt-8 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-3">التعليقات</h3>
              {/* Notice about comment moderation */}
              <div className="mb-4 bg-blue-50 p-3 rounded-md text-xs text-blue-700 border border-blue-100">
                <p>سيتم مراجعة التعليقات قبل نشرها. يرجى الالتزام بقواعد المجتمع.</p>
              </div>

              {/* Comments list */}
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <p className="text-gray-500 text-center py-4">جاري تحميل التعليقات...</p>
                ) : !comments || comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد تعليقات حتى الآن.</p>
                ) : (
                  comments.map((comment) => {
                    console.log('Rendering comment:', comment) // Debug log

                    if (typeof comment?.createdBy === 'object' && comment.createdBy !== null)
                      return (
                        <div
                          key={comment.id}
                          className="bg-gray-50 p-3 rounded-md border border-gray-100 flex items-start"
                        >
                          <Image
                            src={gravatar.url(comment?.createdBy?.email, {
                              s: '32',
                              d: 'retro',
                            })}
                            alt={comment?.createdBy?.fullName || 'Anonymous'}
                            width={32}
                            height={32}
                            className="rounded-full ml-2 object-cover"
                            unoptimized
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-800 text-sm">
                                {comment?.createdBy?.fullName || 'Anonymous'}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      )
                  })
                )}
              </div>
              {/* Comment form */}
              <div className="mt-3">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                  placeholder="أضف تعليقًا..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">أقصى عدد للحروف: 500</span>
                  <button
                    className="px-3 py-1 bg-[#91be3f] text-white rounded-md hover:bg-[#82aa39] transition-colors text-sm"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                  >
                    إرسال
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation with Progress */}
        <div className="bg-white border-t border-gray-200 w-full">
          <div className="p-4">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">التقدم</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div
                className="bg-[#91be3f] h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Lesson Navigation */}
            <div className="flex justify-between">
              <button
                onClick={navigateToPrevious}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700"
              >
                <ChevronRight className="h-4 w-4 ml-1" />
                الدرس السابق
              </button>

              <button
                onClick={markLessonAsCompleted}
                className="px-4 py-2 bg-[#91be3f] text-white rounded flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4 ml-1" />
                وضع علامة كمكتمل
              </button>

              <button
                onClick={navigateToNext}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700"
              >
                الدرس التالي
                <ChevronLeft className="h-4 w-4 mr-1" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Fixed Position */}
      <aside
        className="bg-[#253b74] text-white fixed right-0 top-0 h-full z-20 transition-all duration-300"
        style={{
          width: sidebarOpen ? '18rem' : '0',
          overflow: 'hidden',
        }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#1a2c5a]">
            <h2 className="text-xl font-bold">محتوى الدورة</h2>
          </div>

          {/* Progress indicator */}
          <div className="bg-[#1a2c5a] px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="text-sm">التقدم</div>
              <div className="text-sm font-bold">{progress}%</div>
            </div>
            <div className="w-full bg-[#253b74] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#91be3f] h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Course Sections */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-2">
              {course.sections?.map((section, sIndex) => (
                <div key={sIndex} className="mb-1">
                  {/* Section Header */}
                  <button
                    className={`w-full p-3 text-right flex items-center rounded ${
                      expandedSection === sIndex ? 'bg-[#91be3f] text-white' : 'hover:bg-[#1a2c5a]'
                    }`}
                    //onClick={() => toggleSection(sIndex)}
                  >
                    <div className="flex items-center flex-1">
                      <div className="ml-2">
                        {expandedSection === sIndex ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm truncate">{section.title || 'قسم بدون عنوان'}</span>
                    </div>
                  </button>

                  {/* Section Lessons */}
                  <AnimatePresence>
                    {expandedSection === sIndex && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mr-4 border-r border-[#1a2c5a] pr-2 mt-1"
                      >
                        {(section.lessons ?? []).map((lesson: any, lIndex: number) => (
                          <button
                            key={lIndex}
                            className={`w-full p-2 text-right flex items-center text-sm rounded my-1 ${
                              sIndex === currentSectionIndex && lIndex === currentLessonIndex
                                ? 'bg-[#1a2c5a] text-white'
                                : 'hover:bg-[#1a2c5a]'
                            }`}
                            onClick={() => {
                              setIsLoading(true)
                              setCurrentSectionIndex(sIndex)
                              setCurrentLessonIndex(lIndex)
                              setTimeout(() => setIsLoading(false), 300)
                            }}
                          >
                            <div className="flex items-center">
                              <div className="ml-2">
                                {completedLessons.has(`${section.id}-${lIndex}`) ? (
                                  <CheckCircle className="h-4 w-4 text-[#91be3f]" />
                                ) : (
                                  <Circle className="h-4 w-4 text-[#253b74]" />
                                )}
                              </div>
                              <span className="truncate">{lesson.title || 'درس بدون عنوان'}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay - only shown on small screens when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          style={{ width: 'calc(100% - 18rem)', right: '18rem' }}
        ></div>
      )}
    </div>
  )
}

export default CourseStudyPageClient
