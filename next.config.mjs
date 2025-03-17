import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
  // Your Next.js config here
  images: {
    domains: ['bucket-production-9dc0.up.railway.app'],
  },
}

export default withPayload(nextConfig)
