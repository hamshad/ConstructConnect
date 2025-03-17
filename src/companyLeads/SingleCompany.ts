import { join } from 'path';
import { CompanySql } from './CompanySql';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import colors from 'picocolors';
import { SQL } from '../utils/SQL';
import type companyRawLeads from '../../data/companyRawLeads';

const CompanyDB = new CompanySql();
const SingleCompanyFile = join(process.cwd(), 'data', 'single_company_leads.json');

async function fetchSingleCompanyLead(companyId: string): Promise<SingleCompanyType> {
  let url;
  try {
    url = new URL('https://api.io.constructconnect.com/cc/v1/companyInfo');
  } catch (error) {
    throw new Error('Invalid URL');
  }

  url.searchParams.set('companyId', companyId.toString());

  if (Bun.env.API_PUBLIC_KEY === undefined) {
    throw new Error('API_PUBLIC_KEY is required');
  }

  url.searchParams.set('x-api-key', Bun.env.API_PUBLIC_KEY);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${JSON.stringify(response, null, 2)}`);
  }

  return response.json();
}


async function addSingleCompanyToListFromApi(companyId: number, company: SingleCompanyType): Promise<void> {
  console.log(company)

  await CompanyDB.addSingleCompany(companyId.toString(), company);

  console.log(colors.blue(`Company ${company.companyInformation[0].SourceCompanyId} added/updated to the database successfully!`));

}

export async function addAllSingleCompanyLeadsToDatabaseFromFile(filePath: string = SingleCompanyFile): Promise<void> {

  if (!await Bun.file(filePath).exists()) {
    throw new Error(`${filePath} does not exist`);
  }

  const fileContent = await Bun.file(filePath).text();
  const data: SingleCompanyType[] = JSON.parse(fileContent);

  for (const company of data) {
    console.log('Company', company)
    await CompanyDB.addSingleCompany(company.companyInformation[0].SourceCompanyId.toString(), company);

  }

  console.log("\n");
  console.log("Companies added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function getAllSingleCompanyLeads(companyId: string): Promise<void> {

  // const companyIds = await CompanyDB.getAllCompaniesIds();

  // console.log(`Total number of companies in the database: ${companyIds.length}`);

  // for (const companyId of companyIds) {
  console.log(`\n--------------------------------------------------------------------`);
  console.log(`Fetching company leads for ${companyId}`);
  console.log(`--------------------------------------------------------------------`);

  const response = await fetchSingleCompanyLead(companyId);

  console.log(`Fetched ${response.companyInformation[0].CompanyName} Company Lead`);

  await appendToFile<SingleCompanyType>(SingleCompanyFile, response);
  // await addSingleCompanyToListFromApi(companyId, response);
  // }

  // console.log('All Single Company Leads are fetched successfully');
}



export async function addSingleCompanyFromCompanyFile(companyFromList: typeof companyRawLeads[0], singleCompany: SingleCompanyType): Promise<void> {

  const query = `
    INSERT INTO public.companies(
      company_id, name, industry_value, project_count, project_value, 
      phone, email, role_group, role_type, is_watched, is_viewed, 
      last_viewed_date, location, address, website, fax, 
      source_company_id, last_updated_date, associated_contacts, 
      company_portfolio, company_notes, updated_id
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
           $14, $15, $16, $17, $18::timestamp, $19, $20, $21, $22)
    RETURNING id`;

  // Values array that matches the parameters in order
  const values = [
    companyFromList.companyId,
    singleCompany.companyInformation[0].CompanyName,
    companyFromList.industryValue,
    companyFromList.projectCount,
    companyFromList.projectValue,
    singleCompany.companyInformation[0].Phone,
    singleCompany.companyInformation[0].EmailAddress,
    companyFromList.roleGroup,
    companyFromList.roleType,
    singleCompany.companyInformation[0].IsWatched,
    companyFromList.isViewed,
    companyFromList.lastViewedDate,
    companyFromList.location,
    singleCompany.companyInformation[0].Address,
    singleCompany.companyInformation[0].Website,
    singleCompany.companyInformation[0].Fax,
    singleCompany.companyInformation[0].SourceCompanyId,
    singleCompany.companyInformation[0].LastUpdatedDate,
    singleCompany.companyInformation[0].AssociatedContacts,
    companyData.company_portfolio,   // JSON object
    companyData.company_notes,       // JSON object
    companyData.updated_id
  ];

  try {
    const result = await SQL.client.query(query, values);
    console.log('Company inserted with ID:', result.rows[0].id);
  }
