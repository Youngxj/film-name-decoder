# 🎬 Film Name Decoder - 子目录部署完整指南

## 🚀 快速部署

### 1. 打包项目
```bash
npm run build
```

### 2. 部署文件
将 `dist` 目录中的所有文件复制到服务器的子目录中：
```bash
# 示例：部署到 /film-decoder/ 子目录
cp -r dist/* /var/www/html/film-decoder/
```

### 3. 访问应用
```
https://yourdomain.com/film-decoder/
```

## 🔧 已修复的问题

### ✅ React Router 子目录支持
- **问题**: 在子目录中路由不工作，页面显示空白
- **解决**: 自动检测部署路径，动态设置 Router basename
- **代码**: `src/App.tsx` 中的 `getBasename()` 函数

### ✅ 相对路径资源引用
- **问题**: 资源文件 404 错误
- **解决**: 使用相对路径 `base: './'`
- **配置**: `vite.config.ts` 中的 base 配置

### ✅ 代码分包优化
- **vendor**: React 核心库 + 路由 (159.3 KB)
- **ui**: UI 组件库 (21.9 KB)
- **index**: 主应用代码 (83.6 KB)

## 📋 部署检查清单

### 必需文件
- [ ] `index.html` (应用入口)
- [ ] `assets/` 目录 (包含所有 JS/CSS 文件)
- [ ] `vite.svg` (图标文件)

### 服务器配置
- [ ] 配置 SPA 重写规则 (重要!)
- [ ] 确保支持 HTML5 History API
- [ ] 设置正确的 MIME 类型

### 访问测试
- [ ] 主页面正常显示
- [ ] 路由跳转工作正常
- [ ] 浏览器控制台无错误

## 🛠️ 服务器配置

### Nginx
```nginx
location /film-decoder/ {
    alias /path/to/your/dist/;
    try_files $uri $uri/ /film-decoder/index.html;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache
```apache
<Directory "/path/to/your/dist">
    RewriteEngine On
    RewriteBase /film-decoder/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /film-decoder/index.html [L]
</Directory>
```

## 🔍 故障排除

### 问题 1: 页面显示空白
**症状**: 访问页面后显示空白，没有内容
**原因**: React Router 路由配置问题
**解决方案**:
1. 检查浏览器控制台是否有 JavaScript 错误
2. 确保访问的是 `index.html` 文件
3. 验证服务器是否正确配置了 SPA 重写规则

### 问题 2: 资源文件 404
**症状**: 页面加载但样式丢失，控制台显示 CSS/JS 文件 404
**原因**: 相对路径解析问题或文件缺失
**解决方案**:
1. 确保 `dist` 目录完整复制到服务器
2. 检查文件权限是否正确
3. 验证服务器支持静态文件访问

### 问题 3: 路由跳转不工作
**症状**: 直接访问子路由返回 404
**原因**: 服务器没有配置 SPA 重写规则
**解决方案**:
1. 配置服务器重写规则（见上方配置）
2. 确保服务器支持 HTML5 History API

## 🧪 调试工具

### 使用调试页面
1. 将 `debug.html` 复制到部署目录
2. 访问 `https://yourdomain.com/your-subdirectory/debug.html`
3. 运行各项测试来诊断问题

### 手动检查
```bash
# 检查文件是否存在
curl -I https://yourdomain.com/film-decoder/index.html
curl -I https://yourdomain.com/film-decoder/assets/vendor-6af34bce.js

# 检查路由重写
curl -I https://yourdomain.com/film-decoder/rules
curl -I https://yourdomain.com/film-decoder/extensions
```

## 🎯 高级配置

### 自定义子目录路径
如果需要部署到特定路径，创建 `.env` 文件：
```bash
# .env
VITE_BASE_PATH=/custom/path/film-decoder/
```

然后重新打包：
```bash
npm run build
```

### 多环境部署
```bash
# 开发环境
VITE_BASE_PATH=/ npm run build

# 测试环境
VITE_BASE_PATH=/test/film-decoder/ npm run build

# 生产环境
VITE_BASE_PATH=/film-decoder/ npm run build
```

## 📞 技术支持

如果遇到部署问题：
1. 首先使用 `debug.html` 进行诊断
2. 检查浏览器开发者工具的控制台和网络选项卡
3. 验证服务器配置是否正确
4. 确保所有文件都已正确部署

---

**✅ 部署成功标志**: 访问主页面能看到 "Film Name Decoder" 界面，路由跳转正常工作。