import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const File: CollectionConfig = {
  slug: 'file',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
  ],
  upload: {
    // Use a function to dynamically set the storage path based on file typ
    disableLocalStorage: true,
    adminThumbnail: 'thumbnail',

    mimeTypes: [
      'application/pdf',
      'application/x-excel',
      'application/excel',
      'application/vnd.ms-excel',
      'application/x-msexcel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ], // Restrict to images only
  },
}
