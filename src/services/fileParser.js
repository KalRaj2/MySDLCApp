export function parseGeneratedFiles(
  content
) {

  const files = [];

  /*
    SUPPORTS:

    FILE: path
    ### FILE: path
    ### path

  */

  const regex =
    /(?:###\s*)?(?:FILE:\s*)?([^\n]+\.(jsx|js|tsx|ts|css|html|json))\s*\n```[\w]*\n([\s\S]*?)```/g;

  let match;

  while (
    (match = regex.exec(content))
      !== null
  ) {

    files.push({

      fileName:
        match[1].trim(),

      code:
        match[3].trim(),

    });
  }

  return files;
}