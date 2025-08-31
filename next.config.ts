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

  // 暂时禁用 ESLint 以避免缓存文件
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 完全禁用缓存
  experimental: {
    webpackBuildWorker: false,
  },

  // Webpack 配置 - 彻底禁用所有缓存
  webpack: (config, { dev, isServer }) => {
    // 完全禁用缓存
    config.cache = false;

    // 禁用文件系统缓存
    if (config.infrastructureLogging) {
      config.infrastructureLogging.level = 'error';
    }

    // 禁用持久化缓存
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
      buildDependencies: {
        hash: false,
        timestamp: false
      }
    };

    return config;
  },
};

export default nextConfig;
