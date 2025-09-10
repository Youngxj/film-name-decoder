# GitHub Actions 工作流说明

本项目包含三个 GitHub Actions 工作流，用于自动化构建、测试和部署流程。

## 📋 工作流概览

### 1. `build-and-deploy.yml` - 完整的 CI/CD 流程
**触发条件:**
- 推送到 `main` 或 `master` 分支
- 创建 Pull Request
- 手动触发

**功能:**
- ✅ 代码检查 (ESLint)
- ✅ TypeScript 类型检查
- 🏗️ 项目构建
- 📤 上传构建产物
- 🚀 自动部署到 GitHub Pages
- 📦 创建 Release (仅限 tag 推送)

### 2. `build-static.yml` - 快速静态文件构建
**触发条件:**
- 推送到任何分支
- 手动触发

**功能:**
- 🏗️ 快速构建静态文件
- 📦 创建多种格式的压缩包
- 📤 上传构建产物 (保留 90 天)
- 🚀 可选的 GitHub Pages 部署

### 3. `release.yml` - 发布管理
**触发条件:**
- 创建 Release
- 推送 Tag (v*)
- 手动触发

**功能:**
- 🏗️ 构建发布版本
- 📦 创建多格式发布包 (ZIP, TAR.GZ, 7Z)
- 🔐 生成文件校验和
- 🚀 自动创建/更新 GitHub Release
- 📝 生成详细的发布说明

## 🚀 使用指南

### 快速构建静态文件

1. **自动触发**: 推送代码到任何分支即可自动构建
2. **手动触发**: 
   - 进入 GitHub 仓库的 Actions 页面
   - 选择 "Build Static Files" 工作流
   - 点击 "Run workflow"

### 部署到 GitHub Pages

1. **自动部署**: 推送到 `main` 或 `master` 分支会自动部署
2. **手动部署**: 
   - 运行 "Build Static Files" 工作流
   - 勾选 "是否部署到 GitHub Pages"

### 创建发布版本

#### 方法一: 通过 Git Tag
```bash
# 创建并推送标签
git tag v1.0.0
git push origin v1.0.0
```

#### 方法二: 通过 GitHub Release
1. 进入 GitHub 仓库的 Releases 页面
2. 点击 "Create a new release"
3. 输入标签版本 (如 v1.0.0)
4. 填写发布说明
5. 点击 "Publish release"

#### 方法三: 手动触发
1. 进入 Actions 页面
2. 选择 "Release" 工作流
3. 点击 "Run workflow"
4. 输入版本号和发布信息

## 📦 构建产物说明

### 构建产物类型

| 类型 | 说明 | 保留时间 |
|------|------|----------|
| `static-files-*` | 原始构建文件 | 90 天 |
| `release-packages-*` | 压缩发布包 | 90 天 |
| GitHub Release | 正式发布版本 | 永久 |

### 文件格式

| 格式 | 适用场景 | 说明 |
|------|----------|------|
| `.zip` | Windows 用户 | 兼容性最好 |
| `.tar.gz` | Linux/macOS | Unix 系统标准 |
| `.7z` | 高压缩需求 | 最小文件体积 |

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_BASE_PATH` | 应用基础路径 | `./` |
| `VITE_OMDB_API_KEY` | OMDB API 密钥 | 空 |

### GitHub Pages 配置

确保在仓库设置中启用 GitHub Pages:
1. 进入仓库 Settings
2. 找到 Pages 设置
3. Source 选择 "GitHub Actions"

### 权限要求

工作流需要以下权限:
- `contents: read` - 读取仓库内容
- `pages: write` - 写入 GitHub Pages
- `id-token: write` - 身份验证

## 📋 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认依赖安装正确
   - 查看构建日志中的错误信息

2. **部署失败**
   - 确认 GitHub Pages 已启用
   - 检查仓库权限设置
   - 验证工作流权限配置

3. **Release 创建失败**
   - 确认 `GITHUB_TOKEN` 权限
   - 检查标签格式是否正确
   - 验证发布内容格式

### 调试技巧

1. **查看详细日志**
   - 进入 Actions 页面
   - 点击具体的工作流运行
   - 展开各个步骤查看详细输出

2. **本地测试**
   ```bash
   # 本地构建测试
   npm ci
   npm run build
   
   # 检查构建产物
   ls -la dist/
   ```

3. **手动触发调试**
   - 使用手动触发功能
   - 逐步测试各个工作流
   - 根据日志调整配置

## 🔗 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Vite 构建文档](https://vitejs.dev/guide/build.html)
- [项目主页](../README.md)