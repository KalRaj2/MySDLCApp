import { useEffect, useState } from "react";

import {
  saveChat,
  getChatHistory,
} from "@services/db/chatService";

import { streamOllama } from "@services/ai/streamAI";

export default function AIChat() {

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    const history =
      await getChatHistory();

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

    await saveChat(
      "assistant",
      aiText
    );

    setLoading(false);
  };

  return (

    <div className="flex flex-col h-[85vh] text-black">

      <h1 className="text-3xl font-bold mb-4 text-black">
        AI SDLC Assistant
      </h1>

      <div
        className="
          flex-1
          bg-white
          border
          border-gray-200
          rounded-xl
          p-4
          overflow-auto
        "
      >

        <div className="flex flex-col gap-4">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`
                p-4
                rounded-xl
                max-w-[80%]
                shadow-sm

                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-100 text-black self-start"
                }
              `}
            >

              <div
                className="
                  text-xs
                  mb-1
                  opacity-70
                "
              >
                {msg.role}
              </div>

              <div className="whitespace-pre-wrap">
                {msg.message}
              </div>

            </div>
          ))}

          {loading && (
            <div className="text-gray-500">
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
          className="
            flex-1
            p-4
            rounded-xl
            border
            border-gray-300
            bg-white
            text-black
          "
        />

        <button
          onClick={sendMessage}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            rounded-xl
            font-semibold
          "
        >
          Send
        </button>

      </div>

    </div>
  );
}