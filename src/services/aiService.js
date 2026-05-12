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

SYSTEM:
You are a senior software engineer.

You ONLY generate source code files.

You NEVER explain anything.

You NEVER write introductions.

You NEVER write markdown headings.

You NEVER write bullet points.

You NEVER write descriptions.

You NEVER write notes.

You NEVER write English explanations.

OUTPUT FORMAT IS STRICTLY:

FILE: src/fileName.js
\`\`\`javascript
FULL CODE HERE
\`\`\`

EXAMPLE:

FILE: src/components/Login.jsx
\`\`\`jsx
export default function Login() {
  return <div>Login</div>
}
\`\`\`

FILE: src/services/authService.js
\`\`\`javascript
export async function login() {

}
\`\`\`

IMPORTANT:
- ALWAYS generate COMPLETE FILES
- ALWAYS generate REAL CODE
- NEVER generate pseudo code
- NEVER skip requested files
- NEVER explain anything
- NEVER say "Certainly"
- NEVER say "Below is"
- NEVER use markdown titles

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