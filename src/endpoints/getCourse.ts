// endpoints/getCourse.ts
import { PayloadRequest } from 'payload'
import payload from 'payload'

export const getCourse = async (req: PayloadRequest, id: string) => {
  const course = await payload.findByID({ collection: 'courses', id, depth: 2 }) // Depth for relationships

  if (!req.user) {
    // Anonymous: Metadata only
    return {
      id: course.id,
      title: course.title,
      urlName: course.urlName,
      description: course.description,
      coverPhoto: course.coverPhoto,
      videoPreview: course.videoPreview,
      isPaid: course.isPaid,
      price: course.price,
      sections: course.sections?.map((section) => ({
        title: section.title,
        description: section.description,
        order: section.order,
        isPublic: section.isPublic,
        lessons:
          section.lessons?.map((lesson) => ({
            title: lesson.title,
            order: lesson.order,
          })) || [],
      })),
    }
  }

  // Authenticated (individualAccount user)
  const participationResult = await payload.find({
    collection: 'participation',
    where: { client: { equals: req.user.id }, course: { equals: course.id } },
    limit: 1,
  })
  const participation = participationResult.docs[0]
  const isEnrolled =
    participation && (course.isPaid === 'free' || participation.paymentStatus === 'paid')

  if (!isEnrolled) {
    // Authenticated, not enrolled: Metadata + public sections
    return {
      ...course,
      sections: course.sections?.map((section) =>
        section.isPublic
          ? section
          : {
              title: section.title,
              description: section.description,
              order: section.order,
              isPublic: section.isPublic,
              lessons: (section.lessons ?? []).map((lesson) => ({
                title: lesson.title,
                order: lesson.order,
              })),
            },
      ),
    }
  }

  // Enrolled: Full access
  return course
}
