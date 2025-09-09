import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import BackToTop from "@/components/ui/back-to-top";
import SimpleThemeToggle from "../ui/simple-theme-toggle";

const MainLayout: React.FC = () => {
  const location = useLocation();
  
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 导航栏 */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border md:sticky md:top-0 z-10 header-nav">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" title="返回首页">
                <div className="text-2xl mr-2 group-hover:scale-110 transition-transform">🎬</div>
                <div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Film Name Decoder
                  </span>
                  <div className="text-xs text-slate-400 -mt-1">影视文件名解析器</div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  title={link.title}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-blue-900/50 text-blue-300 shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-105"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <SimpleThemeToggle />
            </div>
          </div>
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
              <h3 className="text-blue-300 font-semibold mb-3">快速导航</h3>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-slate-400 hover:text-blue-300 text-sm transition-colors"
                    title={link.title}
                  >
                    {link.label}
                  </Link>
                ))}
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