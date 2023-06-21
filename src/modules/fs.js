import fsPromises from "node:fs/promises";
import { handleInvalidOperation } from "./utils.js";

const getDirectoryEntryType = (dirEntry) => {
  if (dirEntry.isFile()) {
    return "file";
  } else if (dirEntry.isDirectory()) {
    return "directory";
  }

  return "other";
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

export const createFile = async (filePath) => {
  try {
    await fsPromises.writeFile(filePath, "");
  } catch {
    handleInvalidOperation();
  }
};

export const removeFile = async (filePath) => {
  try {
    const fileStat = await fsPromises.stat(filePath);

    if (!fileStat.isFile()) {
      throw new Error();
    }

    await fsPromises.rm(filePath);
  } catch {
    handleInvalidOperation();
  }
};
