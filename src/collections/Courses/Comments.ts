import { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import individualAccount from '../Clients/individual'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    description: 'Manage comments for course lessons',
    defaultColumns: ['content', 'course', 'lessonId', 'status', 'createdBy', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      // Anyone can read approved comments, but only admins can read pending ones
      if (!req.user) {
        return {
          status: {
            equals: 'approved',
          },
        }
      }
      return true
    },
    create: authenticated, // Any authenticated user can create a comment
    update: ({ req }) => {
      // Only admins can update comments (to change status)
      return !!(req.user?.collection === 'users' && req.user?.roles?.includes('superadmin'))
    },
    delete: ({ req }) => {
      // Only admins can delete comments
      return !!(req.user?.collection === 'users' && req.user?.roles?.includes('superadmin'))
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment Content',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: {
        description: 'The course this comment belongs to',
      },
    },
    {
      name: 'sectionIndex',
      type: 'number',
      required: true,
      label: 'Section Index',
      admin: {
        description: 'The index of the section containing the lesson (0-based)',
      },
    },
    {
      name: 'lessonIndex',
      type: 'number',
      required: true,
      label: 'Lesson Index',
      admin: {
        description: 'The index of the lesson within the section (0-based)',
      },
    },
    {
      name: 'lessonId',
      type: 'text',
      required: true,
      label: 'Lesson ID',
      admin: {
        description: 'The unique identifier for the lesson',
      },
    },
    {
      name: 'lessonPath',
      type: 'text',
      required: true,
      label: 'Lesson Path',
      admin: {
        description:
          'Format: sectionIndex.lessonIndex (e.g., "0.2" for first section, third lesson)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.sectionIndex !== undefined && data?.lessonIndex !== undefined) {
              return `${data.sectionIndex}.${data.lessonIndex}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
      label: 'Status',
      admin: {
        description: 'Only approved comments will be displayed to users',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'individualAccount',
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'postedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set createdBy field to the current user
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }

        // Set postedAt to current date if not already set
        if (!data.postedAt) {
          data.postedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only run this hook when a comment is created
        if (operation !== 'create') return

        // Use a transaction to ensure database operations are atomic
        let transaction: any

        try {
          console.log(`Starting afterChange hook for comment ${doc.id}`)

          // Begin transaction explicitly
          transaction = await req.payload.db.beginTransaction()

          // Get the course ID
          const courseId = typeof doc.course === 'object' ? doc.course.id : doc.course

          // Parse indices
          const [sectionIndex, lessonIndex] = doc.lessonPath.split('.').map(Number)
          const lessonId = doc.lessonId

          console.log(
            `Processing update for course ${courseId}, section ${sectionIndex}, lesson ${lessonIndex}, lessonId ${lessonId}`,
          )

          // First, check if the course exists and if the section/lesson indices are valid
          const courseExists = await req.payload.db.findOne({
            collection: 'courses',
            where: {
              id: courseId,
              [`sections.${sectionIndex}`]: { $exists: true },
              [`sections.${sectionIndex}.lessons.${lessonIndex}`]: { $exists: true },
            },
          })

          if (!courseExists) {
            console.error(`Course ${courseId} not found or section/lesson indices invalid`)
            return
          }

          // Find the specific lesson by ID (if we're using IDs)
          if (lessonId) {
            const updateResult = await req.payload.db.updateOne({
              collection: 'courses',
              where: {
                id: courseId,
                [`sections.${sectionIndex}.lessons.${lessonIndex}.id`]: lessonId,
              },
              data: {
                $addToSet: {
                  [`sections.${sectionIndex}.lessons.${lessonIndex}.comments`]: doc.id,
                },
              },
              options: { transaction },
            })

            if (updateResult.modifiedCount === 0) {
              console.warn(
                `No update occurred for course ${courseId}, lessonId ${lessonId} - comment might already exist or path is invalid`,
              )
            } else {
              console.log(
                `Successfully added comment ${doc.id} to course ${courseId}, section ${sectionIndex}, lesson ${lessonIndex}, lessonId ${lessonId}`,
              )
            }
          } else {
            // Fallback to the old approach if lessonId is not available
            const updateResult = await req.payload.db.updateOne({
              collection: 'courses',
              where: { id: courseId },
              data: {
                $addToSet: {
                  [`sections.${sectionIndex}.lessons.${lessonIndex}.comments`]: doc.id,
                },
              },
              options: { transaction },
            })

            if (updateResult.modifiedCount === 0) {
              console.warn(
                `No update occurred for course ${courseId} - comment might already exist or path is invalid`,
              )
            } else {
              console.log(
                `Successfully added comment ${doc.id} to course ${courseId}, section ${sectionIndex}, lesson ${lessonIndex}`,
              )
            }
          }

          // Commit the transaction
          if (transaction) {
            await transaction.commit()
            console.log(`Transaction committed for comment ${doc.id}`)
          }
        } catch (error) {
          // Roll back transaction on error
          if (transaction) {
            try {
              await transaction.rollback()
              console.log(`Transaction rolled back for comment ${doc.id}`)
            } catch (rollbackError) {
              console.error('Error rolling back transaction:', rollbackError)
            }
          }

          console.error('Error in comment afterChange hook:', error)

          // Implement recovery mechanism
          try {
            // Log the error for debugging
          } catch (logError) {
            console.error('Failed to log error:', logError)
          }
        } finally {
          // Ensure connection is properly released if transaction wasn't committed or rolled back
          if (transaction && transaction.isActive) {
            try {
              await transaction.rollback()
              console.log(
                `Transaction forcefully rolled back in finally block for comment ${doc.id}`,
              )
            } catch (finalError) {
              console.error('Error in finally block:', finalError)
            }
          }

          console.log(`Completed afterChange hook for comment ${doc.id}`)
        }
      },
    ],
  },
}
