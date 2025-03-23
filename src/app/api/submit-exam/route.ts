import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getClient } from '@/app/(app)/(authenticated)/_actions/getClient'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const data = await request.json()

  // Check for authenticated user
  const user = await getClient()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: No authenticated user' }, { status: 401 })
  }

  // Validate that the client field matches the authenticated user or set it
  if (!data.client || data.client !== user.id) {
    data.client = user.id // Ensure the client field is set to the authenticated user's ID
  }

  try {
    const submission = await payload.create({
      collection: 'exam-submissions',
      data: {
        ...data,
        status: 'pending',
        submissionDate: new Date().toISOString(),
      },
    })

    return NextResponse.json(submission, { status: 200 })
  } catch (error) {
    console.error('Error creating exam submission:', error)
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 })
  }
}
