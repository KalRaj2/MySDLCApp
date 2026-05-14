const OLLAMA_URL =
  "http://127.0.0.1:11434/api/generate";

export async function generateAIResponse({

  prompt,

  model = "qwen2.5-coder:3b",

  onStream,

}) {

  try {

    const finalPrompt = `
SYSTEM:
You are an expert senior software engineer.

ABSOLUTE RULES:

1. ONLY generate FILE blocks
2. NO explanations
3. NO markdown headings
4. NO introductions
5. NO summaries
6. NO notes
7. NO bullet points
8. NO text outside FILE blocks

CORRECT FORMAT:

FILE: src/components/Login.jsx
\`\`\`jsx
FULL CODE HERE
\`\`\`

FILE: src/services/authService.js
\`\`\`javascript
FULL CODE HERE
\`\`\`

IMPORTANT:
- Always generate REAL production-ready code
- Always include imports
- Always include exports
- Never generate placeholder comments
- Never explain code

CRITICAL RULES:

1. ONLY generate FILE blocks
2. NEVER explain anything
3. NEVER use comments for filenames
4. NEVER write markdown headings
5. NEVER write normal text
6. ALWAYS use THIS EXACT FORMAT:

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

              temperature: 0.1,

              num_predict: 4096,

            },

          }),
        }
      );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "OLLAMA ERROR:",
        errorText
      );

      throw new Error(errorText);
    }

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

    let buffer = "";

    while (true) {

      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      buffer += decoder.decode(
        value,
        {
          stream: true,
        }
      );

      const lines =
        buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {

        if (!line.trim()) continue;

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

        } catch (error) {

          console.error(
            "STREAM JSON ERROR:",
            error
          );
        }
      }
    }

    if (buffer.trim()) {

      try {

        const parsed =
          JSON.parse(buffer);

        if (parsed.response) {

          fullResponse +=
            parsed.response;
        }

      } catch (error) {

        console.error(
          "FINAL BUFFER ERROR:",
          error
        );
      }
    }

    /*
      CLEAN BAD OUTPUTS
    */

    fullResponse =
      fullResponse
        .replace(
          /Certainly!|Here('|’)s|Below is|Explanation:|Notes:/gi,
          ""
        )
        .trim();

    return fullResponse;

  } catch (error) {

    console.error(
      "AI SERVICE ERROR:",
      error
    );

    return `
FILE: error.txt
\`\`\`txt
${error.message}
\`\`\`
`;
  }
}

/*
BACKWARD COMPATIBILITY
*/

export async function askOllama(
  prompt,
  onStream
) {

  return await generateAIResponse({

    prompt,

    onStream,

  });
}

export default {

  generateAIResponse,

  askOllama,

};