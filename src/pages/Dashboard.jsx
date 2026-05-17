import { useEffect, useState } from "react";

import { getProjects }
from "@services/db/projectService";

export default function Dashboard() {

  const [projectCount, setProjectCount] =
    useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    const projects =
      await getProjects();

    setProjectCount(projects.length);
  };

  return (

    <div className="text-black">

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Dashboard
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >

        <div
          className="
            bg-white
            border
            border-gray-200
            p-5
            rounded-xl
            shadow-sm
          "
        >

          <h2 className="text-gray-600">
            Total Projects
          </h2>

          <p
            className="
              text-4xl
              mt-3
              font-bold
              text-blue-600
            "
          >
            {projectCount}
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-gray-200
            p-5
            rounded-xl
            shadow-sm
          "
        >

          <h2 className="text-gray-600">
            Discovery Sessions
          </h2>

          <p
            className="
              text-4xl
              mt-3
              font-bold
              text-blue-600
            "
          >
            0
          </p>

        </div>

        <div
          className="
            bg-white
            border
            border-gray-200
            p-5
            rounded-xl
            shadow-sm
          "
        >

          <h2 className="text-gray-600">
            Generated Documents
          </h2>

          <p
            className="
              text-4xl
              mt-3
              font-bold
              text-blue-600
            "
          >
            0
          </p>

        </div>

      </div>

    </div>
  );
}