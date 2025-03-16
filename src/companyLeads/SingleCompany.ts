import { join } from 'path';
import { CompanySql } from './CompanySql';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import colors from 'picocolors';

const CompanyDB = new CompanySql();
const SingleCompanyFile = join(process.cwd(), 'data', 'single_company_leads.json');

async function fetchSingleCompanyLead(companyId: number): Promise<SingleCompanyType> {
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
  const data = JSON.parse(fileContent) as SingleCompanyType[];

  for (const company of data) {
    // console.log(company)
    await CompanyDB.addSingleCompany(company.companyInformation[0].SourceCompanyId.toString(), company);

  }

  console.log("\n");
  console.log("Companies added/updated successfully!");
  console.log("\n");
  console.log("\n");
}
export async function getAllSingleCompanyLeads(existingRecords?: number): Promise<void> {
  // while (true) {
  console.log(`\n--------------------------------------------------------------------`);

  const response = await fetchSingleCompanyLead(existingRecords!);

  console.log(`Fetched ${response.companyInformation[0].CompanyName} company leads`);

  await appendToFile<SingleCompanyType>(SingleCompanyFile, response);
  await addSingleCompanyToListFromApi(existingRecords!, response);
  // }

  console.log('All Single Company Leads are fetched successfully');
}
