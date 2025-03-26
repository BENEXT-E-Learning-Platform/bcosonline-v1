import { CollectionConfig } from 'payload'
import { Coursereview } from '@/payload-types'
import { isInternalUser } from '@/access/IsUserRole'
import { authenticated } from '@/access/authenticated'

export const CourseReviews: CollectionConfig = {
  slug: 'coursereviews',
  admin: {
    useAsTitle: 'title',
    description: 'Course reviews and ratings from users',
    defaultColumns: ['course', 'overallRating', 'reviewCount', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      // Anyone can read approved reviews, but only admins can read pending ones
      if (!req.user) {
        return {
          'reviews.status': {
            equals: 'approved',
          },
        }
      }
      return true
    },
    create: authenticated, // Any authenticated user can create a review
    update: ({ req }) => {
      // Only admins can update reviews (to change status)
      // Users can mark helpful or submit new reviews
      return true
    },
    delete: ({ req }) => {
      // Only admins can delete reviews
      return !!(req.user?.collection === 'users' && req.user?.roles?.includes('superadmin'))
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      label: 'Review Title',
      admin: {
        description: 'Auto-generated from related course',
      },
      hooks: {
        beforeValidate: [
          async ({ value, data, req }) => {
            if (data?.course) {
              try {
                // Get the course title
                const courseId = typeof data.course === 'object' ? data.course.id : data.course
                const course = await req.payload.findByID({
                  collection: 'courses',
                  id: courseId,
                })
                return `Reviews for ${course.title}`
              } catch (err) {
                console.error('Error getting course title:', err)
                return value || 'Course Reviews'
              }
            }
            return value || 'Course Reviews'
          },
        ],
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Related Course',
      hasMany: false,
    },
    {
      name: 'overallRating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
      required: true,
      label: 'Overall Rating',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      required: true,
      label: 'Review Count',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviews',
      type: 'array',
      label: 'Reviews',
      admin: {
        description: 'All reviews for this course',
      },
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          required: true,
          label: 'Rating',
        },
        {
          name: 'comment',
          type: 'textarea',
          label: 'Review Comment',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ],
          defaultValue: 'pending',
          required: true,
          label: 'Review Status',
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Review Date',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'helpful',
          type: 'number',
          defaultValue: 0,
          label: 'Helpful Votes',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Feature This Review',
          defaultValue: false,
          admin: {
            description: 'Check to feature this review on the course page',
          },
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'individualAccount',
          required: true,
          label: 'User',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      async ({
        req,
        data,
        operation,
      }: {
        req: any
        data: Partial<Coursereview>
        operation: string
      }) => {
        // Set createdBy field to the current user if it's a new document
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }

        // Automatically set the user field for new reviews
        if (data.reviews && data.reviews.length > 0) {
          // Only process the newly added reviews
          const existingReviews = operation === 'update' ? data.reviews.slice(0, -1) : []
          const newReviews =
            operation === 'update' ? [data.reviews[data.reviews.length - 1]] : data.reviews

          // Set the user for each new review
          newReviews.forEach((review) => {
            if (!review.user && req.user) {
              review.user = req.user.id
            }

            // Set createdAt if not already set
            if (!review.createdAt) {
              review.createdAt = new Date().toISOString()
            }
          })

          // Recombine the reviews array
          data.reviews = [...existingReviews, ...newReviews]

          // Calculate review statistics
          const approvedReviews = data.reviews.filter((review) => review.status === 'approved')
          data.reviewCount = approvedReviews.length
          data.overallRating =
            approvedReviews.length > 0
              ? parseFloat(
                  (
                    approvedReviews.reduce((acc, review) => acc + review.rating, 0) /
                    approvedReviews.length
                  ).toFixed(1),
                )
              : 0
        } else {
          data.overallRating = 0
          data.reviewCount = 0
        }

        return data
      },
    ],
  },
}
