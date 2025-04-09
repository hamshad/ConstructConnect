import { join } from 'path';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import type projectLeads from '../../data/projectLeads';
import { CuratedProjectSql } from './CuratedProjectSql';
import { ProjectSql } from '../projectLeads/ProjectSql';

const DB = new CuratedProjectSql();

var projectPaths: string[] = []
const mainFilePath = projectPaths[0] ?? join(process.cwd(), 'data', 'curated_project_leads.json');

async function fetchCuratedProjectLeads(projectId: string): Promise<CuratedProjectType> {
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
  url.searchParams.set('projectId', projectId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function addAllProjectLeadsToPostgresqlFromApi(data: CuratedProjectType[]): Promise<void> {
  for (const project of data) {
    console.log(project)

    await DB.insert(project);
  }

  console.log("\n");
  console.log("Project Leads added/updated successfully!");
  console.log("\n");
  console.log("\n");
}

export async function countProjectLeadsInFile(filePath: string = mainFilePath): Promise<number> {
  try {
    if (!await Bun.file(filePath).exists()) {
      console.log(`${filePath} does not exist`);
      return 0;
    }

    const fileContent = await Bun.file(filePath).text();
    const data: [any] = JSON.parse(fileContent);

    return Number(data.length);
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
export async function addAllProjectLeadsToPostgresqlFromFile(filePath: string = mainFilePath): Promise<void> {

  if (!await Bun.file(filePath).exists()) {
    console.log(`${filePath} does not exist`);
    return;
  }

  const s = spinner();
  s.start('Adding Project to database...');

  const fileContent = await Bun.file(filePath).text();
  const data: CuratedProjectType[] = JSON.parse(fileContent);

  let i = 0;
  for (const company of data) {

    await DB.insert(company);

    i++;
    s.message(`Adding Curated Projects to database... ${i}/${data.length}`);
  }

  console.log("\n");
  s.stop('Projects added/updated successfully! Total Curated Projects added: ' + data.length);
  console.log("\n");
  console.log("\n");
}

/**
* Fetches all project leads from the API and appends them to a JSON file.
*
* @param {number} existingRecords - The number of existing records in the JSON file (optional)
* @returns {Promise<void>}
*/
export async function getAllCuratedProject(existingRecords?: number): Promise<void> {
  let offset: number = Number(existingRecords) ?? 0;
  const totalRecords: number = await (new ProjectSql()).getProjectLength();

  while (offset < totalRecords) {
    console.log('Offset/Total: ', offset, '/', totalRecords);

    const outputFilePath: string = join(process.cwd(), 'data', `curated_project_leads_${offset}-${offset + 50}.json`);

    console.log(`Offset: ${offset}`);
    const getProjectIds = await (new ProjectSql()).getAllProjectsIds(offset);

    for (const projectId of getProjectIds) {

      const response = await fetchCuratedProjectLeads(projectId);

      await appendToFile<CuratedProjectType>(outputFilePath, response);
      console.log(`Fetched ${response.projectDetails[0].Id} curated project`);

    }

    offset += offset - totalRecords < 100 ? offset - totalRecords : 50;
  }

  console.info('All curated projects fetched successfully');
}
