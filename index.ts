import postgres from "postgres";
import companyLeads from "./data/companyLeads";
import projectLeads from "./data/projectLeads";


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

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "constructconnect",
  username: "postgres",
  password: "1234",
  onnotice: notice => console.log(notice),
  onclose: () => console.log("\nConnection closed"),
})

const [{ version }] = await sql`SELECT version()`;
console.log(version);
console.log("\n");

const result = await sql`SELECT * FROM companies`;
console.log("[RESULT]", JSON.stringify(result, null, 2));

while (true) {
  console.log("0. Exit");
  console.log("1. Add all companies to the database");
  console.log("2. Add all projects to the database");
  console.log("3. show all companies");
  console.log("4. show all projects");
  console.log("\n")

  const choice = Number(prompt("Enter your choice: "));
  console.log("\n")
  console.log("\n")

  if (choice === 0) {
    break;
  }

  if (choice === 1) {
    for (const company of companyLeads) {
      console.log(company)

      await sql`
        INSERT INTO companies (
          company_id,
          name,
          industry_value,
          project_count,
          project_value,
          phone,
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
          ${company.industryValue},
          ${company.projectCount},
          ${company.projectValue},
          ${company.phone},
          ${company.roleGroup},
          ${company.roleType},
          ${company.isWatched},
          ${company.isViewed},
          ${company.lastViewedDate},
          ${JSON.stringify(company.location)},
          ${JSON.stringify(company.address)}
        )
        ON CONFLICT (company_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          industry_value = EXCLUDED.industry_value,
          project_count = EXCLUDED.project_count,
          project_value = EXCLUDED.project_value,
          phone = EXCLUDED.phone,
          role_group = EXCLUDED.role_group,
          role_type = EXCLUDED.role_type,
          is_watched = EXCLUDED.is_watched,
          is_viewed = EXCLUDED.is_viewed,
          last_viewed_date = EXCLUDED.last_viewed_date,
          location = EXCLUDED.location,
          address = EXCLUDED.address
      `;
    }
    console.log("Companies added/updated successfully!");
  }

  if (choice === 2) {
    for (const project of projectLeads) {
      console.log(project);

      await sql`
        INSERT INTO projects (
          project_id,
          title,
          project_url,
          project_description,
          property_type,
          document_count,
          addenda_count,
          last_addenda_date,
          has_new_addenda,
          bids_to_contact_role_group,
          contracting_method,
          floors_below_grade,
          categories,
          sub_categories,
          construction_types,
          project_sections,
          trades,
          project_value_range,
          csi_codes,
          is_watched,
          is_hidden,
          project_category,
          latitude,
          longitude,
          address_line1,
          city,
          county,
          state,
          state_code,
          state_abbr,
          zipcode,
          country_code,
          region,
          company_ids,
          company_names,
          last_updated_date,
          created_project_date,
          bid_date,
          start_date,
          is_shareable,
          is_viewed,
          project_status,
          project_value,
          building_uses_string,
          content_type,
          unique_project_id,
          sectors,
          document_acquisition_status,
          document_acquisition_status_id
        ) VALUES (
          ${project.projectId},
          ${project.title},
          ${project.projectUrl},
          ${project.projectDescription},
          ${project.propertyType},
          ${project.documentCount},
          ${project.addendaCount},
          ${project.lastAddendaDate},
          ${project.hasNewAddenda},
          ${project.bidsToContactRoleGroup},
          ${project.contractingMethod},
          ${project.floorsBelowGrade},
          ${project.categories},
          ${project.subCategories},
          ${project.constructionTypes},
          ${project.projectSections},
          ${project.trades},
          ${project.projectValueRange},
          ${project.csiCodes},
          ${project.isWatched},
          ${project.isHidden},
          ${project.projectCategory},
          ${project.location?.latitude},
          ${project.location?.longitude},
          ${project.address?.addressLine1},
          ${project.address?.city},
          ${project.address?.county},
          ${project.address?.state},
          ${project.address?.stateCode},
          ${project.address?.stateAbbr},
          ${project.address?.zipcode},
          ${project.address?.countryCode},
          ${project.address?.region},
          ${project.companyId},
          ${project.companyNameList},
          ${project.lastUpdatedDate},
          ${project.createdProjectDate},
          ${project.bidDate},
          ${project.startDate},
          ${project.isShareable},
          ${project.isViewed},
          ${project.projectStatus},
          ${project.projectValue},
          ${project.buildingUsesString},
          ${project.contentType},
          ${project.uniqueProjectId},
          ${project.sectors},
          ${project.documentAcquisitionStatus},
          ${project.documentAcquisitionStatusId}
        )
        ON CONFLICT (project_id) 
        DO UPDATE SET
          title = EXCLUDED.title,
          project_url = EXCLUDED.project_url,
          project_description = EXCLUDED.project_description,
          property_type = EXCLUDED.property_type,
          document_count = EXCLUDED.document_count,
          addenda_count = EXCLUDED.addenda_count,
          last_addenda_date = EXCLUDED.last_addenda_date,
          has_new_addenda = EXCLUDED.has_new_addenda,
          bids_to_contact_role_group = EXCLUDED.bids_to_contact_role_group,
          contracting_method = EXCLUDED.contracting_method,
          floors_below_grade = EXCLUDED.floors_below_grade,
          categories = EXCLUDED.categories,
          sub_categories = EXCLUDED.sub_categories,
          construction_types = EXCLUDED.construction_types,
          project_sections = EXCLUDED.project_sections,
          trades = EXCLUDED.trades,
          project_value_range = EXCLUDED.project_value_range,
          csi_codes = EXCLUDED.csi_codes,
          is_watched = EXCLUDED.is_watched,
          is_hidden = EXCLUDED.is_hidden,
          project_category = EXCLUDED.project_category,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          address_line1 = EXCLUDED.address_line1,
          city = EXCLUDED.city,
          county = EXCLUDED.county,
          state = EXCLUDED.state,
          state_code = EXCLUDED.state_code,
          state_abbr = EXCLUDED.state_abbr,
          zipcode = EXCLUDED.zipcode,
          country_code = EXCLUDED.country_code,
          region = EXCLUDED.region,
          company_ids = EXCLUDED.company_ids,
          company_names = EXCLUDED.company_names,
          last_updated_date = EXCLUDED.last_updated_date,
          created_project_date = EXCLUDED.created_project_date,
          bid_date = EXCLUDED.bid_date,
          start_date = EXCLUDED.start_date,
          is_shareable = EXCLUDED.is_shareable,
          is_viewed = EXCLUDED.is_viewed,
          project_status = EXCLUDED.project_status,
          project_value = EXCLUDED.project_value,
          building_uses_string = EXCLUDED.building_uses_string,
          content_type = EXCLUDED.content_type,
          unique_project_id = EXCLUDED.unique_project_id,
          sectors = EXCLUDED.sectors,
          document_acquisition_status = EXCLUDED.document_acquisition_status,
          document_acquisition_status_id = EXCLUDED.document_acquisition_status_id
      `;
    }
    console.log("Projects added/updated successfully!");
  }

  if (choice === 3) {
    const companies = await sql`SELECT * FROM companies`;
    console.log("All Companies:");
    console.table(companies);
  }

  if (choice === 4) {
    const projects = await sql`SELECT * FROM projects`;
    console.log("All Projects:");
    console.table(projects);
  }
}

await sql.end();
