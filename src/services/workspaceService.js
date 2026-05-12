import { initDB } from "../database/db";

export async function saveWorkspaceDocument(
  data
) {
  const db = await initDB();

  await db.execute(
    `
      INSERT INTO workspace_documents (
        project_id,
        title,
        type,
        content,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.project_id,
      data.title,
      data.type,
      data.content,
      new Date().toISOString(),
    ]
  );
}

export async function getWorkspaceDocuments(
  projectId
) {
  const db = await initDB();

  return await db.select(
    `
      SELECT * FROM workspace_documents
      WHERE project_id = ?
      ORDER BY id DESC
    `,
    [projectId]
  );
}
export async function updateWorkspaceDocument(
  id,
  content
) {
  const db = await initDB();

  await db.execute(
    `
      UPDATE workspace_documents
      SET content = ?
      WHERE id = ?
    `,
    [content, id]
  );
}

export async function getDocumentById(id) {
  const db = await initDB();

  const result = await db.select(
    `
      SELECT * FROM workspace_documents
      WHERE id = ?
    `,
    [id]
  );

  return result[0];
}