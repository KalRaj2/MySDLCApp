import {
  initDB,
  getDB,
} from "@services/db/db";

export async function createProject(projectName) {
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

export async function getProjects() {
  await initDB();

  const db = getDB();

  return await db.select(`
    SELECT *
    FROM projects
    ORDER BY id DESC
  `);
}

export async function deleteProject(id) {
  await initDB();

  const db = getDB();

  await db.execute(
    `DELETE FROM generated_files WHERE project_id = ?`,
    [id]
  );

  await db.execute(
    `DELETE FROM documents WHERE project_id = ?`,
    [id]
  );

  await db.execute(
    `DELETE FROM requirement_matrix WHERE project_id = ?`,
    [id]
  );

  await db.execute(
    `DELETE FROM agile_tasks WHERE project_id = ?`,
    [id]
  );

  await db.execute(
    `DELETE FROM projects WHERE id = ?`,
    [id]
  );
}