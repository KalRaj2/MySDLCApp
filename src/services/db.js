import Database from "@tauri-apps/plugin-sql";

let dbInstance = null;

export async function initDB() {

  try {

    if (dbInstance) {
      return dbInstance;
    }

    dbInstance =
      await Database.load(
        "sqlite:mysdlc.db"
      );

    console.log("Database loaded");

    /* PROJECTS */

    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS projects (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        description TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

      )
    `);

    console.log(
      "Projects table ready"
    );

    /* DOCUMENTS */

    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS documents (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_id INTEGER,

        title TEXT,

        type TEXT,

        content TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

      )
    `);

    console.log(
      "Documents table ready"
    );

    /* GENERATED FILES */

    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS generated_files (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_id INTEGER,

        file_name TEXT,

        content TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

      )
    `);

    console.log(
      "Generated files table ready"
    );

    return dbInstance;

  } catch (error) {

    console.error(
      "DB Init Error:",
      error
    );

    throw error;
  }
}

export function getDB() {

  if (!dbInstance) {

    throw new Error(
      "Database not initialized"
    );
  }

  return dbInstance;
}