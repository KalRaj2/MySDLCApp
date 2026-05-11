import { askOllama } from "../services/aiService";
import { useState } from "react";
import toast from "react-hot-toast";

import { analyzeRequirements } from "../services/aiAnalyzer";
import { saveDiscoverySession } from "../services/discoveryService";

export default function Discovery() {
  const [formData, setFormData] = useState({
    project_name: "",
    client_notes: "",
    business_goal: "",
    target_audience: "",
    challenges: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAnalyze = async () => {
  try {
    const prompt = `
You are an expert SDLC architect.

Analyze this client requirement.

Project Name:
${formData.project_name}

Client Notes:
${formData.client_notes}

Business Goal:
${formData.business_goal}

Target Audience:
${formData.target_audience}

Challenges:
${formData.challenges}

Generate:
1. Project Purpose
2. Functional Requirements
3. Non Functional Requirements
4. Suggested Architecture
5. MVP Features
6. Risks
7. Timeline
8. Questions to ask client
`;

    const aiResult = await askOllama(prompt);

    setResult(aiResult);

    await saveDiscoverySession({
      ...formData,
      ai_response: aiResult,
    });

    toast.success("AI Analysis completed");
  } catch (error) {
    console.error(error);

    toast.error("AI analysis failed");
  }
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Discovery Meeting Engine
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl">
          <div className="flex flex-col gap-4">

            <input
              type="text"
              name="project_name"
              placeholder="Project Name"
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <textarea
              name="client_notes"
              placeholder="Client Raw Ideas"
              rows="5"
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <textarea
              name="business_goal"
              placeholder="Business Goal"
              rows="3"
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <textarea
              name="target_audience"
              placeholder="Target Audience"
              rows="3"
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <textarea
              name="challenges"
              placeholder="Challenges"
              rows="3"
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <button
              onClick={handleAnalyze}
              className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
            >
              Analyze Requirements
            </button>

          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl whitespace-pre-wrap overflow-auto">
          {result || "AI Analysis will appear here"}
        </div>
      </div>
    </div>
  );
}