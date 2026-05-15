export function parseGeneratedFiles(text) {

  try {

    if (!text) {

      return [];

    }

    const files = [];

    /*
      SUPPORTS BOTH:

      1)

      FILE: src/App.jsx
      ```jsx
      code
      ```

      2)

      FILE: src/App.jsx
      import React ...

    */

    const sections =
      text.split("FILE:");

    for (const section of sections) {

      const trimmed =
        section.trim();

      if (!trimmed) {

        continue;

      }

      const lines =
        trimmed.split("\n");

      const fileName =
        lines[0]?.trim();

      if (!fileName) {

        continue;

      }

      let code =
        lines
          .slice(1)
          .join("\n")
          .trim();

      /*
        REMOVE MARKDOWN FENCES
      */

      code = code
        .replace(/```[\w]*/g, "")
        .replace(/```/g, "")
        .trim();

      if (!code) {

        continue;

      }

      files.push({

        fileName,

        code,

      });

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