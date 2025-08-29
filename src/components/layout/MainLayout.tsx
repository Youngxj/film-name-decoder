import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import BackToTop from "@/components/ui/back-to-top";

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // 导航链接
  const navLinks = [
    { path: "/", label: "解析器" },
    { path: "/rules", label: "规则库" },
    { path: "/extensions", label: "文件格式" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 text-white">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  影视文件名解析器
                </span>
              </Link>
            </div>
            
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.path
                      ? "bg-blue-900/50 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
        <BackToTop />
      </main>

      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">
                影视文件名解析器 - 帮助你理解影视文件命名规则
              </p>
            </div>
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-400 hover:text-blue-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;