import { write } from "console";

export async function appendToFile<T>(filePath: string) {

  if (!await Bun.file(filePath).exists()) {
    console.info("File does not exist. Creating a new file...");
    Bun.write(filePath, JSON.stringify([], null, 2));
  }

  const file = Bun.file(filePath);
  const existingData: T[] = await file.json();
  const writer = file.writer();
  // Bun.write(filePath, JSON.stringify(updateData, null, 2));

  return {
    append: (data: T) => {
      writer.ref();

      const newData = existingData.concat(data);
      writer.write(JSON.stringify(newData, null, 2));

      console.info(`Appended new records to ${filePath}`);
      console.info(`Total records in File: ${newData.length}`);
      console.log('\n');

      writer.unref();
    },
    close: () => {
      writer.end();
      console.info(`Closed file writer for ${filePath}`);
    }
  }
}

