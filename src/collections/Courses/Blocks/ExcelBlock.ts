import { Block } from 'payload'
export const ExcelBlock: Block = {
  slug: 'excelContent',
  labels: {
    singular: 'Excel Content',
    plural: 'Excel Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Excel Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Excel Description',
    },
    {
      name: 'excelFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Excel File',
    },
  ],
}
