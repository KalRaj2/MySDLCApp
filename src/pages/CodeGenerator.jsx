import WorkspaceTabs from "../components/WorkspaceTabs";

import ProjectExplorer from "../components/ProjectExplorer";

import {
  getGeneratedFiles,
} from "../services/generatedFileService";

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

import FileTree from "../components/FileTree";

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

  const [
    generatedFiles,
    setGeneratedFiles,
  ] = useState([]);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [openTabs, setOpenTabs] =
  useState([]);

const [activeProject, setActiveProject] =
  useState(null);

  function exportResponse() {

    const blob = new Blob(
      [response],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `${projectName || "project"}-response.txt`;

    a.click();

    URL.revokeObjectURL(url);
  }

  
  async function generateCode() {

    try {

      setLoading(true);

      setResponse("");

      setGeneratedFiles([]);

      setSelectedFile(null);

      const finalPrompt = `

You are a senior software engineer.

CRITICAL RULES:

1. ONLY generate FILE blocks
2. NEVER explain anything
3. NEVER use comments for filenames
4. NEVER write markdown headings
5. NEVER write normal text
6. ALWAYS use THIS EXACT FORMAT:

FILE: src/components/Login.jsx
\`\`\`jsx
FULL CODE HERE
\`\`\`

FILE: src/services/authService.js
\`\`\`javascript
FULL CODE HERE
\`\`\`

7. GENERATE MULTIPLE FILES
8. EACH FILE MUST START WITH "FILE:"
9. DO NOT SKIP "FILE:"
10. GENERATE COMPLETE WORKING CODE

PROJECT NAME:
${projectName}

FRAMEWORK:
${framework}

LANGUAGE:
${language}

USER REQUIREMENTS:
${prompt}

`;

      const aiResponse =
        await generateAIResponse({

          prompt: finalPrompt,

          model:
            "qwen2.5-coder:3b",

          onStream: (text) => {

            setResponse(text);

          },

        });

      console.log(
        "RAW AI RESPONSE:",
        aiResponse
      );

      setResponse(aiResponse);

      const files =
        parseGeneratedFiles(
          aiResponse
        );

      console.log(
        "PARSED FILES:",
        files
      );

      if (
        !files ||
        files.length === 0
      ) {

        setResponse(
          aiResponse ||
          "No files generated"
        );

        return;
      }

      const savedFiles = [];

      for (const file of files) {

        try {

          const fileData = {

            project_name:
              projectName,

            file_name:
              file.fileName,

            content:
              file.code,

          };

          console.log(
            "SAVING FILE:",
            fileData
          );

          await saveGeneratedFile(
            fileData
          );

          await saveWorkspaceDocument({

            project_name:
              projectName,

            title:
              file.fileName,

            content:
              file.code,

          });

          savedFiles.push({
            ...file,
          });

        } catch (saveError) {

          console.error(
            "FILE SAVE ERROR:",
            saveError
          );
        }
      }

      console.log(
        "Saved Files:",
        savedFiles
      );

      setGeneratedFiles(
        savedFiles
      );

      if (
        savedFiles.length > 0
      ) {

        setSelectedFile(
          savedFiles[0]
        );
      }

      const refreshed =
        await getGeneratedFiles();

      console.log(
        "DATABASE FILES:",
        refreshed
      );

    } catch (error) {

      console.error(
        "CODE GENERATOR ERROR:",
        error
      );

      setResponse(
        "AI Generation Failed"
      );

    } finally {

      setLoading(false);
    }
  }

  function openFile(file) {

  const exists =
    openTabs.find(
      (f) =>
        f.fileName ===
        file.fileName
    );

  if (!exists) {

    setOpenTabs([
      ...openTabs,
      file,
    ]);
  }

  setSelectedFile(file);
}

function closeTab(file) {

  const updated =
    openTabs.filter(
      (f) =>
        f.fileName !==
        file.fileName
    );

  setOpenTabs(updated);

  if (
    selectedFile?.fileName ===
    file.fileName
  ) {

    setSelectedFile(
      updated[0] || null
    );
  }
}
async function handleProjectSelect(
  project
) {

  try {

    setActiveProject(project);

    const files =
      await getGeneratedFiles(
        project.name
      );

    setGeneratedFiles(files);

    if (files.length > 0) {

      setSelectedFile(
        files[0]
      );

      setOpenTabs([
        files[0],
      ]);
    }

  } catch (error) {

    console.error(
      "LOAD PROJECT FILES ERROR:",
      error
    );
  }
}
  return (

    <div
      className="
        p-6
        text-white
        bg-gray-950
        min-h-screen
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >

        AI Code Generator

      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

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

          <option>
            React
          </option>

          <option>
            Vue
          </option>

          <option>
            Angular
          </option>

          <option>
            Node.js
          </option>

          <option>
            Express
          </option>

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

          <option>
            JavaScript
          </option>

          <option>
            TypeScript
          </option>

          <option>
            Python
          </option>

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

      <div
        className="
          flex
          gap-4
          mt-4
        "
      >

        <button
          onClick={generateCode}
          disabled={loading}
          className="
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
          onClick={exportResponse}
          className="
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

      </div>

      <div
  className="
    mt-6
    grid
    grid-cols-12
    gap-4
    h-[80vh]
  "
>

  {/* PROJECT EXPLORER */}

  <div
    className="
      col-span-2
      bg-gray-900
      rounded
      overflow-hidden
      border
      border-gray-800
    "
  >

    <ProjectExplorer
      onSelectProject={
        handleProjectSelect
      }
    />

  </div>

  {/* FILE TREE */}

  <div
    className="
      col-span-2
      bg-gray-900
      rounded
      overflow-hidden
      border
      border-gray-800
    "
  >

    <FileTree

      files={generatedFiles}

      selectedFile={selectedFile}

      onSelect={(file) => {

        openFile(file);

      }}

    />

  </div>

  {/* EDITOR */}

  <div
    className="
      col-span-8
      flex
      flex-col
      bg-gray-900
      rounded
      overflow-hidden
      border
      border-gray-800
    "
  >

    <WorkspaceTabs

      tabs={openTabs}

      activeTab={selectedFile}

      onTabClick={(file) => {

        setSelectedFile(file);

      }}

      onClose={closeTab}

    />

    <div className="flex-1">

      <CodeEditor

        file={selectedFile}

        onChange={(value) => {

          if (!selectedFile)
            return;

          const updatedFile = {

            ...selectedFile,

            code: value,

          };

          setSelectedFile(
            updatedFile
          );

          setOpenTabs(

            openTabs.map((f) =>

              f.fileName ===
              updatedFile.fileName
                ? updatedFile
                : f
            )
          );
        }}

      />

    </div>

  </div>

</div>

      <div className="mt-8">

        <h2
          className="
            text-2xl
            font-bold
            mb-4
          "
        >

          Full AI Response

        </h2>

        <pre
          className="
            bg-black
            text-green-400
            p-4
            rounded
            overflow-auto
            whitespace-pre-wrap
            max-h-[500px]
          "
        >

          {response}

        </pre>

      </div>

    </div>
  );
}