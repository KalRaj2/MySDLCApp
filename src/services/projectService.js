import {
  initDB,
  getDB,
} from "./db";

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

  await initDB();

  const db = getDB();

  return await db.select(
    "SELECT * FROM projects ORDER BY id DESC"
  );
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