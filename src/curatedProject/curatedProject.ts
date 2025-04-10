import { join } from 'path';
import { appendToFile } from '../../data/FileOperations';
import { spinner } from '@clack/prompts';
import { CuratedProjectSql } from './CuratedProjectSql';
import { ProjectSql } from '../projectLeads/ProjectSql';

const DB = new CuratedProjectSql();

const projectPathFile = join(process.cwd(), 'src', 'curatedProject', 'curatedPaths.json');

async function fetchCuratedProjectLeads(projectId: string): Promise<CuratedProjectType | undefined> {
  let url;
  try {
    url = new URL('https://api.io.constructconnect.com/cc/v1/curatedProjectInfo');
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
    console.error('Error fetching project leads:', JSON.stringify(response, null, 2));
    console.error(`HTTP error! status: ${response.status}`);
    const curatedProjectApiError = join(process.cwd(), 'src', 'curatedProject', 'curatedProjectApiError.json');
    await Bun.write(curatedProjectApiError, `Error fetching curated project no. ${projectId} with status code ${response.status}: ${JSON.stringify(response, null, 2)}`);
    return undefined;
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

export async function countCuratedProjectsInFile(): Promise<number> {
  try {

    let numberOfProjects: number = 0;

    if (!await Bun.file(projectPathFile).exists()) {
      console.log(`${projectPathFile} does not exist`);
      return 0;
    }

    const projectPaths = await Bun.file(projectPathFile).json();

    for (const filePath of projectPaths) {

      if (!await Bun.file(filePath).exists()) {
        console.log(`${filePath} does not exist`);
        return 0;
      }

      const fileContent = await Bun.file(filePath).text();
      const data: [any] = JSON.parse(fileContent);

      numberOfProjects += data.length;
    }

    return numberOfProjects;

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
export async function addAllCuratedProjectLeadsToPostgresqlFromFile(): Promise<void> {

  if (!await Bun.file(projectPathFile).exists()) {
    console.log(`${projectPathFile} does not exist`);
    return;
  }

  const projectPaths = await Bun.file(projectPathFile).json();

  for (const filePath of projectPaths) {
    console.log('Project Path: ', filePath);

    if (!await Bun.file(filePath).exists()) {
      console.log(`${filePath} does not exist`);
      continue;
    }

    const s = spinner();
    s.start('Adding Project to database...');

    const fileContent = await Bun.file(filePath).arrayBuffer();
    const data: CuratedProjectType[] = JSON.parse(new TextDecoder().decode(fileContent));

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

    // Creating a file and push it on the array
    const outputFilePath: string = join(process.cwd(), 'data', `curated_project_leads_${offset}-${offset + 50}.json`);

    await appendToFile<string>(projectPathFile, outputFilePath);


    console.log(`Offset: ${offset}`);
    // NOTE: unknown type is used here to avoid type errors
    // and overlap another type on the default type
    const getProjectIds: unknown = await (new ProjectSql()).getAllCuratedProjectIds(offset);
    const projectIds = (getProjectIds as { project_id: string }[]).map((project) => project.project_id);

    for (const projectId of projectIds) {

      console.log(`Fetching project with ID: ${JSON.stringify(projectId)}`);

      const response = await fetchCuratedProjectLeads(projectId);

      // Check if the response is valid
      if (response) {
        await appendToFile<CuratedProjectType>(outputFilePath, response);
        console.log(`Fetched ${response.projectDetails[0].Id} curated project`);
      }
    }

    offset += Math.abs(offset - totalRecords) < 100 ? offset - totalRecords : 50;
  }

  console.info('All curated projects fetched successfully');
}
