import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar";


function Router() {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route exact path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default Router;
