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
await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS workspace_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT,
    type TEXT,
    content TEXT,
    created_at TEXT
  )
`);

await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS project_timelines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    phase TEXT,
    status TEXT,
    due_date TEXT
  )
`);
await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS requirement_matrix (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    requirement_id TEXT,
    title TEXT,
    description TEXT,
    module_name TEXT,
    priority TEXT,
    status TEXT,
    test_case TEXT,
    risk_level TEXT,
    sprint TEXT,
    created_at TEXT
  )
`);
await dbInstance.execute(`
  CREATE TABLE IF NOT EXISTS agile_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT,
    description TEXT,
    status TEXT,
    priority TEXT,
    story_points INTEGER,
    assigned_to TEXT,
    sprint TEXT,
    created_at TEXT
  )
`);
await db.execute(`
CREATE TABLE IF NOT EXISTS generated_files (

  id INTEGER PRIMARY KEY AUTOINCREMENT,

  project_id INTEGER,

  file_name TEXT,

  content TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);
    console.log("Projects table ready");

    return dbInstance;
  } catch (error) {
    console.error("DB Init Error:", error);

    throw error;
  }
}