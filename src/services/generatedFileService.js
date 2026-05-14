import { getDB } from "./db";

export async function saveGeneratedFile({
  project_name,
  file_name,
  content,
}) {
  try {
    const db = await getDB();

    await db.execute(
      `
      INSERT INTO generated_files (
        project_name,
        file_name,
        content
      )
      VALUES (?, ?, ?)
      `,
      [
        project_name,
        file_name,
        content,
      ]
    );

    console.log(
      "FILE SAVED:",
      file_name
    );

    return true;

  } catch (error) {

    console.error(
      "SAVE FILE ERROR:",
      error
    );

    return false;
  }
}

export async function getGeneratedFiles() {

  try {

    const db = await getDB();

    const result =
      await db.select(
        `
        SELECT *
        FROM generated_files
        ORDER BY id DESC
        `
      );

    console.log(
      "DB FETCH:",
      result
    );

    return result || [];

  } catch (error) {

    console.error(
      "GET FILES ERROR:",
      error
    );

    return [];
  }
}

export async function deleteGeneratedFile(
  id
) {

  try {

    const db = await getDB();

    await db.execute(
      `
      DELETE FROM generated_files
      WHERE id = ?
      `,
      [id]
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