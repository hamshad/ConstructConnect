import { outro, select, spinner, note } from '@clack/prompts';
import { addAllCompanyLeadsToPostgresqlFromFile, getAllCompanyLeads } from "./src/companyLeads/company";
import { SQL } from './src/utils/SQL'
import { join } from 'path';
import { exit } from "process";
import colors from 'picocolors';

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
        const length = await SQL.sql`SELECT COUNT(*) FROM companies`;
        s.stop('Found ' + length[0].count + ' companies');

        s.start('Fetching company leads from API');
        try {
          await getAllCompanyLeads(length[0].count as number);
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
      case 'countCompanies': {
        const s = spinner();
        s.start('Counting companies');

        const dbCount = await SQL.sql`SELECT COUNT(*) FROM companies`;
        s.stop('Database count retrieved');

        if (dbCount[0].count === 0) {
          console.log(colors.yellow("No companies found in the database!"));
        } else {
          console.log(colors.green(`Total number of companies in the database: ${dbCount[0].count}`));
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
        const companies = await SQL.sql`SELECT * FROM companies`;
        s.stop(`Loaded ${companies.length} companies`);

        console.log(colors.green("All Companies:"));
        console.table(companies);
        break;
      }
      case 'showTop10': {
        const s = spinner();
        s.start('Loading top 10 companies');
        const topCompanies = await SQL.sql`SELECT * FROM companies LIMIT 10`;
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
