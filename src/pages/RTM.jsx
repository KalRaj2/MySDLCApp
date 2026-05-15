import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  getProjects,
} from "@services/db/projectService";

import {
  addRequirement,
  getRequirements,
} from "@services/db/rtmService";

export default function RTM() {

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [
    requirements,
    setRequirements,
  ] = useState([]);

  const [form,
    setForm] =
    useState({
      requirement_id: "",
      title: "",
      description: "",
      module_name: "",
      priority: "Medium",
      status: "Pending",
      test_case: "",
      risk_level: "Medium",
      sprint: "",
    });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects =
    async () => {

      const data =
        await getProjects();

      setProjects(data);

      if (data.length > 0) {

        setSelectedProject(
          data[0].id
        );

        loadRequirements(
          data[0].id
        );
      }
    };

  const loadRequirements =
    async (projectId) => {

      const data =
        await getRequirements(
          projectId
        );

      setRequirements(data);
    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const saveRequirement =
    async () => {

      try {

        await addRequirement({
          project_id:
            selectedProject,
          ...form,
        });

        toast.success(
          "Requirement added"
        );

        loadRequirements(
          selectedProject
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Save failed"
        );

      }
    };

  return (

    <div className="h-[85vh] flex gap-6">

      {/* LEFT PANEL */}

      <div className="w-[400px] bg-slate-800 rounded-xl p-5 overflow-auto">

        <h1 className="text-2xl font-bold mb-4">
          Requirement Matrix
        </h1>

        <div className="flex flex-col gap-3">

          <select
            value={selectedProject}
            onChange={(e) => {

              setSelectedProject(
                e.target.value
              );

              loadRequirements(
                e.target.value
              );
            }}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >

            {projects.map((project) => (

              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>

            ))}

          </select>

          <input
            type="text"
            name="requirement_id"
            placeholder="REQ-001"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <input
            type="text"
            name="title"
            placeholder="Requirement Title"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Requirement Description"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <input
            type="text"
            name="module_name"
            placeholder="Module Name"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <select
            name="priority"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >
            <option>
              High
            </option>
            <option>
              Medium
            </option>
            <option>
              Low
            </option>
          </select>

          <select
            name="status"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >
            <option>
              Pending
            </option>
            <option>
              In Progress
            </option>
            <option>
              Completed
            </option>
          </select>

          <input
            type="text"
            name="test_case"
            placeholder="TC-001"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <select
            name="risk_level"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >
            <option>
              High
            </option>
            <option>
              Medium
            </option>
            <option>
              Low
            </option>
          </select>

          <input
            type="text"
            name="sprint"
            placeholder="Sprint 1"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <button
            onClick={saveRequirement}
            className="bg-blue-600 p-4 rounded-xl"
          >
            Save Requirement
          </button>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 bg-slate-900 rounded-xl p-5 overflow-auto">

        <h2 className="text-2xl font-bold mb-5">
          Requirements
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {requirements.map((req) => (

            <div
              key={req.id}
              className="bg-slate-800 p-5 rounded-xl"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-lg font-bold">
                    {req.requirement_id}
                  </h3>

                  <p className="text-gray-400">
                    {req.title}
                  </p>

                </div>

                <div className="text-sm">
                  {req.status}
                </div>

              </div>

              <div className="mt-4 text-sm text-gray-300">

                {req.description}

              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">

                <span className="bg-blue-600 px-2 py-1 rounded">
                  {req.priority}
                </span>

                <span className="bg-red-600 px-2 py-1 rounded">
                  {req.risk_level}
                </span>

                <span className="bg-green-600 px-2 py-1 rounded">
                  {req.sprint}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}