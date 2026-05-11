import AIChat from "../pages/AIChat";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Discovery from "../pages/Discovery";
import Settings from "../pages/Settings";
import CreateProject from "../pages/CreateProject";

import MainLayout from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/ai-chat" element={<AIChat />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}