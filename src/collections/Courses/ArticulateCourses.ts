import { CollectionConfig } from 'payload'
import { extractZip } from '../../utilities/extractZip'
import path from 'path'
import { promisify } from 'util'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const existsAsync = promisify(fs.exists)
const mkdirAsync = promisify(fs.mkdir)

export const Articulate: CollectionConfig = {
  slug: 'articulateCourses',
  admin: {
    useAsTitle: 'title',
    description: 'Upload Articulate CMi5 courses here.',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    disableLocalStorage: false,
    staticDir: path.resolve(__dirname, '../../../uploads'),
    mimeTypes: [
      'application/zip',
      'application/x-zip-compressed',
      'apploication/x-zip',
      'application/x-compressed',
      'multipart/x-zip',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        console.log(`afterChange triggered (${operation}) for doc:`, doc)

        const filename = doc.filename
        console.log('Destructured filename:', filename)

        if (!filename) {
          console.log('No filename found in doc:', doc)
          return doc
        }

        const uploadDir = path.resolve(__dirname, '../../../uploads')
        const zipPath = path.join(uploadDir, filename)
        const extractDir = path.resolve(__dirname, '../../../storage/articulate', String(doc.id)) // Back to storage
        console.log('zipPath:', zipPath)
        console.log('extractDir:', extractDir)

        try {
          if (!(await existsAsync(extractDir))) {
            console.log('Creating extractDir:', extractDir)
            await mkdirAsync(extractDir, { recursive: true })
          }

          if (!(await existsAsync(zipPath))) {
            console.log('Zip file not found at:', zipPath)
            return doc
          }

          console.log('Extracting zip from', zipPath, 'to', extractDir)
          await extractZip(zipPath, extractDir)
          console.log('Extraction completed successfully')
        } catch (error) {
          console.error('Error in extraction process:', error)
          throw error
        }

        return doc
      },
    ],
  },
}
