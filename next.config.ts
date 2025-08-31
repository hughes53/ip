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

  // 禁用缓存以避免大文件
  experimental: {
    webpackBuildWorker: false,
  },

  // Webpack 配置
  webpack: (config, { dev, isServer }) => {
    // 在生产环境中禁用持久化缓存
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
