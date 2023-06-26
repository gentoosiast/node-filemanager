import fsPromises from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { assertIsFile } from "./utils.js";

const getDirectoryEntryType = (dirEntry) => {
  if (dirEntry.isFile()) {
    return "file";
  } else if (dirEntry.isDirectory()) {
    return "directory";
  }

  return "other";
};

export const moveUpDirectory = () => {
  const parentDirPath = path.dirname(process.cwd());

  changeDirectory(parentDirPath);
};

export const changeDirectory = (dirPath) => {
  let dir = dirPath;

  if (process.platform === "win32" && /^[a-zA-Z]:$/.test(dirPath)) {
    dir = `${dirPath}${path.sep}`;
  }

  process.chdir(dir);
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
  await assertIsFile(filePath);

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
  } finally {
    fh?.close();
  }
};

export const copyFile = async (srcFilePath, destDirPath) => {
  let srcFh = null;
  let destFh = null;

  try {
    await assertIsFile(srcFilePath);
    await fsPromises.mkdir(destDirPath, { recursive: true });

    const destFilePath = path.resolve(destDirPath, path.basename(srcFilePath));
    srcFh = await fsPromises.open(srcFilePath);
    destFh = await fsPromises.open(destFilePath, "w");
    const readStream = srcFh.createReadStream();
    const writeStream = destFh.createWriteStream();

    await pipeline(readStream, writeStream);
  } finally {
    srcFh?.close();
    destFh?.close();
  }
};

export const moveFile = async (srcFilePath, destDirPath) => {
  await copyFile(srcFilePath, destDirPath);
  await removeFile(srcFilePath);
};
