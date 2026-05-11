import Database from "@tauri-apps/plugin-sql";

let dbInstance = null;

export async function initDB() {
  try {
    if (dbInstance) {
      return dbInstance;
    }

    dbInstance = await Database.load("sqlite:mysdlc.db");

    console.log("Database loaded");

    await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS discovery_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT,
    client_notes TEXT,
    business_goal TEXT,
    target_audience TEXT,
    challenges TEXT,
    ai_response TEXT,
    created_at TEXT
  )
`);
await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS ai_chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    message TEXT,
    created_at TEXT
  )
`);

    console.log("Projects table ready");

    return dbInstance;
  } catch (error) {
    console.error("DB Init Error:", error);

    throw error;
  }
}