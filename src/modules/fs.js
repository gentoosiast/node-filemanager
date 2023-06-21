import fsPromises from "node:fs/promises";
import { handleInvalidOperation } from "./utils.js";

const getDirectoryEntryType = (dirEntry) => {
  if (dirEntry.isFile()) {
    return "file";
  } else if (dirEntry.isDirectory()) {
    return "directory";
  } else {
    return "other";
  }
};

export const listDirectoryContents = async (dir) => {
  try {
    const dirEnts = await fsPromises.readdir(dir, { withFileTypes: true });
    const tabularData = dirEnts
      .map((dirEntry) => ({
        Name: dirEntry.name,
        Type: getDirectoryEntryType(dirEntry),
      }))
      .filter((dirEntry) => dirEntry.Type !== "other")
      .sort((dirEntryA, dirEntryB) => {
        if (dirEntryA.Type === dirEntryB.Type) {
          return dirEntryA.Name.localeCompare(dirEntryB.Name);
        }

        return dirEntryA.Type === "directory" ? -1 : 1;
      });

    console.table(tabularData);
  } catch {
    handleInvalidOperation();
  }
};
