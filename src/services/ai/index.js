// AI SERVICE LAYER EXPORTS
export * from "./ai";
export * from "./db";
export * from "./file";
export * from "./templates";
export { generateAIResponse, askOllama } from "./aiService";

export { streamOllama } from "./streamAI";

export {
  analyzeCode,
  analyzeRequirements,
  detectTechStack,
} from "./aiAnalyzer";