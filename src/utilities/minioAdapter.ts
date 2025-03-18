import * as Minio from 'minio'

let minioClient: Minio.Client

// Enhanced debug function to check MinIO configuration
const debugMinioConfig = () => {
  console.log('=== MinIO Configuration Debug ===')
  console.log('MINIO_ENDPOINT:', process.env.MINIO_ENDPOINT || 'Not set (using default: localhost)')
  console.log('MINIO_PORT:', process.env.MINIO_PORT || 'Not set (using default: 9000)')
  console.log('MINIO_USE_SSL:', process.env.MINIO_USE_SSL || 'Not set (using default: false)')
  console.log('MINIO_ACCESS_KEY:', process.env.MINIO_ACCESS_KEY ? 'Set' : 'Not set')
  console.log('MINIO_SECRET_KEY:', process.env.MINIO_SECRET_KEY ? 'Set' : 'Not set')
  console.log('Bucket Name:', bucketName)
  console.log('===============================')
}

// Initialize MinIO client with better error handling
export const initializeMinioClient = async () => {
  if (!minioClient) {
    // Debug the configuration before initializing the client
    debugMinioConfig()

    try {
      minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: Number(process.env.MINIO_PORT) || 9000,
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || '',
        secretKey: process.env.MINIO_SECRET_KEY || '',
      })

      // Test the connection immediately to validate configuration
      await minioClient
        .listBuckets()
        .then(() => console.log('=== MinIO connection successful ==='))
        .catch((err) => {
          console.error('MinIO connection test failed:', err)
          // Continue anyway - don't throw here as we still want to return the client
        })
    } catch (error) {
      console.error('Failed to initialize MinIO client:', error)
      throw new Error(
        `MinIO client initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
  return minioClient
}

const bucketName = process.env.MINIO_BUCKET_NAME || 'firstbucket'

/**
 * Generate a URL for a file in the MinIO bucket with enhanced error handling.
 * @param fileName - The name of the file in the bucket.
 * @param isPublic - Whether the file is publicly accessible.
 * @returns The URL to access the file.
 */
export const getFileUrl = async (fileName: string, isPublic: boolean = false): Promise<string> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO getFileUrl: Getting URL for "${fileName}" in bucket "${bucketName}"`)

    if (isPublic) {
      // If the file is public, return the direct URL
      const directUrl = `https://${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`
      console.log(`MinIO getFileUrl: Returning public URL: ${directUrl}`)
      return directUrl
    } else {
      // If the file is private, generate a pre-signed URL
      const expiry = 24 * 60 * 60 // URL expires in 24 hours
      const presignedUrl = await client.presignedGetObject(bucketName, fileName, expiry)
      console.log(`MinIO getFileUrl: Generated presigned URL for "${fileName}"`)
      return presignedUrl
    }
  } catch (error) {
    console.error(`MinIO getFileUrl Error for "${fileName}":`, error)
    throw error
  }
}

/**
 * Check if a file exists in the MinIO bucket with enhanced error handling.
 * @param fileName - The name of the file to check.
 * @returns Whether the file exists.
 */
export const fileExists = async (fileName: string): Promise<boolean> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO fileExists: Checking if "${fileName}" exists in bucket "${bucketName}"`)

    await client.statObject(bucketName, fileName)
    console.log(`MinIO fileExists: File "${fileName}" exists`)
    return true
  } catch (error) {
    // Check if this is a "not found" error, which is expected if the file doesn't exist
    if (error instanceof Error && error.message.includes('Not Found')) {
      console.log(`MinIO fileExists: File "${fileName}" does not exist`)
      return false
    }

    // If it's any other error, log it as a true error
    console.error(`MinIO fileExists Error for "${fileName}":`, error)
    return false
  }
}

/**
 * List all files in the bucket for debugging purposes.
 * @returns Array of file names in the bucket.
 */
export const listAllFiles = async (): Promise<string[]> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO listAllFiles: Listing all files in bucket "${bucketName}"`)

    const fileNames: string[] = []
    const stream = client.listObjects(bucketName, '', true)

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) {
          fileNames.push(obj.name)
        }
      })

      stream.on('end', () => {
        console.log(`MinIO listAllFiles: Found ${fileNames.length} files in bucket "${bucketName}"`)
        resolve(fileNames)
      })

      stream.on('error', (err) => {
        console.error(`MinIO listAllFiles Error:`, err)
        reject(err)
      })
    })
  } catch (error) {
    console.error(`MinIO listAllFiles Error:`, error)
    throw error
  }
}

/**
 * Upload a file to the MinIO bucket with enhanced error handling.
 * @param fileName - The name of the file to upload.
 * @param fileBuffer - The file data as a Buffer.
 * @param isPublic - Whether the file should be publicly accessible.
 * @returns The file name if the upload is successful.
 */
export const uploadFile = async (
  fileName: string,
  fileBuffer: Buffer,
  isPublic: boolean = false,
): Promise<string> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO uploadFile: Uploading "${fileName}" to bucket "${bucketName}"`)

    const metaData = {
      'Content-Type': 'application/octet-stream', // Default MIME type
    }

    await client.putObject(bucketName, fileName, fileBuffer, fileBuffer.length, metaData)
    console.log(`MinIO uploadFile: Successfully uploaded "${fileName}"`)

    if (isPublic) {
      // Set the file as publicly accessible
      await client.setBucketPolicy(
        bucketName,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/${fileName}`],
            },
          ],
        }),
      )
      console.log(`MinIO uploadFile: Set "${fileName}" as publicly accessible`)
    }

    return fileName
  } catch (error) {
    console.error(`MinIO uploadFile Error for "${fileName}":`, error)
    throw error
  }
}

/**
 * Delete a file from the MinIO bucket with enhanced error handling.
 * @param fileName - The name of the file to delete.
 * @returns Whether the file was successfully deleted.
 */
export const deleteFile = async (fileName: string): Promise<boolean> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO deleteFile: Deleting "${fileName}" from bucket "${bucketName}"`)

    await client.removeObject(bucketName, fileName)
    console.log(`MinIO deleteFile: Successfully deleted "${fileName}"`)
    return true
  } catch (error) {
    console.error(`MinIO deleteFile Error for "${fileName}":`, error)
    return false
  }
}

/**
 * Download a file from the MinIO bucket with enhanced error handling.
 * @param fileName - The name of the file to download.
 * @returns The file data as a Buffer.
 */
export const downloadFile = async (fileName: string): Promise<Buffer> => {
  try {
    const client = await initializeMinioClient()
    console.log(`MinIO downloadFile: Downloading "${fileName}" from bucket "${bucketName}"`)

    return new Promise(async (resolve, reject) => {
      const chunks: Uint8Array[] = []

      const dataStream = await client.getObject(bucketName, fileName)

      dataStream.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk)
      })

      dataStream.on('end', () => {
        const fileBuffer: Buffer = Buffer.concat(chunks)
        console.log(`MinIO downloadFile: Successfully downloaded "${fileName}"`)
        resolve(fileBuffer)
      })

      dataStream.on('error', (err: Error): void => {
        console.error(`MinIO downloadFile Stream Error for "${fileName}":`, err)
        reject(err)
      })
    })
  } catch (error) {
    console.error(`MinIO downloadFile Error for "${fileName}":`, error)
    throw error
  }
}

// Example usage of the functions
;(async () => {
  try {
    // Initialize the MinIO client
    await initializeMinioClient()

    // Upload a file
    const fileName = 'example.txt'
    const fileBuffer = Buffer.from('Hello, MinIO!')
    await uploadFile(fileName, fileBuffer, true)

    // Get the file URL
    const fileUrl = await getFileUrl(fileName, true)
    console.log(`File URL: ${fileUrl}`)

    // Check if the file exists
    const exists = await fileExists(fileName)
    console.log(`File exists: ${exists}`)

    // List all files in the bucket
    const files = await listAllFiles()
    console.log(`Files in bucket: ${files.join(', ')}`)

    // Download the file
    const downloadedFileBuffer = await downloadFile(fileName)
    console.log(`Downloaded file content: ${downloadedFileBuffer.toString()}`)

    // Delete the file
    const isDeleted = await deleteFile(fileName)
    console.log(`File deleted: ${isDeleted}`)
  } catch (error) {
    console.error('Error in example usage:', error)
  }
})()
