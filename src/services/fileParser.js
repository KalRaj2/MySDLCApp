export function parseGeneratedFiles(text) {

  try {

    if (!text) return [];

    const files = [];

    /*
      MATCHES:

      FILE: src/App.jsx
      ```jsx
      code
      ```

    */

    const regex =
      /FILE:\s*(.*?)\n```(?:\w+)?\n([\s\S]*?)```/g;

    let match;

    while (
      (match = regex.exec(text)) !== null
    ) {

      const fileName =
        match[1]?.trim();

      const code =
        match[2]?.trim();

      if (fileName && code) {

        files.push({

          fileName,

          code,

        });
      }
    }

    console.log(
      "PARSED FILES:",
      files
    );

    return files;

  } catch (error) {

    console.error(
      "FILE PARSER ERROR:",
      error
    );

    return [];
  }
}