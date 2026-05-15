export async function streamOllama(prompt, onChunk) {
  try {
    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen2.5-coder:3b",
          prompt,
          stream: true,
          options: {
            temperature: 0.2,
            top_p: 0.8,
            num_predict: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("OLLAMA ERROR:", text);
      onChunk?.(`AI Error: ${text}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      /**
       * STEP 1: Decode stream chunk
       */
      buffer += decoder.decode(value, { stream: true });

      /**
       * STEP 2: Split lines safely
       */
      const lines = buffer.split("\n");

      /**
       * Keep last incomplete line in buffer
       */
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const json = JSON.parse(line);

          if (json.response) {
            /**
             * IMPORTANT:
             * send only incremental chunk (not full text)
             */
            onChunk(json.response);
          }
        } catch (err) {
          console.error("STREAM PARSE ERROR:", err);
        }
      }
    }

    return true;
  } catch (error) {
    console.error("STREAM ERROR:", error);
    onChunk?.("Failed connecting to Ollama.");
    return false;
  }
}