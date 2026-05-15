const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

/*
  AI CODE GENERATION ENGINE
*/
export async function generateAIResponse({
  prompt,
  model = "qwen2.5-coder:3b",
  onStream,
}) {
  try {
    const finalPrompt = `
You are a senior software engineer AI system.

STRICT OUTPUT RULES:
- ONLY output FILE blocks
- NO explanations
- NO SYSTEM messages
- NO markdown outside FILE blocks
- NO extra text

FORMAT STRICTLY LIKE THIS:

FILE: src/App.jsx
\`\`\`jsx
code here
\`\`\`

FILE: src/services/api.js
\`\`\`javascript
code here
\`\`\`

USER REQUEST:
${prompt}
`;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: finalPrompt,
        stream: true,
        options: {
          temperature: 0.2,
          num_predict: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullResponse = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const parsed = JSON.parse(line);

          if (parsed.response) {
            const chunk = parsed.response;

            // 🚨 FILTER SYSTEM NOISE
            if (
              chunk.includes("SYSTEM:") ||
              chunk.includes("assistant:") ||
              chunk.includes("user:")
            ) {
              continue;
            }

            fullResponse += chunk;

            if (onStream) {
              onStream(fullResponse); // full progressive text
            }
          }
        } catch (err) {
          console.error("STREAM PARSE ERROR:", err);
        }
      }
    }

    // flush buffer
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.response) {
          fullResponse += parsed.response;
        }
      } catch (err) {
        console.error("FINAL BUFFER ERROR:", err);
      }
    }

    // cleanup AI junk text
    fullResponse = fullResponse
      .replace(/Certainly!|Here('|’)s|Below is|Explanation:|Notes:/gi, "")
      .trim();

    return fullResponse;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);

    return `FILE: src/error/error.txt
\`\`\`txt
${error.message}
\`\`\``;
  }
}

/*
  BACKWARD COMPATIBILITY
*/
export async function askOllama(prompt, onStream) {
  return await generateAIResponse({
    prompt,
    onStream,
  });
}

export default {
  generateAIResponse,
  askOllama,
};