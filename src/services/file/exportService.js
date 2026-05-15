import {
  writeTextFile,
} from "@tauri-apps/plugin-fs";

import {
  save,
} from "@tauri-apps/plugin-dialog";

export async function exportMarkdown(
  filename,
  content
) {

  try {

    const filePath =
      await save({
        defaultPath:
          `${filename}.md`,
      });

    if (!filePath)
      return false;

    await writeTextFile(
      filePath,
      content
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

    const filePath =
      await save({
        defaultPath:
          `${filename}.txt`,
      });

    if (!filePath)
      return false;

    await writeTextFile(
      filePath,
      content
    );

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}