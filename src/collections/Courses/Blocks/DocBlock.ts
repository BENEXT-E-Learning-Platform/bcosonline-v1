import { Block } from 'payload'

export const DocBlock: Block = {
  slug: 'docContent',
  labels: {
    singular: 'Document Content',
    plural: 'Document Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Document Description',
    },
    {
      name: 'docFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Document File',
    },
  ],
}
