import { useState } from "react";

import { save } from "@tauri-apps/plugin-dialog";

import {
  writeTextFile,
  mkdir,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

import {
  generateAIResponse,
} from "@services/ai/aiService";

import {
  parseGeneratedFiles,
} from "@services/file/fileParser";

import {
  saveGeneratedFile,
  getGeneratedFiles,
} from "@services/db/generatedFileService";

import {
  saveWorkspaceDocument,
} from "@services/db/workspaceService";

import CodeEditor from "@components/CodeEditor";

import FileTree from "@components/FileTree";

import WorkspaceTabs from "@components/WorkspaceTabs";

import ProjectExplorer from "@components/ProjectExplorer";

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

  const [generatedFiles, setGeneratedFiles] =
    useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [openTabs, setOpenTabs] =
    useState([]);

  const [activeProject, setActiveProject] =
    useState(null);

  /*
    EXPORT FULL AI RESPONSE
  */

  async function exportResponse() {

    try {

      if (!response) {

        alert("No response found");

        return;
      }

      const filePath =
        await save({

          defaultPath:
            `${projectName || "project"}-response.txt`,

        });

      if (!filePath) {

        return;
      }

      await writeTextFile(
        filePath,
        response
      );

      alert(
        "Response exported successfully"
      );

    } catch (error) {

      console.error(
        "EXPORT RESPONSE ERROR:",
        error
      );

      alert(
        "Export failed"
      );
    }
  }

  /*
    EXPORT FULL PROJECT
  */

  async function handleExportProject() {

    try {

      if (
        !generatedFiles ||
        generatedFiles.length === 0
      ) {

        alert(
          "No generated files found"
        );

        return;
      }

      /*
        SELECT FOLDER
      */

      const selectedFolder =
        await save({

          defaultPath:
            projectName || "MyProject",

        });

      if (!selectedFolder) {

        return;
      }

      /*
        WRITE ALL FILES
      */

      for (const file of generatedFiles) {

        try {

          const fullPath =
            `${selectedFolder}/${file.fileName}`;

          /*
            CREATE FOLDERS
          */

          const folderPath =
            fullPath.substring(
              0,
              fullPath.lastIndexOf("/")
            );

          await mkdir(
            folderPath,
            {
              recursive: true,
            }
          );

          /*
            WRITE FILE
          */

          await writeTextFile(
            fullPath,
            file.code || file.content || ""
          );

          console.log(
            "EXPORTED:",
            fullPath
          );

        } catch (fileError) {

          console.error(
            "FILE EXPORT ERROR:",
            fileError
          );
        }
      }

      alert(
        "Project exported successfully"
      );

    } catch (error) {

      console.error(
        "PROJECT EXPORT ERROR:",
        error
      );

      alert(
        "Project export failed"
      );
    }
  }

  /*
    GENERATE AI CODE
  */

  async function generateCode() {

    try {

      setLoading(true);

      setResponse("");

      setGeneratedFiles([]);

      setSelectedFile(null);

      setOpenTabs([]);

      const finalPrompt = `

You are a senior software engineer.

STRICT RULES:

1. ONLY generate FILE blocks
2. NEVER explain anything
3. NEVER write markdown headings
4. NEVER write normal text
5. ALWAYS use THIS EXACT FORMAT

FILE: src/App.jsx
\`\`\`jsx
FULL CODE
\`\`\`

FILE: src/services/api.js
\`\`\`javascript
FULL CODE
\`\`\`

6. EVERY FILE MUST START WITH FILE:
7. GENERATE MULTIPLE FILES
8. GENERATE COMPLETE WORKING CODE

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

      /*
        PARSE FILES
      */

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

        alert(
          "No files parsed"
        );

        return;
      }

      const savedFiles = [];

      /*
        SAVE FILES
      */

      for (const file of files) {

        try {

          const fileData = {

            project_id: activeProject?.id || 1,

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
  project_id: activeProject?.id || 1,
  title: file.fileName,
  type: "code",
  content: file.code,
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

      if (savedFiles.length > 0) {

        setSelectedFile(
          savedFiles[0]
        );

        setOpenTabs([
          savedFiles[0],
        ]);
      }

      const refreshed =
        await getGeneratedFiles(
          projectName
        );

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

  /*
    OPEN FILE
  */

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

  /*
    CLOSE TAB
  */

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

  /*
    LOAD PROJECT
  */

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
        "LOAD PROJECT ERROR:",
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

        <button
          onClick={handleExportProject}
          className="
            bg-purple-600
            hover:bg-purple-700
            px-6
            py-3
            rounded
            font-bold
          "
        >

          Export Full Project

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

        <div
          className="
            col-span-2
            bg-gray-900
            rounded
            border
            border-gray-800
            overflow-hidden
          "
        >

          <ProjectExplorer
            onSelectProject={
              handleProjectSelect
            }
          />

        </div>

        <div
          className="
            col-span-2
            bg-gray-900
            rounded
            border
            border-gray-800
            overflow-hidden
          "
        >

          <FileTree
            files={generatedFiles}
            selectedFile={selectedFile}
            onSelect={openFile}
          />

        </div>

        <div
          className="
            col-span-8
            flex
            flex-col
            bg-gray-900
            rounded
            border
            border-gray-800
            overflow-hidden
          "
        >

          <WorkspaceTabs
            tabs={openTabs}
            activeTab={selectedFile}
            onTabClick={setSelectedFile}
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