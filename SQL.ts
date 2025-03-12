import postgres from "postgres";
import type companyRawLeads from "./data/companyRawLeads";

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

  static async addCompanies(company: typeof companyRawLeads[0]) {
    console.log('[COMPANY]:', company);

    try {
      const insertResult = await SQL.sql`
        INSERT INTO companies (
          company_id,
          name,
          industry_value,
          project_count,
          project_value,
          phone,
          email,
          role_group,
          role_type,
          is_watched,
          is_viewed,
          last_viewed_date,
          location,
          address
        ) VALUES (
          ${company.companyId},
          ${company.name},
          ${company.industryValue ?? null},
          ${company.projectCount ?? null},
          ${company.projectValue ?? null},
          ${company.phone ?? null},
          ${company.email ?? null},
          ${company.roleGroup ?? null},
          ${company.roleType ?? null},
          ${company.isWatched ?? null},
          ${company.isViewed ?? null},
          ${company.lastViewedDate ?? null},
          ${JSON.stringify(company.location)},
          ${JSON.stringify(company.address)}
        )
        ON CONFLICT (id) DO NOTHING
      `;

      console.log('INSERT RESULT', insertResult);

    } catch (error) {
      console.error(error);
      throw new Error(`Error adding company: ${error}`);
    }
  }

  static async closeSQL() {
    await SQL.sql.end();
  }
}
