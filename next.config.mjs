/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      // Include Prisma engines in API routes
      "src/app/api/**": ["./node_modules/.prisma/client/**/*"],
    },
  },
};

export default nextConfig;
