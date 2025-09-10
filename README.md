# 影视文件名解析器 (Film Name Decoder)

一个专业的影视文件名智能解析工具，支持电影、电视剧文件名的详细信息识别，包括分辨率、编码格式、音频信息、片源类型等。

> 此项目特别感谢[CodeBuddy](https://www.codebuddy.com/)的大力支持！

<p align="center">
  <img src="./assets/images/preview.png" alt="预览" width="600">
</p>

## ✨ 功能特性

### 🎬 智能解析能力
- **影片信息识别**：自动识别影片标题、年份、季集信息
- **技术参数解析**：解析视频分辨率（720p、1080p、4K等）、编码格式（H.264、H.265、AV1等）
- **音频信息识别**：检测音频格式和声道布局（5.1、7.1、Atmos等）
- **片源类型识别**：识别片源类型（BluRay、WEB-DL、HDRip等）
- **发布组信息**：识别发布组和压制者信息

### ⚡ 专业特性
- **Scene和P2P规范支持**：完整支持Scene发布规范和P2P命名规则
- **HDR格式识别**：支持HDR、杜比视界等高级视频格式
- **多语言支持**：识别多语言和字幕信息
- **IMDB集成**：自动查询并提供IMDB链接
- **规则库管理**：内置完整的解析规则库，支持规则查询和分类

### 🎨 用户体验
- **响应式设计**：完美适配桌面和移动设备
- **深色/浅色主题**：支持主题切换，护眼模式
- **历史记录**：保存解析历史，方便回顾
- **实时搜索**：支持规则库和文件格式的实时搜索

## 🚀 在线体验

访问 [Film Name Decoder](https://youngxj.github.io/film-name-decoder/) 立即体验

## 📦 安装

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 克隆项目
```bash
git clone https://github.com/Youngxj/film-name-decoder.git
cd film-name-decoder
```

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 环境变量配置
复制环境变量示例文件并配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：
```env
# OMDB API Key for IMDB integration
VITE_OMDB_API_KEY=your_omdb_api_key_here
```

**获取 OMDB API Key：**
1. 访问 [OMDB API](https://www.omdbapi.com/apikey.aspx)
2. 注册并获取免费的API密钥
3. 将密钥填入 `.env` 文件中的 `VITE_OMDB_API_KEY`

## 🛠️ 开发

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## 📁 项目结构

```
film-name-decoder/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # React 组件
│   │   ├── layout/        # 布局组件
│   │   └── ui/            # UI 组件
│   ├── contexts/          # React Context
│   ├── lib/               # 核心库
│   │   ├── database/      # 数据库文件
│   │   ├── parsers/       # 解析器
│   │   ├── services/      # 服务层
│   │   └── utils/         # 工具函数
│   ├── pages/             # 页面组件
│   └── styles/            # 样式文件
├── package.json
└── README.md
```

## 🔧 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 组件**：Tailwind CSS + shadcn/ui
- **状态管理**：React Context
- **路由**：React Router
- **主题系统**：支持深色/浅色模式
- **数据存储**：LocalStorage
- **外部API**：OMDB API (IMDB数据集成)

## ⚙️ 环境变量

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `VITE_BASE_PATH` | 应用基础路径 | 否 | `./`  |
| `VITE_OMDB_API_KEY` | OMDB API密钥，用于IMDB数据集成 | 否 | 内置测试密钥 |



**注意**：虽然OMDB API密钥不是必需的，但建议获取自己的密钥以确保服务稳定性和避免API限制。

## 📖 使用指南

### 基本使用

1. **输入文件名**：在输入框中输入影视文件名
2. **点击解析**：系统会自动解析文件名中的各种信息
3. **查看结果**：解析结果分为多个标签页展示：
   - **基本信息**：影片标题、年份、季集等
   - **技术参数**：视频和音频技术规格
   - **高级信息**：Scene标签、P2P扩展信息
   - **匹配规则**：显示匹配到的解析规则
   - **文件格式**：文件容器格式说明

### 示例文件名

```
The.Matrix.1999.1080p.BluRay.x264-SPARKS.mkv
Breaking.Bad.S05E14.720p.HDTV.x264-KILLERS.mp4
Inception.2010.UHD.2160p.HDR.DTS-HD.MA.5.1.x265-TrueHD.mkv
```

### 高级功能

- **历史记录**：查看之前的解析记录
- **规则库**：浏览和搜索解析规则
- **文件格式库**：了解各种视频文件格式

## 🎯 解析能力

### 支持的信息类型

| 类型 | 示例 | 说明 |
|------|------|------|
| 影片标题 | The.Matrix | 电影或剧集名称 |
| 年份 | 1999 | 发行年份 |
| 季集信息 | S01E01 | 电视剧季数和集数 |
| 分辨率 | 1080p, 4K, 2160p | 视频分辨率 |
| 视频编码 | x264, x265, AV1 | 视频编码格式 |
| 音频编码 | DTS, AC3, AAC | 音频编码格式 |
| 声道布局 | 5.1, 7.1, Atmos | 音频声道配置 |
| 片源类型 | BluRay, WEB-DL | 视频来源 |
| HDR格式 | HDR10, DV | 高动态范围格式 |
| 发布组 | SPARKS, RARBG | 发布组织 |

### 支持的文件格式

- **视频容器**：MKV, MP4, AVI, TS, M2TS
- **Scene规范**：完整支持Scene发布标准
- **P2P扩展**：支持P2P社区扩展规则

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 编写清晰的提交信息
- 为新功能添加相应的测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢 Scene 和 P2P 社区制定的命名规范
- 感谢开源社区提供的优秀工具和库
- 感谢所有贡献者的支持

## 📞 联系方式

- 项目主页：[GitHub Repository](https://github.com/Youngxj/film-name-decoder)
- 问题反馈：[Issues](https://github.com/Youngxj/film-name-decoder/issues)
- 功能建议：[Discussions](https://github.com/Youngxj/film-name-decoder/discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！