import { join } from 'path';
import type singleCompanyRawLeads from '../../data/singleCompanyLeadRaw';
import { CompanySql } from './CompanySql';
import { appendToFile } from '../../data/FileOperations';


type SingleCompanyLeadType = typeof singleCompanyRawLeads[0];

const CompanyDB = new CompanySql();
const SingleCompanyFile = join(process.cwd(), 'data', 'single_company_leads.json');

async function fetchSingleCompanyLead(companyId: number): Promise<SingleCompanyLeadType> {
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function addSingleCompanyToListFromApi(data: SingleCompanyLeadType): Promise<void> {
  for (const company of data) {
    console.log(company)

    // TODO: Add company to database
  }

  console.log("\n");
  console.log("Companies added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function addAllCompanyLeadsToPostgresqlFromFile(filePath: string = SingleCompanyFile): Promise<void> {
  if (!await Bun.file(filePath).exists()) {
    throw new Error(`${filePath} does not exist`);
  }

  const fileContent = await Bun.file(filePath).text();
  const data = JSON.parse(fileContent);

  for (const company of data) {
    // console.log(company)
    await CompanyDB.addCompanies(company);

  }

  console.log("\n");
  console.log("Companies added/updated successfully!");
  console.log("\n");
  console.log("\n");
}
export async function getAllCompanyLeads(existingRecords?: number): Promise<void> {
  while (true) {
    console.log(`\n--------------------------------------------------------------------`);

    const response = await fetchSingleCompanyLead(91432);

    console.log(`Fetched ${response.numFound} company leads`);

    await appendToFile<SingleCompanyLeadType>(SingleCompanyFile, response.docs);
    // await addAllCompanyLeadsToPostgresqlFromApi(response);

  }

  console.log('All company leads fetched successfully');
}
