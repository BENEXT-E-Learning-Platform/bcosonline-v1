import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/IsUserRole'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: anyone,
    update: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
