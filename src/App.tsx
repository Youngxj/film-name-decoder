import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import RulesPage from "./pages/RulesPage";
import ExtensionsPage from "./pages/ExtensionsPage";

function App() {
  // 获取当前路径作为 basename，支持子目录部署
  const getBasename = () => {
    const path = window.location.pathname;
    // 如果路径以 /index.html 结尾，移除它
    if (path.endsWith('/index.html')) {
      return path.slice(0, -11); // 移除 '/index.html'
    }
    // 如果路径以 / 结尾，移除最后的 /
    if (path.endsWith('/') && path.length > 1) {
      return path.slice(0, -1);
    }
    // 获取目录路径（不包括文件名）
    const lastSlashIndex = path.lastIndexOf('/');
    return lastSlashIndex > 0 ? path.slice(0, lastSlashIndex) : '';
  };

  return (
    <Router basename={getBasename()}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="extensions" element={<ExtensionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;