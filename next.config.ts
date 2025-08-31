import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  trailingSlash: false,
  distDir: 'out',

  // 确保静态文件正确处理
  assetPrefix: '',

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

  // 实验性功能配置
  experimental: {
    // 完全禁用 webpackBuildWorker 以避免 Cloudflare Pages 构建问题
    webpackBuildWorker: false,
  },

  // Webpack 配置 - 只在生产环境禁用缓存
  webpack: (config, { dev, isServer }) => {
    // 只在生产环境禁用缓存
    if (!dev) {
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
    }

    return config;
  },
};

export default nextConfig;
