import { useEffect, useState } from "react";

import {
  saveChat,
  getChatHistory,
} from "../services/chatService";

import { streamOllama } from "../services/streamAI";

export default function AIChat() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await getChatHistory();

    setMessages(history);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      message: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    await saveChat("user", input);

    setInput("");

    setLoading(true);

    let aiText = "";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        message: "",
      },
    ]);

    aiText = await streamOllama(
      `
You are an expert SDLC AI architect.

Answer professionally.

User:
${input}
`,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[
            updated.length - 1
          ].message = chunk;

          return updated;
        });
      }
    );

    await saveChat("assistant", aiText);

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[85vh]">

      <h1 className="text-3xl font-bold mb-4">
        AI SDLC Assistant
      </h1>

      <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-auto">

        <div className="flex flex-col gap-4">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl max-w-[80%]
              ${
                msg.role === "user"
                  ? "bg-blue-600 self-end"
                  : "bg-slate-700 self-start"
              }`}
            >
              <div className="text-sm text-gray-300 mb-1">
                {msg.role}
              </div>

              <div className="whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400">
              AI thinking...
            </div>
          )}

        </div>

      </div>

      <div className="mt-4 flex gap-3">

        <input
          type="text"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask SDLC AI..."
          className="flex-1 p-4 rounded-xl bg-slate-800 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6 rounded-xl"
        >
          Send
        </button>

      </div>
    </div>
  );
}