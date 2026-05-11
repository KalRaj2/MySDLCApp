import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getProjects,
  deleteProject,
} from "../services/projectService";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load projects");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);

      toast.success("Project deleted");

      loadProjects();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Projects
      </h1>

      <div className="grid gap-4">
        {projects.length === 0 && (
          <div className="bg-slate-800 p-5 rounded-xl">
            No projects found.
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-800 p-5 rounded-xl flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {project.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {project.created_at}
              </p>
            </div>

            <button
              onClick={() => handleDelete(project.id)}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}