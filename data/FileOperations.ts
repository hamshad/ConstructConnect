export async function appendToFile<T>(filePath: string): Promise<Function<T>> {
  try {

    const file = Bun.file(filePath);

    if (!await file.exists()) {
      console.error("File does not exist. Creating a new file...");
    }

    const fileContent = await file.text();
    let existingData: T[] = JSON.parse(fileContent);
    const writer = file.writer();
    // Bun.write(filePath, JSON.stringify(updateData, null, 2));

    return (data: T) => {

      const updateData = existingData.concat(data);
      writer.write(JSON.stringify(data, null, 2));

      console.info(`Appended new records to ${filePath}`);
      console.info(`Total records: ${updateData.length}`);
      console.log('\n');

    }
  } catch (error) {
    console.error(error);
  }

}

