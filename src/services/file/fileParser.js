export function parseGeneratedFiles(text) {
  try {
    if (!text || typeof text !== "string") {
      return [];
    }

    const files = [];

    /**
     * STEP 1: Split by FILE marker
     */
    const sections = text.split("FILE:");

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const lines = trimmed.split("\n");

      const fileName = lines[0]?.trim();
      if (!fileName) continue;

      let code = lines.slice(1).join("\n").trim();

      /**
       * STEP 2: Remove markdown fences safely
       */
      code = code
        .replace(/```[\w+]*/g, "")
        .replace(/```/g, "")
        .trim();

      if (!code) continue;

      files.push({
        fileName,
        code,
      });
    }

    /**
     * STEP 3: FALLBACK (VERY IMPORTANT)
     * If AI ignores FILE: format, try extracting blocks anyway
     */
    if (files.length === 0) {
      const fallbackRegex =
        /```(?:\w+)?\n([\s\S]*?)```/g;

      let match;
      let index = 0;

      while ((match = fallbackRegex.exec(text)) !== null) {
        files.push({
          fileName: `file_${index++}.txt`,
          code: match[1].trim(),
        });
      }
    }

    console.log("PARSED FILES:", files);

    return files;
  } catch (error) {
    console.error("FILE PARSER ERROR:", error);
    return [];
  }
}