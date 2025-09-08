# 部署说明

## 子目录部署优化 ✅ 已修复访问问题

项目已经配置为支持在网站子目录中运行，并修复了路由访问问题：

### 1. 配置优化
- **相对路径**: 设置 `base: './'`，所有资源使用相对路径引用
- **路由修复**: React Router 自动检测子目录路径，设置正确的 basename
- **资源分包**: 将代码分为 vendor、ui 和主应用三个包，优化加载性能
- **压缩优化**: 启用 terser 压缩，移除 console 和 debugger
- **文件命名**: 使用 hash 命名，支持缓存策略

### 2. 打包结果
```
dist/
├── index.html          (612 bytes)
├── vite.svg           (1.5 KB)
└── assets/
    ├── index-07365cc6.css     (26.7 KB)
    ├── vendor-6af34bce.js     (159.3 KB) - React 核心库 + 路由
    ├── ui-69a62606.js         (21.9 KB)  - UI 组件库
    └── index-b87c75e1.js      (83.6 KB)  - 主应用代码
```

### 🔧 修复的问题
- **路由问题**: 修复了 React Router 在子目录中无法正确工作的问题
- **自动检测**: 应用会自动检测当前部署路径并设置正确的路由基础路径
- **兼容性**: 支持各种子目录部署场景

### 3. 部署方式

#### 方式一：直接部署到子目录
将 `dist` 文件夹内容复制到服务器的子目录中，例如：
```
https://yourdomain.com/film-decoder/
```

#### 方式二：自定义子目录路径
如果需要部署到特定子目录，修改 `vite.config.ts` 中的 `base` 配置：
```typescript
// 例如部署到 /tools/film-decoder/
base: '/tools/film-decoder/',
```

### 4. 服务器配置建议

#### Nginx 配置示例
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

#### Apache 配置示例
```apache
<Directory "/path/to/your/dist">
    RewriteEngine On
    RewriteBase /film-decoder/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /film-decoder/index.html [L]
    
    # 静态资源缓存
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
</Directory>
```

### 5. 验证部署
部署完成后，访问以下 URL 验证：
- 主页面: `https://yourdomain.com/your-subdirectory/`
- 静态资源: `https://yourdomain.com/your-subdirectory/assets/`

### 6. 性能优化特性
- ✅ 代码分割 (Code Splitting)
- ✅ 资源压缩 (Minification)
- ✅ 相对路径引用
- ✅ 缓存友好的文件命名
- ✅ 生产环境优化 (移除 console)

### 7. 故障排除

#### 问题：页面显示空白或不显示内容
**原因**: React Router 路由配置问题
**解决方案**: 
- 确保访问的是 `index.html` 文件
- 检查浏览器控制台是否有 JavaScript 错误
- 确保服务器支持 SPA 路由重写

#### 问题：资源文件 404 错误
**原因**: 相对路径解析问题
**解决方案**:
```bash
# 如果使用绝对路径部署，创建 .env 文件
echo "VITE_BASE_PATH=/your-subdirectory/" > .env
npm run build
```

#### 问题：路由跳转不工作
**原因**: 服务器没有配置 SPA 重写规则
**解决方案**: 参考上面的 Nginx/Apache 配置

### 8. 环境变量配置
复制 `.env.example` 为 `.env` 并根据需要修改：
```bash
cp .env.example .env
```

### 9. 重新打包命令
```bash
npm run build
```

打包完成后，`dist` 目录即可直接部署到任何子目录中。

### 10. 验证部署成功
1. 访问 `https://yourdomain.com/your-subdirectory/`
2. 检查页面是否正常显示
3. 测试路由跳转是否工作
4. 检查浏览器开发者工具中是否有错误