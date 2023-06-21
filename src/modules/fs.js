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

export const renameFile = async (srcFilePath, destFilePath) => {
  try {
    await fsPromises.rename(srcFilePath, destFilePath);
  } catch {
    handleInvalidOperation();
  }
};

export const catFile = async (filePath) => {
  try {
    const fh = await fsPromises.open(filePath);
    const readStream = fh.createReadStream({ encoding: "utf8" });

    await new Promise((resolve) => {
      readStream.on("data", (data) => console.log(data));
      readStream.on("end", async () => {
        await fh.close();
        resolve();
      });
      readStream.on("error", async () => {
        await fh.close();
        throw new Error();
      });
    });
  } catch {
    handleInvalidOperation();
  }
};
