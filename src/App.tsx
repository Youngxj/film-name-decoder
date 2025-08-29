import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import RulesPage from "./pages/RulesPage";
import ExtensionsPage from "./pages/ExtensionsPage";

function App() {
  return (
    <Router>
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