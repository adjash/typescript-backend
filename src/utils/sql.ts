import sqlite3 from "sqlite3";

class SQLInstance {
  dbName: string;
  db: sqlite3.Database;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.db = new sqlite3.Database(this.dbName, (err) => {
      if (err) {
        console.error("Failed to connect to the database:", err);
      } else {
        console.log(`Connected to the database: ${this.dbName}`);
      }
    });
  }

  executeStatement(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (params.length > 0) {
        this.db.run(sql, params, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        this.db.exec(sql, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }

  insertRow(table: string, columns: string[], values: any[]): Promise<void> {
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;
    return this.executeStatement(sql, values);
  }

  updateRow(
    table: string,
    updates: Record<string, any>,
    condition: string,
    conditionParams: any[]
  ): Promise<void> {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    const params = [...Object.values(updates), ...conditionParams];
    return this.executeStatement(sql, params);
  }

  deleteRow(
    table: string,
    condition: string,
    conditionParams: any[]
  ): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE ${condition}`;
    return this.executeStatement(sql, conditionParams);
  }

  closeConnection(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Failed to close the database connection:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
}

export default SQLInstance;
