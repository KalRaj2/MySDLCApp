import CodeGenerator from "../pages/CodeGenerator";
import Architect from "../pages/Architect";
import AgileBoard from "../pages/AgileBoard";
import DocumentEditor from "../pages/DocumentEditor";
import RTM from "../pages/RTM";
import Documents from "../pages/Documents";
import AIChat from "../pages/AIChat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workspace from "../pages/Workspace";
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
          <Route path="/documents" element={<Documents />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/document/:id" element={<DocumentEditor />} />
          <Route path="/rtm" element={<RTM />} />
          <Route path="/agile" element={<AgileBoard />} />
          <Route path="/architect" element={<Architect />} />
          <Route path="/codegen" element={<CodeGenerator />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}