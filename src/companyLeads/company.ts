import { join } from 'path';
import type companyRawLeads from '../../data/companyRawLeads';
import { CompanySql } from './CompanySql';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import { getAllSingleCompanyLeads } from './SingleCompany';

type CompanyLead = typeof companyRawLeads[0];

interface ApiResponse {
  numFound: number;
  start: number;
  docs: CompanyLead[];
  facets: any;
}


const CompanyDB = new CompanySql();

async function fetchCompanyLeads(offset: number, limit: number = 150): Promise<ApiResponse> {
  let url;
  try {
    url = new URL('https://api.io.constructconnect.com/search/v1/CompanyLeads');
  } catch (error) {
    throw new Error('Invalid URL');
  }

  if (Bun.env.API_PUBLIC_KEY === undefined) {
    throw new Error('API_PUBLIC_KEY is required');
  }

  url.searchParams.set('x-api-key', Bun.env.API_PUBLIC_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${Bun.env.API_SECRET_KEY}`
    },
    body: JSON.stringify({
      "sortDir": "asc",
      "filters": {
        "location": {
          "locationType": "None",
        }
      },
      "limit": limit,
      "offset": offset,
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function addAllCompanyLeadsToPostgresqlFromApi(data: ApiResponse): Promise<void> {
  for (const company of data.docs) {
    console.log(company)

    await CompanyDB.addCompanies(company);
  }

  console.log("\n");
  console.log("Companies added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function addAllCompanyLeadsToPostgresqlFromFile(filePath: string = join(process.cwd(), 'data', 'company_leads.json')): Promise<void> {

  if (!await Bun.file(filePath).exists()) {
    console.log(`${filePath} does not exist`);
    return;
  }

  const s = spinner();
  s.start('Adding companies to database...');

  const fileContent = await Bun.file(filePath).text();
  const data: CompanyLead[] = JSON.parse(fileContent);

  let i = 0;
  for (const company of data) {
    // console.log(company)

    await CompanyDB.addCompanies(company);

    // Adding Single Company lead from api to file
    await getAllSingleCompanyLeads(company.companyId.toString())

    i++;
    s.message(`Adding companies to database... ${i}/${data.length}`);
  }

  console.log("\n");
  s.stop('Companies added/updated successfully! Total companies added: ' + data.length);
  console.log("\n");
  console.log("\n");
}

export async function getAllCompanyLeads(existingRecords?: number): Promise<void> {
  const limit: number = 150;
  let offset: number = Number(existingRecords) ?? 0;
  let totalRecords: number = Infinity;
  const outputFilePath: string = join(process.cwd(), 'data', 'company_leads.json');

  while (offset < totalRecords) {
    console.log(`\n--------------------------------------------------------------------`);
    console.log(`Fetching company leads from offset: ${offset} to ${offset + limit}`);

    // if (offset % 1500 === 0) {
    //   console.log('Sleeping for 5 seconds');
    //   await Bun.sleep(5000);
    // }

    const response = await fetchCompanyLeads(offset, limit);

    console.log(`Fetched ${response.numFound} company leads`);

    await appendToFile<CompanyLead[]>(outputFilePath, response.docs);
    // await addAllCompanyLeadsToPostgresqlFromApi(response);

    totalRecords = response.numFound;
    offset += limit;
    console.log(`Total records: ${totalRecords}`);
    console.log(`Offset: ${offset}`);
  }

  console.log('All company leads fetched successfully');
}
