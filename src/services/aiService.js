import axios from "axios";

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

If you generate explanations,
the application will fail.

ONLY generate parsable FILE blocks.

You are a senior software architect and expert full-stack engineer.

Generate production-ready code.

STRICT OUTPUT FORMAT:

FILE: src/path/fileName.ext
\`\`\`language
CODE HERE
\`\`\`

IMPORTANT RULES:

- ONLY generate FILE blocks
- NO explanations
- NO introductions
- NO markdown headings
- NO bullet points
- NO extra text
- NO summaries
- NO descriptions
- NO notes
- NO text outside FILE blocks

REQUIREMENTS:

REQUIREMENTS:

- Generate ALL requested files
- NEVER skip files
- NEVER generate only one file
- Generate one FILE block per file
- Every requested filename MUST appear
- Include complete working code
- Use modern best practices
- Use reusable architecture
- Include imports and exports
- Include validations
- Include services
- Include components
- Use production-ready code

VERY IMPORTANT:

If the user requests:

- Login.jsx
- authService.js
- validation.js

You MUST generate ALL 3 files.

FAILURE TO GENERATE ALL FILES IS INCORRECT.

USER REQUEST:

${prompt}

VERY IMPORTANT:

Return ALL requested files.

Example format:

FILE: src/components/Login.jsx
\`\`\`jsx
CODE
\`\`\`

FILE: src/services/authService.js
\`\`\`javascript
CODE
\`\`\`

FILE: src/utils/validation.js
\`\`\`javascript
CODE
\`\`\`

If you fail to generate ALL files,
the response is incorrect.
`;

    const response =
      await axios.post(

        OLLAMA_URL,

        {

          model: "qwen2.5-coder:3b",
          prompt: finalPrompt,
          stream: true,
          options: {
            num_predict: 4096,
            temperature: 0.2,
            },

        },

        {

          responseType: "stream",

        }
      );

    let fullResponse = "";

    return new Promise((resolve, reject) => {

      response.data.on(

        "data",

        (chunk) => {

          const lines =
            chunk
              .toString()
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

              if (parsed.done) {

                resolve(
                  fullResponse
                );
              }

            } catch (err) {

              console.error(
                "Stream Parse Error:",
                err
              );
            }
          }
        }
      );

      response.data.on(

        "error",

        (err) => {

          console.error(
            "Ollama Stream Error:",
            err
          );

          reject(err);
        }
      );
    });

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