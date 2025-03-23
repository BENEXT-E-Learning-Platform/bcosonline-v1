import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { getPayload } from 'payload'
import payloadConfig from '../../../../payload.config'

// Handles GET requests to /api/courses/[articulateId]/...
export async function GET(req: NextRequest, { params }: { params: { articulateId: string[] } }) {
  // Extract the course ID and file path segments from the dynamic route params
  const { articulateId } = await params
  const id = articulateId[0] // First segment is the course ID (e.g., "12")
  const filePathSegments = articulateId.slice(1).join('/') || 'scormcontent/index.html' // Remaining segments or default to index.html

  // Initialize Payload with the provided config to access auth utilities
  const payload = await getPayload({ config: payloadConfig })

  // Check if the user is authenticated using Payload's auth method
  const authResult = await payload.auth(req)
  console.log('Auth result:', authResult)

  // If no user is authenticated, redirect to /login instead of serving content
  if (!authResult.user) {
    console.log('No user authenticated, redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url)) // Redirect to /login
  }

  // Define the base directory for the course files
  const baseDir = path.resolve(process.cwd(), 'storage/articulate', id)

  // Resolve the full file path from the base directory and requested segments
  const fullPath = path.resolve(baseDir, filePathSegments)

  // Log request details for debugging
  console.log('Requested URL:', req.url)
  console.log('Course ID:', id)
  console.log('File path segments:', filePathSegments)
  console.log('Full path:', fullPath)

  // Prevent directory traversal attacks by ensuring the path stays within baseDir
  if (!fullPath.startsWith(baseDir)) {
    console.log('Invalid path detected')
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
  }

  try {
    // Read the requested file from the filesystem
    const content = await fs.readFile(fullPath)

    // Determine the Content-Type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentType =
      {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png', // For assets like small.png
      }[ext] || 'application/octet-stream'

    // Log the file being served
    console.log('Serving file with Content-Type:', contentType)

    // Return the file content with the appropriate Content-Type header
    return new NextResponse(content, {
      headers: { 'Content-Type': contentType },
    })
  } catch (error) {
    // Log and return a 404 if the file isn’t found
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
