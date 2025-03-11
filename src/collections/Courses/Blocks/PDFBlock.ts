import { Block } from 'payload'

export const PDFBlock: Block = {
  slug: 'pdfContent',
  labels: {
    singular: 'PDF Content',
    plural: 'PDF Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'PDF Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'PDF Description',
    },
    {
      name: 'pdfFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'PDF File',
    },
  ],
}
