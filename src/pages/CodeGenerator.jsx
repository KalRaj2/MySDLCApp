import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

import {
  codeTemplates,
} from "../services/codeTemplates";

import {
  streamOllama,
} from "../services/streamAI";

import {
  getProjects,
} from "../services/projectService";

import {
  saveWorkspaceDocument,
} from "../services/workspaceService";

import {
  exportText,
} from "../services/exportService";

export default function CodeGenerator() {

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [prompt,
    setPrompt] =
    useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(
    codeTemplates[0]
  );

  const [framework,
    setFramework] =
    useState("React");

  const [language,
    setLanguage] =
    useState("JavaScript");

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

  const generateCode =
    async () => {

      if (!prompt.trim()) {

        toast.error(
          "Enter generation prompt"
        );

        return;
      }

      try {

        setLoading(true);

        setResult("");

        let generatedText = "";

        const aiPrompt = `
You are a world-class senior software architect and staff engineer.

STRICT RULES:

- Generate REAL production-ready source code
- DO NOT explain concepts
- DO NOT write tutorials
- DO NOT give numbered steps
- DO NOT describe what you will do
- DO NOT repeat the prompt
- ONLY generate code and file structure
- Generate clean scalable architecture
- Use best practices
- Use proper folder structure
- Use reusable components
- Include comments inside code only when necessary

OUTPUT FORMAT:

1. Folder Structure
2. File Name
3. Source Code

Framework:
${framework}

Programming Language:
${language}

Template:
${selectedTemplate.title}

USER REQUIREMENT:
${prompt}

${selectedTemplate.prompt}

Generate COMPLETE IMPLEMENTATION NOW.
`;

        await streamOllama(
          aiPrompt,
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
            "generated_code",

          content:
            generatedText,
        });

        toast.success(
          "Code generated"
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

  const exportCode =
    async () => {

      if (!result) {

        toast.error(
          "Nothing to export"
        );

        return;
      }

      await exportText(
        "generated_code",
        result
      );
    };

  return (

    <div className="h-[85vh] grid grid-cols-2 gap-6">

      {/* LEFT PANEL */}

      <div className="bg-slate-800 rounded-xl p-6 overflow-auto">

        <h1 className="text-3xl font-bold mb-6">
          AI Code Generator
        </h1>

        <div className="flex flex-col gap-4">

          {/* PROJECT */}

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

          {/* USER PROMPT */}

          <textarea
            rows="7"
            placeholder="Describe the code to generate..."
            value={prompt}
            onChange={(e) =>
              setPrompt(
                e.target.value
              )
            }
            className="p-4 rounded-xl bg-slate-700 outline-none resize-none"
          />

          {/* FRAMEWORK */}

          <select
            value={framework}
            onChange={(e) =>
              setFramework(
                e.target.value
              )
            }
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >

            <option>
              React
            </option>

            <option>
              Node.js
            </option>

            <option>
              Express
            </option>

            <option>
              Spring Boot
            </option>

            <option>
              Next.js
            </option>

          </select>

          {/* LANGUAGE */}

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
            className="p-3 rounded-xl bg-slate-700 outline-none"
          >

            <option>
              JavaScript
            </option>

            <option>
              TypeScript
            </option>

            <option>
              Java
            </option>

            <option>
              SQL
            </option>

          </select>

          {/* TEMPLATE */}

          <select
            value={selectedTemplate.id}
            onChange={(e) => {

              const template =
                codeTemplates.find(
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

            {codeTemplates.map(
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

          {/* GENERATE */}

          <button
            onClick={generateCode}
            className="bg-green-600 p-4 rounded-xl"
          >

            {loading
              ? "Generating..."
              : "Generate Code"}

          </button>

          {/* EXPORT */}

          <button
            onClick={exportCode}
            className="bg-blue-600 p-4 rounded-xl"
          >
            Export Code
          </button>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="bg-slate-900 rounded-xl p-6 overflow-auto whitespace-pre-wrap">

        {loading
          ? "AI generating code..."
          : result ||
            "Generated code appears here"}

      </div>

    </div>
  );
}