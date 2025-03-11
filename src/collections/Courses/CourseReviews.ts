import { CollectionConfig } from 'payload'

export const CourseReviews: CollectionConfig = {
  slug: 'coursereviews',
  admin: {
    useAsTitle: 'courseTitle',
    description: 'Course reviews and ratings from users',
    defaultColumns: ['courseTitle', 'overallRating', 'reviewCount', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user: any } }) => Boolean(user),
    update: ({ req: { user } }: { req: { user: any } }) => Boolean(user?.collection === 'users'),
    delete: ({ req: { user } }: { req: { user: any } }) => Boolean(user?.collection === 'users'),
  },
  fields: [
    {
      name: 'courseTitle',
      type: 'text',
      required: true,
      label: 'Course Title',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Related Course',
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
        readOnly: true,
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      required: true,
      label: 'Review Count',
      admin: {
        readOnly: true,
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
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          label: 'User',
        },
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
          name: 'isFeatured', // New field to mark featured reviews
          type: 'checkbox',
          label: 'Feature This Review',
          defaultValue: false,
          admin: {
            description: 'Check to feature this review on the course page',
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
      ({ req, data }: { req: any; data: Partial<CourseReview> }) => {
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }
        if (data.reviews && data.reviews.length > 0) {
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

// Updated Interface
export interface Review {
  user: string | { id: string; [key: string]: any }
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  helpful: number
  isFeatured: boolean // Added to interface
}

export interface CourseReview {
  id: string
  courseTitle: string
  course: string
  overallRating: number
  reviewCount: number
  reviews: Review[]
  createdBy: string | { id: string }
  createdAt: string
  updatedAt: string
}
