import {
  useState,
  useEffect,
} from "react";

import toast from "react-hot-toast";

import { templates }
from "@/services/templates/templateService";

import { streamOllama }
from "@/services/ai/streamAI";

import {
  exportMarkdown,
  exportText,
} from "@/services/file/exportService";

import {
  getProjects,
} from "@/services/db/projectService";

import {
  saveWorkspaceDocument,
} from "@/services/db/workspaceService";

export default function Documents() {

  const [projectIdea,
    setProjectIdea] =
    useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(templates[0]);

  const [result,
    setResult] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [projects,
    setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

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
        }

      } catch (error) {
        console.error(error);
      }
    };

  const generateDocument =
    async () => {

      if (!projectIdea.trim()) {

        toast.error(
          "Please enter project idea"
        );

        return;
      }

      if (!selectedProject) {

        toast.error(
          "Please select project"
        );

        return;
      }

      try {

        setLoading(true);

        setResult("");

        const prompt = `
You are an expert SDLC architect.

Project Idea:
${projectIdea}

${selectedTemplate.prompt}

Generate detailed professional documentation.
`;

        let generatedText = "";

        await streamOllama(
          prompt,
          (chunk) => {

            generatedText = chunk;

            setResult(chunk);

          }
        );

        await saveWorkspaceDocument({
          project_id: selectedProject,
          title: selectedTemplate.title,
          type: selectedTemplate.id,
          content: generatedText,
        });

        toast.success(
          "Document generated and saved"
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

  const handleExportMarkdown =
    async () => {

      if (!result) {

        toast.error(
          "Nothing to export"
        );

        return;
      }

      const success =
        await exportMarkdown(
          selectedTemplate.id,
          result
        );

      if (success) {

        toast.success(
          "Markdown exported"
        );

      } else {

        toast.error(
          "Export failed"
        );

      }
    };

  const handleExportText =
    async () => {

      if (!result) {

        toast.error(
          "Nothing to export"
        );

        return;
      }

      const success =
        await exportText(
          selectedTemplate.id,
          result
        );

      if (success) {

        toast.success(
          "Text exported"
        );

      } else {

        toast.error(
          "Export failed"
        );

      }
    };

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Document Generator
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT PANEL */}

        <div className="bg-slate-800 p-6 rounded-xl">

          <div className="flex flex-col gap-4">

            <textarea
              rows="8"
              placeholder="Describe your project idea..."
              value={projectIdea}
              onChange={(e) =>
                setProjectIdea(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-700 outline-none resize-none"
            />

            {/* PROJECT SELECTOR */}

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

            {/* TEMPLATE SELECTOR */}

            <select
              value={selectedTemplate.id}
              onChange={(e) => {

                const template =
                  templates.find(
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

              {templates.map(
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
                generateDocument
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl disabled:opacity-50"
            >

              {loading
                ? "Generating..."
                : "Generate Document"}

            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="bg-slate-900 p-6 rounded-xl flex flex-col">

          <div className="flex-1 overflow-auto whitespace-pre-wrap">

            {loading
              ? "AI generating document..."
              : result ||
                "Generated document appears here"}

          </div>

          {/* EXPORT BUTTONS */}

          <div className="mt-6 flex gap-3">

            <button
              onClick={
                handleExportMarkdown
              }
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              Export MD
            </button>

            <button
              onClick={
                handleExportText
              }
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Export TXT
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}