'use client'

import { useEffect, useState } from 'react'
import { Exam as PayloadExam } from '@/payload-types'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExamPageClientProps {
  exam: PayloadExam
}

const ExamPageClient = ({ exam }: ExamPageClientProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState((exam.timeLimit ?? 0) * 60) // Convert minutes to seconds
  const [attempts, setAttempts] = useState(0) // Track the number of attempts
  const [questionCorrectness, setQuestionCorrectness] = useState<{ [key: number]: boolean }>({})
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // Track auth status
  const [clientId, setClientId] = useState<string | null>(null) // Store authenticated user's ID
  const router = useRouter()

  // Check authentication status using /api/individualAccount/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/individualAccount/me', {
          method: 'GET',
          credentials: 'include', // Include cookies if needed for auth
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const data = await response.json()
        if (data && data.user) {
          setIsAuthenticated(true)
          setClientId(data.user.id) // Assuming the user object has an 'id' field
        } else {
          setIsAuthenticated(false)
          setClientId(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setIsAuthenticated(false)
        setClientId(null)
      }
    }

    fetchUser()
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Handle answer selection
  const handleAnswerSelection = (questionIndex: number, answer: any) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleRetake = () => {
    setSelectedAnswers({}) // Reset selected answers
    setSubmitted(false) // Reset submission status
    setScore(null) // Reset score
    setTimeRemaining((exam.timeLimit ?? 0) * 60) // Reset timer
    setAttempts((prev) => prev + 1) // Increment attempt count
  }

  const isRetakeDisabled = !!exam.maxAttempts && attempts >= exam.maxAttempts

  // Handle exam submission
  const handleSubmit = async () => {
    // If authentication status is still loading or user is not authenticated, block submission
    if (isAuthenticated === null || !isAuthenticated || !clientId) {
      alert('You must be logged in to submit the exam.')
      return
    }

    // Validate that all questions have been answered
    const unansweredQuestions: number[] = []
    exam.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index]

      if (!userAnswer) {
        unansweredQuestions.push(index + 1)
        return
      }

      if (question.questionType === 'multiple-choice') {
        const hasSelection = Object.values(userAnswer).some((val) => val === true)
        if (!hasSelection) unansweredQuestions.push(index + 1)
      } else if (question.questionType === 'true-false') {
        const allStatementsAnswered = question.trueFalseOptions?.every(
          (_, idx) => userAnswer[idx] === 'true' || userAnswer[idx] === 'false',
        )
        if (!allStatementsAnswered) unansweredQuestions.push(index + 1)
      } else if (question.questionType === 'short-answer') {
        if (userAnswer.trim() === '') unansweredQuestions.push(index + 1)
      }
    })

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer all questions before submitting. Unanswered questions: ${unansweredQuestions.join(', ')}`,
      )
      return
    }

    let totalPoints = 0
    let earnedPoints = 0
    const correctness: { [key: number]: boolean } = {}
    const answersPayload: any[] = []

    exam.questions.forEach((question, index) => {
      totalPoints += question.points
      const userAnswer = selectedAnswers[index]
      let isCorrect = false
      let pointsEarned = 0

      const answerData: any = {
        questionIndex: index,
        questionType: question.questionType,
        isCorrect: false,
        pointsEarned: 0,
      }

      if (question.questionType === 'multiple-choice' && userAnswer) {
        const correctOptions = question.multipleChoiceOptions
          ?.map((option, idx) => (option.isCorrect ? idx : -1))
          .filter((idx) => idx !== -1)

        const userSelected = Object.keys(userAnswer)
          .filter((key) => userAnswer[key])
          .map((key) => parseInt(key))

        isCorrect =
          correctOptions?.length === userSelected.length &&
          correctOptions?.every((idx) => userSelected.includes(idx))

        answerData.selectedOptions = question.multipleChoiceOptions?.map((_, idx) => ({
          optionIndex: idx,
          selected: userAnswer[idx] || false,
        }))
      } else if (question.questionType === 'true-false' && userAnswer) {
        const allStatementsAnswered = question.trueFalseOptions?.every(
          (_, idx) => userAnswer[idx] === 'true' || userAnswer[idx] === 'false',
        )

        if (allStatementsAnswered && question.trueFalseOptions) {
          isCorrect = question.trueFalseOptions.every((statement, idx) => {
            const userSelection = userAnswer[idx] === 'true'
            const correctAnswer = statement.isTrue === 'true'
            return userSelection === correctAnswer
          })

          answerData.trueFalseResponses = question.trueFalseOptions.map((_, idx) => ({
            statementIndex: idx,
            markedTrue: userAnswer[idx] === 'true',
          }))
        }
      } else if (question.questionType === 'short-answer' && userAnswer) {
        const correctAnswer = question.shortAnswer?.correctAnswer.toLowerCase()
        const userResponse = userAnswer.toLowerCase()
        isCorrect = userResponse === correctAnswer
        answerData.shortAnswerResponse = userAnswer
      }

      correctness[index] = isCorrect
      if (isCorrect) {
        pointsEarned = question.points
        earnedPoints += pointsEarned
      }
      answerData.isCorrect = isCorrect
      answerData.pointsEarned = pointsEarned

      answersPayload.push(answerData)
    })

    const finalScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0

    const submissionData = {
      client: clientId, // Use the authenticated client ID
      course: exam.course,
      exam: exam.id,
      answers: answersPayload,
      score: finalScore,
      timeSpent: ((exam.timeLimit ?? 0) * 60 - timeRemaining) / 60,
      status: 'pending',
    }

    try {
      const response = await fetch('/api/submit-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit exam')
      }

      const result = await response.json()
      console.log('Submission successful:', result)

      setQuestionCorrectness(correctness)
      setScore(finalScore)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting exam:', error)
      alert('There was an error submitting your exam. Please try again.')
    }
  }

  useEffect(() => {
    if (timeRemaining > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeRemaining === 0) {
      handleSubmit()
    }
  }, [timeRemaining, submitted])

  // If auth status is still loading, show a loading state
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
        <p className="text-gray-600 mb-6">{exam.description}</p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">
              Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitted || isAuthenticated === null || !isAuthenticated}
            className="px-4 py-2 bg-[#91be3f] text-white rounded hover:bg-[#7fa82e] disabled:bg-gray-300"
          >
            Submit Exam
          </button>
        </div>

        {exam.questions.map((question, index) => (
          <div
            key={index}
            className={`mb-6 p-4 rounded-lg ${
              submitted
                ? questionCorrectness[index]
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">
              {index + 1}. {question.questionText}
            </h3>

            {question.questionType === 'multiple-choice' && (
              <div className="space-y-2">
                {question.multipleChoiceOptions?.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center space-x-2 ${
                      submitted && option.isCorrect
                        ? 'text-green-600'
                        : submitted && selectedAnswers[index]?.[idx] && !option.isCorrect
                          ? 'text-red-600'
                          : 'text-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAnswers[index]?.[idx] || false}
                      onChange={(e) => {
                        const newAnswers = { ...selectedAnswers }
                        newAnswers[index] = newAnswers[index] || []
                        newAnswers[index][idx] = e.target.checked
                        setSelectedAnswers(newAnswers)
                      }}
                      disabled={submitted}
                      className={`form-checkbox h-4 w-4 ${
                        submitted && option.isCorrect
                          ? 'text-green-600 border-green-600'
                          : submitted && selectedAnswers[index]?.[idx] && !option.isCorrect
                            ? 'text-red-600 border-red-600'
                            : 'text-[#91be3f]'
                      }`}
                    />
                    <span>{option.optionText}</span>
                  </label>
                ))}
              </div>
            )}

            {question.questionType === 'true-false' && (
              <div className="space-y-4">
                {question.trueFalseOptions?.map((statement, idx) => {
                  const userSelection = selectedAnswers[index]?.[idx]
                  const correctAnswer = statement.isTrue === 'true' ? 'true' : 'false'
                  const isStatementCorrect = submitted ? userSelection === correctAnswer : null
                  const isUnanswered = submitted && userSelection === undefined

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${
                        submitted
                          ? isUnanswered
                            ? 'bg-yellow-50 border border-yellow-200'
                            : isStatementCorrect
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-gray-800 mb-2">{statement.statementText}</p>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`statement-${index}-${idx}`}
                            value="true"
                            checked={userSelection === 'true'}
                            onChange={(e) =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [index]: { ...prev[index], [idx]: e.target.value },
                              }))
                            }
                            disabled={submitted}
                            className={`form-radio h-4 w-4 ${
                              submitted
                                ? correctAnswer === 'true'
                                  ? 'text-green-600 border-green-600'
                                  : userSelection === 'true'
                                    ? 'text-red-600 border-red-600'
                                    : 'text-gray-400'
                                : 'text-[#91be3f]'
                            }`}
                          />
                          <span>True</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`statement-${index}-${idx}`}
                            value="false"
                            checked={userSelection === 'false'}
                            onChange={(e) =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [index]: { ...prev[index], [idx]: e.target.value },
                              }))
                            }
                            disabled={submitted}
                            className={`form-radio h-4 w-4 ${
                              submitted
                                ? correctAnswer === 'false'
                                  ? 'text-green-600 border-green-600'
                                  : userSelection === 'false'
                                    ? 'text-red-600 border-red-600'
                                    : 'text-gray-400'
                                : 'text-[#91be3f]'
                            }`}
                          />
                          <span>False</span>
                        </label>
                      </div>
                      {submitted && (
                        <div className="mt-2 text-sm">
                          {isUnanswered ? (
                            <span className="text-yellow-600">Not answered</span>
                          ) : isStatementCorrect ? (
                            <span className="text-green-600">Correct!</span>
                          ) : (
                            <span className="text-red-600">
                              Incorrect! The correct answer is {correctAnswer}.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {question.questionType === 'short-answer' && (
              <textarea
                value={selectedAnswers[index] || ''}
                onChange={(e) =>
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [index]: e.target.value,
                  }))
                }
                disabled={submitted}
                className={`w-full p-2 border rounded ${
                  submitted
                    ? questionCorrectness[index]
                      ? 'border-green-600 bg-green-50'
                      : 'border-red-600 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Type your answer here..."
              />
            )}

            {submitted && (
              <div className="mt-2 text-sm">
                {selectedAnswers[index] === undefined ? (
                  <span className="text-yellow-600">Not answered</span>
                ) : questionCorrectness[index] ? (
                  <span className="text-green-600">Correct!</span>
                ) : (
                  <span className="text-red-600">Incorrect!</span>
                )}
              </div>
            )}
          </div>
        ))}

        {submitted && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-2">
              {score !== null && score >= exam.passingScore ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-lg font-semibold">
                Your Score: {score?.toFixed(2)}% (
                {score !== null && score >= exam.passingScore ? 'Pass' : 'Fail'})
              </span>
            </div>

            {exam.allowRetakes && (
              <button
                onClick={handleRetake}
                disabled={isRetakeDisabled}
                className="mt-4 px-4 py-2 bg-[#91be3f] text-white rounded hover:bg-[#7fa82e] disabled:bg-gray-300"
              >
                Retake Exam {isRetakeDisabled && '(Max Attempts Reached)'}
              </button>
            )}

            <button
              onClick={() => router.push('/courses')}
              className="mt-4 px-4 py-2 bg-[#91be3f] text-white rounded hover:bg-[#7fa82e]"
            >
              Back to Courses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamPageClient
