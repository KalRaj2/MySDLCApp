export async function streamOllama(
  prompt,
  onChunk
) {
  try {
    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tinyllama",
          prompt: prompt,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();

      console.error("OLLAMA ERROR:", text);

      onChunk(text);

      return;
    }

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    let finalText = "";

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      const lines = chunk
        .split("\n")
        .filter(Boolean);

      for (const line of lines) {
        try {
          const json =
            JSON.parse(line);

          if (json.response) {
            finalText += json.response;

            onChunk(finalText);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    return finalText;
  } catch (error) {
    console.error(error);

    onChunk(
      "Failed connecting to Ollama."
    );
  }
}