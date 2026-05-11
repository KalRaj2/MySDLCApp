import {
  writeTextFile,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

export async function exportMarkdown(
  filename,
  content
) {
  try {
    await writeTextFile(
      `${filename}.md`,
      content,
      {
        baseDir:
          BaseDirectory.Document,
      }
    );

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
}

export async function exportText(
  filename,
  content
) {
  try {
    await writeTextFile(
      `${filename}.txt`,
      content,
      {
        baseDir:
          BaseDirectory.Document,
      }
    );

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
}