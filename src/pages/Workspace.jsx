import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProjects,
} from "@services/db/projectService";

import {
  getWorkspaceDocuments,
} from "@services/db/workspaceService";

export default function Workspace() {

  const navigate =
    useNavigate();

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    documents,
    setDocuments,
  ] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects =
    async () => {
      const data =
        await getProjects();

      setProjects(data);

      if (data.length > 0) {
        selectProject(data[0]);
      }
    };

  const selectProject =
    async (project) => {

      setSelectedProject(project);

      const docs =
        await getWorkspaceDocuments(
          project.id
        );

      setDocuments(docs);
    };

  return (
    <div className="h-[85vh] flex gap-6">

      {/* LEFT PANEL */}

      <div className="w-[300px] bg-slate-800 rounded-xl p-4 overflow-auto">

        <h2 className="text-2xl font-bold mb-4">
          Projects
        </h2>

        <div className="flex flex-col gap-3">

          {projects.map((project) => (

            <button
              key={project.id}
              onClick={() =>
                selectProject(project)
              }
              className={`p-4 rounded-xl text-left transition-all
              ${
                selectedProject?.id ===
                project.id
                  ? "bg-blue-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >

              <div className="font-semibold">
                {project.name}
              </div>

              <div className="text-xs text-gray-300 mt-1">
                {project.created_at}
              </div>

            </button>

          ))}

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 bg-slate-900 rounded-xl p-6 overflow-auto">

        {selectedProject ? (
          <>

            <h1 className="text-3xl font-bold mb-6">
              {selectedProject.name}
            </h1>

            <div className="grid grid-cols-2 gap-4">

              {documents.length === 0 && (

                <div className="bg-slate-800 p-5 rounded-xl">
                  No workspace documents yet.
                </div>

              )}

              {documents.map((doc) => (

                <div
                  key={doc.id}
                  onClick={() =>
                    navigate(
                      `/document/${doc.id}`
                    )
                  }
                  className="bg-slate-800 p-5 rounded-xl cursor-pointer hover:bg-slate-700 transition-all"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="text-xl font-semibold">
                        {doc.title}
                      </h2>

                      <p className="text-sm text-gray-400">
                        {doc.type}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 text-sm text-gray-300 line-clamp-6">

                    {doc.content.slice(
                      0,
                      200
                    )}

                  </div>

                </div>

              ))}

            </div>

          </>
        ) : (

          <div>
            No project selected
          </div>

        )}

      </div>

    </div>
  );
}