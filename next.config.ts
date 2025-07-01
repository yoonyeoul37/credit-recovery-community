import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 오류를 무시하고 진행
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류를 무시하고 진행  
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
