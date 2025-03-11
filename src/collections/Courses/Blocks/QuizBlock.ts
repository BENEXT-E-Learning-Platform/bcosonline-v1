// collections/Blocks/QuizQuestion.ts
import { Block, ArrayFieldValidation } from 'payload'

export const QuizBlock: Block = {
  slug: 'quizQuestion',
  labels: {
    singular: 'Quiz Question',
    plural: 'Quiz Questions',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
      admin: {
        description: 'Enter the quiz question (e.g., "What is the capital of France?")',
      },
    },
    {
      name: 'questionType',
      type: 'select',
      required: true,
      label: 'Question Type',
      options: [
        { label: 'Single Choice', value: 'single' },
        { label: 'Multiple Choice', value: 'multiple' },
      ],
      defaultValue: 'single',
      admin: {
        description:
          'Choose whether this is a single-choice (one correct answer) or multiple-choice (one or more correct answers) question',
      },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Answer Options',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Option Text',
          admin: {
            description: 'Enter the text for this answer option (e.g., "Paris")',
          },
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Is Correct Answer',
          defaultValue: false,
          admin: {
            description: 'Check if this option is a correct answer',
          },
        },
      ],
      validate: (
        value: unknown[] | null | undefined,
        { data }: { data: { questionType?: 'single' | 'multiple' } },
      ): true | string => {
        // Ensure value is an array and not empty
        if (!Array.isArray(value) || value.length === 0) {
          return 'Options array must contain at least one item'
        }

        // Type guard for option shape
        const isValidOption = (option: unknown): option is { text: string; isCorrect: boolean } =>
          typeof option === 'object' &&
          option !== null &&
          'text' in option &&
          typeof option.text === 'string' &&
          'isCorrect' in option &&
          typeof option.isCorrect === 'boolean'

        if (!value.every(isValidOption)) {
          return 'All options must have a text string and isCorrect boolean'
        }

        // Count correct answers
        const correctCount = value.filter((option) => option.isCorrect).length

        // Validation based on questionType
        const questionType = data?.questionType as 'single' | 'multiple' | undefined
        if (questionType === 'single') {
          if (correctCount !== 1) {
            return 'Single-choice questions must have exactly one correct answer'
          }
        } else if (questionType === 'multiple') {
          if (correctCount < 1) {
            return 'Multiple-choice questions must have at least one correct answer'
          }
        } else {
          return 'Question type must be specified'
        }

        return true
      },
    },
    {
      name: 'explanation',
      type: 'textarea',
      label: 'Explanation (Optional)',
      admin: {
        description: 'Optional explanation to display after the quiz is answered',
      },
    },
  ],
}

// Updated Interface
export interface QuizBlock {
  blockType: 'quizQuestion'
  question: string
  questionType: 'single' | 'multiple'
  options: {
    text: string
    isCorrect: boolean
  }[]
  explanation?: string
}
