import { CollectionConfig } from 'payload'

export const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'timeLimit', 'passingScore', 'status'],
    description: 'Create and manage exams that can be assigned to courses',
    group: 'Education',
  },
  access: {
    create: ({ req: { user } }) => user?.collection === 'users', // Only admins can create
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true // Admins can read all
      if (user.collection === 'individualAccount') {
        return { status: { equals: 'published' } } // Clients can only see published exams
      }
      return false
    },
    update: ({ req: { user } }) => user?.collection === 'users', // Only admins can update
    delete: ({ req: { user } }) => user?.collection === 'users', // Only admins can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Exam Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'General information about the exam',
      },
    },
    {
      name: 'timeLimit',
      type: 'number',
      label: 'Time Limit (minutes)',
      min: 1,
      defaultValue: 60,
      admin: {
        description: 'Maximum time allowed for completion',
      },
    },
    {
      name: 'passingScore',
      type: 'number',
      label: 'Passing Score (%)',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 70,
    },
    {
      name: 'questions',
      type: 'array',
      label: 'Exam Questions',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add questions to this exam',
      },
      fields: [
        {
          name: 'questionText',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'questionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Multiple Choice', value: 'multiple-choice' },
            { label: 'True/False', value: 'true-false' },
            { label: 'Short Answer', value: 'short-answer' },
          ],
          defaultValue: 'multiple-choice',
          label: 'Question Type',
          admin: {
            description: 'Select the type of question',
          },
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          label: 'Points',
          defaultValue: 1,
          min: 0,
          admin: {
            description: 'Point value for this question',
          },
        },
        // Multiple Choice - multiple options with multiple correct answers possible
        {
          name: 'multipleChoiceOptions',
          type: 'array',
          label: 'Answer Options',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'multiple-choice',
          },
          minRows: 2,
          fields: [
            {
              name: 'optionText',
              type: 'text',
              required: true,
              label: 'Option Text',
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
              label: 'Correct Answer',
              defaultValue: false,
            },
          ],
        },
        // True/False - multiple statements that can each be marked true or false
        {
          name: 'trueFalseOptions',
          type: 'array',
          label: 'Statements to Mark True/False',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'true-false',
          },
          minRows: 2,
          fields: [
            {
              name: 'statementText',
              type: 'text',
              required: true,
              label: 'Statement',
            },
            {
              name: 'isTrue',
              type: 'checkbox',
              label: 'Is True',
              defaultValue: false,
            },
          ],
        },
        // Short Answer - simple text answer
        {
          name: 'shortAnswer',
          type: 'group',
          label: 'Short Answer',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'short-answer',
          },
          fields: [
            {
              name: 'correctAnswer',
              type: 'text',
              required: true,
              label: 'Correct Answer',
            },
            {
              name: 'caseSensitive',
              type: 'checkbox',
              label: 'Case Sensitive',
              defaultValue: false,
            },
            {
              name: 'allowPartialMatch',
              type: 'checkbox',
              label: 'Allow Partial Match',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'explanation',
          type: 'text',
          label: 'Explanation',
          admin: {
            description: 'Explanation of the correct answer (shown after submission)',
          },
        },
      ],
    },
    {
      name: 'randomizeQuestions',
      type: 'checkbox',
      label: 'Randomize Question Order',
      defaultValue: false,
    },
    {
      name: 'showResults',
      type: 'checkbox',
      label: 'Show Results After Submission',
      defaultValue: true,
    },
    {
      name: 'allowRetakes',
      type: 'checkbox',
      label: 'Allow Retakes',
      defaultValue: false,
    },
    {
      name: 'maxAttempts',
      type: 'number',
      label: 'Maximum Attempts',
      min: 1,
      defaultValue: 1,
      admin: {
        condition: (data) => data?.allowRetakes,
        description: 'Maximum number of attempts allowed',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      label: 'Status',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Validate multiple choice questions have at least one correct answer
        if (data.questions) {
          data.questions.forEach((question: any, index: number) => {
            if (question.questionType === 'multiple-choice' && question.multipleChoiceOptions) {
              const hasCorrectOption = question.multipleChoiceOptions.some(
                (option: any) => option.isCorrect,
              )
              if (!hasCorrectOption) {
                throw new Error(`Question ${index + 1} must have at least one correct answer`)
              }
            }
          })
        }
        return data
      },
    ],
  },
  timestamps: true,
}

export interface ExamQuestion {
  questionText: any // text
  questionType: 'multiple-choice' | 'true-false' | 'short-answer'
  points: number
  multipleChoiceOptions?: {
    optionText: string
    isCorrect: boolean
  }[]
  trueFalseOptions?: {
    statementText: string
    isTrue: boolean
  }[]
  shortAnswer?: {
    correctAnswer: string
    caseSensitive: boolean
    allowPartialMatch: boolean
  }
  explanation?: any // text
}

export interface Exam {
  id: string
  title: string
  description?: string
  timeLimit: number
  passingScore: number
  questions: ExamQuestion[]
  randomizeQuestions: boolean
  showResults: boolean
  allowRetakes: boolean
  maxAttempts?: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}
