import {
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  architectureTemplates,
} from "@services/templates/architectureTemplates";

import {
  streamOllama,
} from "@services/ai/streamAI";

import {
  saveWorkspaceDocument,
} from "@services/db/workspaceService";

import {
  getProjects,
} from "@services/db/projectService";

import {
  useEffect,
} from "react";

export default function Architect() {

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [projectIdea,
    setProjectIdea] =
    useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(
    architectureTemplates[0]
  );

  const [techStack,
    setTechStack] =
    useState("React + Node.js");

  const [result,
    setResult] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

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
      }
    };

  const generateArchitecture =
    async () => {

      if (!projectIdea) {

        toast.error(
          "Enter project idea"
        );

        return;
      }

      try {

        setLoading(true);

        let generatedText = "";

        const prompt = `
You are a senior enterprise software architect.

Project Idea:
${projectIdea}

Preferred Tech Stack:
${techStack}

${selectedTemplate.prompt}

Generate highly scalable architecture.
`;

        await streamOllama(
          prompt,
          (chunk) => {

            generatedText = chunk;

            setResult(chunk);

          }
        );

        await saveWorkspaceDocument({
          project_id:
            selectedProject,
          title:
            selectedTemplate.title,
          type:
            "architecture",
          content:
            generatedText,
        });

        toast.success(
          "Architecture generated"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Generation failed"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="h-[85vh] grid grid-cols-2 gap-6">

      {/* LEFT PANEL */}

      <div className="bg-slate-800 rounded-xl p-6">

        <h1 className="text-3xl font-bold mb-6">
          AI Software Architect
        </h1>

        <div className="flex flex-col gap-4">

          <select
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(
                e.target.value
              )
            }
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

          <textarea
            rows="7"
            placeholder="Describe your system..."
            value={projectIdea}
            onChange={(e) =>
              setProjectIdea(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-700 outline-none resize-none"
          />

          <select
            value={techStack}
            onChange={(e) =>
              setTechStack(
                e.target.value
              )
            }
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >

            <option>
              React + Node.js
            </option>

            <option>
              React + Spring Boot
            </option>

            <option>
              Angular + .NET
            </option>

            <option>
              Vue + Laravel
            </option>

            <option>
              Microservices + Kubernetes
            </option>

          </select>

          <select
            value={selectedTemplate.id}
            onChange={(e) => {

              const template =
                architectureTemplates.find(
                  (t) =>
                    t.id ===
                    e.target.value
                );

              setSelectedTemplate(
                template
              );

            }}
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >

            {architectureTemplates.map(
              (template) => (

                <option
                  key={template.id}
                  value={template.id}
                >
                  {template.title}
                </option>

              )
            )}

          </select>

          <button
            onClick={
              generateArchitecture
            }
            className="bg-purple-600 p-4 rounded-xl"
          >

            {loading
              ? "Generating..."
              : "Generate Architecture"}

          </button>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="bg-slate-900 rounded-xl p-6 overflow-auto whitespace-pre-wrap">

        {loading
          ? "AI generating architecture..."
          : result ||
            "Architecture output appears here"}

      </div>

    </div>
  );
}