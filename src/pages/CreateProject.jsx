import { useState } from "react";
import toast from "react-hot-toast";

import { createProject } from "@/services/db/projectService";

export default function CreateProject() {
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name required");
      return;
    }

    try {
      await createProject(projectName);

      toast.success("Project created");

      setProjectName("");
    } catch (error) {
      console.error(error);

      toast.error("Failed to create project");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Create Project
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-xl">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 outline-none"
        />

        <button
          onClick={handleCreateProject}
          className="mt-4 bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}