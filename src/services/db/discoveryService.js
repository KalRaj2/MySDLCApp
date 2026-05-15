import { initDB } from "@services/db/db";

export async function saveDiscoverySession(data) {
  const db = await initDB();

  await db.execute(
    `
      INSERT INTO discovery_sessions (
        project_name,
        client_notes,
        business_goal,
        target_audience,
        challenges,
        ai_response,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.project_name,
      data.client_notes,
      data.business_goal,
      data.target_audience,
      data.challenges,
      data.ai_response,
      new Date().toISOString(),
    ]
  );
}

export async function getDiscoverySessions() {
  const db = await initDB();

  return await db.select(`
    SELECT * FROM discovery_sessions
    ORDER BY id DESC
  `);
}