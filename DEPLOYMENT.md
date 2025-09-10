# 🚀 部署指南

本文档介绍如何构建和部署影视文件名解析器的静态文件。

## 📋 快速开始

### 方法一: 使用 npm 脚本 (推荐)

```bash
# 完整构建和打包
npm run deploy

# 仅构建静态文件
npm run build:static

# 创建压缩包
npm run package

# 构建并预览
npm run serve
```

### 方法二: 手动构建

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 查看构建结果
ls -la dist/
```

## 🔧 GitHub Actions 自动化

### 自动构建 (推荐)

推送代码到 GitHub 仓库后，会自动触发构建：

1. **推送到任何分支** → 自动构建静态文件
2. **推送到 main/master** → 自动构建 + 部署到 GitHub Pages
3. **创建 Release** → 自动构建 + 创建发布包

### 手动触发构建

1. 进入 GitHub 仓库的 **Actions** 页面
2. 选择 **"Build Static Files"** 工作流
3. 点击 **"Run workflow"** 按钮
4. 等待构建完成，下载构建产物

### 创建正式发布

#### 通过 GitHub Release (推荐)
1. 进入仓库的 **Releases** 页面
2. 点击 **"Create a new release"**
3. 输入版本号 (如 `v1.0.0`)
4. 填写发布说明
5. 点击 **"Publish release"**

#### 通过 Git Tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📦 部署方式

### 1. 静态文件服务器

将 `dist/` 目录中的所有文件上传到 Web 服务器：

```bash
# 上传到服务器 (示例)
scp -r dist/* user@server:/var/www/html/

# 或使用 rsync
rsync -av dist/ user@server:/var/www/html/
```

### 2. GitHub Pages

**自动部署** (推荐):
- 推送到 `main` 分支即可自动部署
- 访问: `https://用户名.github.io/仓库名/`

**手动部署**:
1. 构建项目: `npm run build`
2. 推送 `dist/` 到 `gh-pages` 分支

### 3. Netlify

1. 连接 GitHub 仓库
2. 设置构建命令: `npm run build`
3. 设置发布目录: `dist`
4. 自动部署

### 4. Vercel

1. 导入 GitHub 仓库
2. 框架选择: `Vite`
3. 构建命令: `npm run build`
4. 输出目录: `dist`

### 5. 本地服务器

```bash
# 使用 Python
cd dist && python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server dist -p 8000

# 使用 Vite 预览
npm run preview
```

## 🔧 配置选项

### 环境变量

在 `.env` 文件中配置：

```env
# OMDB API 密钥 (可选)
VITE_OMDB_API_KEY=your_api_key_here

# 基础路径 (用于子目录部署)
VITE_BASE_PATH=./
```

### 子目录部署

如果需要部署到子目录 (如 `/app/`)：

```bash
# 设置基础路径
export VITE_BASE_PATH=/app/
npm run build
```

或在 `.env` 文件中设置：
```env
VITE_BASE_PATH=/app/
```

## 📋 构建产物说明

### 文件结构

```
dist/
├── index.html          # 主页面
├── assets/            # 静态资源
│   ├── *.css         # 样式文件
│   ├── *.js          # JavaScript 文件
│   └── *.svg         # 图标文件
├── build-info.json    # 构建信息
└── release-info.json  # 发布信息 (仅 Release)
```

### 压缩包格式

| 格式 | 文件名 | 适用场景 |
|------|--------|----------|
| ZIP | `film-name-decoder-*.zip` | Windows 用户 |
| TAR.GZ | `film-name-decoder-*.tar.gz` | Linux/macOS |
| 7Z | `film-name-decoder-*.7z` | 高压缩率 |

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存重试
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **路径问题**
   - 检查 `VITE_BASE_PATH` 设置
   - 确保资源路径正确

3. **IMDB 功能异常**
   - 检查 `VITE_OMDB_API_KEY` 配置
   - 确认 API 密钥有效

### 调试技巧

```bash
# 查看详细构建信息
npm run build -- --debug

# 本地预览构建结果
npm run preview

# 检查文件大小
du -sh dist/
ls -lah dist/assets/
```

## 📊 性能优化

### 构建优化

项目已配置以下优化：

- ✅ 代码分割 (Code Splitting)
- ✅ 资源压缩 (Minification)
- ✅ Tree Shaking
- ✅ 生产环境移除 console
- ✅ 静态资源哈希命名

### 部署优化

1. **启用 Gzip 压缩**
   ```nginx
   # Nginx 配置示例
   gzip on;
   gzip_types text/css application/javascript application/json;
   ```

2. **设置缓存头**
   ```nginx
   # 静态资源缓存
   location /assets/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **CDN 加速**
   - 将静态资源上传到 CDN
   - 配置 CDN 域名

## 🔗 相关链接

- [GitHub Actions 工作流说明](.github/README.md)
- [项目主页](README.md)
- [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages 文档](https://docs.github.com/en/pages)