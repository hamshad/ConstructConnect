import { outro, select, spinner, note } from '@clack/prompts';
import { addAllCompanyLeadsToPostgresqlFromFile, getAllCompanyLeads } from "./src/companyLeads/company";
import { SQL } from './src/utils/SQL'
import { join } from 'path';
import { exit } from "process";
import colors from 'picocolors';
import { CompanySql } from './src/companyLeads/CompanySql';
import { getAllSingleCompanyLeads } from './src/companyLeads/SingleCompany';

const stop = () => {
  SQL.closeSQL();
  exit(0);
}


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

        s.start('Fetching company leads from API');
        try {
          await getAllCompanyLeads(Number(length[0].count));
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
        s.start('Counting companies in database');
        const length = (await SQL.client.query('select company_id from companies limit 1')).rows;

        s.stop('Found ' + length[0].company_id + ' companies');

        s.start('Fetching company leads from API');
        try {
          await getAllSingleCompanyLeads(Number(length[0].company_id));
          s.stop('Companies added/updated successfully!');
        } catch (error) {
          s.stop(colors.red(`Error: ${error}`));
        }
        break;
      }
      case 'AddSingleToDB': {
        await addAllCompanyLeadsToPostgresqlFromFile();
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
        console.log('In progress...');
        break;
      case 'exit':
      default:
        exit = true;
        break;
    }
  }

  stop();
})();
