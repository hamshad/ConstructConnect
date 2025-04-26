import { join } from 'path';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import { CompanyInfoSql } from './companyInfoSql';
import { CompanySql } from '../companyLeads/CompanySql';

const DB = new CompanyInfoSql();
const CompanyDB = new CompanySql();

const companyInfoPathFile = join(process.cwd(), 'src', 'companyInfo', 'companyInfoPaths.json');

async function fetchCompanyInfo(companyId: string): Promise<SingleCompanyType | undefined> {
  let url;
  try {
    url = new URL('https://api.io.constructconnect.com/cc/v1/companyInfo');
  } catch (error) {
    throw new Error('Invalid URL');
  }

  if (Bun.env.API_PUBLIC_KEY === undefined) {
    throw new Error('API_PUBLIC_KEY is required');
  }

  url.searchParams.set('x-api-key', Bun.env.API_PUBLIC_KEY);
  url.searchParams.set('companyId', companyId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Error fetching company info:', JSON.stringify(response, null, 2));
    console.error(`HTTP error! status: ${response.status}`);
    const curatedProjectApiError = join(process.cwd(), 'src', 'companyInfo', 'CompanyInfoApiError.json');
    await Bun.write(curatedProjectApiError, `Error fetching company info no. ${companyId} with status code ${response.status}: ${JSON.stringify(response, null, 2)}`);
    return undefined;
  }

  return response.json();
}

async function addAllCompanyInfoToPostgresqlFromApi(data: SingleCompanyType[]): Promise<void> {
  for (const companyInfo of data) {
    console.log(companyInfo)

    await DB.insert(companyInfo);
  }

  console.log("\n");
  console.log("Company Info added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function countCuratedProjectsInFile(): Promise<number> {
  try {

    let numberOfCompanyInfo: number = 0;

    if (!await Bun.file(companyInfoPathFile).exists()) {
      console.log(`${companyInfoPathFile} does not exist`);
      return 0;
    }

    const projectPaths = await Bun.file(companyInfoPathFile).json();

    for (const filePath of projectPaths) {

      if (!await Bun.file(filePath).exists()) {
        console.log(`${filePath} does not exist`);
        return 0;
      }

      const fileContent = await Bun.file(filePath).text();
      const data: [any] = JSON.parse(fileContent);

      numberOfCompanyInfo += data.length;
    }

    return numberOfCompanyInfo;

  } catch (error) {
    console.error('Error reading file:', error);
    return 0;
  }
}

/**
* Adds all company info to PostgreSQL database from the local cached data JSON file.
*
* @param {string} filePath - The path to the JSON file containing company info data
*/
export async function addAllCompanyInfoToPostgresqlFromFile(): Promise<void> {

  if (!await Bun.file(companyInfoPathFile).exists()) {
    console.log(`${companyInfoPathFile} does not exist`);
    return;
  }

  const companyPaths = await Bun.file(companyInfoPathFile).json();

  for (const filePath of companyPaths) {
    console.log('Project Path: ', filePath);

    if (!await Bun.file(filePath).exists()) {
      console.log(`${filePath} does not exist`);
      continue;
    }

    const s = spinner();
    s.start('Adding Company Info to database...');

    const fileContent = await Bun.file(filePath).arrayBuffer();
    const data: SingleCompanyType[] = JSON.parse(new TextDecoder().decode(fileContent));

    let i = 0;
    for (const company of data) {

      await DB.insert(company);

      i++;
      s.message(`Adding Company Info to database... ${i}/${data.length}`);
    }

    console.log("\n");
    s.stop('Company Info added/updated successfully! Total Company Info added: ' + data.length);
    console.log("\n");
    console.log("\n");
  }
}


/**
* Fetches all Company Info from the API and appends them to a JSON file.
*
* @param {number} existingRecords - The number of existing records in the JSON file (optional)
* @returns {Promise<void>}
*/
export async function getAllCompanyInfo(existingRecords?: number): Promise<void> {
  const LIMIT = 150;
  let offset: number = Number(existingRecords) ?? 0;
  const totalRecords: number = await CompanyDB.getCompanyLength();

  while (offset < totalRecords) {
    console.log('Offset/Total: ', offset, '/', totalRecords);

    // Creating a file and push it on the array
    const outputFilePath: string = join(process.cwd(), 'data', `comapany_info_${offset}-${offset + LIMIT}.json`);

    await appendToFile<string>(companyInfoPathFile, outputFilePath);


    console.log(`Offset: ${offset}`);
    // NOTE: unknown type is used here to avoid type errors
    // and overlap another type on the default type
    const getCompanyIds: unknown = await DB.getAllIds(LIMIT, offset);
    const companyIds = (getCompanyIds as { company_id: string }[]).map((project) => project.company_id);

    for (const companyId of companyIds) {

      console.log(`Fetching company id with ID: ${JSON.stringify(companyId)}`);

      const response = await fetchCompanyInfo(companyId);

      // Check if the response is valid
      if (response) {
        await appendToFile<SingleCompanyType>(outputFilePath, response);
        console.log(`Fetched ${response.companyInformation[0].Id} company info successfully`);
      }
    }

    offset += Math.abs(offset - totalRecords) < 100 ? offset - totalRecords : LIMIT;
  }

  console.info('All curated projects fetched successfully');
}
