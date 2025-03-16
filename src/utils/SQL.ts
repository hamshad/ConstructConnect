import postgres from "postgres";
import type companyRawLeads from "./data/companyRawLeads";

export class SQL {

  static sql = postgres({
    host: "localhost",
    port: 5432,
    database: "constructconnect",
    username: "postgres",
    password: "1234",
    onnotice: notice => console.log(notice),
    onclose: () => console.log("\nConnection closed"),
  });

  getSQL() {
    if (!SQL.sql) {
      throw new Error("SQL connection not established");
    }
    return SQL.sql;
  }

  static async getVersion() {
    const [{ version }] = await SQL.sql`SELECT version()`;
    console.log(version);
    console.log("\n");
  }

  static async closeSQL() {
    await SQL.sql.end();
  }
}
