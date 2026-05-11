import { useState } from "react";

import { templates } from "../services/templateService";

import { streamOllama } from "../services/streamAI";

export default function Documents() {
  const [projectIdea, setProjectIdea] =
    useState("");

  const [selectedTemplate,
    setSelectedTemplate] =
    useState(templates[0]);

  const [result, setResult] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const generateDocument = async () => {
    if (!projectIdea) return;

    setLoading(true);

    setResult("");

    const prompt = `
You are an expert SDLC architect.

Project Idea:
${projectIdea}

${selectedTemplate.prompt}
`;

    await streamOllama(
      prompt,
      (chunk) => {
        setResult(chunk);
      }
    );

    setLoading(false);
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        AI Document Generator
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-slate-800 p-6 rounded-xl">

          <div className="flex flex-col gap-4">

            <textarea
              rows="6"
              placeholder="Describe project idea..."
              value={projectIdea}
              onChange={(e) =>
                setProjectIdea(
                  e.target.value
                )
              }
              className="p-4 rounded-xl bg-slate-700 outline-none"
            />

            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const template =
                  templates.find(
                    (t) =>
                      t.id === e.target.value
                  );

                setSelectedTemplate(
                  template
                );
              }}
              className="p-3 rounded-xl bg-slate-700"
            >
              {templates.map((template) => (
                <option
                  key={template.id}
                  value={template.id}
                >
                  {template.title}
                </option>
              ))}
            </select>

            <button
              onClick={generateDocument}
              className="bg-blue-600 p-4 rounded-xl"
            >
              Generate Document
            </button>

          </div>

        </div>

        <div className="bg-slate-900 p-6 rounded-xl overflow-auto whitespace-pre-wrap">

          {loading
            ? "AI generating document..."
            : result || "Generated document appears here"}

        </div>

      </div>

    </div>
  );
}