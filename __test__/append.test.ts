import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { appendToFile } from "../data/FileOperations"; // Update with correct path


const data = [
  [
    { id: 1, name: ["Record 1", "Union 1"], timestamp: "2025-04-08 12:10:00" },
    { id: 2, name: ["Record 2", "Union 2"], timestamp: "2025-04-08 12:11:00" },
    { id: 3, name: ["Record 3", "Union 3"], timestamp: "2025-04-08 12:12:00" },
    { id: 4, name: ["Record 4", "Union 4"], timestamp: "2025-04-08 12:13:00" },
    { id: 5, name: ["Record 5", "Union 5"], timestamp: "2025-04-08 12:14:00" }
  ],
  [
    { id: 1, name: ["Record 1", "Union 1"], timestamp: "2025-04-08 12:10:00" },
    { id: 2, name: ["Record 2", "Union 2"], timestamp: "2025-04-08 12:11:00" },
    { id: 3, name: ["Record 3", "Union 3"], timestamp: "2025-04-08 12:12:00" },
    { id: 4, name: ["Record 4", "Union 4"], timestamp: "2025-04-08 12:13:00" },
    { id: 5, name: ["Record 5", "Union 5"], timestamp: "2025-04-08 12:14:00" }
  ],
  [
    { id: 1, name: ["Record 1", "Union 1"], timestamp: "2025-04-08 12:10:00" },
    { id: 2, name: ["Record 2", "Union 2"], timestamp: "2025-04-08 12:11:00" },
    { id: 3, name: ["Record 3", "Union 3"], timestamp: "2025-04-08 12:12:00" },
    { id: 4, name: ["Record 4", "Union 4"], timestamp: "2025-04-08 12:13:00" },
    { id: 5, name: ["Record 5", "Union 5"], timestamp: "2025-04-08 12:14:00" }
  ],
  [
    { id: 1, name: ["Record 1", "Union 1"], timestamp: "2025-04-08 12:10:00" },
    { id: 2, name: ["Record 2", "Union 2"], timestamp: "2025-04-08 12:11:00" },
    { id: 3, name: ["Record 3", "Union 3"], timestamp: "2025-04-08 12:12:00" },
    { id: 4, name: ["Record 4", "Union 4"], timestamp: "2025-04-08 12:13:00" },
    { id: 5, name: ["Record 5", "Union 5"], timestamp: "2025-04-08 12:14:00" }
  ],
  [
    { id: 1, name: ["Record 1", "Union 1"], timestamp: "2025-04-08 12:10:00" },
    { id: 2, name: ["Record 2", "Union 2"], timestamp: "2025-04-08 12:11:00" },
    { id: 3, name: ["Record 3", "Union 3"], timestamp: "2025-04-08 12:12:00" },
    { id: 4, name: ["Record 4", "Union 4"], timestamp: "2025-04-08 12:13:00" },
    { id: 5, name: ["Record 5", "Union 5"], timestamp: "2025-04-08 12:14:00" }
  ],
];

describe("Append To File", () => {
  const testFilePath = "./__test__/test-output.json";

  test("appendToFile", async () => {

    const outputFilePath: string = testFilePath;
    const outputFile = await appendToFile<typeof data[0]>(outputFilePath);

    // Append records using the iterator pattern
    for (var d of data) {
      outputFile.append(d);
    }

    // Close the file
    outputFile.close();

    // Verify the file content
    const fileContent = await Bun.file(outputFilePath).text();
    console.log(`File Content test: ${fileContent}`);
    const parsedContent = JSON.parse(fileContent);

    expect(parsedContent).toEqual([...data[0], ...data[1], ...data[2], ...data[3], ...data[4]]);
    expect(parsedContent.length).toBe(5 * 5);
  });

});
