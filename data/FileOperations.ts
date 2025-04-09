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

// export async function appendToFile<T>(filePath: string) {
//   if (!await Bun.file(filePath).exists()) {
//     console.info("File does not exist. Creating a new file...");
//     Bun.write(filePath, JSON.stringify([], null, 2));
//   }

//   const file = Bun.file(filePath);
//   const fileContent = await file.text();
//   let existingData: T[] = JSON.parse(fileContent);

//   console.info(`Appending data to ${fileContent}`);

//   const writer = file.writer();

//   return {
//     append: async (data: T | T[]) => {
//       writer.ref();

//       var newFile = fileContent.trim() === '[]';
//       var existingFile = (await file.text()).slice(-1) === ']';

//       console.log(existingFile);

//       if (newFile) {
//         console.info(`New File`);
//         writer.write(JSON.stringify(data, null, 2).replace(/\]/g, '') + '\n');
//         newFile = false;
//       } else if (existingFile) {
//         console.info(`Existing File`);
//         const newText = (await file.text()).replace(/\]/, '');
//         Bun.write(filePath, newText);
//         existingFile = false;

//         writer.write(JSON.stringify(data, null, 2).replace(/\[/g, ',').replace(/\]/g, '') + '\n');
//       } else {
//         console.info(`Appending to Existing File`);
//         writer.write(JSON.stringify(data, null, 2).replace(/\[/g, ',').replace(/\]/g, '') + '\n');
//       }

//       console.info(`Appended new records to ${filePath}`);
//       console.info(`Total records in File: ${existingData.length}`);
//       console.log('\n');

//       writer.unref();
//     },
//     close: () => {
//       writer.write(']');
//       writer.end();
//       console.info(`Closed file writer for ${filePath}`);
//     }
//   }
// }

