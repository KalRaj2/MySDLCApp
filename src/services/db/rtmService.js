import { initDB }
from "../database/db";

export async function addRequirement(
  data
) {

  const db =
    await initDB();

  await db.execute(
    `
      INSERT INTO requirement_matrix (
        project_id,
        requirement_id,
        title,
        description,
        module_name,
        priority,
        status,
        test_case,
        risk_level,
        sprint,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.project_id,
      data.requirement_id,
      data.title,
      data.description,
      data.module_name,
      data.priority,
      data.status,
      data.test_case,
      data.risk_level,
      data.sprint,
      new Date().toISOString(),
    ]
  );
}

export async function getRequirements(
  projectId
) {

  const db =
    await initDB();

  return await db.select(
    `
      SELECT *
      FROM requirement_matrix
      WHERE project_id = ?
      ORDER BY id DESC
    `,
    [projectId]
  );
}