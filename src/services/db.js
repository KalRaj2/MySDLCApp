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

    console.log(
      "Database loaded"
    );

    /*
      PROJECTS TABLE
    */

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

    /*
      DOCUMENTS TABLE
    */

    await dbInstance.execute(`

      CREATE TABLE IF NOT EXISTS documents (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_name TEXT,

        title TEXT,

        type TEXT,

        content TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

      )

    `);

    console.log(
      "Documents table ready"
    );

    /*
      REMOVE OLD generated_files TABLE
      IMPORTANT:
      OLD TABLE USED project_id
      NEW TABLE USES project_name
    */

    await dbInstance.execute(`

      DROP TABLE IF EXISTS generated_files

    `);

    /*
      GENERATED FILES TABLE
    */

    await dbInstance.execute(`

      CREATE TABLE generated_files (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        project_name TEXT,

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