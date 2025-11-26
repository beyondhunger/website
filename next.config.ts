/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  experimental: {
    serverMinification: false,
  },
};

module.exports = nextConfig;
