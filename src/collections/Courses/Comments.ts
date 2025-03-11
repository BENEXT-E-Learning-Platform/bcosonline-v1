import { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    description: 'Manage comments for course lessons',
    defaultColumns: ['content', 'course', 'lessonPath', 'status', 'createdBy', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      // Anyone can read approved comments, but only admins can read pending ones
      if (!req.user) {
        return {
          status: {
            equals: 'approved',
          },
        }
      }
      return true
    },
    create: authenticated, // Any authenticated user can create a comment
    update: ({ req }) => {
      // Only admins can update comments (to change status)
      return !!(req.user?.collection === 'users' && req.user?.roles?.includes('superadmin'))
    },
    delete: ({ req }) => {
      // Only admins can delete comments
      return !!(req.user?.collection === 'users' && req.user?.roles?.includes('superadmin'))
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment Content',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: {
        description: 'The course this comment belongs to',
      },
    },
    {
      name: 'lessonPath',
      type: 'text',
      required: true,
      label: 'Lesson Path',
      admin: {
        description:
          'Format: sectionIndex.lessonIndex (e.g., "0.2" for first section, third lesson)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
      label: 'Status',
      admin: {
        description: 'Only approved comments will be displayed to users',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'postedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set createdBy field to the current user
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }

        // Set postedAt to current date if not already set
        if (!data.postedAt) {
          data.postedAt = new Date().toISOString()
        }

        return data
      },
    ],
    // Completely removed the afterChange hook since it's not needed
  },
}

export interface Comment {
  id: string
  content: string
  course: string | { id: string }
  lessonPath: string
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string | { id: string }
  postedAt: string
  createdAt: string
  updatedAt: string
}
