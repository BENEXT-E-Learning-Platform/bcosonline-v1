import { isSuperAdmin } from '@/access/IsUserRole'
import { CollectionConfig } from 'payload'

// Instructors Collection
export const Instructors: CollectionConfig = {
  slug: 'instructors',
  admin: {
    useAsTitle: 'name',
    description: 'Instructors for LMS courses',
  },
  access: {
    // Only admins can create, update, and delete instructors
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
    // Anyone can read instructors (e.g., for displaying in course details)
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Instructor Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Instructor Description',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true, // Ensure no duplicate instructor emails
      label: 'Instructor Email',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Instructor Photo',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
      // Automatically set when created
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}

// TypeScript Interface for Instructor
export interface Instructor {
  id: string
  name: string
  description?: string
  email: string
  photo?: string | { id: string } // Media reference
  createdBy: string | { id: string }
  createdAt: string
  updatedAt: string
}
