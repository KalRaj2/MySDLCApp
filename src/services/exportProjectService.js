import {
  mkdir,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

import {
  open,
} from "@tauri-apps/plugin-dialog";

export async function exportProject(
  projectName,
  files
) {

  try {

    /*
      SELECT EXPORT DIRECTORY
    */

    const selectedFolder =
      await open({

        directory: true,

        multiple: false,

        defaultPath: "Desktop",

      });

    if (!selectedFolder) {

      return false;

    }

    /*
      ROOT PROJECT PATH
    */

    const rootPath =
      `${selectedFolder}/${projectName}`;

    /*
      CREATE ROOT PROJECT FOLDER
    */

    await mkdir(
      rootPath,
      {
        recursive: true,
      }
    );

    /*
      CREATE ALL FILES
    */

    for (const file of files) {

      const fullPath =
        `${rootPath}/${file.fileName}`;

      /*
        CREATE FOLDER STRUCTURE
      */

      const folderPath =
        fullPath
          .split("/")
          .slice(0, -1)
          .join("/");

      await mkdir(
        folderPath,
        {
          recursive: true,
        }
      );

      /*
        WRITE FILE
      */

      await writeTextFile(
        fullPath,
        file.code
      );

      console.log(
        "EXPORTED FILE:",
        fullPath
      );
    }

    return true;

  } catch (error) {

    console.error(
      "EXPORT PROJECT ERROR:",
      error
    );

    return false;

  }
}