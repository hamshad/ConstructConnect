import postgres from "postgres";

// const db = new SQL({
//   url: "postgres://root:1234@localhost:5432/constructconnect",

//   hostname: "localhost",
//   port: 5432,
//   database: "constructconnect",
//   username: "postgres",
//   password: "1234",

//   tls: true,

//   onconnect: async (client) => {
//     console.log("Connected to database")
//   },

//   onclose: async (client) => {
//     console.log("Connection closed")
//   }
// });


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

  static async getVersion() {
    const [{ version }] = await SQL.sql`SELECT version()`;
    console.log(version);
    console.log("\n");
  }

  static async closeSQL() {
    await SQL.sql.end();
  }
}
