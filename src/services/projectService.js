import { initDB } from "../database/db";

export async function createProject(projectName) {
  const db = await initDB();

  await db.execute(
    `
      INSERT INTO projects (name, created_at)
      VALUES (?, ?)
    `,
    [projectName, new Date().toISOString()]
  );
}

export async function getProjects() {
  const db = await initDB();

  const projects = await db.select(`
    SELECT * FROM projects
    ORDER BY id DESC
  `);

  return projects;
}

export async function deleteProject(id) {
  const db = await initDB();

  await db.execute(
    `
      DELETE FROM projects
      WHERE id = ?
    `,
    [id]
  );
}