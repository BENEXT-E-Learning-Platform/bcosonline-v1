// components/itemRenderer.tsx

import React, { useState } from 'react'
import {
  VideoContentViewer,
  PDFContentViewer,
  ExcelContentViewer,
  DocContentViewer,
} from './ContentViewers'

export interface ContentItem {
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
  points?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface ContentItemRendererProps {
  item: ContentItem
}

const QuizComponent: React.FC<{ item: ContentItem }> = ({ item }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const handleOptionChange = (index: number) => {
    if (submitted) return // Prevent changing answers after submission

    if (item.questionType === 'single') {
      setSelectedOptions([index])
    } else {
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      )
    }
  }

  const checkAnswer = (): boolean => {
    if (!item.options) return false

    // For single choice questions
    if (item.questionType === 'single') {
      if (selectedOptions.length !== 1) return false
      return item.options[selectedOptions[0]]?.isCorrect || false
    }

    // For multiple choice questions
    // 1. All selected options must be correct
    const allSelectedAreCorrect = selectedOptions.every((index) => item.options?.[index]?.isCorrect)

    // 2. All correct options must be selected
    const correctIndices = item.options
      .map((option, index) => (option.isCorrect ? index : -1))
      .filter((index) => index !== -1)

    const allCorrectAreSelected = correctIndices.every((index) => selectedOptions.includes(index))

    return allSelectedAreCorrect && allCorrectAreSelected
  }

  const handleSubmit = () => {
    // Check if any option is selected
    if (selectedOptions.length === 0) {
      alert('الرجاء اختيار إجابة على الأقل')
      return
    }

    const result = checkAnswer()
    setIsCorrect(result)
    setSubmitted(true)
    setShowExplanation(result) // Show explanation if correct
    setAttemptCount((prev) => prev + 1)
  }

  const handleTryAgain = () => {
    setSubmitted(false)
    // Don't reset selected options to allow the user to adjust their answer
    setShowExplanation(false)
  }

  const handleNextQuestion = () => {
    // Reset everything for the next question
    setSelectedOptions([])
    setSubmitted(false)
    setIsCorrect(false)
    setShowExplanation(false)
    setAttemptCount(0)
    // You would typically navigate to the next question here
    // But since this component is meant to handle single questions,
    // you might want to emit an event to the parent component
  }

  // Get the points display if points are available
  const getPointsDisplay = () => {
    if (!item.points) return null
    return (
      <span className="text-sm font-medium text-gray-500 ml-2">
        ({item.points} {item.points === 1 ? 'نقطة' : 'نقاط'})
      </span>
    )
  }

  // Get difficulty badge if available
  const getDifficultyBadge = () => {
    if (!item.difficulty) return null

    const badgeColors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    }

    const difficultyText = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب',
    }

    return (
      <span
        className={`${badgeColors[item.difficulty]} text-xs font-medium px-2.5 py-0.5 rounded ml-2`}
      >
        {difficultyText[item.difficulty]}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6" dir="rtl">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium">{item.question}</h3>
        {getPointsDisplay()}
        {getDifficultyBadge()}
      </div>

      <div className="space-y-3 mb-6">
        {item.options?.map((option, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg transition-colors ${
              submitted && option.isCorrect
                ? 'bg-green-50 border-green-200'
                : submitted && selectedOptions.includes(index) && !option.isCorrect
                  ? 'bg-red-50 border-red-200'
                  : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <label className="flex items-center cursor-pointer w-full">
              <input
                type={item.questionType === 'single' ? 'radio' : 'checkbox'}
                checked={selectedOptions.includes(index)}
                onChange={() => handleOptionChange(index)}
                className="ml-3 h-4 w-4"
                disabled={submitted}
              />
              <span className="text-gray-800">{option.text}</span>
            </label>

            {submitted && selectedOptions.includes(index) && option.feedback && (
              <p className="text-sm mt-2 pr-7 text-gray-600">{option.feedback}</p>
            )}

            {submitted && option.isCorrect && (
              <div className="flex items-center mt-1 pr-7 text-green-600 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>الإجابة الصحيحة</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback area */}
      {submitted && (
        <div className={`p-4 mb-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex items-center">
            {isCorrect ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-800 font-medium">إجابة صحيحة! أحسنت.</p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-medium">إجابة غير صحيحة. حاول مرة أخرى.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Explanation area */}
      {showExplanation && item.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 ml-2 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">شرح:</h4>
              <p className="text-sm text-blue-700">{item.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end mt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            تحقق من الإجابة
          </button>
        ) : (
          <div className="space-x-3 space-x-reverse">
            {!isCorrect && (
              <button
                onClick={handleTryAgain}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg ml-3"
              >
                حاول مرة أخرى
              </button>
            )}
            <button
              onClick={handleNextQuestion}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const ContentItemRenderer: React.FC<ContentItemRendererProps> = ({ item }) => {
  // Helper function to determine content type from fileName if blockType isn't specific
  const determineFileType = (fileName: string): string => {
    if (!fileName) return 'unknown'

    const extension = fileName.split('.').pop()?.toLowerCase()

    if (!extension) return 'unknown'

    if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return 'video'
    } else if (['pdf'].includes(extension)) {
      return 'pdf'
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return 'excel'
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word'
    }

    return 'unknown'
  }

  // Determine content type based on blockType or fileName
  const contentType =
    item.blockType === 'fileContent' && item.fileName
      ? determineFileType(item.fileName)
      : item.blockType === 'videoContent'
        ? 'video'
        : item.blockType === 'pdfContent'
          ? 'pdf'
          : item.blockType === 'excelContent'
            ? 'excel'
            : item.blockType === 'docContent'
              ? 'word'
              : item.blockType === 'quizQuestion'
                ? 'quiz'
                : 'unknown'

  // Get the appropriate file URL based on content type
  const getFileUrl = (): string => {
    // If explicit URLs are provided, use them
    if (contentType === 'video' && item.videoUrl) return item.videoUrl
    if (contentType === 'pdf' && item.pdfUrl) return item.pdfUrl
    if (contentType === 'excel' && item.excelUrl) return item.excelUrl
    if (contentType === 'word' && item.docUrl) return item.docUrl

    // Add direct detection for Excel files
    if (
      contentType === 'excel' ||
      ['xlsx', 'xls', 'csv'].some((ext) => item.fileName?.toLowerCase().endsWith(ext))
    ) {
      // Check if fileName is already a full URL
      if (item.fileName?.startsWith('http') || item.fileName?.startsWith('/')) {
        return item.fileName
      }
      // Otherwise build API URL
      if (item.fileName) {
        return `/api/files?fileName=${encodeURIComponent(item.fileName)}`
      }
    }

    // Otherwise, use the fileName if available
    if (item.fileName) {
      // This would be where you'd construct the URL to access the file
      return `/api/files?fileName=${encodeURIComponent(item.fileName)}`
    }

    return ''
  }

  // Render the appropriate content viewer based on content type
  const renderContentViewer = () => {
    const fileUrl = getFileUrl()

    switch (contentType) {
      case 'video':
        return <VideoContentViewer url={fileUrl} title={item.title} />
      case 'pdf':
        return <PDFContentViewer url={fileUrl} title={item.title} />
      case 'excel':
        return <ExcelContentViewer url={fileUrl} title={item.title} />
      case 'word':
        return <DocContentViewer url={fileUrl} title={item.title} />
      case 'quiz':
        return <QuizComponent item={item} />
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6" dir="rtl">
            <h3 className="text-lg font-medium mb-3">{item.title || 'المحتوى'}</h3>
            {item.description && <p className="text-gray-700">{item.description}</p>}
          </div>
        )
    }
  }

  return <div className="mb-8">{renderContentViewer()}</div>
}

export default ContentItemRenderer
