import path from "node:path";
import {
  moveUpDirectory,
  changeDirectory,
  listDirectoryContents,
  createFile,
  moveFile,
  removeFile,
  renameFile,
  catFile,
  copyFile,
} from "./fs.js";
import { calculateHash } from "./hash.js";

const handleInvalidInput = () => console.error("Invalid input");

export const parseCommand = async (line) => {
  const args = line
    .trim()
    .split(" ")
    .filter((arg) => arg.length > 0);

  switch (args[0]) {
    case "up": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      await moveUpDirectory();
      break;
    }

    case "cd": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      changeDirectory(args[1]);
      break;
    }

    case "ls": {
      if (args.length > 1) {
        handleInvalidInput();
        break;
      }

      await listDirectoryContents(process.cwd());
      break;
    }

    case "cat": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[1]);
      await catFile(filePath);
      break;
    }

    case "add": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[1]);
      await createFile(filePath);
      break;
    }

    case "rn": {
      if (args.length !== 3) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[1]);
      const destFilePath = path.resolve(process.cwd(), args[2]);
      await renameFile(srcFilePath, destFilePath);
      break;
    }

    case "cp": {
      if (args.length !== 3) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[1]);
      const destDirPath = path.resolve(process.cwd(), args[2]);
      await copyFile(srcFilePath, destDirPath);
      break;
    }

    case "mv": {
      if (args.length !== 3) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[1]);
      const destDirPath = path.resolve(process.cwd(), args[2]);
      await moveFile(srcFilePath, destDirPath);
      break;
    }

    case "rm": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[1]);
      await removeFile(filePath);
      break;
    }

    case "os": {
      console.log("Not implemented yet: os");
      break;
    }

    case "hash": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[1]);
      await calculateHash(filePath);
      break;
    }

    case "compress": {
      console.log("Not implemented yet: compress");
      break;
    }

    case "decompress": {
      console.log("Not implemented yet: decompress");
      break;
    }

    case ".exit": {
      process.exit(0);
    }

    default: {
      handleInvalidInput();
    }
  }
};
