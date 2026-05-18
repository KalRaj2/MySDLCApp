import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function initDB() {
  try {
    if (db) {
      return db;
    }

    db = await Database.load("sqlite:mysdlc.db");

    console.log("DB Connected");

    /* PROJECTS */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        framework TEXT,
        language TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* DOCUMENTS */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT,
        content TEXT,
        version INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    /* GENERATED FILES */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS generated_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        content TEXT,
        language TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    /* CHAT HISTORY */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        role TEXT,
        message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    /* DISCOVERY SESSIONS */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS discovery_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_name TEXT,
        client_notes TEXT,
        business_goal TEXT,
        target_audience TEXT,
        challenges TEXT,
        ai_response TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* REQUIREMENT MATRIX */
    await db.execute(`
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
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    /* AGILE TASKS */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS agile_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        title TEXT,
        description TEXT,
        status TEXT,
        priority TEXT,
        story_points TEXT,
        assigned_to TEXT,
        sprint TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    console.log("All tables initialized");

    return db;
  } catch (error) {
    console.error("DB Init Error:", error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return db;
}