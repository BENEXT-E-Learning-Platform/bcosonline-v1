import { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'name',
    description: 'Define certificate templates for courses',
    defaultColumns: ['name', 'createdAt'],
  },
  access: {
    read: () => true, // Allow public read access for now; adjust as needed
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Certificate Name',
      admin: {
        description:
          'A descriptive name for this certificate template (e.g., "Completion Certificate")',
      },
    },
    {
      name: 'template',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Certificate Template',
      admin: {
        description:
          'Upload a template file (e.g., PDF or image) with placeholders for dynamic data like the client name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional details about this certificate template',
      },
    },
    {
      name: 'createdTo',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.createdTo) {
          data.createdTo = req.user.id
        }
        return data
      },
    ],
  },
}

export interface Certificate {
  id: string
  name: string
  template: string // ID of the media file
  description?: string
  createdTo: string | { id: string }
  createdAt: string
  updatedAt: string
}
