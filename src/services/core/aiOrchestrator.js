import { streamOllama } from "../streamAI";

/**
 * Central AI Engine for ALL SDLC operations
 * Replaces scattered AI calls across pages
 */

export async function runAIWorkflow({
  type,
  projectContext,
  input,
  template = "",
  onChunk,
}) {
  try {
    const prompt = buildPrompt({
      type,
      projectContext,
      input,
      template,
    });

    let fullResponse = "";

    await streamOllama(prompt, (chunk) => {
      fullResponse += chunk;
      onChunk(chunk, fullResponse);
    });

    return fullResponse;
  } catch (error) {
    console.error("AI ORCHESTRATOR ERROR:", error);
    throw error;
  }
}

/**
 * Standardized prompt builder
 */
function buildPrompt({ type, projectContext, input, template }) {
  return `
You are an expert SDLC AI system.

PROJECT CONTEXT:
${JSON.stringify(projectContext || {}, null, 2)}

TASK TYPE:
${type}

USER INPUT:
${input}

TEMPLATE INSTRUCTION:
${template}

RULES:
- Be structured
- Be production ready
- Follow SDLC standards
- Output clean, usable engineering artifacts
`;
}