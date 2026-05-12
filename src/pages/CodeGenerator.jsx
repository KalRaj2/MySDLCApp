import { useState } from "react";

import {
  generateAIResponse,
} from "../services/aiService";

import {
  parseGeneratedFiles,
} from "../services/fileParser";

import {
  saveGeneratedFile,
  getGeneratedFiles,
} from "../services/generatedFileService";

import {
  saveWorkspaceDocument,
} from "../services/workspaceService";

import CodeEditor from "../components/CodeEditor";

export default function CodeGenerator() {

  const [projectName, setProjectName] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [framework, setFramework] =
    useState("React");

  const [language, setLanguage] =
    useState("JavaScript");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [generatedFiles,
    setGeneratedFiles] =
    useState([]);

  const [selectedFile,
    setSelectedFile] =
    useState(null);

  async function generateCode() {

    try {

      setLoading(true);

      setResponse("");

      setGeneratedFiles([]);

      const finalPrompt = `

Project Name:
${projectName}

Framework:
${framework}

Language:
${language}

Requirements:
${prompt}

Generate complete production-ready code.

STRICT RULES:

- Generate ALL requested files
- Use FILE blocks
- No explanations
- No markdown headings
- No descriptions
- No notes

FORMAT:

FILE: src/fileName.js
\`\`\`javascript
CODE
\`\`\`

`;

      const aiResponse =
        await generateAIResponse({

          prompt: finalPrompt,

          onStream: (text) => {
            setResponse(text);
          },

        });

      const files =
        parseGeneratedFiles(
          aiResponse
        );

      setGeneratedFiles(files);

      if (files.length > 0) {

        setSelectedFile(files[0]);
      }

      for (const file of files) {

        await saveGeneratedFile({

          project_name:
            projectName,

          file_name:
            file.fileName,

          content:
            file.code,

        });

        await saveWorkspaceDocument({

          project_name:
            projectName,

          title:
            file.fileName,

          content:
            file.code,

        });
      }

      const refreshed =
        await getGeneratedFiles();

      console.log(
        "Saved Files:",
        refreshed
      );

    } catch (error) {

      console.error(error);

      setResponse(
        "AI Generation Failed"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-6">

        AI Code Generator

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(
              e.target.value
            )
          }
          className="
            bg-gray-800
            border
            border-gray-700
            rounded
            p-3
          "
        />

        <select
          value={framework}
          onChange={(e) =>
            setFramework(
              e.target.value
            )
          }
          className="
            bg-gray-800
            border
            border-gray-700
            rounded
            p-3
          "
        >
          <option>React</option>
          <option>Vue</option>
          <option>Angular</option>
          <option>Node.js</option>
          <option>Express</option>
        </select>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          className="
            bg-gray-800
            border
            border-gray-700
            rounded
            p-3
          "
        >
          <option>JavaScript</option>
          <option>TypeScript</option>
          <option>Python</option>
        </select>

      </div>

      <textarea
        rows="10"
        placeholder="
Describe your project requirements...
        "
        value={prompt}
        onChange={(e) =>
          setPrompt(
            e.target.value
          )
        }
        className="
          w-full
          mt-4
          bg-gray-800
          border
          border-gray-700
          rounded
          p-4
        "
      />

      <button
        onClick={generateCode}
        disabled={loading}
        className="
          mt-4
          bg-blue-600
          hover:bg-blue-700
          px-6
          py-3
          rounded
          font-bold
        "
      >

        {loading
          ? "Generating..."
          : "Generate Code"}

      </button>

      <button
        className="
          ml-4
          mt-4
          bg-green-600
          hover:bg-green-700
          px-6
          py-3
          rounded
          font-bold
        "
      >

        Export Full Response

      </button>

      <div className="mt-8">

        <h2 className="
          text-2xl
          font-bold
          mb-4
        ">

          Generated Files

        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-4
        ">

          <div className="
            bg-gray-900
            rounded
            p-3
            h-[80vh]
            overflow-auto
          ">

            {generatedFiles.length === 0 && (

              <div className="
                text-gray-400
              ">

                No generated files

              </div>
            )}

            <div className="
              space-y-2
            ">

              {generatedFiles.map(
                (file, index) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelectedFile(
                      file
                    )
                  }
                  className={`
                    p-2
                    rounded
                    cursor-pointer
                    transition
                    ${
                      selectedFile?.fileName ===
                      file.fileName
                        ? "bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    }
                  `}
                >

                  {file.fileName}

                </div>

              ))}

            </div>

          </div>

          <div className="
            md:col-span-3
            bg-gray-900
            rounded
            overflow-hidden
          ">

            <CodeEditor

              file={selectedFile}

              onChange={(value) => {

                setSelectedFile({

                  ...selectedFile,

                  code: value,

                });

              }}

            />

          </div>

        </div>

      </div>

      <div className="mt-8">

        <h2 className="
          text-2xl
          font-bold
          mb-4
        ">

          Full AI Response

        </h2>

        <pre className="
          bg-black
          text-green-400
          p-4
          rounded
          overflow-auto
          whitespace-pre-wrap
        ">

          {response}

        </pre>

      </div>

    </div>
  );
}