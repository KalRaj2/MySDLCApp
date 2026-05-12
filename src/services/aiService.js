const OLLAMA_URL =
  "http://127.0.0.1:11434/api/generate";

/* =========================================
   MAIN AI GENERATOR
========================================= */

export async function generateAIResponse({

  prompt,

  model = "qwen2.5-coder:3b",

  onStream,

}) {

  try {

    const finalPrompt = `

You are NOT a chatbot.

You are a code generation engine.

Your response will be parsed automatically.

ONLY generate FILE blocks.

STRICT FORMAT:

FILE: src/fileName.js
\`\`\`javascript
CODE
\`\`\`

RULES:

- Generate ALL requested files
- No explanations
- No markdown headings
- No descriptions
- No notes
- No extra text

USER REQUEST:

${prompt}

`;

    const response =
      await fetch(

        OLLAMA_URL,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

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

        }
      );

    if (!response.body) {

      throw new Error(
        "No response body"
      );
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let fullResponse = "";

    while (true) {

      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      const lines =
        chunk
          .split("\n")
          .filter(Boolean);

      for (const line of lines) {

        try {

          const parsed =
            JSON.parse(line);

          if (parsed.response) {

            fullResponse +=
              parsed.response;

            if (onStream) {

              onStream(
                fullResponse
              );
            }
          }

        } catch (err) {

          console.error(
            "Parse Error:",
            err
          );
        }
      }
    }

    return fullResponse;

  } catch (error) {

    console.error(
      "AI Service Error:",
      error
    );

    throw error;
  }
}

/* =========================================
   BACKWARD COMPATIBILITY
========================================= */

export async function askOllama(
  prompt,
  onStream
) {

  return await generateAIResponse({

    prompt,

    onStream,

  });
}