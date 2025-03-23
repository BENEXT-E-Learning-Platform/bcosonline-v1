// src/app/api/video/getMinioSecureUrl/route.ts
import { Client } from 'minio'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json()
    const { videoId, bucketName, quality } = body

    const endpointUrl = process.env.MINIO_ENDPOINT || ''

    // Remove the protocol and port from the endpoint if present
    const formattedEndpoint = endpointUrl
      .replace(/^https?:\/\//, '') // Remove http:// or https://
      .split(':')[0] // Remove port if included

    // Set up MinIO client
    const minioClient = new Client({
      endPoint: formattedEndpoint, // Just the hostname without protocol or port
      port: parseInt(process.env.MINIO_PORT || '443'), // Probably 443 for HTTPS
      useSSL: true, // If using https://
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
    })

    console.log(
      `Connecting to MinIO at: ${formattedEndpoint} on port ${process.env.MINIO_PORT || '443'}`,
    )
    console.log(`Looking for object: ${videoId} in bucket: ${bucketName}`)

    const encodedVideoId = encodeURIComponent(videoId)
    const url = await minioClient.presignedGetObject(bucketName, encodedVideoId, 15 * 60)
    console.log(`Generated URL: ${url}`)
    // Return the URL and when it expires
    return NextResponse.json({
      url,
      expiresAt: Date.now() + 15 * 60 * 1000,
    })
  } catch (error) {
    console.error('MinIO URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate secure URL', details: (error as Error).message },
      { status: 500 },
    )
  }
}
