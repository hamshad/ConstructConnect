export async function appendToFile<T>(filePath: string, data: T): Promise<void> {
  try {
    const file = Bun.file(filePath);
    const exists = await file.exists();

    // If file doesn't exist, simply write the new data
    if (!exists) {
      await Bun.write(filePath, JSON.stringify([data], null, 2));
      console.info(`Created new file ${filePath} with 1 record`);
      console.log('\n');
      return;
    }

    // For existing files, we'll modify the JSON array without loading it all in memory
    const fileSize = file.size;

    // If file is empty or not valid JSON, start fresh
    if (fileSize === 0) {
      await Bun.write(filePath, JSON.stringify([data], null, 2));
      console.info(`Initialized ${filePath} with 1 record`);
      console.log('\n');
      return;
    }

    // Create a temporary file to avoid memory issues
    const tempFilePath = `${filePath}.tmp`;
    const writeStream = Bun.file(tempFilePath).writer();

    // Start the JSON array
    writeStream.write('[\n');

    // Read the original file in chunks and process it
    let isFirstItem = true;
    let recordCount = 0;
    let fileContent = await file.text();

    // Remove the outer brackets and split by newlines
    fileContent = fileContent.trim();
    if (fileContent.startsWith('[')) fileContent = fileContent.slice(1);
    if (fileContent.endsWith(']')) fileContent = fileContent.slice(0, -1);

    // Process the records
    const lines = fileContent.split('\n');
    let currentRecord = '';
    let bracketCount = 0;

    for (const line of lines) {
      currentRecord += line + '\n';

      // Count brackets to properly detect JSON objects
      for (const char of line) {
        if (char === '{') bracketCount++;
        if (char === '}') bracketCount--;
      }

      // If we have a complete JSON object
      if (bracketCount === 0 && currentRecord.trim()) {
        // Clean up the record (remove commas at the end)
        let cleanRecord = currentRecord.trim();
        if (cleanRecord.endsWith(',')) {
          cleanRecord = cleanRecord.slice(0, -1);
        }

        if (cleanRecord) {
          // Write with appropriate comma
          if (!isFirstItem) {
            writeStream.write(',\n');
          }
          writeStream.write(cleanRecord);
          isFirstItem = false;
          recordCount++;
          currentRecord = '';
        }
      }
    }

    // Add the new data
    if (!isFirstItem) {
      writeStream.write(',\n');
    }
    writeStream.write(JSON.stringify(data, null, 2));
    recordCount++;

    // Close the array
    writeStream.write('\n]');
    writeStream.end();

    // Replace the original file with the temporary file
    await Bun.write(filePath, await Bun.file(tempFilePath).arrayBuffer());

    // Remove the temporary file
    try {
      await Bun.write(tempFilePath, ''); // Clear content
      const fs = await import('fs/promises');
      await fs.unlink(tempFilePath); // Delete the file
    } catch (err) {
      console.warn(`Warning: Could not remove temporary file ${tempFilePath}`, err);
    }

    console.info(`Appended new record to ${filePath}`);
    console.info(`Total records: ${recordCount}`);
    console.log('\n');
  } catch (error) {
    console.error('Error in appendToFile:', error);
  }
}
