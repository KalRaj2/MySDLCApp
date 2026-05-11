export async function askOllama(prompt) {
  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tinyllama",
          prompt,
          stream: false,
        }),
      }
    );

    const data = await response.json();

    return data.response;
  } catch (error) {
    console.error(error);

    return "AI connection failed";
  }
}