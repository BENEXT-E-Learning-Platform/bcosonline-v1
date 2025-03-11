// collections/Videos.js
import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'duration',
      type: 'number',
      label: 'Duration (seconds)',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'hlsUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  upload: {
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
    adminThumbnail: () => null,
  },
}
