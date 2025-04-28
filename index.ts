import { outro, select, spinner, note, confirm } from '@clack/prompts';
import { addAllCompanyLeadsToPostgresqlFromFile, getAllCompanyLeads } from "./src/companyLeads/company";
import { SQL } from './src/utils/SQL'
import { join } from 'path';
import { exit } from "process";
import colors from 'picocolors';
import { CompanySql } from './src/companyLeads/CompanySql';
import { addAllSingleCompanyLeadsToDatabaseFromFile, getAllSingleCompanyLeads } from './src/companyLeads/SingleCompany';
import { addAllProjectLeadsToPostgresqlFromFile, countProjectLeadsInFile, getAllProjectLeads } from './src/projectLeads/project';
import { ProjectSql } from './src/projectLeads/ProjectSql';
import { CuratedProjectSql } from './src/curatedProject/CuratedProjectSql';
import { addAllCuratedProjectLeadsToPostgresqlFromFile, countCuratedProjectsInFile, getAllCuratedProject } from './src/curatedProject/curatedProject';
import { CompanyInfoSql } from './src/companyInfo/companyInfoSql';
import { countCompanyInfosInFile, getAllCompanyInfo } from './src/companyInfo/companyInfo';

const stop = () => {
  SQL.closeSQL();
  exit(0);
}

/**
* Company Info
*
* @description This function displays a menu for company info options and executes the selected action.
*/
async function companyInfoMenu() {
  let backToMain = false;

  while (!backToMain) {
    const action = await select({
      message: 'Company Info Options:',
      options: [
        { value: 'fetchApi', label: 'Call all Company Infos from API' },
        { value: 'fileCount', label: 'Length of Company Infos data in file' },
        { value: 'fileToDB', label: 'Add all Company Infos from JSON to Database' },
        // { value: 'fetchSingleApi', label: 'Call SINGLE project lead from API' },
        // { value: 'AddSingleToDB', label: 'Add all SINGLE project to the database' },
        { value: 'lengthProject', label: 'Total number of Company Infos in the database' },
        // { value: 'showAll', label: 'Show all projects in the database' },
        // { value: 'showTop10', label: 'Show Top 10 projects in the database' },
        { value: 'back', label: 'Back to main menu' }
      ]
    });

    if (!action) {
      // User cancelled with Ctrl+C
      outro('Operation cancelled');
      process.exit(0);
    }

    switch (action) {
      case 'fetchApi': {
        const s = spinner();
        s.start('Counting Company Infos in database');

        // From the File
        const length = await countCompanyInfosInFile();

        // From the Database
        // const length = await (new CompanyInfoSql()).getLength();

        s.stop('Found ' + length + ' Company Infos');

        const count = await confirm({
          message: `Start fetching from ${length}?`,
        });

        s.start('Fetching Company Infos from API');
        try {
          await getAllCompanyInfo(count ? Number(length) : 0);
          s.stop('Company Infos added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        stop();
        break;
      }
      case 'fileCount': {
        const s = spinner();
        s.start('Counting the company infos in file');
        console.log('\nNo. of company infos in file is: ', await countCompanyInfosInFile());
        s.stop();
        stop();
        break;
      }
      case 'fileToDB': {
        const s = spinner();
        s.start('Adding Company Info from JSON file to Database');
        await addAllCuratedProjectLeadsToPostgresqlFromFile();
        s.stop('Company Info from file added to database');
        stop();
        break;
      }
      // case 'fetchSingleApi': {
      //   const s = spinner();

      //   s.start('Fetching company leads from API');
      //   try {
      //     await getAllSingleCompanyLeads();
      //     s.stop('Companies added/updated successfully!');
      //   } catch (error) {
      //     s.stop(colors.red(`Error: ${error}`));
      //   }
      //   break;
      // }
      // case 'AddSingleToDB': {
      //   await addAllSingleCompanyLeadsToDatabaseFromFile();
      //   break;
      // }
      case 'lengthProject': {
        const s = spinner();
        s.start('Counting Curated Projects');

        const length = await (new CuratedProjectSql()).getLength();
        s.stop('Database count retrieved');

        if (length === 0) {
          console.log(colors.yellow("No companies found in the database!"));
        } else {
          console.log(colors.green(`Total number of companies in the database: ${length}`));
        }

        try {
          console.log(colors.blue(`Data file count: ${await countCuratedProjectsInFile()}`));
        } catch (error) {
          console.error(colors.red(`Error reading data file: ${error}`));
        }
        break;
      }
      // case 'showAll': {
      //   const s = spinner();
      //   s.start('Loading all companies');
      //   const companies = await new CompanySql().getAllCompanies();
      //   s.stop(`Loaded ${companies.length} companies`);

      //   console.log(colors.green("All Companies:"));
      //   console.table(companies);
      //   break;
      // }
      // case 'showTop10': {
      //   const s = spinner();
      //   s.start('Loading top 10 companies');
      //   const topCompanies = await new CompanySql().getAllCompanies(10);
      //   s.stop(`Loaded ${topCompanies.length} companies`);

      //   console.log(colors.green("Top 10 Companies:"));
      //   console.table(topCompanies);
      //   break;
      // }
      case 'back':
      default:
        backToMain = true;
        break;
    }
  }
}


/**
* Curated Project Menu
*
* @description This function displays a menu for curated project options and executes the selected action.
*/
async function curatedProjectMenu() {
  let backToMain = false;

  while (!backToMain) {
    const action = await select({
      message: 'Curated Project Options:',
      options: [
        { value: 'fetchApi', label: 'Call all Curated Projects from API' },
        { value: 'fileCount', label: 'Length of Curated Projects data in file' },
        { value: 'fileToDB', label: 'Add all Curated Projects from JSON to Database' },
        // { value: 'fetchSingleApi', label: 'Call SINGLE project lead from API' },
        // { value: 'AddSingleToDB', label: 'Add all SINGLE project to the database' },
        { value: 'lengthProject', label: 'Total number of Curated Projects in the database' },
        // { value: 'showAll', label: 'Show all projects in the database' },
        // { value: 'showTop10', label: 'Show Top 10 projects in the database' },
        { value: 'back', label: 'Back to main menu' }
      ]
    });

    if (!action) {
      // User cancelled with Ctrl+C
      outro('Operation cancelled');
      process.exit(0);
    }

    switch (action) {
      case 'fetchApi': {
        const s = spinner();
        s.start('Counting curated projects in database');
        // const length = (await SQL.client.query(`SELECT COUNT(*) FROM public.project_leads`)).rows;
        // const length = await countProjectLeadsInFile();
        const length = await (new CuratedProjectSql()).getLength();

        s.stop('Found ' + length + ' curated projects');

        const count = await confirm({
          message: `Start fetching from ${length}?`,
        });

        s.start('Fetching Curated Projects from API');
        try {
          await getAllCuratedProject(count ? Number(length) : 0);
          s.stop('Curated Projects added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        stop();
        break;
      }
      case 'fileCount': {
        const s = spinner();
        s.start('Counting the projects in file');
        console.log('\nNo. of projects in file is: ', await countProjectLeadsInFile());
        s.stop();
        stop();
        break;
      }
      case 'fileToDB': {
        const s = spinner();
        s.start('Adding Curated Project from JSON file to Database');
        await addAllCuratedProjectLeadsToPostgresqlFromFile();
        s.stop('Curated Project from file added to database');
        stop();
        break;
      }
      // case 'fetchSingleApi': {
      //   const s = spinner();

      //   s.start('Fetching company leads from API');
      //   try {
      //     await getAllSingleCompanyLeads();
      //     s.stop('Companies added/updated successfully!');
      //   } catch (error) {
      //     s.stop(colors.red(`Error: ${error}`));
      //   }
      //   break;
      // }
      // case 'AddSingleToDB': {
      //   await addAllSingleCompanyLeadsToDatabaseFromFile();
      //   break;
      // }
      case 'lengthProject': {
        const s = spinner();
        s.start('Counting Curated Projects');

        const length = await (new CuratedProjectSql()).getLength();
        s.stop('Database count retrieved');

        if (length === 0) {
          console.log(colors.yellow("No companies found in the database!"));
        } else {
          console.log(colors.green(`Total number of companies in the database: ${length}`));
        }

        try {
          console.log(colors.blue(`Data file count: ${await countCuratedProjectsInFile()}`));
        } catch (error) {
          console.error(colors.red(`Error reading data file: ${error}`));
        }
        break;
      }
      // case 'showAll': {
      //   const s = spinner();
      //   s.start('Loading all companies');
      //   const companies = await new CompanySql().getAllCompanies();
      //   s.stop(`Loaded ${companies.length} companies`);

      //   console.log(colors.green("All Companies:"));
      //   console.table(companies);
      //   break;
      // }
      // case 'showTop10': {
      //   const s = spinner();
      //   s.start('Loading top 10 companies');
      //   const topCompanies = await new CompanySql().getAllCompanies(10);
      //   s.stop(`Loaded ${topCompanies.length} companies`);

      //   console.log(colors.green("Top 10 Companies:"));
      //   console.table(topCompanies);
      //   break;
      // }
      case 'back':
      default:
        backToMain = true;
        break;
    }
  }
}


/**
* Project Leads Menu
*
* @description This function displays a menu for project leads options and executes the selected action.
*/
async function projectLeadsMenu() {
  let backToMain = false;

  while (!backToMain) {
    const action = await select({
      message: 'Project Leads Options:',
      options: [
        { value: 'fetchApi', label: 'Call all project leads from API' },
        { value: 'fileCount', label: 'Length of project leads data in file' },
        { value: 'fileToDB', label: 'Add all Project Leads from JSON to Database' },
        // { value: 'fetchSingleApi', label: 'Call SINGLE project lead from API' },
        // { value: 'AddSingleToDB', label: 'Add all SINGLE project to the database' },
        { value: 'lengthProject', label: 'Total number of Project Leads in the database' },
        // { value: 'showAll', label: 'Show all projects in the database' },
        // { value: 'showTop10', label: 'Show Top 10 projects in the database' },
        { value: 'back', label: 'Back to main menu' }
      ]
    });

    if (!action) {
      // User cancelled with Ctrl+C
      outro('Operation cancelled');
      process.exit(0);
    }

    switch (action) {
      case 'fetchApi': {
        const s = spinner();
        s.start('Counting projects in database');
        // const length = (await SQL.client.query(`SELECT COUNT(*) FROM public.project_leads`)).rows;
        // const length = await countProjectLeadsInFile();
        const length = await (new ProjectSql()).getProjectLength();

        s.stop('Found ' + length + ' companies');

        const count = await confirm({
          message: `Start fetching from ${length}?`,
        });

        s.start('Fetching company leads from API');
        try {
          await getAllProjectLeads(count ? Number(length) : 0);
          s.stop('Projects added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        stop();
        break;
      }
      case 'fileCount': {
        const s = spinner();
        s.start('Counting the projects in file');
        console.log('\nNo. of projects in file is: ', await countProjectLeadsInFile());
        s.stop();
        stop();
        break;
      }
      case 'fileToDB': {
        const s = spinner();
        s.start('Adding Project Leads from JSON file to Database');
        await addAllProjectLeadsToPostgresqlFromFile();
        s.stop('Project Leads from file added to database');
        stop();
        break;
      }
      // case 'fetchSingleApi': {
      //   const s = spinner();

      //   s.start('Fetching company leads from API');
      //   try {
      //     await getAllSingleCompanyLeads();
      //     s.stop('Companies added/updated successfully!');
      //   } catch (error) {
      //     s.stop(colors.red(`Error: ${error}`));
      //   }
      //   break;
      // }
      // case 'AddSingleToDB': {
      //   await addAllSingleCompanyLeadsToDatabaseFromFile();
      //   break;
      // }
      case 'lengthProject': {
        const s = spinner();
        s.start('Counting Project Leads');

        const length = await (new ProjectSql()).getProjectLength();
        s.stop('Database count retrieved');

        if (length === 0) {
          console.log(colors.yellow("No companies found in the database!"));
        } else {
          console.log(colors.green(`Total number of companies in the database: ${length}`));
        }

        try {
          console.log(colors.blue(`Data file count: ${await countProjectLeadsInFile()}`));
        } catch (error) {
          console.error(colors.red(`Error reading data file: ${error}`));
        }
        break;
      }
      // case 'showAll': {
      //   const s = spinner();
      //   s.start('Loading all companies');
      //   const companies = await new CompanySql().getAllCompanies();
      //   s.stop(`Loaded ${companies.length} companies`);

      //   console.log(colors.green("All Companies:"));
      //   console.table(companies);
      //   break;
      // }
      // case 'showTop10': {
      //   const s = spinner();
      //   s.start('Loading top 10 companies');
      //   const topCompanies = await new CompanySql().getAllCompanies(10);
      //   s.stop(`Loaded ${topCompanies.length} companies`);

      //   console.log(colors.green("Top 10 Companies:"));
      //   console.table(topCompanies);
      //   break;
      // }
      case 'back':
      default:
        backToMain = true;
        break;
    }
  }
}


/**
  * Company Leads Menu
  *
  * @description This function displays a menu for company leads options and executes the selected action.
  */
async function companyLeadsMenu() {
  let backToMain = false;

  while (!backToMain) {
    const action = await select({
      message: 'Company Leads Options:',
      options: [
        { value: 'fetchApi', label: 'Call all company leads from API' },
        { value: 'addToDb', label: 'Add all company leads to the database' },
        { value: 'fetchSingleApi', label: 'Call SINGLE company lead from API' },
        { value: 'AddSingleToDB', label: 'Add all SINGLE company to the database' },
        { value: 'countCompanies', label: 'Total number of companies in the database' },
        { value: 'showAll', label: 'Show all companies in the database' },
        { value: 'showTop10', label: 'Show Top 10 companies in the database' },
        { value: 'back', label: 'Back to main menu' }
      ]
    });

    if (!action) {
      // User cancelled with Ctrl+C
      outro('Operation cancelled');
      process.exit(0);
    }

    switch (action) {
      case 'fetchApi': {
        const s = spinner();
        s.start('Counting companies in database');
        const length = (await SQL.client.query(`SELECT COUNT(*) FROM companies`)).rows;

        s.stop('Found ' + length[0].count + ' companies');

        const count = await confirm({
          message: `Start fetching from ${length[0].count}?`,
        });

        s.start('Fetching company leads from API');
        try {
          await getAllCompanyLeads(count ? Number(length[0].count) : 0);
          s.stop('Companies added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        stop();
        break;
      }
      case 'addToDb': {
        const s = spinner();
        s.start('Adding company leads from file to database');
        await addAllCompanyLeadsToPostgresqlFromFile();
        s.stop('Companies from file added to database');
        stop();
        break;
      }
      case 'fetchSingleApi': {
        const s = spinner();

        s.start('Fetching company leads from API');
        try {
          await getAllSingleCompanyLeads();
          s.stop('Companies added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        break;
      }
      case 'AddSingleToDB': {
        await addAllSingleCompanyLeadsToDatabaseFromFile();
        break;
      }
      case 'countCompanies': {
        const s = spinner();
        s.start('Counting companies');

        const res = await SQL.client.query(`SELECT COUNT(*) FROM companies`);
        s.stop('Database count retrieved');

        if (res.rows[0].count === 0) {
          console.log(colors.yellow("No companies found in the database!"));
        } else {
          console.log(colors.green(`Total number of companies in the database: ${res.rows[0].count}`));
        }

        try {
          const filePath = join(process.cwd(), 'data', 'company_leads.json');
          const fileContent = await Bun.file(filePath).text();
          console.log(colors.blue(`Data file count: ${JSON.parse(fileContent).length}`));
        } catch (error) {
          console.error(colors.red(`Error reading data file: ${error}`));
        }
        break;
      }
      case 'showAll': {
        const s = spinner();
        s.start('Loading all companies');
        const companies = await new CompanySql().getAllCompanies();
        s.stop(`Loaded ${companies.length} companies`);

        console.log(colors.green("All Companies:"));
        console.table(companies);
        break;
      }
      case 'showTop10': {
        const s = spinner();
        s.start('Loading top 10 companies');
        const topCompanies = await new CompanySql().getAllCompanies(10);
        s.stop(`Loaded ${topCompanies.length} companies`);

        console.log(colors.green("Top 10 Companies:"));
        console.table(topCompanies);
        break;
      }
      case 'back':
      default:
        backToMain = true;
        break;
    }
  }
}

// Starting Main Menu
(async function() {
  let exit = false;

  // Display help
  // note(
  //   [
  //     'Navigation Keys:',
  //     '  j : Move down (next option)',
  //     '  k : Move up (previous option)',
  //   ].join('\n'),
  //   'Keyboard Navigation Help'
  // );

  while (!exit) {
    const action = await select({
      message: 'Select an option:',
      options: [
        { value: 'companyLeads', label: 'Company Leads' },
        { value: 'projectLeads', label: 'Project Leads' },
        { value: 'curatedProjects', label: 'Curated Projects' },
        { value: 'companyInfos', label: 'Company Info' },
        { value: 'exit', label: 'Exit' }
      ]
    });

    if (!action) {
      // User cancelled with Ctrl+C
      outro('Operation cancelled');
      process.exit(0);
    }

    switch (action) {
      case 'companyLeads':
        await companyLeadsMenu();
        break;
      case 'projectLeads':
        await projectLeadsMenu();
        break;
      case 'curatedProjects':
        await curatedProjectMenu();
        break;
      case 'companyInfos':
        await companyInfoMenu();
        break;
      case 'exit':
      default:
        exit = true;
        break;
    }
  }

  stop();
})();
