import {
  initDB,
  getDB,
} from "./db";

export async function saveWorkspaceDocument(document) {
  await initDB();

  const db = getDB();

  await db.execute(
    `
      INSERT INTO documents (
        project_id,
        title,
        type,
        content,
        created_at,
        updated_at
      )

      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      document.project_id,
      document.title,
      document.type,
      document.content,
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
}

export async function getWorkspaceDocuments(projectId) {
  await initDB();

  const db = getDB();

  return await db.select(
    `
      SELECT *
      FROM documents
      WHERE project_id = ?
      ORDER BY id DESC
    `,
    [projectId]
  );
}

export async function deleteWorkspaceDocument(id) {
  await initDB();

  const db = getDB();

  await db.execute(
    `
      DELETE FROM documents
      WHERE id = ?
    `,
    [id]
  );
}

export async function updateWorkspaceDocument(id, content) {
  await initDB();

  const db = getDB();

  await db.execute(
    `
      UPDATE documents
      SET
        content = ?,
        updated_at = ?
      WHERE id = ?
    `,
    [
      content,
      new Date().toISOString(),
      id,
    ]
  );
}

export async function getDocumentById(id) {
  await initDB();

  const db = getDB();

  const result = await db.select(
    `
      SELECT *
      FROM documents
      WHERE id = ?
    `,
    [id]
  );

  return result[0] || null;
}