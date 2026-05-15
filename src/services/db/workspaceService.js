import {
  initDB,
  getDB,
} from "./db";

/* SAVE DOCUMENT */

export async function saveWorkspaceDocument(
  document
) {

  await initDB();

  const db = getDB();

  await db.execute(

    `
    INSERT INTO documents
    (
      project_id,
      title,
      type,
      content
    )

    VALUES (?, ?, ?, ?)
    `,

    [
      document.project_id,
      document.title,
      document.type,
      document.content,
    ]
  );
}

/* GET PROJECT DOCUMENTS */

export async function getWorkspaceDocuments(
  projectId
) {

  await initDB();

  const db = getDB();

  const result =
    await db.select(

      `
      SELECT *
      FROM documents

      WHERE project_id = ?

      ORDER BY id DESC
      `,

      [projectId]
    );

  return result;
}

/* DELETE DOCUMENT */

export async function deleteWorkspaceDocument(
  id
) {

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

/* UPDATE DOCUMENT */

export async function updateWorkspaceDocument(
  document
) {

  await initDB();

  const db = getDB();

  await db.execute(

    `
    UPDATE documents

    SET
      title = ?,
      type = ?,
      content = ?

    WHERE id = ?
    `,

    [
      document.title,
      document.type,
      document.content,
      document.id,
    ]
  );
}
/* GET SINGLE DOCUMENT */

export async function getDocumentById(
  id
) {

  await initDB();

  const db = getDB();

  const result =
    await db.select(

      `
      SELECT *
      FROM documents

      WHERE id = ?
      `,

      [id]
    );

  return result[0];
}