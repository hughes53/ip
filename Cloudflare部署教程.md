# Cloudflare Pages 部署教程

## 🎯 重要提醒

⚠️ **关键配置**: Build output directory 必须设置为 `out`，否则会出现 404 错误！

## 1. 准备 GitHub 仓库

1. 访问 [hughes53/ip](https://github.com/hughes53/ip)
2. 点击右上角的 "Fork" 按钮创建你自己的副本

## 2. 在 Cloudflare Pages 中部署

### 2.1 前置准备
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 在左侧菜单找到并点击 "Pages"
3. 点击 "Create a project" 或 "连接到 Git"
4. 按提示关联你的 GitHub 账号

### 2.2 创建项目 (关键配置)
1. 选择你刚才 fork 的仓库
2. 点击 "Begin setup" 开始设置
3. **重要配置**:
   ```
   Project name: 自定义项目名称
   Production branch: main 或 master
   Framework preset: Next.js (Static HTML Export)  ← 选择这个
   Build command: npm run build
   Build output directory: out  ← 必须是 "out"，不是 ".next"
   Root directory: (留空)
   Environment variables: (无需设置)
   ```

### 2.3 Node.js 版本设置
1. 在 "Environment variables" 部分添加:
   ```
   NODE_VERSION = 20.17.0
   ```

### 2.4 完成部署
1. 点击 "Save and Deploy" 保存并部署
2. 等待构建完成 (通常需要 1-2 分钟)
3. 构建成功后，访问分配的域名即可使用

## 3. 常见问题解决

### 问题1: 网站显示 404 错误
**原因**: Build output directory 设置错误
**解决**: 
1. 进入项目 Settings → Builds & deployments
2. 将 "Build output directory" 改为 `out`
3. 重新部署

### 问题2: 构建失败，出现文件大小错误
**原因**: 缓存文件过大
**解决**: 
1. 确保使用最新版本的代码 (已修复此问题)
2. 检查 next.config.ts 中是否包含缓存禁用配置

### 问题3: TypeScript 类型错误
**原因**: 代码中存在类型错误
**解决**: 
1. 确保使用最新版本的代码
2. 检查 hooks/useOptimizedMail.ts 中的类型定义

## 4. 验证部署成功

部署成功后，你应该能看到:
- ✅ 网站正常加载
- ✅ IP 地址自动检测
- ✅ 地址信息生成功能正常
- ✅ 邮箱生成功能正常
- ✅ 主题切换功能正常

## 5. 项目特性

- 🌍 基于 IP 的真实地址生成
- 📧 本地邮箱生成服务 (无需外部 API)
- 🎨 现代化 UI 设计
- 📱 完美的移动端适配
- 🚀 快速加载和响应

---

**部署成功示例**: https://ip-8hq.pages.dev/

如有问题，请检查上述配置是否正确，特别是 Build output directory 必须为 `out`。
