import fsPromises from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const getDirectoryEntryType = (dirEntry) => {
  if (dirEntry.isFile()) {
    return "file";
  } else if (dirEntry.isDirectory()) {
    return "directory";
  }

  return "other";
};

export const moveUpDirectory = async () => {
  const parentDirPath = path.dirname(process.cwd());

  changeDirectory(parentDirPath);
};

export const changeDirectory = async (dirPath) => {
  process.chdir(dirPath);
};

export const listDirectoryContents = async (dir) => {
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
};

export const createFile = async (filePath) => {
  await fsPromises.writeFile(filePath, "");
};

export const removeFile = async (filePath) => {
  const fileStat = await fsPromises.stat(filePath);

  if (!fileStat.isFile()) {
    throw new Error();
  }

  await fsPromises.rm(filePath);
};

export const renameFile = async (srcFilePath, destFilePath) => {
  await fsPromises.rename(srcFilePath, destFilePath);
};

export const catFile = async (filePath) => {
  let fh = null;
  try {
    fh = await fsPromises.open(filePath);
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
  } catch (err) {
    fh?.close();
    throw err;
  }
};

export const copyFile = async (srcFilePath, destDirPath) => {
  let srcFh = null;
  let destFh = null;
  try {
    const destFilePath = path.resolve(destDirPath, path.basename(srcFilePath));
    srcFh = await fsPromises.open(srcFilePath);
    destFh = await fsPromises.open(destFilePath, "w");
    const readStream = srcFh.createReadStream();
    const writeStream = destFh.createWriteStream();

    await pipeline(readStream, writeStream);
  } catch (err) {
    srcFh?.close();
    destFh?.close();
    throw err;
  }
};

export const moveFile = async (srcFilePath, destDirPath) => {
  await copyFile(srcFilePath, destDirPath);
  await removeFile(srcFilePath);
};
