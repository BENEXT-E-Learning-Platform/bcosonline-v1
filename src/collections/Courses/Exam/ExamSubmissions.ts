import { CollectionConfig } from 'payload'

export const ExamSubmissions: CollectionConfig = {
  slug: 'exam-submissions',
  admin: {
    useAsTitle: 'submissionDate',
    defaultColumns: ['client', 'course', 'exam', 'score', 'submissionDate'],
    description: 'Track exam submissions from clients',
    group: 'Education',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user && user.collection === 'individualAccount'), // Only authenticated clients
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true // Admins can read all
      return { client: { equals: user.id } } // Clients can only read their own submissions
    },
    update: ({ req: { user } }) => user?.collection === 'users', // Only admins can update
    delete: ({ req: { user } }) => user?.collection === 'users', // Only admins can delete
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'individualAccount',
      required: true,
      label: 'Client',
      admin: { readOnly: true },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: { readOnly: true },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      label: 'Exam',
      admin: { readOnly: true },
    },
    {
      name: 'answers',
      type: 'array',
      label: 'Answers',
      required: true,
      fields: [
        {
          name: 'questionIndex',
          type: 'number',
          required: true,
          label: 'Question Index',
          admin: { description: 'Index of the question in the exam' },
        },
        {
          name: 'questionType',
          type: 'select',
          options: [
            { label: 'Multiple Choice', value: 'multiple-choice' },
            { label: 'True/False', value: 'true-false' },
            { label: 'Short Answer', value: 'short-answer' },
          ],
          required: true,
          label: 'Question Type',
        },
        // For multiple-choice questions
        {
          name: 'selectedOptions',
          type: 'array',
          label: 'Selected Options',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'multiple-choice',
          },
          fields: [
            {
              name: 'optionIndex',
              type: 'number',
              required: true,
              label: 'Option Index',
            },
            {
              name: 'selected',
              type: 'checkbox',
              required: true,
              label: 'Selected',
              defaultValue: false,
            },
          ],
        },
        // For true-false questions
        {
          name: 'trueFalseResponses',
          type: 'array',
          label: 'True/False Responses',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'true-false',
          },
          fields: [
            {
              name: 'statementIndex',
              type: 'number',
              required: true,
              label: 'Statement Index',
            },
            {
              name: 'markedTrue',
              type: 'checkbox',
              required: true,
              label: 'Marked as True',
              defaultValue: false,
            },
          ],
        },
        // For short-answer questions
        {
          name: 'shortAnswerResponse',
          type: 'text',
          label: 'Short Answer Response',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'short-answer',
          },
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Is Correct',
          admin: { readOnly: true },
        },
        {
          name: 'pointsEarned',
          type: 'number',
          label: 'Points Earned',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'score',
      type: 'number',
      label: 'Score (%)',
      required: false,
      min: 0,
      max: 100,
      admin: { readOnly: true, description: 'Calculated score after submission' },
    },
    {
      name: 'submissionDate',
      type: 'date',
      label: 'Submission Date',
      required: true,
      admin: { readOnly: true },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'timeSpent',
      type: 'number',
      label: 'Time Spent (minutes)',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Graded', value: 'graded' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
      required: true,
      label: 'Submission Status',
    },
    {
      name: 'feedback',
      type: 'text',
      label: 'Admin Feedback',
      admin: {
        condition: (data) => data?.status === 'graded' || data?.status === 'failed',
        description: 'Optional feedback for the student',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        if (req.user && !data.client) {
          data.client = req.user.id // Auto-set client to the authenticated user
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const { payload } = req
        if (doc.status === 'pending') {
          try {
            // Auto-grade the exam
            const exam = await payload.findByID({
              collection: 'exams',
              id: doc.exam,
            })

            let totalPoints = 0
            let earnedPoints = 0

            // Process each answer
            for (const answer of doc.answers) {
              const question = exam.questions[answer.questionIndex]
              if (!question) continue

              totalPoints += question.points
              let isCorrect = false
              let pointsEarned = 0

              // Grade based on question type
              if (question.questionType === 'multiple-choice' && answer.selectedOptions) {
                // Check if selected options match correct options
                const allCorrect = question.multipleChoiceOptions?.every((option, idx) => {
                  const selectedOption = answer.selectedOptions.find(
                    (so: { optionIndex: number; selected: boolean }) => so.optionIndex === idx,
                  )
                  return option.isCorrect === (selectedOption?.selected || false)
                })

                if (allCorrect) {
                  isCorrect = true
                  pointsEarned = question.points
                }
              } else if (question.questionType === 'true-false' && answer.trueFalseResponses) {
                // Check if true/false markings match correct answers
                const allCorrect = question.trueFalseOptions?.every((statement, idx) => {
                  const response = answer.trueFalseResponses.find(
                    (r: { statementIndex: number; markedTrue: boolean }) =>
                      r.statementIndex === idx,
                  )
                  return statement.isTrue === (response?.markedTrue || false)
                })

                if (allCorrect) {
                  isCorrect = true
                  pointsEarned = question.points
                }
              } else if (question.questionType === 'short-answer' && answer.shortAnswerResponse) {
                // Compare short answer against correct answer
                const userAnswer = question.shortAnswer?.caseSensitive
                  ? answer.shortAnswerResponse
                  : answer.shortAnswerResponse?.toLowerCase()

                const correctAnswer = question.shortAnswer?.caseSensitive
                  ? question.shortAnswer.correctAnswer
                  : question.shortAnswer?.correctAnswer.toLowerCase()

                if (question.shortAnswer && question.shortAnswer.allowPartialMatch) {
                  // Check if correct answer is contained in user answer or vice versa
                  if (
                    correctAnswer &&
                    (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer))
                  ) {
                    isCorrect = true
                    pointsEarned = question.points
                  }
                } else {
                  // Exact match required
                  if (userAnswer === correctAnswer) {
                    isCorrect = true
                    pointsEarned = question.points
                  }
                }
              }

              // Update the answer with grading results
              answer.isCorrect = isCorrect
              answer.pointsEarned = pointsEarned

              earnedPoints += pointsEarned
            }

            // Calculate final score as percentage
            const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0

            // Update the submission
            await payload.update({
              collection: 'exam-submissions',
              id: doc.id,
              data: {
                answers: doc.answers, // Save the updated answers with grading
                score,
                status: score >= exam.passingScore ? 'graded' : 'failed',
              },
              req,
            })

            // Update course completion status if needed
            const courseData = await payload.findByID({
              collection: 'courses',
              id: doc.course,
            })

            const examConfig = Array.isArray(courseData.exam)
              ? courseData.exam.find(
                  (e) =>
                    e.exam === doc.exam || (typeof e.exam === 'object' && e.exam.id === doc.exam),
                )
              : undefined

            if (examConfig?.requiredToComplete && score >= exam.passingScore) {
              // Check if this should update participation status
              await payload.update({
                collection: 'participation',
                where: {
                  client: { equals: doc.client },
                  course: { equals: doc.course },
                },
                data: {
                  status: 'completed', // Or another appropriate status
                },
                req,
              })
            }
          } catch (error) {
            console.error('Error grading exam submission:', error)
            // Handle error appropriately
          }
        }
      },
    ],
  },
  timestamps: true,
}

export interface ExamSubmission {
  id: string
  client: string | { id: string }
  course: string | { id: string }
  exam: string | { id: string }
  answers: {
    questionIndex: number
    questionType: 'multiple-choice' | 'true-false' | 'short-answer'
    selectedOptions?: {
      optionIndex: number
      selected: boolean
    }[]
    trueFalseResponses?: {
      statementIndex: number
      markedTrue: boolean
    }[]
    shortAnswerResponse?: string
    isCorrect: boolean
    pointsEarned: number
  }[]
  score?: number
  submissionDate: string
  timeSpent?: number
  status: 'pending' | 'graded' | 'failed'
  feedback?: any // text
  createdAt: string
  updatedAt: string
}
