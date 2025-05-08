import { join } from 'path';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import { ProjectSql } from './ProjectSql';

type ProjectLead = ProjectLeadsType['data'][0];

interface ApiResponse {
  numFound: number;
  start: number;
  docs: ProjectLead[];
  facets: any;
}


const ProjectDB = new ProjectSql();

const projectFilePath1 = join(process.cwd(), 'data', 'project_leads_2.4.2025.json');
const projectFilePath2 = join(process.cwd(), 'data', 'project_leads_9.4.2025.json');
const projectFilePath3 = join(process.cwd(), 'data', 'project_leads_9.4.2025(2).json');
const mainFilePath = [projectFilePath1, projectFilePath2, projectFilePath3];

async function fetchProjectLeads(offset: number, limit: number = 150): Promise<ApiResponse> {
  let url;
  try {
    url = new URL('https://api.io.constructconnect.com/search/v1/ProjectLeads');
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
      // "sort": "",
      // "sortDir": "asc",
      "includeHidden": true,
      "limit": limit,
      "offset": offset
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function addAllProjectLeadsToPostgresqlFromApi(data: ApiResponse): Promise<void> {
  for (const company of data.docs) {
    console.log(company)

    await ProjectDB.insertProjectLead(company);
  }

  console.log("\n");
  console.log("Project Leads added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function countProjectLeadsInFile(filePaths: string[] = mainFilePath): Promise<number> {

  let length = 0;
  try {
    for (const filePath of filePaths) {
      if (!await Bun.file(filePath).exists()) {
        console.log(`${filePath} does not exist`);
        return 0;
      }

      const fileContent = await Bun.file(filePath).text();
      const data: [any] = JSON.parse(fileContent);

      length += data.length;

    }
    return Number(length);
  } catch (error) {
    console.error('Error reading file:', error);
    return 0;
  }
}

/**
* Adds all company leads to PostgreSQL database from the local cached data JSON file.
*
* @param {string} filePath - The path to the JSON file containing company leads data
*/
export async function addAllProjectLeadsToPostgresqlFromFile(filePaths: string[] = mainFilePath): Promise<void> {

  let i = 0;
  const s = spinner();


  s.start('Adding Project to database...');

  for (const filePath of filePaths) {
    if (!await Bun.file(filePath).exists()) {
      console.log(`${filePath} does not exist`);
      return;
    }

    const fileContent = await Bun.file(filePath).text();
    const data: ProjectLead[] = JSON.parse(fileContent);


    for (const project of data) {
      console.log('PROJECT:', JSON.stringify(data, null, 2));

      await ProjectDB.insertProjectLead(project);

      i++;
      s.message(`Adding Projects to database... ${i}/${data.length}`);
    }

  }

  console.log("\n");
  s.stop('Projects added/updated successfully!');
  console.log("\n");
  console.log("\n");
}



/**
* Fetches all project leads from the API and appends them to a JSON file.
*
* @param {number} existingRecords - The number of existing records in the JSON file (optional)
* @returns {Promise<void>}
*/
export async function getAllProjectLeads(existingRecords?: number): Promise<void> {
  const limit: number = 150;
  let offset: number = Number(existingRecords) ?? 0;
  let totalRecords: number = Infinity;
  const outputFilePath: string = mainFilePath;

  while (offset < totalRecords) {
    console.log(`\n--------------------------------------------------------------------`);
    console.log(`Fetching company leads from offset: ${offset} to ${offset + limit}`);

    // if (offset % 1500 === 0) {
    //   console.log('Sleeping for 5 seconds');
    //   await Bun.sleep(5000);
    // }

    const response = await fetchProjectLeads(offset, limit);

    console.log(`Fetched ${response.numFound} project leads`);

    await appendToFile<ProjectLead[]>(outputFilePath, response.docs);
    // await addAllCompanyLeadsToPostgresqlFromApi(response);

    totalRecords = response.numFound;
    offset += limit;
    console.log(`Total records: ${totalRecords}`);
    console.log(`Offset: ${offset}`);
  }

  console.log('All project leads fetched successfully');
}
