import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  trailingSlash: true,

  // 优化图片
  images: {
    unoptimized: true // 对于静态部署
  },

  // 压缩配置
  compress: true,
};

export default nextConfig;
