export async function appendToFile<T>(filePath: string, data: T): Promise<void> {
  try {
    let existingData: T[] = [];
    if (await Bun.file(filePath).exists()) {
      const fileContent = await Bun.file(filePath).text();
      existingData = JSON.parse(fileContent);
    }

    const updateData = existingData.concat(data);

    await Bun.write(filePath, JSON.stringify(updateData, null, 2));
    console.info(`Appended new records to ${filePath}`);
    console.info(`Total records: ${updateData.length}`);
    console.log('\n');
  } catch (error) {
    console.error(error);
  }
}

