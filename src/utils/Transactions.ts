import { confirm, text } from '@clack/prompts';
import colors from 'picocolors';
import { SQL } from '../utils/SQL';

// Transaction decorator with prompts for starting and committing transactions
export function Transactional() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value; // Save the original method

    // Wrap the original method with transaction logic
    descriptor.value = async function(...args: any[]) {

      // Ask the user if they want to start a transaction
      const start = await confirm({
        message: 'Do you want to start a transaction?',
      });

      if (!start) {
        // If the user chooses not to start a transaction, just call the original method
        return await originalMethod.apply(this, args);
      }

      // Start the transaction
      console.log(colors.gray('Starting transaction...'));
      const connection = await SQL.startTransaction();

      try {
        // Execute the original method (SQL query)
        const result = await originalMethod.apply(this, args);

        // Ask the user if they want to commit or rollback
        const commit = await text({
          message: 'Commit or Rollback?',
          placeholder: 'Commit or Rollback',
          initialValue: 'Commit',
        });

        if (commit?.toString().toLowerCase() === 'commit') {
          console.log('Committing transaction...');
          await connection(true); // Commit the transaction
        } else {
          console.log('Rolling back transaction...');
          await connection(false); // Rollback the transaction
        }

        return result;
      } catch (error) {
        // Handle errors and rollback
        console.error('Error occurred, rolling back transaction:', error);
        await connection(false); // Rollback on error
        throw error; // Re-throw the error after rolling back
      }
    };

    return descriptor;
  };
}
