// collections/Blocks/QuizBlock.ts
import { Block } from 'payload'

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
        {
          name: 'feedback',
          type: 'textarea',
          label: 'Option Feedback',
          admin: {
            description: 'Optional feedback to show when this option is selected',
          },
        },
      ],
      admin: {
        description: 'Add answer options for this question',
      },
      validate: (
        value: unknown[] | null | undefined,
        { siblingData }: { siblingData: { questionType?: 'single' | 'multiple' } },
      ): true | string => {
        // Ensure value is an array and not empty
        if (!Array.isArray(value) || value.length < 2) {
          return 'At least two options are required for a quiz question'
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
        const questionType = siblingData?.questionType

        if (questionType === 'single') {
          if (correctCount !== 1) {
            return 'Single-choice questions must have exactly one correct answer'
          }
        } else if (questionType === 'multiple') {
          if (correctCount < 1) {
            return 'Multiple-choice questions must have at least one correct answer'
          }
        } else if (!questionType) {
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
    {
      name: 'points',
      type: 'number',
      label: 'Points',
      defaultValue: 1,
      admin: {
        description: 'Number of points this question is worth',
      },
    },
    {
      name: 'timeLimit',
      type: 'number',
      label: 'Time Limit (seconds)',
      admin: {
        description: 'Optional time limit for answering this question (in seconds)',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      label: 'Difficulty Level',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
      defaultValue: 'medium',
      admin: {
        description: 'Difficulty level of this question',
      },
    },
  ],
}
