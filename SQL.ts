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

  async addCompanies(company: typeof companyRawLeads[0]) {
    // await SQL.sql`
    //     INSERT INTO companies (
    //       company_id,
    //       name,
    //       industry_value,
    //       project_count,
    //       project_value,
    //       phone,
    //       email,
    //       role_group,
    //       role_type,
    //       is_watched,
    //       is_viewed,
    //       last_viewed_date,
    //       location,
    //       address
    //     ) VALUES (
    //       ${company.companyId},
    //       ${company.name},
    //       ${company.industryValue ?? null},
    //       ${company.projectCount ?? null},
    //       ${company.projectValue ?? null},
    //       ${company.phone ?? null},
    //       ${company.email ?? null},
    //       ${company.roleGroup ?? null},
    //       ${company.roleType ?? null},
    //       ${company.isWatched ?? null},
    //       ${company.isViewed ?? null},
    //       ${company.lastViewedDate ?? null},
    //       ${JSON.stringify(company.location)},
    //       ${JSON.stringify(company.address)}
    //     )
    //     ON CONFLICT (company_id) DO NOTHING
    //   `;
    await SQL.sql`
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
    ${company.projectCount},
    ${company.projectValue},
    ${company.phone ?? null},
    ${company.email ?? null},
    ${Array.isArray(company.roleGroup) && company.roleGroup.length > 0 ? company.roleGroup : null},
    ${Array.isArray(company.roleType) && company.roleType.length > 0 ? company.roleType : null},
    ${company.isWatched},
    ${company.isViewed},
    ${company.lastViewedDate},
    ${company.location ? JSON.stringify(company.location) : null},
    ${company.address ? JSON.stringify(company.address) : null}
  )
  ON CONFLICT (company_id) 
  DO UPDATE SET
    name = EXCLUDED.name,
    industry_value = COALESCE(EXCLUDED.industry_value, companies.industry_value),
    project_count = EXCLUDED.project_count,
    project_value = EXCLUDED.project_value,
    phone = COALESCE(EXCLUDED.phone, companies.phone),
    email = COALESCE(EXCLUDED.email, companies.email),
    role_group = COALESCE(EXCLUDED.role_group, companies.role_group),
    role_type = COALESCE(EXCLUDED.role_type, companies.role_type),
    is_watched = EXCLUDED.is_watched,
    is_viewed = EXCLUDED.is_viewed,
    last_viewed_date = EXCLUDED.last_viewed_date,
    location = COALESCE(EXCLUDED.location, companies.location),
    address = COALESCE(EXCLUDED.address, companies.address)
`;
  }

  static async closeSQL() {
    await SQL.sql.end();
  }
}
