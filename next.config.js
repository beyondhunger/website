/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/services': ['./node_modules/.prisma/**/*']
  }
};

module.exports = nextConfig;
