import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getDocumentById,
  updateWorkspaceDocument,
} from "../services/workspaceService";

import { streamOllama } from "../services/streamAI";

export default function DocumentEditor() {
  const { id } = useParams();

  const [document,
    setDocument] =
    useState(null);

  const [content,
    setContent] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument =
    async () => {
      const doc =
        await getDocumentById(id);

      setDocument(doc);

      setContent(doc.content);
    };

  const saveDocument =
    async () => {
      await updateWorkspaceDocument(
        id,
        content
      );

      toast.success(
        "Document updated"
      );
    };

  const refineWithAI =
    async () => {
      setLoading(true);

      let refined = "";

      await streamOllama(
        `
Improve this SDLC document professionally:

${content}
`,
        (chunk) => {
          refined = chunk;

          setContent(chunk);
        }
      );

      setLoading(false);

      toast.success(
        "AI refinement completed"
      );
    };

  if (!document) {
    return (
      <div>
        Loading document...
      </div>
    );
  }

  return (
    <div className="h-[85vh] flex flex-col">

      <div className="flex justify-between items-center mb-4">

        <div>
          <h1 className="text-3xl font-bold">
            {document.title}
          </h1>

          <p className="text-gray-400">
            {document.type}
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={refineWithAI}
            className="bg-purple-600 px-4 py-2 rounded-xl"
          >
            {loading
              ? "AI Refining..."
              : "Refine With AI"}
          </button>

          <button
            onClick={saveDocument}
            className="bg-green-600 px-4 py-2 rounded-xl"
          >
            Save
          </button>

        </div>

      </div>

      <textarea
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        className="flex-1 bg-slate-900 rounded-xl p-5 outline-none resize-none"
      />

    </div>
  );
}