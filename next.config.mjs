/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Only use basePath if deploying to a subdirectory like github.io/repo-name
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

export default nextConfig
