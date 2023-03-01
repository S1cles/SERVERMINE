import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import Navbar from "./components/Navbar";
import SettingsPage from "./pages/SettingsPage";

function Router() {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route exact path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  );
}

export default Router;
