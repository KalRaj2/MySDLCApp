import {
  initDB,
  getDB,
} from "./db";

export async function saveGeneratedFile(
  file
) {

  await initDB();

  const db = getDB();

  await db.execute(

    `
    INSERT INTO generated_files
    (
      project_id,
      file_name,
      content
    )

    VALUES (?, ?, ?)
    `,

    [
      file.project_id,
      file.file_name,
      file.content,
    ]
  );
}

export async function getGeneratedFiles(
  projectId
) {

  await initDB();

  const db = getDB();

  const result =
    await db.select(

      `
      SELECT *
      FROM generated_files

      WHERE project_id = ?

      ORDER BY id DESC
      `,

      [projectId]
    );

  return result;
}