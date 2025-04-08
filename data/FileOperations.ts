export async function appendToFile<T>(filePath: string) {
  var newFile = false;
  var existingFile = false;

  if (!await Bun.file(filePath).exists()) {
    console.info("File does not exist. Creating a new file...");
    Bun.write(filePath, JSON.stringify([], null, 2));
    newFile = true;
  }
  existingFile = true;

  const file = Bun.file(filePath);
  const fileContent = await file.text();
  let existingData: T[] = JSON.parse(fileContent);

  const writer = file.writer();

  return {
    append: async (data: T | T[]) => {
      writer.ref();

      if (newFile) {
        writer.write(JSON.stringify(data, null, 2).replace(/\]/g, '') + '\n');
        newFile = false;
      } else if (existingFile) {
        file.write((await file.text()).replace(/\]/, ''));
        existingFile = false;
      } else {
        writer.write(JSON.stringify(data, null, 2).replace(/\[/g, ',').replace(/\]/g, '') + '\n');
      }

      console.info(`Appended new records to ${filePath}`);
      console.info(`Total records in File: ${existingData.length}`);
      console.log('\n');

      writer.unref();
    },
    close: () => {
      writer.write(']');
      writer.end();
      console.info(`Closed file writer for ${filePath}`);
    }
  }
}

