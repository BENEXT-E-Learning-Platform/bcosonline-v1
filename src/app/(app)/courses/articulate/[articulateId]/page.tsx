import { notFound } from 'next/navigation'

export default async function ArticulateCoursePage({
  params,
}: {
  params: { articulateId: string }
}) {
  const { articulateId } = await params

  if (!articulateId) {
    notFound() // Replaces the loading check; redirects to 404 if no ID
  }

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        src={
          `/api/courses/${articulateId}/scormcontent/index.html`
          // `/articulate/${articulateId}/story.html`
        }
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Articulate Course"
      />
    </div>
  )
}
