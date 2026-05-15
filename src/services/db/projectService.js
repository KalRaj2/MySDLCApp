import {
  initDB,
  getDB,
} from "@services/db/db";

/*
  CREATE PROJECT
*/

export async function createProject(
  projectName
) {

  await initDB();

  const db = getDB();

  await db.execute(
    `
      INSERT INTO projects (
        name,
        created_at
      )
      VALUES (?, ?)
    `,
    [
      projectName,
      new Date().toISOString(),
    ]
  );
}

/*
  GET ALL PROJECTS
*/

export async function getProjects() {

  await initDB();

  const db = getDB();

  return await db.select(`
    SELECT *
    FROM projects
    ORDER BY id DESC
  `);
}

/*
  DELETE PROJECT
*/

export async function deleteProject(
  id
) {

  await initDB();

  const db = getDB();

  /*
    GET PROJECT NAME FIRST
  */

  const project =
    await db.select(
      `
        SELECT *
        FROM projects
        WHERE id = ?
      `,
      [id]
    );

  if (
    project &&
    project.length > 0
  ) {

    const projectName =
      project[0].name;

    /*
      DELETE GENERATED FILES
    */

    await db.execute(
      `
        DELETE FROM generated_files
        WHERE project_name = ?
      `,
      [projectName]
    );

    /*
      DELETE DOCUMENTS
    */

    await db.execute(
      `
        DELETE FROM documents
        WHERE project_name = ?
      `,
      [projectName]
    );
  }

  /*
    DELETE PROJECT
  */

  await db.execute(
    `
      DELETE FROM projects
      WHERE id = ?
    `,
    [id]
  );
}

/*
  GET PROJECT FILES
*/

export async function getProjectFiles(
  projectName
) {

  await initDB();

  const db = getDB();

  return await db.select(
    `
      SELECT *
      FROM generated_files
      WHERE project_name = ?
      ORDER BY id ASC
    `,
    [projectName]
  );
}

/*
  RENAME PROJECT
*/

export async function renameProject(
  oldName,
  newName
) {

  await initDB();

  const db = getDB();

  /*
    UPDATE PROJECTS
  */

  await db.execute(
    `
      UPDATE projects
      SET name = ?
      WHERE name = ?
    `,
    [newName, oldName]
  );

  /*
    UPDATE GENERATED FILES
  */

  await db.execute(
    `
      UPDATE generated_files
      SET project_name = ?
      WHERE project_name = ?
    `,
    [newName, oldName]
  );

  /*
    UPDATE DOCUMENTS
  */

  await db.execute(
    `
      UPDATE documents
      SET project_name = ?
      WHERE project_name = ?
    `,
    [newName, oldName]
  );
}