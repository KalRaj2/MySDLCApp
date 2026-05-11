import { useEffect, useState } from "react";

import { getProjects } from "../services/projectService";

export default function Dashboard() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const projects = await getProjects();

    setProjectCount(projects.length);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl">
          <h2>Total Projects</h2>

          <p className="text-4xl mt-3 font-bold">
            {projectCount}
          </p>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h2>Discovery Sessions</h2>

          <p className="text-4xl mt-3 font-bold">
            0
          </p>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h2>Generated Documents</h2>

          <p className="text-4xl mt-3 font-bold">
            0
          </p>
        </div>
      </div>
    </div>
  );
}