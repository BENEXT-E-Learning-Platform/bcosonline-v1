import { isSuperAdmin } from '@/access/IsUserRole'
import { CollectionConfig } from 'payload'

export const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'timeLimit', 'passingScore', 'status', 'submissionCount'],
    description: 'Create and manage exams that can be assigned to courses',
    group: 'Education',
  },
  access: {
    create: isSuperAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true // Admins can read all
      if (user.collection === 'individualAccount') {
        return { status: { equals: 'published' } } // Clients can only see published exams
      }
      return false
    },
    update: isSuperAdmin,
    delete: isSuperAdmin,
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
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: {
        description: 'The course this exam belongs to',
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
        // Multiple Choice
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
        // True/False
        {
          name: 'trueFalseOptions',
          type: 'array',
          label: 'Statements to Mark True/False',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'true-false',
          },
          minRows: 1, // Changed to 1 to allow single-statement T/F questions
          fields: [
            {
              name: 'statementText',
              type: 'text',
              required: true,
              label: 'Statement',
            },
            {
              name: 'isTrue',
              type: 'radio',
              options: [
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ],
              defaultValue: 'false',
              label: 'Is True',
              admin: {
                layout: 'horizontal',
              },
            },
          ],
        },
        // Short Answer
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
      name: 'submissionCount',
      type: 'number',
      label: 'Submission Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of submissions for this exam',
      },
    },
    {
      name: 'submissions',
      type: 'relationship',
      relationTo: 'exam-submissions',
      hasMany: true,
      label: 'Submissions',
      admin: {
        readOnly: true,
        description: 'List of submissions for this exam',
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
            if (question.questionType === 'true-false' && question.trueFalseOptions) {
              const hasStatements = question.trueFalseOptions.length > 0
              if (!hasStatements) {
                throw new Error(`Question ${index + 1} must have at least one statement`)
              }
            }
          })
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const { payload } = req
        // Update submissionCount based on related submissions
        const submissions = await payload.find({
          collection: 'exam-submissions',
          where: { exam: { equals: doc.id } },
          limit: 0, // No limit to count all submissions
        })
        const submissionCount = submissions.totalDocs
        await payload.update({
          collection: 'exams',
          id: doc.id,
          data: { submissionCount },
        })
      },
    ],
  },
  timestamps: true,
}
