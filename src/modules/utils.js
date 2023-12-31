import fsPromises from "node:fs/promises";

const DEFAULT_USERNAME = "anonymous";

export const getUsernameFromArgs = () => {
  const usernameArg = process.argv.find((arg) => arg.startsWith("--username="));

  if (!usernameArg) {
    return DEFAULT_USERNAME;
  }

  return usernameArg.split("=")[1] || DEFAULT_USERNAME;
};

export const handleInvalidOperation = () => console.error("Operation failed");

export const assertIsFile = async (filePath) => {
  const fileStats = await fsPromises.stat(filePath);

  if (!fileStats.isFile()) {
    throw new Error(`"${filePath}" is not a file`);
  }
};
