import { initDB } from "@services/db/db";

export async function saveChat(role, message) {
  const db = await initDB();

  await db.execute(
    `
      INSERT INTO ai_chat_history (
        role,
        message,
        created_at
      )
      VALUES (?, ?, ?)
    `,
    [
      role,
      message,
      new Date().toISOString(),
    ]
  );
}

export async function getChatHistory() {
  const db = await initDB();

  return await db.select(`
    SELECT * FROM ai_chat_history
    ORDER BY id ASC
  `);
}