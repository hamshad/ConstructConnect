import projectLeads from "./data/projectLeads";
import { addAllCompanyLeadsToPostgresqlFromFile, getAllCompanyLeads } from "./src/companyLeads/company";
import { SQL } from './SQL'
import { join } from 'path';


// [MENU 1]
console.log("1. Company Leads");
console.log("2. Add all projects to the database");
console.log("4. show all projects");
console.log("0. Exit");
console.log("\n")

const choice = Number(prompt("Enter your choice: "));
console.log("\n")
console.log("\n")


// [MENU 2]
if (choice === 1) {
  console.log("1. Call all company leads from API");
  console.log("2. Add all company leads to the database");
  console.log("3. Total number of companies in the database");
  console.log("4. Show all companies in the database");
  console.log("0. Exit");

  const subChoice = Number(prompt("Enter your choice: "));
  console.log("\n")
  console.log("\n")

  if (subChoice === 1) {
    const length = await SQL.sql`SELECT COUNT(*) FROM companies`;

    getAllCompanyLeads(length[0].count as number)
      .then(() => {
        console.log("Companies added/updated successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (subChoice === 2) {
    addAllCompanyLeadsToPostgresqlFromFile();
  }

  if (subChoice === 3) {

    const length = await SQL.sql`SELECT COUNT(*) FROM companies`;
    if (length[0].count === 0) {
      console.log("No companies found in the database!");
    } else {
      console.log("Total number of companies in the database: ", length[0].count);
    }

    const filePath = join(process.cwd(), 'data', 'companyLeads.json');
    const fileContent = await Bun.file(filePath).text();
    console.log("Data file path: ", JSON.parse(fileContent).length);
  }

  if (subChoice === 4) {
    const companies = await SQL.sql`SELECT * FROM companies`;
    console.log("All Companies:");
    console.table(companies);
  }
}


if (choice === 2) {
  for (const project of projectLeads) {
    console.log(project);
    await SQL.sql`
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
  const companies = await SQL.sql`SELECT * FROM companies`;
  console.log("All Companies:");
  console.table(companies);
}

if (choice === 4) {
  const projects = await SQL.sql`SELECT * FROM projects`;
  console.log("All Projects:");
  console.table(projects);
}

if (choice === 0) {
  SQL.closeSQL();
}
