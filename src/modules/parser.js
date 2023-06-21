import path from "node:path";
import {
  listDirectoryContents,
  createFile,
  removeFile,
  renameFile,
  catFile,
} from "./fs.js";

const handleInvalidInput = () => console.error("Invalid input");

export const parseCommand = async (line) => {
  const args = line
    .trim()
    .split(" ")
    .filter((arg) => arg.length > 0);

  switch (args[0]) {
    case "up": {
      console.log("Not implemented yet: up");
      break;
    }

    case "cd": {
      console.log("Not implemented yet: cd");
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
      console.log("Not implemented yet: cp");
      break;
    }

    case "mv": {
      console.log("Not implemented yet: mv");
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
      console.log("Not implemented yet: hash");
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
