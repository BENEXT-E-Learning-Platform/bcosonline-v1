// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Comments } from '@/collections/Courses/Comments'
import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

import { s3Storage } from '@payloadcms/storage-s3'
import { individualAccount } from './collections/Clients/individual'
import brevoAdapter from '@/utilities/brevoAdapter'

import { Courses } from './collections/Courses/Courses'
import { Participation } from './collections/Courses/Participation'
import { Instructors } from '@/collections/Instructors'
import businessAcounts from './collections/Clients/business'
import { CourseReviews } from './collections/Courses/CourseReviews'
import { Certificates } from './collections/Courses/Certificates'
import { Videos } from './collections/Courses/Videos'
import { Exams } from './collections/Courses/Exam/Exams'
import { ExamSubmissions } from './collections/Courses/Exam/ExamSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  email: brevoAdapter(),
  // This config helps us configure global or default features that the other editors can inherit
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Media,
    Categories,
    Users,
    Comments,
    individualAccount,
    Courses,
    Instructors,
    Participation,
    businessAcounts,
    CourseReviews,
    Certificates,
    Videos,
    Exams,
    ExamSubmissions,
  ],

  plugins: [
    s3Storage({
      collections: {
        media: true,
        videos: true,
      },
      bucket: process.env.MINIO_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.MINIO_ROOT_USER || '',
          secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
        },
        region: process.env.MINIO_REGION || 'us-east-1',
        endpoint: process.env.MINIO_PUBLIC_ENDPOINT || '',
        forcePathStyle: true, // Required for MinIO       // ... Other S3 configuration
      },
    }),
  ],

  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async (req) => {
        return new Response('OK', { status: 200 })
      },
    },
  ],
  secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET_REPLACE_ME',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
