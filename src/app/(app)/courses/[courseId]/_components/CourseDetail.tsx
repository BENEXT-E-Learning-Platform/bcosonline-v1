'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import EnrollButton from './EnrollButton'
import { Coursereview, Course as PayloadCourse } from '@/payload-types'
import { Star, StarHalf, ThumbsUp } from 'lucide-react'
import { format } from 'date-fns'

interface CourseDetailProps {
  course: PayloadCourse
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState<Coursereview[]>([])
  const [overallRating, setOverallRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch reviews for this course when component mounts
    fetchCourseReviews()

    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [course.id]) // Add course.id as a dependency

  const fetchCourseReviews = async () => {
    try {
      setIsLoading(true)
      // Fetch reviews for this specific course using Payload API
      const response = await fetch(`/api/coursereviews?where[course][equals]=${course.id}`)
      const data = await response.json()

      if (data.docs && data.docs.length > 0) {
        const reviewData = data.docs[0] as Coursereview

        // Set review data
        setReviewId(String(reviewData.id))
        setOverallRating(reviewData.overallRating)
        setReviewCount(reviewData.reviewCount)

        // Check if reviews exist and handle them properly
        if (
          reviewData.reviews &&
          Array.isArray(reviewData.reviews) &&
          reviewData.reviews.length > 0
        ) {
          // Filter for approved reviews and wrap them in a Coursereview structure
          const approvedReviews = [
            {
              ...reviewData,
              reviews: reviewData.reviews.filter((review) => review.status === 'approved'),
            },
          ]

          setReviews(approvedReviews)
        } else {
          // No reviews available
          setReviews([])
        }
      } else {
        // Reset state if no reviews found
        setReviewId(null)
        setOverallRating(0)
        setReviewCount(0)
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching course reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    try {
      setIsSubmitting(true)

      // If we already have a review document for this course
      if (reviewId) {
        // Add a new review to the existing document
        const response = await fetch(`/api/coursereviews/${reviewId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviews: [
              ...reviews,
              {
                rating: data.rating,
                comment: data.comment,
                status: 'pending', // All new reviews start as pending
                createdAt: new Date().toISOString(),
                helpful: 0,
                isFeatured: false,
                // No need to specify user - it will be added by the hook
              },
            ],
          }),
        })

        if (response.ok) {
          alert('Your review has been submitted and is pending approval')
          fetchCourseReviews() // Refresh reviews
        } else {
          const errorData = await response.json()
          alert(`Failed to submit review: ${errorData.errors?.[0]?.message || 'Please try again'}`)
        }
      } else {
        // Create a new review document for this course
        const response = await fetch('/api/coursereviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseTitle: course.title, // Add the course title
            course: course.id, // Add the course relationship
            reviews: [
              {
                rating: data.rating,
                comment: data.comment,
                status: 'pending', // All new reviews start as pending
                createdAt: new Date().toISOString(),
                helpful: 0,
                isFeatured: false,
                // No need to specify user - it will be added by the hook
              },
            ],
          }),
        })

        if (response.ok) {
          const newReviewData = await response.json()
          setReviewId(newReviewData.id)
          alert('Your review has been submitted and is pending approval')
          fetchCourseReviews() // Refresh reviews
        } else {
          const errorData = await response.json()
          alert(`Failed to submit review: ${errorData.errors?.[0]?.message || 'Please try again'}`)
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const markReviewHelpful = async (reviewIndex: number) => {
    if (!reviewId) return

    try {
      const updatedReviews = [...reviews]
      updatedReviews[reviewIndex] = {
        ...updatedReviews[reviewIndex],
        helpful: (updatedReviews[reviewIndex].helpful ?? 0) + 1,
      }

      const response = await fetch(`/api/coursereviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: updatedReviews,
        }),
      })

      if (response.ok) {
        fetchCourseReviews() // Refresh reviews
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error)
    }
  }

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null)
    } else {
      setExpandedSection(sectionId)
    }
  }

  const tabVariants = {
    inactive: { opacity: 0, y: 10, display: 'none' },
    active: { opacity: 1, y: 0, display: 'block' },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const listItem = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const coverPhoto =
    typeof course.coverPhoto === 'object' && course.coverPhoto?.url
      ? course.coverPhoto.url
      : '/placeholder.jpg'
  const videoPreview =
    typeof course.videoPreview === 'object' && course.videoPreview?.url
      ? course.videoPreview.url
      : ''

  // ReviewStars Component
  const ReviewStars: React.FC<{ rating: number; size?: number; className?: string }> = ({
    rating,
    size = 20,
    className = '',
  }) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <div className={`flex items-center ${className}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
    )
  }

  // ReviewSummary Component
  const ReviewSummary: React.FC<{
    overallRating: number
    reviewCount: number
    className?: string
  }> = ({ overallRating, reviewCount, className = '' }) => {
    return (
      <div className={`flex items-center ${className}`}>
        <ReviewStars rating={overallRating} />
        <span className="ml-2 text-lg font-medium">{overallRating.toFixed(1)}</span>
        <span className="ml-2 text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    )
  }
  // Add this temporarily to check the reviews data structure
  console.log('Reviews data:', reviews)
  // ReviewList Component
  const ReviewList: React.FC<{
    reviews: Coursereview[]
    onMarkHelpful?: (index: number, reviewIndex: number) => void
    className?: string
  }> = ({ reviews, onMarkHelpful, className = '' }) => {
    return (
      <div className={`space-y-6 ${className}`}>
        {reviews.length > 0 ? (
          reviews.map((courseReview, index) =>
            courseReview.reviews && courseReview.reviews.length > 0 ? (
              courseReview.reviews.map((review, reviewIndex) => (
                <div
                  key={`${index}-${reviewIndex}`}
                  className={`p-4 border rounded-lg ${review.isFeatured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
                >
                  {review.isFeatured && (
                    <div className="mb-2 px-2 py-1 bg-yellow-400 text-yellow-800 text-xs font-medium rounded inline-block">
                      Featured Review
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {review.user && typeof review.user === 'object'
                          ? review.user.fullName || review.user.email || 'Anonymous User'
                          : 'Anonymous User'}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {review.createdAt
                          ? format(new Date(review.createdAt), 'MMMM d, yyyy')
                          : 'Date not available'}
                      </div>
                    </div>
                    <ReviewStars rating={review.rating} size={16} />
                  </div>
                  {review.comment && <div className="mt-3 text-gray-700">{review.comment}</div>}
                  <div className="mt-4 flex items-center">
                    <button
                      onClick={() => onMarkHelpful && onMarkHelpful(index, reviewIndex)}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div key={index} className="text-gray-500 text-center py-8">
                No reviews yet for this course.
              </div>
            ),
          )
        ) : (
          <div className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this course!
          </div>
        )}
      </div>
    )
  }

  // ReviewForm Component
  const ReviewForm: React.FC<{
    onSubmit: (data: { rating: number; comment: string }) => void
    className?: string
  }> = ({ onSubmit, className = '' }) => {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (rating > 0) {
        setIsSubmitting(true)
        onSubmit({ rating, comment })
        setRating(0)
        setComment('')
      }
    }

    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={`${
                    (hoveredRating || rating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                {rating === 1
                  ? 'Poor'
                  : rating === 2
                    ? 'Fair'
                    : rating === 3
                      ? 'Good'
                      : rating === 4
                        ? 'Very Good'
                        : 'Excellent'}
              </span>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review (Optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your thoughts about this course..."
          />
        </div>
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium 
            ${
              rating === 0 || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-4 flex-wrap gap-2"
            >
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full mr-2 ${
                  course.state === 'published'
                    ? 'bg-[#91be3f]/20 text-[#91be3f]'
                    : course.state === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {course.state.charAt(0).toUpperCase() + course.state.slice(1)}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full mr-2 ${
                  course.isPaid === 'paid'
                    ? 'bg-[#253b74]/15 text-[#253b74]'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {course.isPaid === 'paid' ? `$${course.price}` : 'Free'}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                {course.enrollmentType}
              </span>
              {reviewCount > 0 && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                  <Star size={12} className="mr-1 fill-yellow-500 text-yellow-500" />
                  {overallRating.toFixed(1)}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-[#253b74] mb-2"
            >
              {course.title}
              <div className="w-16 h-1 bg-[#91be3f] rounded-full mt-3"></div>
            </motion.h1>

            {course.instructor && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center mt-4"
              >
                <div className="bg-[#253b74]/10 p-2 rounded-full mr-3">
                  <svg
                    className="w-5 h-5 text-[#253b74]"
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
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Instructor</span>
                  <p className="font-medium text-[#253b74]">
                    {typeof course.instructor === 'object'
                      ? course.instructor.id
                      : course.instructor}
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-[#253b74]/5 to-[#91be3f]/5 rounded-xl p-6 grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 shadow-sm"
            >
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#253b74]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16L7 13V7L12 4L17 7V13L12 16Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 9V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-[#253b74]">
                  {course.description.infos.numberOfVideos}
                </p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>

              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#253b74]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                      d="M9 21L9 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-[#253b74]">
                  {course.description.infos.numberOfSections}
                </p>
                <p className="text-xs text-gray-500">Sections</p>
              </div>

              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#253b74]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 22H18C19.1046 22 20 21.1046 20 20V7.41421C20 6.88378 19.7893 6.37507 19.4142 6L14 0.585786C13.6249 0.210714 13.1162 0 12.5858 0H4C2.89543 0 2 0.89543 2 2V20C2 21.1046 2.89543 22 4 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 0V6H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-[#253b74]">
                  {course.description.infos.numberOfPracticalFiles}
                </p>
                <p className="text-xs text-gray-500">Files</p>
              </div>

              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#253b74]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6V12L16 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-[#253b74]">
                  {course.description.infos.courseTime}
                </p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>

              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#253b74]"
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
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-xs text-gray-500">Enrolled</p>
              </div>
            </motion.div>

            {/* Tabs for Overview and Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-[#253b74] text-[#253b74]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'curriculum'
                      ? 'border-b-2 border-[#253b74] text-[#253b74]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-[#253b74] text-[#253b74]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews {reviewCount > 0 && `(${reviewCount})`}
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    variants={tabVariants}
                    className="mt-6"
                  >
                    <p className="text-gray-600">
                      {course.description.infos.numberOfPracticalExamples}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'curriculum' && (
                  <motion.div
                    key="curriculum"
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    variants={tabVariants}
                    className="mt-6"
                  >
                    <motion.ul
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {course.sections?.map((section) => (
                        <motion.li
                          key={section.id}
                          variants={listItem}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div
                            onClick={() => section.id && toggleSection(section.id)}
                            className="flex justify-between items-center cursor-pointer"
                          >
                            <h3 className="font-semibold text-[#253b74]">{section.title}</h3>
                            <svg
                              className={`w-5 h-5 transform transition-transform ${
                                expandedSection === section.id ? 'rotate-180' : ''
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <AnimatePresence>
                            {expandedSection === section.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-2"
                              >
                                {section.lessons?.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center space-x-2 text-gray-600"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M12 7C11.45 7 11 7.45 11 8V12C11 12.55 11.45 13 12 13H15C15.55 13 16 12.55 16 12C16 11.45 15.55 11 15 11H13V8C13 7.45 12.55 7 12 7Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                    <span>{lesson.title}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    variants={tabVariants}
                    className="mt-6"
                  >
                    {/* Review Summary */}
                    <ReviewSummary overallRating={overallRating} reviewCount={reviewCount} />

                    {/* Review List */}
                    <ReviewList
                      reviews={reviews}
                      onMarkHelpful={markReviewHelpful}
                      className="mt-6"
                    />

                    {/* Review Form */}
                    <ReviewForm onSubmit={handleReviewSubmit} className="mt-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Course Image and Actions */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="sticky top-8"
            >
              <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                {coverPhoto ? (
                  <>
                    {videoPreview ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        src={videoPreview}
                        poster={coverPhoto}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image src={coverPhoto} alt={course.title} width={500} height={380} />
                    )}
                  </>
                ) : (
                  <div className="bg-gray-200 w-full h-full"></div>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full bg-[#253b74] text-white py-3 rounded-lg font-semibold hover:bg-[#1d2f5a] transition-colors"
                >
                  {isPlaying ? 'Pause Course' : 'Start Course'}
                </button>

                <EnrollButton
                  courseId={String(course.id)}
                  firstSectionId={String(course.sections?.[0]?.order ?? '')}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
export default CourseDetail
