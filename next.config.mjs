import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
  // Your Next.js config here
  images: {
    domains: [
      'bucket-production-9dc0.up.railway.app',
      'images.unsplash.com',
      'img.freepik.com',
      'online.bcos-dz.com',
      'plus.unsplash.com',
      'randomuser.me'
    ],
  },
}

export default withPayload(nextConfig)
