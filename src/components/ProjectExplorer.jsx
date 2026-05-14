import { useEffect, useState }
from "react";

import {
  getProjects,
  getProjectFiles,
} from "../services/projectService";

export default function ProjectExplorer({

  onFileSelect,

}) {

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    expandedProject,
    setExpandedProject,
  ] = useState(null);

  const [
    projectFiles,
    setProjectFiles,
  ] = useState({});

  useEffect(() => {

    loadProjects();

  }, []);

  async function loadProjects() {

    try {

      const data =
        await getProjects();

      setProjects(data);

    } catch (error) {

      console.error(
        "LOAD PROJECTS ERROR:",
        error
      );
    }
  }

  async function toggleProject(
    projectName
  ) {

    if (
      expandedProject === projectName
    ) {

      setExpandedProject(null);

      return;
    }

    setExpandedProject(
      projectName
    );

    /*
      LOAD FILES
    */

    if (
      !projectFiles[projectName]
    ) {

      try {

        const files =
          await getProjectFiles(
            projectName
          );

        setProjectFiles((prev) => ({

          ...prev,

          [projectName]: files,

        }));

      } catch (error) {

        console.error(
          "LOAD FILES ERROR:",
          error
        );
      }
    }
  }

  return (

    <div
      className="
        bg-gray-950
        text-white
        h-full
        overflow-auto
        p-2
      "
    >

      <h2
        className="
          text-lg
          font-bold
          mb-4
        "
      >

        Projects

      </h2>

      {projects.map((project) => (

        <div
          key={project.id}
          className="mb-2"
        >

          <div
            onClick={() =>
              toggleProject(
                project.name
              )
            }
            className="
              cursor-pointer
              bg-gray-900
              hover:bg-gray-800
              p-2
              rounded
            "
          >

            📁 {project.name}

          </div>

          {
            expandedProject ===
              project.name && (

              <div
                className="
                  ml-4
                  mt-2
                "
              >

                {(
                  projectFiles[
                    project.name
                  ] || []
                ).map((file) => (

                  <div
                    key={file.id}
                    onClick={() =>
                      onFileSelect({
                        fileName:
                          file.file_name,

                        code:
                          file.content,
                      })
                    }
                    className="
                      cursor-pointer
                      hover:text-blue-400
                      py-1
                    "
                  >

                    📄 {
                      file.file_name
                    }

                  </div>

                ))}

              </div>
            )
          }

        </div>

      ))}

    </div>
  );
}