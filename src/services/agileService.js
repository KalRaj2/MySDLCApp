import { initDB } from "@services/db/db";

export async function createTask(
  data
) {

  const db =
    await initDB();

  await db.execute(
    `
      INSERT INTO agile_tasks (
        project_id,
        title,
        description,
        status,
        priority,
        story_points,
        assigned_to,
        sprint,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.project_id,
      data.title,
      data.description,
      data.status,
      data.priority,
      data.story_points,
      data.assigned_to,
      data.sprint,
      new Date().toISOString(),
    ]
  );
}

export async function getTasks(
  projectId
) {

  const db =
    await initDB();

  return await db.select(
    `
      SELECT *
      FROM agile_tasks
      WHERE project_id = ?
      ORDER BY id DESC
    `,
    [projectId]
  );
}

export async function updateTaskStatus(
  id,
  status
) {

  const db =
    await initDB();

  await db.execute(
    `
      UPDATE agile_tasks
      SET status = ?
      WHERE id = ?
    `,
    [status, id]
  );
}