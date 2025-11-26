import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,  // SAFE
  // No experimental flags needed for Prisma
};

export default nextConfig;
