import {
  initDB,
  getDB,
} from "@services/db/db";

/*
  SAVE GENERATED FILE
*/

export async function saveGeneratedFile(file) {
  try {
    const db = await initDB();

    await db.execute(
      `
      INSERT INTO generated_files (
        project_id,
        file_name,
        content,
        language
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        file.project_id,
        file.file_name,
        file.content,
        file.language || "javascript",
      ]
    );

    console.log(
      "FILE SAVED:",
      file.file_name
    );

  } catch (error) {

    console.error(
      "SAVE FILE ERROR:",
      error
    );

    throw error;
  }
}

/*
  GET GENERATED FILES
*/

export async function getGeneratedFiles(
  projectName = null
) {

  try {

    await initDB();

    const db = getDB();

    let result = [];

    /*
      GET PROJECT FILES
    */

    if (projectName) {

      result =
        await db.select(
          `
            SELECT *

            FROM generated_files

            WHERE project_name = ?

            ORDER BY id DESC
          `,
          [projectName]
        );

    } else {

      /*
        GET ALL FILES
      */

      result =
        await db.select(`
          SELECT *

          FROM generated_files

          ORDER BY id DESC
        `);
    }

    console.log(
      "DB FETCH:",
      result
    );

    return result;

  } catch (error) {

    console.error(
      "GET FILES ERROR:",
      error
    );

    return [];
  }
}

/*
  GET SINGLE GENERATED FILE
*/

export async function getGeneratedFileById(
  id
) {

  try {

    await initDB();

    const db = getDB();

    const result =
      await db.select(
        `
          SELECT *

          FROM generated_files

          WHERE id = ?
        `,
        [id]
      );

    return result?.[0] || null;

  } catch (error) {

    console.error(
      "GET FILE ERROR:",
      error
    );

    return null;
  }
}

/*
  UPDATE GENERATED FILE
*/

export async function updateGeneratedFile({

  id,

  content,

}) {

  try {

    await initDB();

    const db = getDB();

    await db.execute(
      `
        UPDATE generated_files

        SET
          content = ?

        WHERE id = ?
      `,
      [
        content,
        id,
      ]
    );

    console.log(
      "FILE UPDATED:",
      id
    );

    return true;

  } catch (error) {

    console.error(
      "UPDATE FILE ERROR:",
      error
    );

    return false;
  }
}

/*
  RENAME GENERATED FILE
*/

export async function renameGeneratedFile({

  id,

  file_name,

}) {

  try {

    await initDB();

    const db = getDB();

    await db.execute(
      `
        UPDATE generated_files

        SET
          file_name = ?

        WHERE id = ?
      `,
      [
        file_name,
        id,
      ]
    );

    console.log(
      "FILE RENAMED:",
      file_name
    );

    return true;

  } catch (error) {

    console.error(
      "RENAME FILE ERROR:",
      error
    );

    return false;
  }
}

/*
  DELETE SINGLE FILE
*/

export async function deleteGeneratedFile(
  id
) {

  try {

    await initDB();

    const db = getDB();

    await db.execute(
      `
        DELETE FROM generated_files

        WHERE id = ?
      `,
      [id]
    );

    console.log(
      "FILE DELETED:",
      id
    );

    return true;

  } catch (error) {

    console.error(
      "DELETE FILE ERROR:",
      error
    );

    return false;
  }
}

/*
  DELETE ALL FILES OF PROJECT
*/

export async function deleteProjectFiles(
  projectName
) {

  try {

    await initDB();

    const db = getDB();

    await db.execute(
      `
        DELETE FROM generated_files

        WHERE project_name = ?
      `,
      [projectName]
    );

    console.log(
      "PROJECT FILES DELETED:",
      projectName
    );

    return true;

  } catch (error) {

    console.error(
      "DELETE PROJECT FILES ERROR:",
      error
    );

    return false;
  }
}

/*
  SEARCH FILES
*/

export async function searchGeneratedFiles(
  keyword
) {

  try {

    await initDB();

    const db = getDB();

    const result =
      await db.select(
        `
          SELECT *

          FROM generated_files

          WHERE
            file_name LIKE ?
            OR content LIKE ?

          ORDER BY id DESC
        `,
        [
          `%${keyword}%`,
          `%${keyword}%`,
        ]
      );

    console.log(
      "SEARCH RESULT:",
      result
    );

    return result;

  } catch (error) {

    console.error(
      "SEARCH FILE ERROR:",
      error
    );

    return [];
  }
}

/*
  GET PROJECT FILE COUNT
*/

export async function getProjectFileCount(
  projectName
) {

  try {

    await initDB();

    const db = getDB();

    const result =
      await db.select(
        `
          SELECT COUNT(*) as total

          FROM generated_files

          WHERE project_name = ?
        `,
        [projectName]
      );

    return result?.[0]?.total || 0;

  } catch (error) {

    console.error(
      "COUNT FILE ERROR:",
      error
    );

    return 0;
  }
}