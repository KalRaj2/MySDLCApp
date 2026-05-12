import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  getProjects,
} from "../services/projectService";

import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../services/agileService";

const columns = [
  "Backlog",
  "Todo",
  "In Progress",
  "Testing",
  "Done",
];

export default function AgileBoard() {

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [tasks,
    setTasks] =
    useState([]);

  const [form,
    setForm] =
    useState({
      title: "",
      description: "",
      status: "Backlog",
      priority: "Medium",
      story_points: 1,
      assigned_to: "",
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

        loadTasks(
          data[0].id
        );
      }
    };

  const loadTasks =
    async (projectId) => {

      const data =
        await getTasks(
          projectId
        );

      setTasks(data);
    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleCreateTask =
    async () => {

      try {

        await createTask({
          project_id:
            selectedProject,
          ...form,
        });

        toast.success(
          "Task created"
        );

        loadTasks(
          selectedProject
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Task creation failed"
        );

      }
    };

  const moveTask =
    async (
      id,
      status
    ) => {

      await updateTaskStatus(
        id,
        status
      );

      loadTasks(
        selectedProject
      );
    };

  return (

    <div className="h-[85vh] flex flex-col gap-5">

      {/* TOP PANEL */}

      <div className="bg-slate-800 rounded-xl p-5">

        <h1 className="text-3xl font-bold mb-4">
          Agile Sprint Board
        </h1>

        <div className="grid grid-cols-4 gap-3">

          <select
            value={selectedProject}
            onChange={(e) => {

              setSelectedProject(
                e.target.value
              );

              loadTasks(
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
            name="title"
            placeholder="Task Title"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <input
            type="text"
            name="assigned_to"
            placeholder="Assigned To"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <input
            type="text"
            name="sprint"
            placeholder="Sprint 1"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

          <textarea
            rows="2"
            name="description"
            placeholder="Task Description"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none col-span-2"
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

          <input
            type="number"
            name="story_points"
            placeholder="Story Points"
            onChange={handleChange}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          />

        </div>

        <button
          onClick={handleCreateTask}
          className="bg-blue-600 px-6 py-3 rounded-xl mt-4"
        >
          Create Task
        </button>

      </div>

      {/* KANBAN BOARD */}

      <div className="flex-1 grid grid-cols-5 gap-4 overflow-auto">

        {columns.map((column) => (

          <div
            key={column}
            className="bg-slate-900 rounded-xl p-4"
          >

            <h2 className="text-xl font-bold mb-4">
              {column}
            </h2>

            <div className="flex flex-col gap-3">

              {tasks
                .filter(
                  (task) =>
                    task.status === column
                )
                .map((task) => (

                  <div
                    key={task.id}
                    className="bg-slate-800 p-4 rounded-xl"
                  >

                    <div className="flex justify-between items-center">

                      <h3 className="font-semibold">
                        {task.title}
                      </h3>

                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                        {task.story_points}
                      </span>

                    </div>

                    <p className="text-sm text-gray-300 mt-3">
                      {task.description}
                    </p>

                    <div className="mt-3 flex justify-between items-center">

                      <span className="text-xs text-gray-400">
                        {task.assigned_to}
                      </span>

                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        {task.sprint}
                      </span>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {columns.map((status) => (

                        status !== task.status && (

                          <button
                            key={status}
                            onClick={() =>
                              moveTask(
                                task.id,
                                status
                              )
                            }
                            className="text-xs bg-slate-700 px-2 py-1 rounded"
                          >
                            {status}
                          </button>

                        )

                      ))}

                    </div>

                  </div>

                ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}