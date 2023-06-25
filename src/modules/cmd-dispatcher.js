import path from "node:path";
import { parseLine } from "./cmd-parser.js";
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
import { processFileWithBrotli } from "./brotli.js";
import { dispatchOSOperation } from "./os-operations.js";

const handleInvalidInput = () => console.error("Invalid input");

export const dispatchCommand = async (line) => {
  const [cmd, ...args] = parseLine(line);

  switch (cmd) {
    case "up": {
      if (args.length !== 0) {
        handleInvalidInput();
        break;
      }

      await moveUpDirectory();
      break;
    }

    case "cd": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      changeDirectory(args[0]);
      break;
    }

    case "ls": {
      if (args.length !== 0) {
        handleInvalidInput();
        break;
      }

      await listDirectoryContents(process.cwd());
      break;
    }

    case "cat": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[0]);
      await catFile(filePath);
      break;
    }

    case "add": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[0]);
      await createFile(filePath);
      break;
    }

    case "rn": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[0]);
      const destFilePath = path.resolve(process.cwd(), args[1]);
      await renameFile(srcFilePath, destFilePath);
      break;
    }

    case "cp": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[0]);
      const destDirPath = path.resolve(process.cwd(), args[1]);
      await copyFile(srcFilePath, destDirPath);
      break;
    }

    case "mv": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[0]);
      const destDirPath = path.resolve(process.cwd(), args[1]);
      await moveFile(srcFilePath, destDirPath);
      break;
    }

    case "rm": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[0]);
      await removeFile(filePath);
      break;
    }

    case "os": {
      const supportedOperations = [
        "--EOL",
        "--cpus",
        "--homedir",
        "--username",
        "--architecture",
      ];

      if (args.length !== 1 || !supportedOperations.includes(args[0])) {
        handleInvalidInput();
        break;
      }

      dispatchOSOperation(args[0]);
      break;
    }

    case "hash": {
      if (args.length !== 1) {
        handleInvalidInput();
        break;
      }

      const filePath = path.resolve(process.cwd(), args[0]);
      await calculateHash(filePath);
      break;
    }

    case "compress": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[0]);
      const destFilePath = path.resolve(process.cwd(), args[1]);

      await processFileWithBrotli(srcFilePath, destFilePath, "compress");
      break;
    }

    case "decompress": {
      if (args.length !== 2) {
        handleInvalidInput();
        break;
      }

      const srcFilePath = path.resolve(process.cwd(), args[0]);
      const destFilePath = path.resolve(process.cwd(), args[1]);

      await processFileWithBrotli(srcFilePath, destFilePath, "decompress");
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
