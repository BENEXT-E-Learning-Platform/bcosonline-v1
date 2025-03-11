import { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoContent',
  labels: {
    singular: 'Video Content',
    plural: 'Video Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Video Description',
    },
    {
      name: 'videoFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Video File',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (seconds)',
    },
  ],
}
