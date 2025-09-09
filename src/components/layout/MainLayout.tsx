import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import BackToTop from "@/components/ui/back-to-top";
import SimpleThemeToggle from "../ui/simple-theme-toggle";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 导航链接
  const navLinks = [
    { path: "/", label: "🎬 解析器", title: "影片文件名解析工具" },
    { path: "/rules", label: "📋 规则库", title: "查看解析规则详情" },
    { path: "/extensions", label: "📁 文件格式", title: "了解视频文件格式" }
  ];

  // 根据路由更新页面标题
  useEffect(() => {
    const getPageTitle = () => {
      switch (location.pathname) {
        case '/':
          return '影片文件名解析器 - Film Name Decoder | 智能解析电影文件名信息';
        case '/rules':
          return '解析规则库 - Film Name Decoder | 查看文件名解析规则详情';
        case '/extensions':
          return '文件格式说明 - Film Name Decoder | 视频文件格式介绍';
        default:
          return '影片文件名解析器 - Film Name Decoder | 智能解析电影文件名信息';
      }
    };

    document.title = getPageTitle();
  }, [location.pathname]);

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 导航栏 */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border md:sticky md:top-0 z-10 header-nav">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo 区域 */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" title="返回首页">
                <div className="text-2xl mr-2 group-hover:scale-110 transition-transform">🎬</div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Film Name Decoder
                  </span>
                  <div className="text-xs text-slate-400 -mt-1">影视文件名解析器</div>
                </div>
                <div className="sm:hidden">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Film Name Decoder
                  </span>
                </div>
              </Link>
            </div>
            
            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  title={link.title}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-blue-600/20 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-105"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/Youngxj/film-name-decoder"
                target="_blank"
                rel="noopener noreferrer"
                title="查看 GitHub 项目"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <SimpleThemeToggle />
            </div>

            {/* 移动端右侧按钮组 */}
            <div className="flex md:hidden items-center space-x-2">
              <SimpleThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-colors"
                aria-label="打开菜单"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* 移动端下拉菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-blue-600/20 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://github.com/Youngxj/film-name-decoder"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub 项目
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main role="main">
        <Outlet />
        <BackToTop />
      </main>

      {/* 页脚 */}
      <footer className="bg-card/80 backdrop-blur-md border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* 品牌信息 */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🎬</span>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  Film Name Decoder
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                专业的影视文件名智能解析工具，支持电影、电视剧文件名的详细信息识别，
                帮助用户快速了解媒体文件的技术参数和来源信息。
              </p>
            </div>

            {/* 功能特色 */}
            <div className="md:col-span-1">
              <h3 className="text-blue-300 font-semibold mb-3">核心功能</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• 智能识别影片标题和年份</li>
                <li>• 解析视频分辨率和编码格式</li>
                <li>• 识别音频格式和声道布局</li>
                <li>• 检测片源类型和发布组信息</li>
                <li>• 支持Scene和P2P发布规范</li>
              </ul>
            </div>

            {/* 导航链接 */}
            <div className="md:col-span-1">
              <h3 className="text-blue-600 dark:text-blue-300 font-semibold mb-3">快速导航</h3>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-300 text-sm transition-colors"
                    title={link.title}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <h3 className="text-blue-600 dark:text-blue-300 font-semibold mb-3 mt-6">友情链接</h3>
              <div className="space-y-2">
                <a
                  href="https://www.imdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-300 text-sm transition-colors flex items-center"
                >
                  <span className="mr-2">🎬</span>
                  IMDB 电影数据库
                </a>
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-slate-500 text-xs">
              © 2025 Film Name Decoder. 专业影视文件名解析工具 |
              <span className="mx-2">•</span>
              智能识别 | 准确解析 | 开源免费
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;