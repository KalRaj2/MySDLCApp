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

import {
  parseGeneratedFiles,
} from "../services/fileParser";

import {
  saveGeneratedFile,
  getGeneratedFiles,
} from "../services/generatedFileService";

export default function CodeGenerator() {

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const [
    prompt,
    setPrompt,
  ] = useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(
    codeTemplates[0]
  );

  const [
    framework,
    setFramework,
  ] = useState("React");

  const [
    language,
    setLanguage,
  ] = useState("JavaScript");

  const [
    result,
    setResult,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    generatedFiles,
    setGeneratedFiles,
  ] = useState([]);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  useEffect(() => {

    loadProjects();

  }, []);

  const loadProjects =
    async () => {

      try {

        const data =
          await getProjects();

        setProjects(data);

        if (data.length > 0) {

          setSelectedProject(
            data[0].id
          );

          const files =
            await getGeneratedFiles(
              data[0].id
            );

          setGeneratedFiles(files);
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load projects"
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

        setSelectedFile(null);

        let generatedText = "";

        const aiPrompt = `
SYSTEM:
You are a senior software engineer.

STRICT RULES:

- Output ONLY source code
- NO explanations
- NO tutorials
- NO numbered lists
- Use standard Tailwind className
- DO NOT use tw=""
- DO NOT import tailwindcss directly
- Generate complete implementation
- Generate separate files
- Use production-ready architecture
- Use reusable code

MANDATORY FORMAT:

FILE: src/components/Login.jsx
\`\`\`javascript
CODE
\`\`\`

FILE: src/services/authService.js
\`\`\`javascript
CODE
\`\`\`

USER REQUEST:
${prompt}

TECH STACK:
${framework}

LANGUAGE:
${language}

TEMPLATE:
${selectedTemplate.title}

Generate implementation now.
`;

        await streamOllama(

          aiPrompt,

          (chunk) => {

            generatedText = chunk;

            setResult(chunk);

          }
        );

        const parsedFiles =
          parseGeneratedFiles(
            generatedText
          );

        if (
          parsedFiles.length > 0
        ) {

          for (const file of parsedFiles) {

            await saveGeneratedFile({

              project_id:
                selectedProject,

              file_name:
                file.fileName,

              content:
                file.code,
            });
          }

          const files =
            await getGeneratedFiles(
              selectedProject
            );

          setGeneratedFiles(files);

          setSelectedFile(
            files[0]
          );

        } else {

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
        }

        toast.success(
          "Code generated successfully"
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
            onChange={async (e) => {

              const projectId =
                e.target.value;

              setSelectedProject(
                projectId
              );

              const files =
                await getGeneratedFiles(
                  projectId
                );

              setGeneratedFiles(
                files
              );

              setSelectedFile(
                null
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

          {/* USER PROMPT */}

          <textarea
            rows="8"
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

          {/* GENERATE BUTTON */}

          <button
            onClick={generateCode}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 transition-all p-4 rounded-xl font-semibold"
          >

            {loading
              ? "Generating..."
              : "Generate Code"}

          </button>

          {/* EXPORT BUTTON */}

          <button
            onClick={exportCode}
            className="bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl font-semibold"
          >

            Export Full Response

          </button>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="grid grid-cols-3 gap-4 h-full">

        {/* FILE LIST */}

        <div className="bg-slate-950 rounded-xl p-4 overflow-auto">

          <h2 className="font-bold mb-4 text-lg">
            Generated Files
          </h2>

          <div className="flex flex-col gap-2">

            {generatedFiles.length === 0 && (

              <div className="text-gray-400 text-sm">
                No generated files
              </div>

            )}

            <div className="mt-4">

  <h2 className="text-lg font-bold mb-3">
    Generated Files
  </h2>

  <div className="space-y-2">

    {generatedFiles.map((file, index) => (

      <div
        key={index}
        className="
          bg-gray-800
          text-green-400
          px-3
          py-2
          rounded
          cursor-pointer
          hover:bg-gray-700
          transition
        "
        onClick={() =>
          setSelectedFile(file)
        }
      >
        {file.fileName}
      </div>

    ))}

  </div>

</div>

          </div>

        </div>

        {/* CODE VIEWER */}

        <div className="col-span-2 bg-slate-900 rounded-xl p-6 overflow-auto">

          {selectedFile ? (

            <div>

              <div className="flex justify-between items-center mb-4">

                <h2 className="font-bold text-xl break-all">
                  {selectedFile.file_name}
                </h2>

                <button
                  onClick={() =>
                    exportText(
                      selectedFile.file_name,
                      selectedFile.content
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg"
                >

                  Export File

                </button>

              </div>

              <pre className="whitespace-pre-wrap text-sm">
                {selectedFile.content}
              </pre>

            </div>

          ) : (

            <div className="text-gray-400">

              {loading
                ? "AI generating code..."
                : result
                  ? result
                  : "Generated code appears here"}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}