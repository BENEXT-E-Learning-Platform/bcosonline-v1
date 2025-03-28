// collections/Courses.ts
import { CollectionConfig, Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { QuizBlock } from './Blocks/QuizBlock'
import { VideoBlock } from './Blocks/VideoBlock'
import { PDFBlock } from './Blocks/PDFBlock'
import { ExcelBlock } from './Blocks/ExcelBlock'
import { DocBlock } from './Blocks/DocBlock'
import { ImageBlock } from './Blocks/ImageBlock'

const contentBlocks: Block[] = [VideoBlock, PDFBlock, ExcelBlock, DocBlock, ImageBlock, QuizBlock]

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage courses for the LMS',
    defaultColumns: ['title', 'instructor', 'state', 'createdAt'],
  },
  access: {
    read: async ({ req: { user } }) => {
      if (!user) return true // Anonymous can see metadata; filter in resolver
      return Boolean(user) // Authenticated/enrolled handled in resolver
    },
    create: ({ req: { user } }) => user?.collection === 'users', // Admins only
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Course Title' },
    {
      name: 'urlName',
      type: 'text',
      required: true,
      label: 'URL Name',
      admin: { description: 'Lowercase course name for URL display' },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            !value && data?.title
              ? data.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
              : value,
        ],
      },
    },
    {
      name: 'state',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Pending', value: 'pending' },
      ],
      defaultValue: 'draft',
      required: true,
      label: 'Course State',
    },
    {
      name: 'description',
      type: 'group',
      label: 'Course Description',
      fields: [
        {
          name: 'details',
          type: 'group',
          label: 'Course Details',
          fields: [
            {
              name: 'challenges',
              type: 'array',
              label: 'Course Challenges',
              fields: [
                {
                  name: 'point',
                  type: 'richText',
                  required: true,
                  label: 'Challenge',
                  editor: lexicalEditor({}),
                },
              ],
            },
            {
              name: 'overview',
              type: 'array',
              label: 'Course Overview',
              fields: [
                {
                  name: 'point',
                  type: 'richText',
                  required: true,
                  label: 'Overview Point',
                  editor: lexicalEditor({}),
                },
              ],
            },
            {
              name: 'outcomes',
              type: 'array',
              label: 'Course Outcomes',
              fields: [
                {
                  name: 'point',
                  type: 'richText',
                  required: true,
                  label: 'Outcome',
                  editor: lexicalEditor({}),
                },
              ],
            },
            {
              name: 'targetAudience',
              type: 'array',
              label: 'Target Audience',
              fields: [
                {
                  name: 'point',
                  type: 'richText',
                  required: true,
                  label: 'Audience',
                  editor: lexicalEditor({}),
                },
              ],
            },
          ],
        },
        {
          name: 'infos',
          type: 'group',
          label: 'Course Information',
          fields: [
            { name: 'numberOfVideos', type: 'number', required: true, label: 'Number of Videos' },
            {
              name: 'numberOfSections',
              type: 'number',
              required: true,
              label: 'Number of Sections',
            },
            {
              name: 'numberOfPracticalFiles',
              type: 'number',
              required: true,
              label: 'Number of Practical Files',
            },
            {
              name: 'numberOfPracticalExamples',
              type: 'number',
              required: true,
              label: 'Number of Practical Examples',
            },
            { name: 'courseTime', type: 'number', required: true, label: 'Course Time (minutes)' },
          ],
        },
      ],
    },
    {
      name: 'coverPhoto',
      label: 'Cover Photo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    { name: 'videoPreview', label: 'Video Preview', type: 'relationship', relationTo: 'videos' },
    {
      name: 'enrollmentType',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      defaultValue: 'public',
      required: true,
      label: 'Enrollment Type',
    },
    {
      name: 'isPaid',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
      defaultValue: 'free',
      required: true,
      label: 'Pricing',
    },
    {
      name: 'price',
      type: 'number',
      required: false,
      label: 'Price',
      admin: { condition: (data) => data.isPaid === 'paid' },
      validate: (value: number | number[] | null | undefined, { data }: { data: any }) => {
        if (Array.isArray(value)) return true
        return data.isPaid === 'paid' && (value === undefined || value === null || value <= 0)
          ? 'Price is required for paid courses and must be greater than 0'
          : true
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Section Title' },
        { name: 'description', type: 'textarea', label: 'Section Description' },
        { name: 'order', type: 'number', required: true, defaultValue: 0, label: 'Section Order' },
        {
          name: 'isPublic',
          type: 'checkbox',
          label: 'Make Section Public',
          defaultValue: false,
          admin: {
            description: 'Allow authenticated users (non-enrolled) to view this sections content.',
          },
        },
        {
          name: 'lessons',
          type: 'array',
          label: 'Lessons',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Lesson Title' },
            { name: 'description', type: 'textarea', label: 'Lesson Description' },
            {
              name: 'id',
              type: 'text',
              required: true,
              label: 'Lesson ID',
              admin: {
                description: 'Unique identifier for this lesson',
              },
              hooks: {
                beforeValidate: [
                  ({ value }) => {
                    // Generate a unique ID if one doesn't exist
                    if (!value) {
                      return `lesson_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'order',
              type: 'number',
              required: true,
              defaultValue: 0,
              label: 'Lesson Order',
            },
            { name: 'contentItems', type: 'blocks', label: 'Content Items', blocks: contentBlocks },
            {
              name: 'comments',
              type: 'relationship',
              relationTo: 'comments',
              hasMany: true,
              label: 'Comments',
              admin: {
                description: 'Comments associated with this lesson',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'instructors',
      required: true,
      label: 'Instructor',
    },

    {
      name: 'exam', // New field to link an exam
      type: 'relationship',
      relationTo: 'exams',
      required: false,
      label: 'Related Exam',
      admin: {
        description: 'Select an exam to associate with this course',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
    },
    // Add this field to the Courses.ts fields array
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'coursereviews',
      hasMany: true,
      label: 'Course Reviews',
      admin: {
        description: 'Reviews associated with this course',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.createdBy) data.createdBy = req.user.id
        return data
      },
    ],
  },
}
