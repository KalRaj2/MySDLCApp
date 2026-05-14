export function parseGeneratedFiles(text) {

  try {

    if (!text) return [];

    const files = [];

    /*
      FORMAT 1:

      FILE: src/App.jsx
      ```jsx
      code
      ```
    */

    const fileRegex =
      /FILE:\s*(.*?)\n```(?:\w+)?\n([\s\S]*?)```/g;

    let match;

    while (
      (match = fileRegex.exec(text)) !== null
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

    /*
      FORMAT 2:

      // src/App.jsx
    */

    const commentRegex =
      /\/\/\s*(src\/.*?\.\w+)\n([\s\S]*?)(?=\/\/\s*src\/|\Z)/g;

    while (
      (match = commentRegex.exec(text)) !== null
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