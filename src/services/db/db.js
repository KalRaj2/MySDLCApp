import Database from "@tauri-apps/plugin-sql";

let db = null;

/*
  INIT DATABASE
*/

export async function initDB() {
  try {
    if (db) {
      return db;
    }

    db = await Database.load(
      "sqlite:mysdlc.db"
    );

    console.log("DB Connected");

    /*
      PROJECTS TABLE
    */

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

    console.log("Projects table ready");

    /*
      DOCUMENTS TABLE
    */

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

    console.log("Documents table ready");

    /*
      GENERATED FILES TABLE
    */

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

    console.log("Generated files table ready");

    /*
      CHAT HISTORY TABLE
    */

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

    console.log("Chat history table ready");

    /*
      RTM MATRIX TABLE
    */

    await db.execute(`
      CREATE TABLE IF NOT EXISTS rtm_matrix (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_id INTEGER,

        requirement_id TEXT,

        requirement TEXT,

        linked_testcase TEXT,

        linked_file TEXT,

        status TEXT,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    console.log("RTM table ready");

    /*
      DISCOVERY ANSWERS TABLE
    */

    await db.execute(`
      CREATE TABLE IF NOT EXISTS discovery_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_id INTEGER,

        question TEXT,

        answer TEXT,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    console.log("Discovery table ready");

    /*
      AGILE SPRINTS TABLE
    */

    await db.execute(`
      CREATE TABLE IF NOT EXISTS agile_sprints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_id INTEGER,

        sprint_name TEXT,

        goal TEXT,

        tasks TEXT,

        status TEXT,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
      )
    `);

    console.log("Agile table ready");

    return db;

  } catch (error) {

    console.error(
      "DB Init Error:",
      error
    );

    throw error;
  }
}

/*
  GET DB
*/

export function getDB() {

  if (!db) {

    throw new Error(
      "Database not initialized"
    );
  }

  return db;
}