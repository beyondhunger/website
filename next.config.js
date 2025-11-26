/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      // include prisma engine inside serverless bundle
      "src/app/api/**": ["./node_modules/.prisma/client/**/*"]
    },
  },
};

module.exports = nextConfig;
