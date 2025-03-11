import { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageContent',
  labels: {
    singular: 'Image Content',
    plural: 'Image Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Image Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Image Description',
    },
    {
      name: 'imageFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Image File',
    },
  ],
}
