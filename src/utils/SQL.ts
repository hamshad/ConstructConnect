import { Pool, type PoolClient } from "pg";

export class SQL {
  static pool = new Pool();
  static client: PoolClient;

  static {
    (async () => {
      SQL.client = await SQL.pool.connect();
    })();
  }

  getSQL() {
    if (!SQL.client) {
      throw new Error("SQL connection not established");
    }
    return SQL.client;
  }

  static async getVersion() {
    try {
      const res = await SQL.client.query("SELECT version();");
      console.log(res.rows[0].version);
      console.log("\n");
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  }

  static async startTransaction() {
    await SQL.client.query("BEGIN;");

    return async (commit: boolean = true) => {
      await SQL.client.query(commit ? "COMMIT;" : "ROLLBACK;");
    };
  }

  static async closeSQL() {
    if (SQL.client) {
      SQL.client.release();
    }
    await SQL.pool.end();
    console.log("\nConnection closed");
  }
}
